import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { OrderTemplate, ORDER_TEMPLATES, pickRandomOrders } from '@/data/orders'

export interface ActiveOrder {
  instanceId: string
  template: OrderTemplate
  fulfilled: boolean
}

interface OrderState {
  activeOrders: ActiveOrder[]
}

interface OrderActions {
  initOrders: () => void
  refreshOrders: () => void
  /** Check if an order can be fulfilled with the given board item IDs */
  canFulfill: (orderId: string, boardItemIds: string[]) => boolean
}

let _orderCounter = Date.now() * 1000

function createActiveOrder(template: OrderTemplate): ActiveOrder {
  return {
    instanceId: `order_${++_orderCounter}`,
    template,
    fulfilled: false,
  }
}

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    immer((set, get) => ({
      activeOrders: [],

      initOrders: () => {
        // Skip if already initialized from persistence
        if (get().activeOrders.length > 0) return
        const tutorialTemplate = ORDER_TEMPLATES.find(t => t.id === 'order_tutorial')
        const excludeIds = tutorialTemplate ? ['order_tutorial'] : []
        const count = tutorialTemplate ? 2 : 3
        const others = pickRandomOrders(count, excludeIds)
        const initial = tutorialTemplate
          ? [createActiveOrder(tutorialTemplate), ...others.map(createActiveOrder)]
          : others.map(createActiveOrder)
        set(state => { state.activeOrders = initial })
      },

      refreshOrders: () => {
        const { activeOrders } = get()
        const currentIds = activeOrders.map(o => o.template.id)
        const newTemplates = pickRandomOrders(3, currentIds)
        set(state => {
          state.activeOrders = [...state.activeOrders, ...newTemplates.map(createActiveOrder)]
        })
      },

      canFulfill: (orderId, boardItemIds) => {
        const { activeOrders } = get()
        const order = activeOrders.find(o => o.instanceId === orderId)
        if (!order || order.fulfilled) return false

        // For each requirement, check we have enough matching items
        const available = [...boardItemIds]
        for (const req of order.template.requirements) {
          let found = 0
          for (let i = available.length - 1; i >= 0; i--) {
            if (available[i] === req.itemId) {
              found++
              if (found === req.count) break
            }
          }
          if (found < req.count) return false
        }
        return true
      },
    })),
    {
      name: 'hehegame-orders',
      partialize: (state) => ({ activeOrders: state.activeOrders }),
    }
  )
)

// Separate function since we need richer board data
export function fulfillOrderAction(
  orderId: string,
  boardItems: Array<{ instanceId: string; itemId: string }>,
  removeItemFn: (instanceId: string) => boolean,
  addCoinsFn: (amount: number) => void
): boolean {
  const { activeOrders } = useOrderStore.getState()
  const order = activeOrders.find(o => o.instanceId === orderId)
  if (!order || order.fulfilled) return false

  // Check availability and collect which instances to remove
  const available = [...boardItems]
  const toRemove: string[] = []

  for (const req of order.template.requirements) {
    let needed = req.count
    for (let i = available.length - 1; i >= 0 && needed > 0; i--) {
      if (available[i].itemId === req.itemId) {
        toRemove.push(available[i].instanceId)
        available.splice(i, 1)
        needed--
      }
    }
    if (needed > 0) return false // not enough
  }

  // Execute removals
  for (const instanceId of toRemove) {
    removeItemFn(instanceId)
  }

  // Mark fulfilled & add coins
  useOrderStore.setState(state => {
    const o = state.activeOrders.find(o => o.instanceId === orderId)
    if (o) o.fulfilled = true
  })

  addCoinsFn(order.template.coinReward)

  // Replace with new order after a delay
  setTimeout(() => {
    useOrderStore.setState(state => {
      state.activeOrders = state.activeOrders.filter(o => o.instanceId !== orderId)
    })
    const currentIds = useOrderStore.getState().activeOrders.map(o => o.template.id)
    const newTemplates = pickRandomOrders(1, currentIds)
    if (newTemplates.length > 0) {
      useOrderStore.setState(state => {
        state.activeOrders.push({
          instanceId: `order_${++_orderCounter}`,
          template: newTemplates[0],
          fulfilled: false,
        })
      })
    }
  }, 1500)

  return true
}
