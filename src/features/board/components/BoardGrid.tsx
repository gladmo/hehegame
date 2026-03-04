import React, { useCallback, useRef } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { useBoardStore, COLS, ROWS } from '@/store/useBoardStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import { ITEM_MAP } from '@/data/items'
import Cell from './Cell'

const GHOST_SIZE = 52

const BoardGrid: React.FC = () => {
  const cells = useBoardStore(s => s.cells)
  const drag = useBoardStore(s => s.drag)
  const selectedIdx = useBoardStore(s => s.selectedIdx)
  const startDrag = useBoardStore(s => s.startDrag)
  const moveDrag = useBoardStore(s => s.moveDrag)
  const endDrag = useBoardStore(s => s.endDrag)
  const cancelDrag = useBoardStore(s => s.cancelDrag)
  const clickGenerator = useBoardStore(s => s.clickGenerator)
  const selectCell = useBoardStore(s => s.selectCell)
  const spendEnergy = useEconomyStore(s => s.spendEnergy)

  const isDragging = drag.fromIdx !== null
  const gridRef = useRef<HTMLDivElement>(null)
  // Track whether the pointer has moved (to distinguish tap from drag)
  const pointerMovedRef = useRef(false)

  // Ghost position – updated via motion values to avoid React re-renders on every frame
  const ghostX = useMotionValue(-200)
  const ghostY = useMotionValue(-200)

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    const item = cells[idx]?.item
    if (!item || item.isLocked) {
      selectCell(idx)
      return
    }
    // Capture pointer so we continue receiving pointermove/pointerup even when
    // the finger/cursor moves over other elements (critical for mobile).
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerMovedRef.current = false
    // Pre-position ghost before first move so it doesn't jump
    ghostX.set(e.clientX - GHOST_SIZE / 2)
    ghostY.set(e.clientY - GHOST_SIZE / 2)
    startDrag(idx)
  }, [cells, startDrag, selectCell, ghostX, ghostY])

  // Grid-level pointermove: use elementFromPoint to find the cell under the
  // pointer. This works on both desktop and mobile (touch), because pointer
  // events bubble up from the capturing element to the grid even when a cell
  // has pointer capture, and elementFromPoint ignores capture for hit testing.
  const handleGridPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    pointerMovedRef.current = true
    // Update ghost position directly via motion values (no React re-render)
    ghostX.set(e.clientX - GHOST_SIZE / 2)
    ghostY.set(e.clientY - GHOST_SIZE / 2)
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const cellEl = el?.closest('[data-cell-idx]') as HTMLElement | null
    if (cellEl) {
      const idx = parseInt(cellEl.dataset.cellIdx ?? '-1', 10)
      moveDrag(idx)
    } else {
      moveDrag(-1) // pointer outside all cells → clear drop target
    }
  }, [isDragging, moveDrag, ghostX, ghostY])

  // Grid-level pointerup: handles both taps (no movement) and drag drops.
  const handleGridPointerUp = useCallback(() => {
    if (!isDragging) return
    const fromIdx = drag.fromIdx
    if (fromIdx === null) return

    if (!pointerMovedRef.current) {
      // Tap with no movement → generator click or cell select
      cancelDrag()
      const item = cells[fromIdx]?.item
      if (item && !item.isLocked) {
        const def = ITEM_MAP[item.itemId]
        if (def?.isGenerator) {
          const ok = spendEnergy(1)
          if (ok) clickGenerator(fromIdx)
          return
        }
      }
      selectCell(fromIdx)
      return
    }

    endDrag()
  }, [isDragging, drag, cells, cancelDrag, endDrag, selectCell, clickGenerator, spendEnergy])

  const draggedItem = drag.fromIdx !== null ? cells[drag.fromIdx]?.item : null
  const draggedDef = draggedItem ? ITEM_MAP[draggedItem.itemId] : null

  return (
    <>
      {/* Drag ghost: follows pointer using motion values (no re-render per frame) */}
      <AnimatePresence>
        {isDragging && draggedDef && (
          <motion.div
            key="drag-ghost"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              x: ghostX,
              y: ghostY,
              width: GHOST_SIZE,
              height: GHOST_SIZE,
              pointerEvents: 'none',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.18)',
              border: '2px solid rgba(255,255,255,0.45)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.95 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          >
            {draggedDef.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={gridRef}
        onPointerMove={handleGridPointerMove}
        onPointerUp={handleGridPointerUp}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gap: 4,
          padding: 6,
          background: 'linear-gradient(135deg, #c8a46e 0%, #d4b483 50%, #c0955a 100%)',
          borderRadius: 12,
          border: '3px solid #8B6914',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          // Prevent text/element selection during mouse drag on PC
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {cells.map((cell, idx) => (
          <Cell
            key={idx}
            idx={idx}
            item={cell.item}
            isSelected={selectedIdx === idx}
            isDraggingFrom={drag.fromIdx === idx}
            isDropTarget={drag.targetIdx === idx}
            canMerge={drag.targetIdx === idx && drag.canMerge}
            canUnlockTarget={drag.targetIdx === idx && drag.canUnlockTarget}
            onPointerDown={(e) => handlePointerDown(e, idx)}
          />
        ))}
      </div>
    </>
  )
}

export default BoardGrid
