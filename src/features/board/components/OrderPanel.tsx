import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore, fulfillOrderAction, ActiveOrder } from '@/store/useOrderStore'
import { useBoardStore } from '@/store/useBoardStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import { ITEM_MAP } from '@/data/items'

const OrderCard: React.FC<{ order: ActiveOrder; onFulfill: () => void; canFulfill: boolean }> = ({
  order, onFulfill, canFulfill,
}) => {
  const isTutorial = order.template.id === 'order_tutorial'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={canFulfill ? onFulfill : undefined}
      onKeyDown={canFulfill ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFulfill() } } : undefined}
      role={canFulfill ? 'button' : undefined}
      tabIndex={canFulfill ? 0 : undefined}
      style={{
        background: canFulfill
          ? 'linear-gradient(135deg, #1a3a1a, #2d5a2d)'
          : isTutorial
            ? 'linear-gradient(135deg, #2a1a0a, #4a2a0a)'
            : 'linear-gradient(135deg, #1a1a0a, #3a2a0a)',
        border: `2px solid ${canFulfill ? '#4ade80' : isTutorial ? '#f0a040' : '#8B6914'}`,
        borderRadius: 10,
        padding: '5px 7px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        boxShadow: canFulfill
          ? '0 0 12px rgba(74,222,128,0.4)'
          : isTutorial
            ? '0 0 10px rgba(240,160,64,0.3)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        flexShrink: 0,
        minWidth: 80,
        cursor: canFulfill ? 'pointer' : 'default',
        scrollSnapAlign: 'start',
        position: 'relative',
      }}
    >
      {/* Item icons row */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {order.template.requirements.map(req => {
          const def = ITEM_MAP[req.itemId]
          return (
            <span key={req.itemId} style={{ fontSize: 26, lineHeight: 1 }}>
              {def?.emoji ?? '?'}
            </span>
          )
        })}
      </div>

      {/* Coin reward */}
      <div style={{ color: '#fde68a', fontSize: 10, fontWeight: 'bold' }}>
        🪙{order.template.coinReward}
      </div>

      {/* Complete indicator */}
      {canFulfill && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            color: '#4ade80',
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          ✓ 完成
        </motion.div>
      )}
    </motion.div>
  )
}

const OrderPanel: React.FC = () => {
  const activeOrders = useOrderStore(s => s.activeOrders)
  const cells = useBoardStore(s => s.cells)
  const removeItem = useBoardStore(s => s.removeItem)
  const addCoins = useEconomyStore(s => s.addCoins)
  const canFulfillFn = useOrderStore(s => s.canFulfill)

  // Build flat list of {instanceId, itemId} from non-locked board items
  const boardItems = cells
    .filter(c => c.item && !c.item.isLocked)
    .map(c => ({ instanceId: c.item!.instanceId, itemId: c.item!.itemId }))

  const checkFulfill = (order: ActiveOrder) => {
    const itemIds = boardItems.map(b => b.itemId)
    return canFulfillFn(order.instanceId, itemIds)
  }

  const handleFulfill = (order: ActiveOrder) => {
    fulfillOrderAction(order.instanceId, boardItems, removeItem, addCoins)
  }

  return (
    <div style={{
      background: 'rgba(15,8,0,0.95)',
      borderBottom: '2px solid #8B6914',
      padding: '5px 8px',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        alignItems: 'stretch',
      }}>
        {/* Header label */}
        <div style={{
          color: '#f0c040',
          fontSize: 11,
          fontWeight: 'bold',
          flexShrink: 0,
          alignSelf: 'center',
          paddingRight: 2,
        }}>
          📜
        </div>

        <AnimatePresence mode="popLayout">
          {activeOrders.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 10, alignSelf: 'center' }}>暂无订单</div>
          ) : (
            activeOrders.map(order => (
              <OrderCard
                key={order.instanceId}
                order={order}
                canFulfill={checkFulfill(order)}
                onFulfill={() => handleFulfill(order)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrderPanel
