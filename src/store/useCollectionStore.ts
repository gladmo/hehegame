import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CollectionState, CollectionEntry } from '@/shared/types';
import { ALL_ITEMS } from '@/data/items';

interface CollectionStore extends CollectionState {
    // Actions
    discoverItem: (itemDefinitionId: string) => void;
    recordItemCreation: (itemDefinitionId: string) => void;
    recordItemUsage: (itemDefinitionId: string) => void;
    claimMilestone: (milestoneId: number) => boolean;
}

function initializeEntries(): Record<string, CollectionEntry> {
    const entries: Record<string, CollectionEntry> = {};
    for (const item of ALL_ITEMS) {
        entries[item.id] = {
            itemDefinitionId: item.id,
            discovered: false,
            firstDiscoveredAt: null,
            timesCreated: 0,
            timesUsedInOrders: 0,
        };
    }
    return entries;
}

export const useCollectionStore = create<CollectionStore>()(
    immer((set, get) => ({
        entries: initializeEntries(),
        totalDiscovered: 0,
        totalPossible: ALL_ITEMS.length,
        milestonesClaimed: [],

        discoverItem: (itemDefinitionId) => {
            set((draft) => {
                const entry = draft.entries[itemDefinitionId];
                if (entry && !entry.discovered) {
                    entry.discovered = true;
                    entry.firstDiscoveredAt = Date.now();
                    draft.totalDiscovered += 1;
                }
            });
        },

        recordItemCreation: (itemDefinitionId) => {
            set((draft) => {
                const entry = draft.entries[itemDefinitionId];
                if (entry) {
                    entry.timesCreated += 1;
                    if (!entry.discovered) {
                        entry.discovered = true;
                        entry.firstDiscoveredAt = Date.now();
                        draft.totalDiscovered += 1;
                    }
                }
            });
        },

        recordItemUsage: (itemDefinitionId) => {
            set((draft) => {
                const entry = draft.entries[itemDefinitionId];
                if (entry) {
                    entry.timesUsedInOrders += 1;
                }
            });
        },

        claimMilestone: (milestoneId) => {
            const state = get();
            if (state.milestonesClaimed.includes(milestoneId)) {
                return false;
            }
            
            set((draft) => {
                draft.milestonesClaimed.push(milestoneId);
            });
            
            return true;
        },
    }))
);
