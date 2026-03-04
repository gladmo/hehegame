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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        background: canFulfill
          ? 'linear-gradient(135deg, #1a3a1a, #2d5a2d)'
          : 'linear-gradient(135deg, #1a1a0a, #3a2a0a)',
        border: `2px solid ${canFulfill ? '#4ade80' : '#8B6914'}`,
        borderRadius: 10,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: canFulfill ? '0 0 12px rgba(74,222,128,0.3)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s, background 0.2s',
        flexShrink: 0,
      }}
    >
      {/* Requirements */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <div style={{ width: '100%', color: '#f0c040', fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>
          {order.template.name}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {order.template.requirements.map(req => {
            const def = ITEM_MAP[req.itemId]
            return (
              <div key={req.itemId} style={{
                display: 'flex', alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 6, padding: '2px 5px',
                fontSize: 12,
              }}>
                <span>{def?.emoji ?? '?'}</span>
                <span style={{ color: '#fde68a', fontSize: 10 }}>×{req.count}</span>
              </div>
            )
          })}
        </div>
        {/* Timer */}
        <div style={{ color: timeLeft < 300 ? '#f87171' : '#94a3b8', fontSize: 10, marginTop: 2 }}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Reward + Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ color: '#fde68a', fontSize: 12, fontWeight: 'bold' }}>
          🪙{order.template.coinReward}
        </div>
        <button
          onClick={onFulfill}
          disabled={!canFulfill}
          style={{
            padding: '4px 10px',
            borderRadius: 8,
            border: 'none',
            background: canFulfill ? 'linear-gradient(135deg, #4ade80, #16a34a)' : '#374151',
            color: '#fff',
            fontSize: 11,
            fontWeight: 'bold',
            cursor: canFulfill ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            boxShadow: canFulfill ? '0 2px 6px rgba(74,222,128,0.4)' : 'none',
          }}
        >
          {canFulfill ? '提交' : '不足'}
        </button>
      </div>
    </motion.div>
  )
}

const OrderPanel: React.FC = () => {
  const activeOrders = useOrderStore(s => s.activeOrders)
  const cells = useBoardStore(s => s.cells)
  const removeItem = useBoardStore(s => s.removeItem)
  const addCoins = useEconomyStore(s => s.addCoins)
  const addExp = useEconomyStore(s => s.addExp)
  const canFulfillFn = useOrderStore(s => s.canFulfill)

  // Build flat list of {instanceId, itemId} from non-locked board items
  const boardItems = cells
    .filter(c => c.item && !c.item.isLocked)
    .map(c => ({ instanceId: c.item!.instanceId, itemId: c.item!.itemId }))

  // Check fulfillability based on itemIds
  const checkFulfill = (order: ActiveOrder) => {
    const itemIds = boardItems.map(b => b.itemId)
    return canFulfillFn(order.instanceId, itemIds)
  }

  const handleFulfill = (order: ActiveOrder) => {
    fulfillOrderAction(order.instanceId, boardItems, removeItem, addCoins, addExp)
  }

  const hasNonLocked = boardItems.length > 0

  return (
    <div style={{
      padding: '8px 8px 4px',
      background: 'rgba(20,10,0,0.9)',
      borderTop: '2px solid #8B6914',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <div style={{ color: '#f0c040', fontSize: 13, fontWeight: 'bold' }}>
          📜 订单列表
        </div>
        {!hasNonLocked && (
          <div style={{ color: '#f87171', fontSize: 11 }}>
            ⚠ 棋盘上没有可用棋子
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 280,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        <AnimatePresence mode="popLayout">
          {activeOrders.map(order => (
            <OrderCard
              key={order.instanceId}
              order={order}
              canFulfill={hasNonLocked && checkFulfill(order)}
              onFulfill={() => handleFulfill(order)}
            />
          ))}
        </AnimatePresence>

        {activeOrders.length === 0 && (
          <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
            暂无订单
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPanel
