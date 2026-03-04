import React, { useCallback, useRef } from 'react'
import { useBoardStore, COLS, ROWS } from '@/store/useBoardStore'
import { useEconomyStore } from '@/store/useEconomyStore'
import { ITEM_MAP } from '@/data/items'
import Cell from './Cell'

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
    startDrag(idx)
  }, [cells, startDrag, selectCell])

  // Grid-level pointermove: use elementFromPoint to find the cell under the
  // pointer. This works on both desktop and mobile (touch), because pointer
  // events bubble up from the capturing element to the grid even when a cell
  // has pointer capture, and elementFromPoint ignores capture for hit testing.
  const handleGridPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    pointerMovedRef.current = true
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const cellEl = el?.closest('[data-cell-idx]') as HTMLElement | null
    if (cellEl) {
      const idx = parseInt(cellEl.dataset.cellIdx ?? '-1', 10)
      moveDrag(idx)
    } else {
      moveDrag(-1) // pointer outside all cells → clear drop target
    }
  }, [isDragging, moveDrag])

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

  return (
    <div
      ref={gridRef}
      onPointerMove={handleGridPointerMove}
      onPointerUp={handleGridPointerUp}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: 3,
        padding: 6,
        background: 'linear-gradient(135deg, #c8a46e 0%, #d4b483 50%, #c0955a 100%)',
        borderRadius: 12,
        border: '3px solid #8B6914',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)',
        width: '100%',
        height: '100%',
        touchAction: 'none',
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
  )
}

export default BoardGrid
