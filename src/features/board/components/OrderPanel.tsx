import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore, fulfillOrderAction, ActiveOrder } from '@/store/useOrderStore'
import { useBoardStore } from '@/store/useBoardStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import { ITEM_MAP } from '@/data/items'

const OrderCard: React.FC<{ order: ActiveOrder; onFulfill: () => void; canFulfill: boolean }> = ({
  order, onFulfill, canFulfill,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(0)

  useEffect(() => {
    const update = () => setTimeLeft(Math.max(0, Math.floor((order.expiresAt - Date.now()) / 1000)))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [order.expiresAt])

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}时${m}分`
    if (m > 0) return `${m}分${s}秒`
    return `${s}秒`
  }

  const isTutorial = order.template.id === 'order_tutorial'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        background: canFulfill
          ? 'linear-gradient(135deg, #1a3a1a, #2d5a2d)'
          : isTutorial
            ? 'linear-gradient(135deg, #2a1a0a, #4a2a0a)'
            : 'linear-gradient(135deg, #1a1a0a, #3a2a0a)',
        border: `2px solid ${canFulfill ? '#4ade80' : isTutorial ? '#f0a040' : '#8B6914'}`,
        borderRadius: 10,
        padding: '6px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow: canFulfill
          ? '0 0 12px rgba(74,222,128,0.3)'
          : isTutorial
            ? '0 0 10px rgba(240,160,64,0.3)'
            : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s, background 0.2s',
        flexShrink: 0,
        width: 130,
        minHeight: 0,
        scrollSnapAlign: 'start',
      }}
    >
      {/* Order name */}
      <div style={{ color: isTutorial ? '#fbbf24' : '#f0c040', fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {order.template.name}
      </div>

      {/* Requirements */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {order.template.requirements.map(req => {
          const def = ITEM_MAP[req.itemId]
          return (
            <div key={req.itemId} style={{
              display: 'flex', alignItems: 'center', gap: 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 5, padding: '1px 4px',
              fontSize: 11,
            }}>
              <span>{def?.emoji ?? '?'}</span>
              <span style={{ color: '#fde68a', fontSize: 10 }}>×{req.count}</span>
            </div>
          )
        })}
      </div>

      {/* Timer + reward row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 }}>
        <div style={{ color: timeLeft < 300 ? '#f87171' : '#94a3b8', fontSize: 9 }}>
          ⏱{formatTime(timeLeft)}
        </div>
        <div style={{ color: '#fde68a', fontSize: 10, fontWeight: 'bold' }}>
          🪙{order.template.coinReward}
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={onFulfill}
        disabled={!canFulfill}
        style={{
          padding: '3px 0',
          borderRadius: 7,
          border: 'none',
          background: canFulfill ? 'linear-gradient(135deg, #4ade80, #16a34a)' : '#374151',
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold',
          cursor: canFulfill ? 'pointer' : 'not-allowed',
          boxShadow: canFulfill ? '0 2px 6px rgba(74,222,128,0.4)' : 'none',
          width: '100%',
        }}
      >
        {canFulfill ? '提交订单 ✓' : '材料不足'}
      </button>
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

  const tutorialOrder = activeOrders.find(o => o.template.id === 'order_tutorial')

  return (
    <div style={{
      background: 'rgba(15,8,0,0.95)',
      borderBottom: '2px solid #8B6914',
      padding: '6px 8px 4px',
      flexShrink: 0,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{ color: '#f0c040', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>
          📜 订单
        </div>
        {tutorialOrder && (
          <div style={{
            color: '#fbbf24', fontSize: 10,
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.4)',
            borderRadius: 5, padding: '1px 6px',
            flexShrink: 0,
          }}>
            💡 合成棋子后提交新手任务
          </div>
        )}
        {activeOrders.length === 0 && (
          <div style={{ color: '#6b7280', fontSize: 10 }}>暂无订单</div>
        )}
      </div>

      {/* Horizontal scrollable order cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: 2,
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}>
        <AnimatePresence mode="popLayout">
          {activeOrders.map(order => (
            <OrderCard
              key={order.instanceId}
              order={order}
              canFulfill={checkFulfill(order)}
              onFulfill={() => handleFulfill(order)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrderPanel
