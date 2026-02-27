import { useBattlePassStore } from '@/store/useBattlePassStore';
import { useEconomyStore } from '@/store/useEconomyStore';
import { useToolStore } from '@/store/useToolStore';
import { BATTLE_PASS_TIERS } from '@/data/battlepass';
import { BP_XP_PER_TIER } from '@/shared/constants';

export function BattlePassScreen() {
    const currentXp = useBattlePassStore(state => state.currentXp);
    const isPremium = useBattlePassStore(state => state.isPremium);
    const claimedFree = useBattlePassStore(state => state.claimedFree);
    const claimedPremium = useBattlePassStore(state => state.claimedPremium);
    const claimReward = useBattlePassStore(state => state.claimReward);
    const purchasePremium = useBattlePassStore(state => state.purchasePremium);
    const addCoins = useEconomyStore(state => state.addCoins);
    const addGems = useEconomyStore(state => state.addGems);
    const addTool = useToolStore(state => state.addTool);
    const spendGems = useEconomyStore(state => state.spendGems);

    const currentTier = Math.floor(currentXp / BP_XP_PER_TIER);

    const handleClaimReward = (tier: number, isPremiumReward: boolean) => {
        if (tier > currentTier) return;
        
        const tierData = BATTLE_PASS_TIERS[tier - 1];
        if (!tierData) return;

        if (claimReward(tier, isPremiumReward)) {
            const reward = isPremiumReward ? tierData.premiumReward : tierData.freeReward;
            
            if (reward.type === 'coins' && reward.amount) {
                addCoins(reward.amount);
            } else if (reward.type === 'gems' && reward.amount) {
                addGems(reward.amount);
            } else if (reward.type === 'tool' && reward.toolType && reward.amount) {
                addTool(reward.toolType, reward.amount);
            }
        }
    };

    const handleBuyPremium = () => {
        if (spendGems(500)) {
            purchasePremium();
        }
    };

    const daysRemaining = Math.ceil((useBattlePassStore.getState().expiresAt - Date.now()) / 86_400_000);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            padding: '20px',
            overflow: 'auto',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#333' }}>
                    🎫 战斗通行证 - 第 {useBattlePassStore.getState().season} 季
                </h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                    剩余时间: {daysRemaining} 天 • 当前等级: {currentTier}/30 • XP: {currentXp}/{BP_XP_PER_TIER * 30}
                </p>
            </div>

            {!isPremium && (
                <div style={{
                    marginBottom: '20px',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>升级到高级通行证</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                            解锁所有高级奖励，获得更多金币、钻石和独家装饰品！
                        </p>
                    </div>
                    <button
                        onClick={handleBuyPremium}
                        style={{
                            padding: '12px 24px',
                            background: '#ff5722',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        💎 500 购买
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BATTLE_PASS_TIERS.map(tier => {
                    const isUnlocked = currentTier >= tier.tier;
                    const freeRewardClaimed = claimedFree.includes(tier.tier);
                    const premiumRewardClaimed = claimedPremium.includes(tier.tier);

                    return (
                        <div
                            key={tier.tier}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr 1fr',
                                gap: '12px',
                                padding: '12px',
                                background: isUnlocked ? 'white' : '#f5f5f5',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                opacity: isUnlocked ? 1 : 0.7,
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isUnlocked ? '#4caf50' : '#ddd',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 'bold',
                            }}>
                                <div style={{ fontSize: '20px' }}>{tier.tier}</div>
                                <div style={{ fontSize: '10px' }}>TIER</div>
                            </div>

                            {/* Free Reward */}
                            <div style={{
                                padding: '8px',
                                background: '#f9f9f9',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>免费奖励</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {tier.freeReward.type === 'coins' && `🪙 ${tier.freeReward.amount}`}
                                        {tier.freeReward.type === 'gems' && `💎 ${tier.freeReward.amount}`}
                                        {tier.freeReward.type === 'stamina' && `❤️ ${tier.freeReward.amount}`}
                                        {tier.freeReward.type === 'lootbox' && `📦 ${tier.freeReward.itemId}`}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleClaimReward(tier.tier, false)}
                                    disabled={!isUnlocked || freeRewardClaimed}
                                    style={{
                                        padding: '6px 12px',
                                        background: freeRewardClaimed ? '#ddd' : isUnlocked ? '#4caf50' : '#ddd',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: !isUnlocked || freeRewardClaimed ? 'not-allowed' : 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {freeRewardClaimed ? '✓' : '领取'}
                                </button>
                            </div>

                            {/* Premium Reward */}
                            <div style={{
                                padding: '8px',
                                background: isPremium ? '#fff8e1' : '#f0f0f0',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: isPremium ? '2px solid #ffc107' : 'none',
                            }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>高级奖励</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {tier.premiumReward.type === 'coins' && `🪙 ${tier.premiumReward.amount}`}
                                        {tier.premiumReward.type === 'gems' && `💎 ${tier.premiumReward.amount}`}
                                        {tier.premiumReward.type === 'tool' && `${tier.premiumReward.toolType === 'scissors' ? '✂️' : tier.premiumReward.toolType === 'hourglass' ? '⏳' : '🃏'} ${tier.premiumReward.amount}`}
                                        {tier.premiumReward.type === 'lootbox' && `📦 ${tier.premiumReward.itemId}`}
                                        {tier.premiumReward.type === 'decoration' && `🏠 ${tier.premiumReward.itemId}`}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleClaimReward(tier.tier, true)}
                                    disabled={!isPremium || !isUnlocked || premiumRewardClaimed}
                                    style={{
                                        padding: '6px 12px',
                                        background: premiumRewardClaimed ? '#ddd' : isPremium && isUnlocked ? '#ffc107' : '#ddd',
                                        color: premiumRewardClaimed || !isPremium ? '#999' : 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: !isPremium || !isUnlocked || premiumRewardClaimed ? 'not-allowed' : 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {premiumRewardClaimed ? '✓' : !isPremium ? '🔒' : '领取'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
