import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ToolInventory, ToolType } from '@/shared/types';
import { INITIAL_SCISSORS, INITIAL_HOURGLASS, INITIAL_WILDCARD } from '@/shared/constants';

interface ToolStore extends ToolInventory {
    // Actions
    addTool: (tool: ToolType, amount: number) => void;
    useTool: (tool: ToolType) => boolean;
}

export const useToolStore = create<ToolStore>()(
    immer((set, get) => ({
        scissors: INITIAL_SCISSORS,
        hourglass: INITIAL_HOURGLASS,
        wildcard: INITIAL_WILDCARD,

        addTool: (tool, amount) => {
            set((draft) => {
                draft[tool] += amount;
            });
        },

        useTool: (tool) => {
            const state = get();
            if (state[tool] <= 0) {
                return false;
            }
            set((draft) => {
                draft[tool] -= 1;
            });
            return true;
        },
    }))
);
