import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EconomyState } from '@/shared/types';
import {
    INITIAL_COINS,
    INITIAL_GEMS,
    INITIAL_STAMINA,
    MAX_STAMINA,
    STAMINA_REGEN_MS,
    STAMINA_BUY_COST_GEMS,
} from '@/shared/constants';

interface EconomyStore extends EconomyState {
    // Actions
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    addGems: (amount: number) => void;
    spendGems: (amount: number) => boolean;
    spendStamina: (amount: number) => boolean;
    buyStamina: () => boolean;
    tickStaminaRegen: () => void;
}

export const useEconomyStore = create<EconomyStore>()(
    immer((set, get) => ({
        coins: INITIAL_COINS,
        gems: INITIAL_GEMS,
        stamina: INITIAL_STAMINA,
        maxStamina: MAX_STAMINA,
        staminaRegenMs: STAMINA_REGEN_MS,
        lastStaminaTick: Date.now(),

        addCoins: (amount) => {
            set((draft) => {
                draft.coins += amount;
            });
        },

        spendCoins: (amount) => {
            const state = get();
            if (state.coins < amount) {
                return false;
            }
            set((draft) => {
                draft.coins -= amount;
            });
            return true;
        },

        addGems: (amount) => {
            set((draft) => {
                draft.gems += amount;
            });
        },

        spendGems: (amount) => {
            const state = get();
            if (state.gems < amount) {
                return false;
            }
            set((draft) => {
                draft.gems -= amount;
            });
            return true;
        },

        spendStamina: (amount) => {
            const state = get();
            if (state.stamina < amount) {
                return false;
            }
            set((draft) => {
                draft.stamina -= amount;
            });
            return true;
        },

        buyStamina: () => {
            const state = get();
            if (state.gems < STAMINA_BUY_COST_GEMS) {
                return false;
            }
            set((draft) => {
                draft.gems -= STAMINA_BUY_COST_GEMS;
                draft.stamina = draft.maxStamina;
                draft.lastStaminaTick = Date.now();
            });
            return true;
        },

        tickStaminaRegen: () => {
            const state = get();
            if (state.stamina >= state.maxStamina) {
                return;
            }

            const now = Date.now();
            const elapsed = now - state.lastStaminaTick;
            const pointsToAdd = Math.floor(elapsed / state.staminaRegenMs);

            if (pointsToAdd > 0) {
                set((draft) => {
                    draft.stamina = Math.min(draft.maxStamina, draft.stamina + pointsToAdd);
                    draft.lastStaminaTick = now;
                });
            }
        },
    }))
);
