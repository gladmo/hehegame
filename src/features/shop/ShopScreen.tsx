import { useEconomyStore } from '@/store/useEconomyStore';
import { useToolStore } from '@/store/useToolStore';
import { TOOL_COST_GEMS, STAMINA_BUY_COST_GEMS } from '@/shared/constants';
import type { ToolType } from '@/shared/types';

const TOOL_ITEMS: { type: ToolType; icon: string; name: string; description: string }[] = [
    { type: 'scissors', icon: '✂️', name: '剪刀', description: '将高级物品拆分为2个低一级物品' },
    { type: 'hourglass', icon: '⏳', name: '沙漏', description: '重置订单倒计时或加速发射器' },
    { type: 'wildcard', icon: '🃏', name: '万能牌', description: '与任意物品合成升级' },
];

const COIN_PACKS = [
    { amount: 100, gems: 10, icon: '💰' },
    { amount: 500, gems: 40, icon: '💎💰' },
    { amount: 1000, gems: 70, icon: '💎💎💰' },
];

const GEM_PACKS = [
    { amount: 50, label: '小包', price: '¥6' },
    { amount: 150, label: '中包', price: '¥18' },
    { amount: 500, label: '大包', price: '¥58' },
];

export function ShopScreen() {
    const coins = useEconomyStore(state => state.coins);
    const gems = useEconomyStore(state => state.gems);
    const stamina = useEconomyStore(state => state.stamina);
    const maxStamina = useEconomyStore(state => state.maxStamina);
    const addCoins = useEconomyStore(state => state.addCoins);
    const addGems = useEconomyStore(state => state.addGems);
    const buyStamina = useEconomyStore(state => state.buyStamina);
    const spendGems = useEconomyStore(state => state.spendGems);
    const addTool = useToolStore(state => state.addTool);
    const scissors = useToolStore(state => state.scissors);
    const hourglass = useToolStore(state => state.hourglass);
    const wildcard = useToolStore(state => state.wildcard);

    const handleBuyTool = (tool: ToolType) => {
        const cost = TOOL_COST_GEMS[tool];
        if (cost && spendGems(cost)) {
            addTool(tool, 1);
        }
    };

    const handleBuyCoins = (gemCost: number, coinAmount: number) => {
        if (spendGems(gemCost)) {
            addCoins(coinAmount);
        }
    };

    const handleBuyGems = (amount: number) => {
        // Simulate purchase - in real app this would open payment dialog
        // For demo purposes, just add the gems
        addGems(amount);
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            padding: '20px',
            overflow: 'auto',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        }}>
            <h1 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#333' }}>
                🛒 商店
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '12px 24px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ fontSize: '18px' }}>🪙 {coins}</span>
                </div>
                <div style={{ padding: '12px 24px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ fontSize: '18px' }}>💎 {gems}</span>
                </div>
            </div>

            {/* Stamina Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>体力补充</h2>
                <div style={{
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>❤️ 满体力恢复</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                            当前: {stamina}/{maxStamina}
                        </p>
                    </div>
                    <button
                        onClick={() => buyStamina()}
                        disabled={stamina >= maxStamina}
                        style={{
                            padding: '12px 24px',
                            background: stamina >= maxStamina ? '#ddd' : '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: stamina >= maxStamina ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                    >
                        💎 {STAMINA_BUY_COST_GEMS}
                    </button>
                </div>
            </section>

            {/* Tools Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>道具商店</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {TOOL_ITEMS.map(tool => {
                        const cost = TOOL_COST_GEMS[tool.type];
                        const owned = tool.type === 'scissors' ? scissors : tool.type === 'hourglass' ? hourglass : wildcard;
                        
                        return (
                            <div
                                key={tool.type}
                                style={{
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>{tool.icon}</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{tool.name}</h3>
                                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666', minHeight: '36px' }}>
                                    {tool.description}
                                </p>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>
                                    已拥有: {owned}
                                </p>
                                <button
                                    onClick={() => handleBuyTool(tool.type)}
                                    disabled={gems < cost}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: gems < cost ? '#ddd' : '#ffb69f',
                                        color: gems < cost ? '#999' : 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: gems < cost ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    💎 {cost}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Coins Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>金币礼包</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                    {COIN_PACKS.map((pack, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '16px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{pack.icon}</div>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#ffa500' }}>
                                🪙 {pack.amount}
                            </p>
                            <button
                                onClick={() => handleBuyCoins(pack.gems, pack.amount)}
                                disabled={gems < pack.gems}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: gems < pack.gems ? '#ddd' : '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: gems < pack.gems ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                💎 {pack.gems}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gems Section */}
            <section>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>钻石礼包</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                    {GEM_PACKS.map((pack, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '16px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>💎</div>
                            <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#00bcd4' }}>
                                {pack.amount} 钻石
                            </p>
                            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#999' }}>{pack.label}</p>
                            <button
                                onClick={() => handleBuyGems(pack.amount)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: '#ff5722',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {pack.price}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
