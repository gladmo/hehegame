import React from 'react'
import { useBoardStore } from '@/store/useBoardStore'
import { ITEM_MAP } from '@/data/items'
import ItemIcon from '@/shared/ItemIcon'

const sideBtnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  width: 52,
  height: 52,
  background: 'rgba(255,255,255,0.08)',
  border: '1.5px solid #8B6914',
  borderRadius: 10,
  color: '#f0c040',
  fontSize: 10,
  cursor: 'pointer',
  flexShrink: 0,
  padding: 0,
}

const ItemDetailBar: React.FC = () => {
  const selectedIdx = useBoardStore(s => s.selectedIdx)
  const cells = useBoardStore(s => s.cells)
  const deleteSelected = useBoardStore(s => s.deleteSelected)
  const selectCell = useBoardStore(s => s.selectCell)

  const item = selectedIdx !== null ? cells[selectedIdx]?.item : null
  const def = item ? ITEM_MAP[item.itemId] : null
  const mergeResultDef = def?.mergeResultId ? ITEM_MAP[def.mergeResultId] : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      background: 'rgba(20,10,0,0.95)',
      borderTop: '2px solid #8B6914',
      flexShrink: 0,
    }}>
      {/* 仓库 button - left */}
      <button type="button" aria-label="仓库" style={sideBtnStyle}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>📦</span>
        <span>仓库</span>
      </button>

      {/* Middle area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {def && item ? (
          <>
            {/* Item icon */}
            <div style={{
              width: 44, height: 44,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              border: '2px solid #8B6914',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, flexShrink: 0,
            }}>
              <ItemIcon def={def} fontSize={26} />
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
                  padding: '6px 10px',
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
          </>
        ) : (
          <div style={{
            flex: 1,
            textAlign: 'center',
            color: '#c8a46e',
            fontSize: 12,
            opacity: 0.85,
          }}>
            点击棋子查看说明 · 拖动相同棋子合并升级
          </div>
        )}
      </div>

      {/* 活动 button - right */}
      <button type="button" aria-label="活动" disabled style={{ ...sideBtnStyle, opacity: 0.5, cursor: 'not-allowed' }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>🎉</span>
        <span>活动</span>
      </button>
    </div>
  )
}

export default ItemDetailBar
