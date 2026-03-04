import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { canItemsMerge, canUnlock, getMergeResult, ITEM_MAP } from '@/data/items'

export const COLS = 7
export const ROWS = 9

export interface BoardItem {
  instanceId: string      // unique per item on board
  itemId: string          // key into ITEM_MAP
  isLocked: boolean       // locked until unlock condition met
  lockHits?: number       // how many merge-hits needed to unlock (default 1)
}

export interface Cell {
  item: BoardItem | null
}

interface DragState {
  fromIdx: number | null  // flat index of source cell
  targetIdx: number | null
  canMerge: boolean
  canUnlockTarget: boolean
}

interface BoardState {
  cells: Cell[]
  drag: DragState
  selectedIdx: number | null  // clicked/selected cell index
}

interface BoardActions {
  initBoard: () => void
  startDrag: (fromIdx: number) => void
  moveDrag: (targetIdx: number) => void
  endDrag: () => void
  cancelDrag: () => void
  clickGenerator: (cellIdx: number) => void
  selectCell: (idx: number | null) => void
  deleteSelected: () => void
  /** Remove a specific item by instanceId (used by order store) */
  removeItem: (instanceId: string) => boolean
  /** Place an item onto any empty cell (or a given idx) */
  spawnItem: (itemId: string, preferIdx?: number) => boolean
}

let _instanceCounter = Date.now() * 1000
function newInstance(itemId: string): BoardItem {
  return { instanceId: `${itemId}_${++_instanceCounter}`, itemId, isLocked: false }
}

function emptyGrid(): Cell[] {
  return Array.from({ length: COLS * ROWS }, () => ({ item: null }))
}

