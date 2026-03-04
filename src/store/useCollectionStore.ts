import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface CollectionEntry {
  itemId: string
  totalCreated: number  // how many times this item was ever created/merged into
  totalUsed: number     // how many times used in orders
}

interface CollectionState {
  entries: Record<string, CollectionEntry>
}

interface CollectionActions {
  recordItemCreation: (itemId: string) => void
  recordItemUsage: (itemId: string, count?: number) => void
  getEntry: (itemId: string) => CollectionEntry | undefined
}

function ensureEntry(entries: Record<string, CollectionEntry>, itemId: string) {
  if (!entries[itemId]) {
    entries[itemId] = { itemId, totalCreated: 0, totalUsed: 0 }
  }
}

export const useCollectionStore = create<CollectionState & CollectionActions>()(
  immer((set, get) => ({
    entries: {},

    recordItemCreation: (itemId) => {
      set(state => {
        ensureEntry(state.entries, itemId)
        state.entries[itemId].totalCreated += 1
      })
    },

    recordItemUsage: (itemId, count = 1) => {
      set(state => {
        ensureEntry(state.entries, itemId)
        state.entries[itemId].totalUsed += count
      })
    },

    getEntry: (itemId) => {
      return get().entries[itemId]
    },
  }))
)
