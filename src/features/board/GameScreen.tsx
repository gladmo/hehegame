import React, { useEffect } from 'react'
import { useOrderStore } from '@/store/useOrderStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import { useBoardStore } from '@/store/useBoardStore'
import TopBar from './components/TopBar'
import BoardGrid from './components/BoardGrid'
import OrderPanel from './components/OrderPanel'
import ItemDetailBar from './components/ItemDetailBar'

const GameScreen: React.FC = () => {
  const initOrders = useOrderStore(s => s.initOrders)
  const tickEnergy = useEconomyStore(s => s.tickEnergy)
  const autoTickGenerators = useBoardStore(s => s.autoTickGenerators)

  useEffect(() => {
    initOrders()

    // Tick energy every 2 minutes
    const energyTick = setInterval(tickEnergy, 2 * 60 * 1000)

    // Tick auto-generators every minute to process 老母鸡 egg storage and auto-spawn
    autoTickGenerators()  // run once immediately on mount to catch up
    const autoGenTick = setInterval(autoTickGenerators, 60 * 1000)

    return () => {
      clearInterval(energyTick)
      clearInterval(autoGenTick)
    }
  }, [initOrders, tickEnergy, autoTickGenerators])

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
        拖动相同棋子合并升级 · 🔒锁定棋子需拖低级同类棋子解锁 · ⚡点击消耗体力生成 · ⏳老母鸡自动生成
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
