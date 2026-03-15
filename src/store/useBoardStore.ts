import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { canItemsMerge, canUnlock, getMergeResult, getPrimaryGeneratedItemId, ITEM_MAP, selectGeneratedItem } from '@/data/items'

export const COLS = 7
export const ROWS = 9

export interface BoardItem {
  instanceId: string      // unique per item on board
  itemId: string          // key into ITEM_MAP
  isLocked: boolean       // locked until unlock condition met
  lockHits?: number       // how many merge-hits needed to unlock (default 1)
  /** For auto-generators (老母鸡): number of items stored and ready to spawn */
  storedCount?: number
  /** For auto-generators: timestamp (ms) when the current cooldown started */
  lastGeneratedAt?: number
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
  /** Tick auto-generators: fill storage when cooldown expires, then auto-spawn to adjacent cells */
  autoTickGenerators: () => void
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

/** Find empty cells: adjacent cells first, then any empty cell on the board */
function findEmptyCells(cells: Cell[], preferNear: number): number[] {
  const result: number[] = []
  const row = Math.floor(preferNear / COLS)
  const col = preferNear % COLS
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const r = row + dr, c = col + dc
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
      const ni = r * COLS + c
      if (!cells[ni].item) result.unshift(ni)
    }
  }
  if (result.length === 0) {
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].item) result.push(i)
    }
  }
  return result
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

  // ── Row 0: 老母鸡 generator (Lv6, ready to auto-gen) + starting egg pieces ──
  place(0, 1, 'poultry_6')    // 老母鸡 Lv6 – auto-spawns eggs every 1 hour
  place(0, 2, 'egg_1')        // ready to merge
  place(0, 3, 'egg_1')        // egg_1 + egg_1 → egg_2 right away
  place(0, 5, 'basket_5')     // 食篓 Lv5 – click ⚡ to spawn 面团 / 西瓜 (rare)

  // ── Row 1: teapot generator + two coolTea_1 to merge, one locked lantern ───
  place(1, 0, 'teapot_4')     // 茶壶 Lv4 – click ⚡ to spawn 凉茶 / 酒酝圆子 (rare)
  place(1, 1, 'coolTea_1')    // coolTea_1 + coolTea_1 → coolTea_2
  place(1, 2, 'coolTea_1')
  place(1, 6, 'lantern_2', true, 1)  // unlock by dragging lantern_1

  // ── Row 2: dough_1 as extra material; locked mid-level items ────────────────
  place(2, 0, 'dough_1')
  place(2, 5, 'coolTea_4', true, 2)   // LOCKED – needs coolTea items to unlock
  place(2, 6, 'dough_4',   true, 2)   // LOCKED

  // ── Row 3: generators for dresser/craftBox + locked mid-level ────────────────
  place(3, 0, 'dresser_5')    // 妆奁 Lv5 – click ⚡ to spawn 戒指 / 平安扣 (rare)
  place(3, 3, 'teapot_1')     // 茶壶 Lv1 – can be merged to upgrade
  place(3, 4, 'craftBox_5')   // 手作盒 Lv5 – click ⚡ to spawn 灯笼
  place(3, 5, 'ring_3',    true, 2)   // LOCKED
  place(3, 6, 'lantern_3', true, 2)   // LOCKED

  // ── Row 4: loom generator + starting fabric + locked items ───────────────────
  place(4, 0, 'loom_5')       // 织布机 Lv5 – click ⚡ to spawn 布匹
  place(4, 1, 'fabric_1')     // starting fabric piece
  place(4, 5, 'dough_3',   true, 1)   // LOCKED – unlock with dough items
  place(4, 6, 'ring_2',    true, 1)   // LOCKED

  // ── Row 5: lantern_1 (unlocked) + high-level locked ─────────────────────────
  place(5, 0, 'lantern_1')    // can merge two of these → lantern_2
  place(5, 5, 'egg_5',     true, 3)   // LOCKED high-level
  place(5, 6, 'coolTea_5', true, 3)   // LOCKED high-level

  // ── Row 6: ring_1 (unlocked) + locked mid/high ───────────────────────────────
  place(6, 0, 'ring_1')
  place(6, 5, 'egg_3',     true, 1)   // LOCKED
  place(6, 6, 'dough_5',   true, 3)   // LOCKED

  // ── Row 7: locked filler ────────────────────────────────────────────────────
  place(7, 3, 'lantern_4', true, 2)   // LOCKED
  place(7, 4, 'coolTea_3', true, 1)   // LOCKED
  place(7, 5, 'egg_4',     true, 2)   // LOCKED

  // ── Row 8: locked high-value items ──────────────────────────────────────────
  place(8, 3, 'dough_6',   true, 3)   // LOCKED
  place(8, 4, 'egg_6',     true, 3)   // LOCKED
  place(8, 5, 'coolTea_6', true, 3)   // LOCKED

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
      if (!def?.isGenerator) return

      if (def.isAutoGenerator) {
        // Auto-generator (老母鸡): player click spawns one stored egg to nearest empty cell
        const stored = item.storedCount ?? 0
        if (stored <= 0) return  // nothing stored yet

        // Find target: adjacent empty cell first, then any empty cell
        const row = Math.floor(cellIdx / COLS)
        const col = cellIdx % COLS
        let targetIdx = -1
        outer: for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const r = row + dr, c = col + dc
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
            const ni = r * COLS + c
            if (!cells[ni].item) { targetIdx = ni; break outer }
          }
        }
        if (targetIdx === -1) {
          for (let i = 0; i < cells.length; i++) {
            if (!cells[i].item) { targetIdx = i; break }
          }
        }
        if (targetIdx === -1) return  // board full

        const generateId = getPrimaryGeneratedItemId(def)
        if (!generateId) return

        set(state => {
          const it = state.cells[cellIdx].item!
          state.cells[targetIdx].item = newInstance(generateId)
          it.storedCount = (it.storedCount ?? 0) - 1
          // Start CD once all stored items are spawned
          if ((it.storedCount ?? 0) <= 0) {
            it.storedCount = 0
            it.lastGeneratedAt = Date.now()
          }
        })
        return
      }

      // Click generator: spend energy (handled in BoardGrid), weighted random spawn
      if (!def.generates || def.generates.length === 0) {
        // Fallback: use generatesId directly
        if (!def.generatesId) return
        const emptyCells = findEmptyCells(cells, cellIdx)
        if (emptyCells.length === 0) return
        set(state => { state.cells[emptyCells[0]].item = newInstance(def.generatesId!) })
        return
      }

      const emptyCells = findEmptyCells(cells, cellIdx)
      if (emptyCells.length === 0) return

      const generateId = selectGeneratedItem(def.generates, def.level)
      set(state => { state.cells[emptyCells[0]].item = newInstance(generateId) })
    },

    autoTickGenerators: () => {
      const { cells } = get()
      const now = Date.now()

      // Collect auto-generators that need processing
      const toProcess: number[] = []
      for (let i = 0; i < cells.length; i++) {
        const item = cells[i].item
        if (!item || item.isLocked) continue
        const def = ITEM_MAP[item.itemId]
        if (!def?.isAutoGenerator || !def.cooldownMs) continue

        const lastGen = item.lastGeneratedAt ?? 0
        const stored = item.storedCount ?? 0
        const capacity = def.storageCapacity ?? 6

        // CD expired and storage not full → fill storage
        if (stored < capacity && (now - lastGen >= def.cooldownMs)) {
          toProcess.push(i)
        } else if (stored > 0) {
          // Has stored items → try to auto-spawn to adjacent cells
          toProcess.push(i)
        }
      }

      if (toProcess.length === 0) return

      set(state => {
        const now2 = Date.now()
        for (const cellIdx of toProcess) {
          const item = state.cells[cellIdx].item
          if (!item) continue
          const def = ITEM_MAP[item.itemId]
          if (!def?.isAutoGenerator) continue

          const capacity = def.storageCapacity ?? 6
          const lastGen = item.lastGeneratedAt ?? 0
          const cooldown = def.cooldownMs ?? 3_600_000

          // Fill storage if CD expired
          if ((item.storedCount ?? 0) < capacity && (now2 - lastGen >= cooldown)) {
            item.storedCount = capacity
          }

          // Try to auto-spawn stored items to adjacent empty cells
          if ((item.storedCount ?? 0) > 0) {
            const generateId = getPrimaryGeneratedItemId(def)
            if (!generateId) continue

            const row = Math.floor(cellIdx / COLS)
            const col = cellIdx % COLS
            for (let dr = -1; dr <= 1 && (item.storedCount ?? 0) > 0; dr++) {
              for (let dc = -1; dc <= 1 && (item.storedCount ?? 0) > 0; dc++) {
                if (dr === 0 && dc === 0) continue
                const r = row + dr, c = col + dc
                if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
                const ni = r * COLS + c
                if (!state.cells[ni].item) {
                  state.cells[ni].item = newInstance(generateId)
                  item.storedCount = (item.storedCount ?? 0) - 1
                }
              }
            }

            // Start CD once all stored items are spawned
            if ((item.storedCount ?? 0) <= 0) {
              item.storedCount = 0
              item.lastGeneratedAt = now2
            }
          }
        }
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
