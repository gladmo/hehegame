import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { BattlePassState } from '@/shared/types';
import { BP_SEASON_DAYS } from '@/shared/constants';

interface BattlePassStore extends BattlePassState {
    // Actions
    addBattlePassXp: (amount: number) => void;
    claimReward: (tier: number, isPremium: boolean) => boolean;
    purchasePremium: () => boolean;
}

export const useBattlePassStore = create<BattlePassStore>()(
    immer((set, get) => ({
        season: 1,
        isPremium: false,
        currentXp: 0,
        claimedFree: [],
        claimedPremium: [],
        expiresAt: Date.now() + BP_SEASON_DAYS * 86_400_000,

        addBattlePassXp: (amount) => {
            set((draft) => {
                draft.currentXp += amount;
            });
        },

        claimReward: (tier, isPremium) => {
            const state = get();
            
            if (isPremium && !state.isPremium) {
                return false;
            }
            
            const claimed = isPremium ? state.claimedPremium : state.claimedFree;
            if (claimed.includes(tier)) {
                return false;
            }
            
            set((draft) => {
                if (isPremium) {
                    draft.claimedPremium.push(tier);
                } else {
                    draft.claimedFree.push(tier);
                }
            });
            
            return true;
        },

        purchasePremium: () => {
            const state = get();
            if (state.isPremium) {
                return false;
            }
            
            set((draft) => {
                draft.isPremium = true;
            });
            
            return true;
        },
    }))
);
