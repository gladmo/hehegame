import type { BattlePassTier } from '@/shared/types';

export const BATTLE_PASS_TIERS: BattlePassTier[] = Array.from({ length: 30 }, (_, i) => {
    const tier = i + 1;
    return {
        tier,
        xpRequired: tier * 100,
        freeReward: getFreeReward(tier),
        premiumReward: getPremiumReward(tier),
    };
});

function getFreeReward(tier: number): BattlePassTier['freeReward'] {
    if (tier % 10 === 0) return { type: 'lootbox', itemId: tier === 30 ? 'gold' : 'silver' };
    if (tier % 5 === 0) return { type: 'gems', amount: 10 };
    if (tier % 3 === 0) return { type: 'stamina', amount: 10 };
    return { type: 'coins', amount: 50 + tier * 10 };
}

function getPremiumReward(tier: number): BattlePassTier['premiumReward'] {
    if (tier === 30) return { type: 'decoration', itemId: 'garden_gazebo' };
    if (tier % 10 === 0) return { type: 'lootbox', itemId: 'gold' };
    if (tier % 7 === 0) return { type: 'tool', toolType: 'wildcard', amount: 1 };
    if (tier % 5 === 0) return { type: 'gems', amount: 30 };
    if (tier % 3 === 0) return { type: 'tool', toolType: 'scissors', amount: 2 };
    return { type: 'coins', amount: 100 + tier * 15 };
}
