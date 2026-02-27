import { usePlayerStore } from '@/store/usePlayerStore';
import { useEconomyStore } from '@/store/useEconomyStore';

interface ActivityCard {
    avatar: string;
    timeLabel: string;
    status?: 'active' | 'completed' | 'locked';
    position: { top?: string; bottom?: string; left?: string; right?: string };
}

export function RenovationScreen() {
    const coins = useEconomyStore(state => state.coins);
    
    // Activity cards positioned around the isometric view - matching main_UI.jpg
    const activities: ActivityCard[] = [
        { avatar: '📖', timeLabel: '2天13时', status: 'active', position: { top: '80px', left: '32px' } },
        { avatar: '🧧', timeLabel: '2天20时', status: 'active', position: { top: '180px', left: '32px' } },
        { avatar: '🎁', timeLabel: '已结束', status: 'completed', position: { top: '320px', left: '32px' } },
        { avatar: '🎉', timeLabel: '免费好礼', status: 'active', position: { top: '420px', left: '32px' } },
        { avatar: '🐱', timeLabel: '1天12时', status: 'active', position: { bottom: '180px', left: '32px' } },
        
        { avatar: '🐶', timeLabel: '3天10时', status: 'active', position: { top: '140px', right: '32px' } },
        { avatar: '❓', timeLabel: '2天13时', status: 'active', position: { top: '260px', right: '32px' } },
        { avatar: '🎭', timeLabel: '12时25分', status: 'active', position: { top: '420px', right: '32px' } },
        { avatar: '💎', timeLabel: '2时12分', status: 'active', position: { bottom: '260px', right: '32px' } },
        { avatar: '🎨', timeLabel: '10时15分', status: 'active', position: { bottom: '140px', right: '32px' } },
        { avatar: '🎪', timeLabel: '14时37分', status: 'active', position: { bottom: '80px', right: '32px' } },
        { avatar: '🦁', timeLabel: '2天12时', status: 'active', position: { bottom: '32px', right: '32px' } },
    ];

    // Bottom navigation items - matching main_UI.jpg
    const bottomItems = [
        { icon: '📕', name: '故事' },
        { icon: '👧', name: '角色' },
        { icon: '🍵', name: '茶馆' },
    ];

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #4a6b5a 0%, #8b9a7d 30%, #d4c5a0 60%, #ffe4b5 100%)',
            position: 'relative',
        }}>
            {/* Top HUD - matching main_UI.jpg */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'rgba(0, 0, 0, 0.3)',
            }}>
                {/* Left side resources */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Level indicator */}
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff9a76 0%, #ff6b9d 100%)',
                        border: '3px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}>
                        18
                    </div>

                    {/* Stamina with timer */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'white',
                    }}>
                        <span style={{ fontSize: '18px' }}>⚡</span>
                        <span style={{ fontWeight: 'bold' }}>49</span>
                        <span style={{ fontSize: '14px' }}>➕</span>
                        <span style={{ fontSize: '11px' }}>00:01:31</span>
                    </div>

                    {/* Coins */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'white',
                    }}>
                        <span style={{ fontSize: '18px' }}>🪙</span>
                        <span style={{ fontWeight: 'bold' }}>{coins}</span>
                    </div>

                    {/* Hearts */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: 'white',
                    }}>
                        <span style={{ fontSize: '18px' }}>❤️</span>
                        <span style={{ fontWeight: 'bold' }}>63</span>
                    </div>
                </div>

                {/* Right side buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    }}>
                        ⋯
                    </button>
                    <button style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    }}>
                        ⊙
                    </button>
                </div>
            </div>

            {/* Main Isometric View Area */}
            <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
                {/* Central isometric building view placeholder */}
                <div style={{
                    width: '400px',
                    height: '400px',
                    background: 'rgba(100, 80, 60, 0.4)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                }}>
                    {/* Building/Room illustration placeholder */}
                    <div style={{
                        fontSize: '80px',
                        marginBottom: '16px',
                    }}>
                        🏠
                    </div>
                    <div style={{
                        fontSize: '18px',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    }}>
                        餐厅装修区域
                    </div>

                    {/* Coin counter popup in center */}
                    <div style={{
                        marginTop: '32px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '16px 24px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <div style={{ fontSize: '36px' }}>🪙</div>
                        <div style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            101/144
                        </div>
                    </div>

                    {/* Character sprites in the room */}
                    <div style={{
                        position: 'absolute',
                        bottom: '120px',
                        display: 'flex',
                        gap: '20px',
                    }}>
                        <div style={{ fontSize: '48px' }}>👧</div>
                        <div style={{ fontSize: '48px' }}>👸</div>
                    </div>
                </div>

                {/* Activity Cards positioned around - matching main_UI.jpg */}
                {activities.map((activity, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            ...activity.position,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            width: '72px',
                            height: '72px',
                            background: activity.status === 'completed' 
                                ? 'rgba(180, 180, 180, 0.9)'
                                : activity.status === 'locked'
                                ? 'rgba(120, 120, 120, 0.9)'
                                : 'rgba(255, 200, 150, 0.95)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            border: '3px solid rgba(255, 255, 255, 0.9)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {activity.avatar}
                            
                            {activity.status === 'active' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    width: '20px',
                                    height: '20px',
                                    background: '#ff4444',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                }}>
                                    !
                                </div>
                            )}
                        </div>

                        {/* Time label below */}
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#333',
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                            whiteSpace: 'nowrap',
                        }}>
                            {activity.timeLabel}
                        </div>
                    </div>
                ))}

                {/* Right-side action buttons */}
                <div style={{
                    position: 'absolute',
                    right: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    {/* Eye button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        👁️
                    </button>

                    {/* List button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        ≡
                    </button>

                    {/* Shop button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        🏪
                    </button>
                </div>
            </div>

            {/* Bottom Navigation Icons - matching main_UI.jpg */}
            <div style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                background: 'rgba(0, 0, 0, 0.2)',
            }}>
                {bottomItems.map((item, idx) => (
                    <button
                        key={idx}
                        style={{
                            width: '68px',
                            height: '68px',
                            background: 'rgba(255, 240, 200, 0.95)',
                            border: '3px solid rgba(139, 69, 19, 0.6)',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={item.name}
                    >
                        {item.icon}
                    </button>
                ))}
            </div>
        </div>
    );
}
