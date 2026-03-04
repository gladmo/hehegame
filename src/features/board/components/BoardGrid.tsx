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
  const pointerDownRef = useRef<{ idx: number }>({ idx: -1 })

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => {
    const item = cells[idx]?.item
    if (!item || item.isLocked) {
      selectCell(idx)
      return
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    pointerDownRef.current = { idx }
    startDrag(idx)
  }, [cells, startDrag, selectCell])

  const handlePointerEnter = useCallback((idx: number) => {
    if (!isDragging) return
    moveDrag(idx)
  }, [isDragging, moveDrag])

  const handlePointerUp = useCallback((idx: number) => {
    if (!isDragging) {
      selectCell(idx)
      return
    }
    const { fromIdx } = drag
    if (fromIdx === idx) {
      // Tap (no move) = click generator or select
      cancelDrag()
      const item = cells[idx]?.item
      if (item && !item.isLocked) {
        const def = ITEM_MAP[item.itemId]
        if (def?.isGenerator) {
          const ok = spendEnergy(1)
          if (ok) clickGenerator(idx)
          return
        }
      }
      selectCell(idx)
      return
    }
    endDrag()
  }, [isDragging, drag, cells, cancelDrag, endDrag, selectCell, clickGenerator, spendEnergy])

  // Global pointer up (in case pointer leaves grid)
  const handleGridPointerLeave = useCallback(() => {
    if (isDragging) {
      moveDrag(-1) // clear target
    }
  }, [isDragging, moveDrag])

  const handleGridPointerUp = useCallback(() => {
    if (isDragging) {
      endDrag()
    }
  }, [isDragging, endDrag])

  return (
    <div
      ref={gridRef}
      onPointerLeave={handleGridPointerLeave}
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
          onPointerEnter={() => handlePointerEnter(idx)}
          onPointerUp={() => handlePointerUp(idx)}
        />
      ))}
    </div>
  )
}

export default BoardGrid
