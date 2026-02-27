import { useCollectionStore } from '@/store/useCollectionStore';
import { ALL_ITEMS, ITEM_MAP } from '@/data/items';

const MILESTONES = [
    { id: 1, required: 10, reward: '🪙 100' },
    { id: 2, required: 25, reward: '💎 50' },
    { id: 3, required: 50, reward: '🏠 花园喷泉' },
];

export function CollectionScreen() {
    const entries = useCollectionStore(state => state.entries);
    const totalDiscovered = useCollectionStore(state => state.totalDiscovered);
    const totalPossible = useCollectionStore(state => state.totalPossible);
    const milestonesClaimed = useCollectionStore(state => state.milestonesClaimed);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            padding: '20px',
            overflow: 'auto',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        }}>
            <h1 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#333' }}>
                📖 收藏图鉴
            </h1>

            <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>收集进度</h2>
                <div style={{
                    marginBottom: '12px',
                    padding: '8px',
                    background: '#f0f0f0',
                    borderRadius: '8px',
                }}>
                    <div style={{
                        height: '16px',
                        width: `${(totalDiscovered / totalPossible) * 100}%`,
                        background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                        borderRadius: '8px',
                        transition: 'width 0.3s',
                    }} />
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    已发现: {totalDiscovered}/{totalPossible} ({Math.round((totalDiscovered / totalPossible) * 100)}%)
                </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>收集里程碑</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {MILESTONES.map(milestone => {
                        const isAchieved = totalDiscovered >= milestone.required;
                        const isClaimed = milestonesClaimed.includes(milestone.id);

                        return (
                            <div
                                key={milestone.id}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: isClaimed ? '#e8f5e9' : isAchieved ? 'white' : '#f5f5f5',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    border: isClaimed ? '2px solid #4caf50' : 'none',
                                }}
                            >
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                                    {isClaimed ? '✓' : isAchieved ? '🎁' : '🔒'}
                                </div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                    发现 {milestone.required} 种物品
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                    {isClaimed ? '已领取' : milestone.reward}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '20px', color: '#555', marginBottom: '16px' }}>物品图鉴</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {ALL_ITEMS.map(item => {
                        const entry = entries[item.id];
                        const isDiscovered = entry?.discovered ?? false;

                        return (
                            <div
                                key={item.id}
                                style={{
                                    padding: '16px',
                                    background: isDiscovered ? 'white' : '#f5f5f5',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center',
                                    opacity: isDiscovered ? 1 : 0.5,
                                }}
                            >
                                <div style={{
                                    fontSize: '36px',
                                    marginBottom: '8px',
                                    filter: isDiscovered ? 'none' : 'grayscale(100%)',
                                }}>
                                    {isDiscovered ? item.emoji : '❓'}
                                </div>
                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                    {isDiscovered ? item.name : '???'}
                                </p>
                                <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                                    T{item.tier} • {item.typeChain}
                                </p>
                                {isDiscovered && entry && (
                                    <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#666' }}>
                                        合成 {entry.timesCreated}次 • 使用 {entry.timesUsedInOrders}次
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
