import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { OrderTemplate, pickRandomOrders } from '@/data/orders'
import { useCollectionStore } from '@/store/useCollectionStore'

export interface ActiveOrder {
  instanceId: string
  template: OrderTemplate
  expiresAt: number  // timestamp ms
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
  removeExpiredOrders: () => void
}

let _orderCounter = 0

function createActiveOrder(template: OrderTemplate): ActiveOrder {
  return {
    instanceId: `order_${++_orderCounter}`,
    template,
    expiresAt: Date.now() + template.timeLimit * 1000,
    fulfilled: false,
  }
}

export const useOrderStore = create<OrderState & OrderActions>()(
  immer((set, get) => ({
    activeOrders: [],

    initOrders: () => {
      const templates = pickRandomOrders(3)
      set(state => {
        state.activeOrders = templates.map(createActiveOrder)
      })
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

    removeExpiredOrders: () => {
      const now = Date.now()
      set(state => {
        state.activeOrders = state.activeOrders.filter(o => o.expiresAt > now || o.fulfilled)
      })
    },
  }))
)

// Separate function since we need richer board data
export function fulfillOrderAction(
  orderId: string,
  boardItems: Array<{ instanceId: string; itemId: string }>,
  removeItemFn: (instanceId: string) => boolean,
  addCoinsFn: (amount: number) => void,
  addExpFn?: (amount: number) => void
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

  // Execute removals and record usage
  for (const instanceId of toRemove) {
    removeItemFn(instanceId)
  }
  // Record item usage for collection tracking (batched by requirement)
  for (const req of order.template.requirements) {
    useCollectionStore.getState().recordItemUsage(req.itemId, req.count)
  }

  // Mark fulfilled & add coins
  useOrderStore.setState(state => {
    const o = state.activeOrders.find(o => o.instanceId === orderId)
    if (o) o.fulfilled = true
  })

  addCoinsFn(order.template.coinReward)
  if (addExpFn) addExpFn(order.template.expReward)

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
          expiresAt: Date.now() + newTemplates[0].timeLimit * 1000,
          fulfilled: false,
        })
      })
    }
  }, 1500)

  return true
}
