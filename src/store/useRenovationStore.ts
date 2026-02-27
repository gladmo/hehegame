import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { RenovationState, AreaState, PlacedDecoration } from '@/shared/types';
import { AREAS } from '@/data/renovations';

interface RenovationStore extends RenovationState {
    // Actions
    placeDecoration: (areaId: string, slot: string, decorationId: string, variantIndex: number) => void;
    getAreaCompletion: (areaId: string) => number;
    isAreaUnlocked: (areaId: string, playerLevel: number) => boolean;
}

function initializeAreas(): Record<string, AreaState> {
    const areas: Record<string, AreaState> = {};
    for (const area of AREAS) {
        areas[area.id] = {
            unlocked: area.unlockLevel === 1,
            decorations: {},
            completionPercent: 0,
        };
    }
    return areas;
}

export const useRenovationStore = create<RenovationStore>()(
    immer((set, get) => ({
        areas: initializeAreas(),

        placeDecoration: (areaId, slot, decorationId, variantIndex) => {
            set((draft) => {
                if (!draft.areas[areaId]) {
                    draft.areas[areaId] = {
                        unlocked: true,
                        decorations: {},
                        completionPercent: 0,
                    };
                }
                
                draft.areas[areaId].decorations[slot] = {
                    decorationId,
                    variantIndex,
                };
                
                // Recalculate completion
                const area = AREAS.find(a => a.id === areaId);
                if (area) {
                    const placed = Object.keys(draft.areas[areaId].decorations).length;
                    draft.areas[areaId].completionPercent = Math.round((placed / area.slots) * 100);
                }
            });
        },

        getAreaCompletion: (areaId) => {
            const state = get();
            return state.areas[areaId]?.completionPercent ?? 0;
        },

        isAreaUnlocked: (areaId, playerLevel) => {
            const area = AREAS.find(a => a.id === areaId);
            return area ? playerLevel >= area.unlockLevel : false;
        },
    }))
);
