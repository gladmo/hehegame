import { usePlayerStore } from '@/store/usePlayerStore';
import { useRenovationStore } from '@/store/useRenovationStore';
import { useEconomyStore } from '@/store/useEconomyStore';
import { AREAS, DECORATIONS, AREA_MAP } from '@/data/renovations';

export function RenovationScreen() {
    const playerLevel = usePlayerStore(state => state.level);
    const unlockedAreas = usePlayerStore(state => state.unlockedAreas);
    const areas = useRenovationStore(state => state.areas);
    const placeDecoration = useRenovationStore(state => state.placeDecoration);
    const coins = useEconomyStore(state => state.coins);
    const spendCoins = useEconomyStore(state => state.spendCoins);
    const addXp = usePlayerStore(state => state.addXp);

    const handlePurchaseDecoration = (decorationId: string, variantIndex: number) => {
        const decoration = DECORATIONS.find(d => d.id === decorationId);
        if (!decoration) return;

        if (decoration.cost.currency === 'coins' && spendCoins(decoration.cost.amount)) {
            placeDecoration(decoration.area, decoration.slot, decorationId, variantIndex);
            addXp(decoration.xpReward);
        }
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
                🏠 餐厅装修
            </h1>

            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#555' }}>装修区域</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {AREAS.map(area => {
                        const isUnlocked = playerLevel >= area.unlockLevel;
                        const areaState = areas[area.id];
                        const completion = areaState?.completionPercent ?? 0;

                        return (
                            <div
                                key={area.id}
                                style={{
                                    padding: '16px',
                                    background: isUnlocked ? 'white' : '#ddd',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    opacity: isUnlocked ? 1 : 0.6,
                                }}
                            >
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{area.name}</h3>
                                {isUnlocked ? (
                                    <>
                                        <div style={{
                                            marginBottom: '8px',
                                            padding: '4px',
                                            background: '#f0f0f0',
                                            borderRadius: '8px',
                                        }}>
                                            <div style={{
                                                height: '8px',
                                                width: `${completion}%`,
                                                background: '#4caf50',
                                                borderRadius: '4px',
                                                transition: 'width 0.3s',
                                            }} />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                            完成度: {completion}% ({Object.keys(areaState?.decorations ?? {}).length}/{area.slots})
                                        </p>
                                    </>
                                ) : (
                                    <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
                                        🔒 等级 {area.unlockLevel} 解锁
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '20px', color: '#555' }}>可购买装饰</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {DECORATIONS.filter(d => {
                        const area = AREA_MAP[d.area];
                        return area && playerLevel >= area.unlockLevel;
                    }).slice(0, 10).map(decoration => {
                        const areaState = areas[decoration.area];
                        const isPlaced = areaState?.decorations[decoration.slot] !== undefined;

                        return (
                            <div
                                key={decoration.id}
                                style={{
                                    padding: '16px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: isPlaced ? '2px solid #4caf50' : 'none',
                                }}
                            >
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{decoration.name}</h3>
                                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
                                    区域: {AREA_MAP[decoration.area]?.name ?? decoration.area}
                                </p>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    {decoration.variants.map((variant, idx) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handlePurchaseDecoration(decoration.id, idx)}
                                            disabled={isPlaced || coins < decoration.cost.amount}
                                            style={{
                                                padding: '8px',
                                                background: isPlaced && areaState.decorations[decoration.slot]?.variantIndex === idx
                                                    ? '#4caf50'
                                                    : '#f0f0f0',
                                                color: isPlaced && areaState.decorations[decoration.slot]?.variantIndex === idx
                                                    ? 'white'
                                                    : '#333',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: isPlaced || coins < decoration.cost.amount ? 'not-allowed' : 'pointer',
                                                fontSize: '12px',
                                                opacity: isPlaced || coins < decoration.cost.amount ? 0.6 : 1,
                                            }}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: isPlaced ? '#4caf50' : '#ff9800' }}>
                                    {isPlaced ? '✓ 已购买' : `🪙 ${decoration.cost.amount} • ⭐ +${decoration.xpReward} XP`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
