import React from 'react'
import { useEconomyStore } from '@/store/useEconomyStore'

const TopBar: React.FC = () => {
  const { coins, energy, maxEnergy, gems, level, addEnergy, addGems } = useEconomyStore()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: 'rgba(30,15,5,0.85)',
      borderBottom: '2px solid #8B6914',
      gap: 8,
      flexWrap: 'nowrap',
      minHeight: 52,
    }}>
      {/* Level badge */}
      <div style={{
        width: 44, height: 44,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #c8860a, #7a4f00)',
        border: '2px solid #f0c040',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 'bold', fontSize: 16,
        flexShrink: 0,
        boxShadow: '0 0 8px rgba(240,192,64,0.5)',
      }}>
        {level}
      </div>

      {/* Energy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <div>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 1 }}>
            {energy}
          </div>
          <div style={{ color: '#aaa', fontSize: 10, lineHeight: 1 }}>/{maxEnergy}</div>
        </div>
        <button
          onClick={() => addEnergy(10)}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#4ade80', border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: 14, fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
        >+</button>
      </div>

      {/* Coins */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 18 }}>🪙</span>
        <span style={{ color: '#fde68a', fontSize: 15, fontWeight: 'bold' }}>{coins}</span>
      </div>

      {/* Gems */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 18 }}>💎</span>
        <span style={{ color: '#f9a8d4', fontSize: 15, fontWeight: 'bold' }}>{gems}</span>
        <button
          onClick={() => addGems(5)}
          style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#f472b6', border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: 14, fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}
        >+</button>
      </div>
    </div>
  )
}

export default TopBar
