import React, { useEffect } from 'react'
import { useOrderStore } from '@/store/useOrderStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import TopBar from './components/TopBar'
import BoardGrid from './components/BoardGrid'
import OrderPanel from './components/OrderPanel'
import ItemDetailBar from './components/ItemDetailBar'

const GameScreen: React.FC = () => {
  const initOrders = useOrderStore(s => s.initOrders)
  const removeExpiredOrders = useOrderStore(s => s.removeExpiredOrders)
  const tickEnergy = useEconomyStore(s => s.tickEnergy)

  useEffect(() => {
    initOrders()

    // Tick energy every 2 minutes
    const energyTick = setInterval(tickEnergy, 2 * 60 * 1000)
    // Remove expired orders every 30s
    const orderTick = setInterval(removeExpiredOrders, 30_000)

    return () => {
      clearInterval(energyTick)
      clearInterval(orderTick)
    }
  }, [initOrders, tickEnergy, removeExpiredOrders])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      background: 'linear-gradient(180deg, #1a0f05 0%, #2d1b0e 100%)',
      overflow: 'hidden',
    }}>
      {/* Order panel - fixed at top, horizontally scrollable */}
      <OrderPanel />

      {/* Top Bar */}
      <TopBar />

      {/* Main board area - takes remaining space, board never scrolls */}
      <div style={{
        flex: 1,
        padding: '4px 6px 2px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        {/* Hint text */}
        <div style={{
          color: '#c8a46e',
          fontSize: 10,
          textAlign: 'center',
          marginBottom: 2,
          opacity: 0.8,
          flexShrink: 0,
        }}>
          拖动相同棋子合并升级 · 🔒锁定棋子需拖低级同类棋子解锁 · 点击⚡生成棋子
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BoardGrid />
        </div>
      </div>

      {/* Item detail bar (shows when something selected) */}
      <ItemDetailBar />
    </div>
  )
}

export default GameScreen