// ─── Initial board layout ────────────────────────────────────────────────────
// 7 cols × 9 rows = 63 cells. Row 0 = top. cell index = row * COLS + col
// Tutorial-friendly: generators + a few level-1 items unlocked; most pieces locked.
function buildInitialBoard(): Cell[] {
  const cells = emptyGrid()

  const place = (row: number, col: number, itemId: string, locked = false, hits = 1) => {
    const idx = row * COLS + col
    if (idx < 0 || idx >= cells.length) return
    if (!ITEM_MAP[itemId]) return
    cells[idx].item = { instanceId: `${itemId}_${++_instanceCounter}`, itemId, isLocked: locked, lockHits: hits }
  }

  // ── Row 0: generators (unlocked) + starting level-1 items ──────────────────
  place(0, 1, 'poultry_gen')    // generator – click ⚡ to spawn poultry_1
  place(0, 2, 'poultry_1')      // ready to merge
  place(0, 3, 'poultry_1')      // ready to merge → get poultry_2 right away
  place(0, 5, 'tool_gen')       // generator – click ⚡ to spawn tool_1

  // ── Row 1: two tea_1 to merge, one locked mid-level to unlock later ─────────
  place(1, 0, 'tea_1')
  place(1, 1, 'tea_1')          // tea_1 + tea_1 → tea_2
  place(1, 6, 'lantern_2', true, 1)  // unlock by dragging lantern_1

  // ── Row 2: one pastry_1 as extra material; locked mid-level items ───────────
  place(2, 0, 'pastry_1')
  place(2, 5, 'tea_4',    true, 2)   // LOCKED – needs tea items to unlock
  place(2, 6, 'pastry_4', true, 2)   // LOCKED

  // ── Row 3: locked mid-level ─────────────────────────────────────────────────
  place(3, 5, 'jewelry_3', true, 2)  // LOCKED
  place(3, 6, 'lantern_3', true, 2)  // LOCKED

  // ── Row 4: tool_1 pair to merge + locked item ───────────────────────────────
  place(4, 0, 'tool_1')
  place(4, 1, 'tool_1')          // tool_1 + tool_1 → tool_2
  place(4, 5, 'pastry_3', true, 1)   // LOCKED – unlock with pastry items
  place(4, 6, 'jewelry_2', true, 1)  // LOCKED

  // ── Row 5: lantern_1 (unlocked) + high-level locked ─────────────────────────
  place(5, 0, 'lantern_1')       // can merge two of these → lantern_2
  place(5, 5, 'poultry_5', true, 3)  // LOCKED high-level
  place(5, 6, 'tea_5',     true, 3)  // LOCKED high-level

  // ── Row 6: jewelry_1 (unlocked) + locked mid/high ───────────────────────────
  place(6, 0, 'jewelry_1')
  place(6, 5, 'poultry_3', true, 1)  // LOCKED
  place(6, 6, 'pastry_5',  true, 3)  // LOCKED

  // ── Row 7: locked filler ────────────────────────────────────────────────────
  place(7, 3, 'lantern_4', true, 2)  // LOCKED
  place(7, 4, 'tea_3',     true, 1)  // LOCKED
  place(7, 5, 'poultry_4', true, 2)  // LOCKED

  // ── Row 8: locked high-value items ──────────────────────────────────────────
  place(8, 3, 'pastry_6',  true, 3)  // LOCKED
  place(8, 4, 'poultry_6', true, 3)  // LOCKED
  place(8, 5, 'tea_6',     true, 3)  // LOCKED

  return cells
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useBoardStore = create<BoardState & BoardActions>()(
  persist(
    immer((set, get) => ({
      cells: buildInitialBoard(),
      drag: { fromIdx: null, targetIdx: null, canMerge: false, canUnlockTarget: false },
      selectedIdx: null,

    initBoard: () => {
      set(state => { state.cells = buildInitialBoard() })
    },

    startDrag: (fromIdx) => {
      set(state => {
        state.drag = { fromIdx, targetIdx: null, canMerge: false, canUnlockTarget: false }
        state.selectedIdx = fromIdx
      })
    },

    moveDrag: (targetIdx) => {
      const { cells, drag } = get()
      if (drag.fromIdx === null) return
      if (targetIdx < 0 || drag.fromIdx === targetIdx) {
        if (drag.targetIdx === null && !drag.canMerge && !drag.canUnlockTarget) return
        set(state => { state.drag.targetIdx = null; state.drag.canMerge = false; state.drag.canUnlockTarget = false })
        return
      }

      const fromItem = cells[drag.fromIdx]?.item
      const toItem = cells[targetIdx]?.item

      if (!fromItem) return

      let canMerge = false
      let canUnlockTarget = false

      if (toItem) {
        if (!toItem.isLocked && !fromItem.isLocked) {
          canMerge = canItemsMerge(fromItem.itemId, toItem.itemId)
        }
        if (toItem.isLocked) {
          canUnlockTarget = canUnlock(toItem.itemId, fromItem.itemId)
        }
      }

      if (drag.targetIdx === targetIdx && drag.canMerge === canMerge && drag.canUnlockTarget === canUnlockTarget) return

      set(state => {
        state.drag.targetIdx = targetIdx
        state.drag.canMerge = canMerge
        state.drag.canUnlockTarget = canUnlockTarget
      })
    },

    endDrag: () => {
      const { cells, drag } = get()
      const { fromIdx, targetIdx, canMerge, canUnlockTarget } = drag
      if (fromIdx === null) {
        set(state => { state.drag = { fromIdx: null, targetIdx: null, canMerge: false, canUnlockTarget: false } })
        return
      }

      const fromItem = cells[fromIdx]?.item
      const toItem = targetIdx !== null ? cells[targetIdx]?.item : null

      set(state => {
        if (fromIdx === null || !fromItem) {
          state.drag = { fromIdx: null, targetIdx: null, canMerge: false, canUnlockTarget: false }
          return
        }

        if (targetIdx !== null && toItem && canMerge) {
          // Merge: replace target with merged item, clear source
          const resultId = getMergeResult(fromItem.itemId)!
          state.cells[targetIdx].item = newInstance(resultId)
          state.cells[fromIdx].item = null
        } else if (targetIdx !== null && toItem && canUnlockTarget) {
          // Unlock: consume the dragged piece, unlock the locked piece
          const lockedItem = state.cells[targetIdx].item!
          const hits = (lockedItem.lockHits ?? 1) - 1
          if (hits <= 0) {
            lockedItem.isLocked = false
            lockedItem.lockHits = 0
          } else {
            lockedItem.lockHits = hits
          }
          state.cells[fromIdx].item = null
        } else if (targetIdx !== null && !toItem) {
          // Move: drag to empty cell
          state.cells[targetIdx].item = fromItem
          state.cells[fromIdx].item = null
        }
        // else: invalid drop - do nothing (item stays)

        state.drag = { fromIdx: null, targetIdx: null, canMerge: false, canUnlockTarget: false }
        state.selectedIdx = null
      })
    },

    cancelDrag: () => {
      set(state => {
        state.drag = { fromIdx: null, targetIdx: null, canMerge: false, canUnlockTarget: false }
      })
    },

    clickGenerator: (cellIdx) => {
      const { cells } = get()
      const item = cells[cellIdx]?.item
      if (!item || item.isLocked) return
      const def = ITEM_MAP[item.itemId]
      if (!def?.isGenerator || !def.generatesId) return

      // Find an empty adjacent cell, or any empty cell
      const emptyCells: number[] = []
      const row = Math.floor(cellIdx / COLS)
      const col = cellIdx % COLS

      // Check adjacent first
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const r = row + dr, c = col + dc
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
          const ni = r * COLS + c
          if (!cells[ni].item) emptyCells.unshift(ni) // prefer adjacent
        }
      }
      // Fallback: any empty cell
      if (emptyCells.length === 0) {
        for (let i = 0; i < cells.length; i++) {
          if (!cells[i].item) emptyCells.push(i)
        }
      }
      if (emptyCells.length === 0) return // board full

      set(state => {
        const targetIdx = emptyCells[0]
        state.cells[targetIdx].item = newInstance(def.generatesId!)
      })
    },

    selectCell: (idx) => {
      set(state => { state.selectedIdx = idx })
    },

    deleteSelected: () => {
      const { selectedIdx } = get()
      if (selectedIdx === null) return
      set(state => {
        if (state.selectedIdx !== null) {
          state.cells[state.selectedIdx].item = null
          state.selectedIdx = null
        }
      })
    },

    removeItem: (instanceId) => {
      const { cells } = get()
      const idx = cells.findIndex(c => c.item?.instanceId === instanceId)
      if (idx === -1) return false
      set(state => { state.cells[idx].item = null })
      return true
    },

    spawnItem: (itemId, preferIdx) => {
      const { cells } = get()
      if (preferIdx !== undefined && !cells[preferIdx].item) {
        set(state => { state.cells[preferIdx].item = newInstance(itemId) })
        return true
      }
      const emptyIdx = cells.findIndex(c => !c.item)
      if (emptyIdx === -1) return false
      set(state => { state.cells[emptyIdx].item = newInstance(itemId) })
      return true
    },
  })),
  {
    name: 'hehegame-board',
    partialize: (state) => ({ cells: state.cells }),
  }
))
