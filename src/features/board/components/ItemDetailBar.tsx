import React from 'react'
import { useBoardStore } from '@/store/useBoardStore'
import { ITEM_MAP } from '@/data/items'

const ItemDetailBar: React.FC = () => {
  const selectedIdx = useBoardStore(s => s.selectedIdx)
  const cells = useBoardStore(s => s.cells)
  const deleteSelected = useBoardStore(s => s.deleteSelected)
  const selectCell = useBoardStore(s => s.selectCell)

  const item = selectedIdx !== null ? cells[selectedIdx]?.item : null
  const def = item ? ITEM_MAP[item.itemId] : null

  if (!def || !item) return null

  const mergeResultDef = def.mergeResultId ? ITEM_MAP[def.mergeResultId] : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      background: 'rgba(20,10,0,0.95)',
      borderTop: '2px solid #8B6914',
    }}>
      {/* Item icon */}
      <div style={{
        width: 44, height: 44,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        border: '2px solid #8B6914',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, flexShrink: 0,
      }}>
        {def.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#f0c040', fontSize: 13, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
          {def.name}
          {def.level > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 'bold',
              background: '#7c3aed', color: '#fff',
              borderRadius: 4, padding: '1px 4px',
            }}>等级{def.level}</span>
          )}
          {item.isLocked && <span style={{ fontSize: 11, color: '#f87171' }}>🔒 锁定中</span>}
        </div>
        <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
          {item.isLocked
            ? `拖动同类低级棋子到此解锁 (还需 ${item.lockHits ?? 1} 次)`
            : def.isGenerator
              ? '点击消耗体力⚡生成棋子'
              : mergeResultDef
                ? `合成相同棋子 → ${mergeResultDef.emoji} ${mergeResultDef.name}`
                : '已达最高等级'}
        </div>
      </div>

      {/* Delete button (only for non-locked items) */}
      {!item.isLocked && (
        <button
          onClick={() => { deleteSelected(); selectCell(null) }}
          style={{
            padding: '6px 12px',
            background: '#dc2626',
            border: '1px solid #ef4444',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          删除 🗑
        </button>
      )}

      {/* Close button */}
      <button
        onClick={() => selectCell(null)}
        style={{
          width: 28, height: 28,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid #6b7280',
          borderRadius: 6,
          color: '#9ca3af',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default ItemDetailBar
