import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { PlayerState } from '@/shared/types';
import { xpForLevel, MAX_LEVEL } from '@/shared/constants';

interface PlayerStore extends PlayerState {
    // Actions
    addXp: (amount: number) => void;
    setStoryProgress: (chapter: number, step: number) => void;
    unlockArea: (areaId: string) => void;
    setCurrentArea: (areaId: string) => void;
}

export const usePlayerStore = create<PlayerStore>()(
    immer((set, get) => ({
        level: 1,
        xp: 0,
        xpToNextLevel: xpForLevel(1),
        storyChapter: 0,
        storyStep: 0,
        unlockedAreas: ['bar'],
        currentArea: 'bar',

        addXp: (amount) => {
            set((draft) => {
                draft.xp += amount;
                
                // Level up loop
                while (draft.xp >= draft.xpToNextLevel && draft.level < MAX_LEVEL) {
                    draft.xp -= draft.xpToNextLevel;
                    draft.level += 1;
                    draft.xpToNextLevel = xpForLevel(draft.level);
                }
            });
        },

        setStoryProgress: (chapter, step) => {
            set((draft) => {
                draft.storyChapter = chapter;
                draft.storyStep = step;
            });
        },

        unlockArea: (areaId) => {
            set((draft) => {
                if (!draft.unlockedAreas.includes(areaId)) {
                    draft.unlockedAreas.push(areaId);
                }
            });
        },

        setCurrentArea: (areaId) => {
            set((draft) => {
                draft.currentArea = areaId;
            });
        },
    }))
);
