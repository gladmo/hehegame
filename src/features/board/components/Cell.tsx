import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { BoardItem } from '@/store/useBoardStore'
import { ITEM_MAP } from '@/data/items'

interface CellProps {
  idx: number
  item: BoardItem | null
  isSelected: boolean
  isDraggingFrom: boolean
  isDropTarget: boolean
  canMerge: boolean
  canUnlockTarget: boolean
  onPointerDown: (e: React.PointerEvent) => void
}

// Floating star particles for generator cells
const STAR_CONFIGS = [
  { left: '20%', delay: 0 },
  { left: '55%', delay: 0.5 },
  { left: '78%', delay: 1.0 },
]

const GeneratorStars: React.FC = () => (
  <>
    {STAR_CONFIGS.map((cfg, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: cfg.left,
          fontSize: 7,
          color: '#ffffff',
          pointerEvents: 'none',
          zIndex: 5,
          lineHeight: 1,
        }}
        animate={{ y: [0, -18, -30], opacity: [0, 0.9, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          delay: cfg.delay,
          ease: 'easeOut',
          repeatDelay: 0.2,
        }}
      >
        ✦
      </motion.div>
    ))}
  </>
)

const Cell: React.FC<CellProps> = memo(({
  idx,
  item,
  isSelected,
  isDraggingFrom,
  isDropTarget,
  canMerge,
  canUnlockTarget,
  onPointerDown,
}) => {
  const def = item ? ITEM_MAP[item.itemId] : null

  let borderColor = '#b89a60'
  let bgColor = 'rgba(210,175,120,0.25)'
  if (isDropTarget && canMerge) { borderColor = '#4ade80'; bgColor = 'rgba(74,222,128,0.2)' }
  else if (isDropTarget && canUnlockTarget) { borderColor = '#facc15'; bgColor = 'rgba(250,204,21,0.2)' }
  else if (isDropTarget) { borderColor = '#93c5fd'; bgColor = 'rgba(147,197,253,0.15)' }
  else if (isSelected) { borderColor = '#60a5fa'; bgColor = 'rgba(96,165,250,0.15)' }

  return (
    <div
      data-cell-idx={idx}
      style={{
        border: `1.5px solid ${borderColor}`,
        borderRadius: 8,
        background: bgColor,
        position: 'relative',
        cursor: item && !item.isLocked ? 'grab' : 'default',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        transition: 'background 0.1s, border-color 0.1s',
        minHeight: 0,
        aspectRatio: '1',
      }}
      onPointerDown={onPointerDown}
    >
      {item && def && (
        <motion.div
          key={item.instanceId}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: isDraggingFrom ? 0.7 : 1, opacity: isDraggingFrom ? 0.4 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '100%', position: 'relative',
          }}
        >
          {/* Emoji (dimmed when locked) */}
          <div style={{
            fontSize: 'clamp(22px, 5.5vw, 34px)',
            lineHeight: 1,
            opacity: item.isLocked ? 0.45 : 1,
            filter: item.isLocked ? 'grayscale(60%)' : 'none',
          }}>
            {def.emoji}
          </div>

          {/* Level badge */}
          {def.level > 0 && (
            <div style={{
              position: 'absolute', bottom: 1, right: 2,
              fontSize: 9, fontWeight: 'bold',
              color: item.isLocked ? '#bbb' : '#fff',
              background: item.isLocked ? 'rgba(60,60,60,0.9)' : 'rgba(0,0,0,0.65)',
              borderRadius: 3, padding: '0 2px',
              lineHeight: '13px',
              zIndex: 3,
            }}>
              Lv{def.level}
            </div>
          )}

          {/* Generator indicator */}
          {def.isGenerator && !item.isLocked && (
            <>
              <div style={{
                position: 'absolute', top: 1, right: 2,
                fontSize: 9, lineHeight: 1,
              }}>⚡</div>
              <GeneratorStars />
            </>
          )}

          {/* Lock overlay */}
          {item.isLocked && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.35)',
              borderRadius: 6,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
              padding: '2px',
              zIndex: 2,
              fontSize: '0.85em',
              pointerEvents: 'none',
            }}>
              🔒
            </div>
          )}
        </motion.div>
      )}

      {/* Merge sparkle overlay */}
      {isDropTarget && canMerge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            border: '2px solid #4ade80',
            borderRadius: 8,
            pointerEvents: 'none',
            boxShadow: '0 0 8px #4ade80',
          }}
        />
      )}

      {/* Unlock sparkle overlay */}
      {isDropTarget && canUnlockTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            border: '2px solid #facc15',
            borderRadius: 8,
            pointerEvents: 'none',
            boxShadow: '0 0 8px #facc15',
          }}
        />
      )}
    </div>
  )
}, (prev, next) => {
  return (
    prev.item?.instanceId === next.item?.instanceId &&
    prev.item?.isLocked === next.item?.isLocked &&
    prev.item?.lockHits === next.item?.lockHits &&
    prev.isSelected === next.isSelected &&
    prev.isDraggingFrom === next.isDraggingFrom &&
    prev.isDropTarget === next.isDropTarget &&
    prev.canMerge === next.canMerge &&
    prev.canUnlockTarget === next.canUnlockTarget
  )
})

Cell.displayName = 'Cell'
export default Cell
