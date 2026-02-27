import { useMetaStore } from '@/store/useMetaStore';
import type { ScreenType } from '@/shared/types';

const SCREENS: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'game', label: '游戏', icon: '🎮' },
    { id: 'renovation', label: '装修', icon: '🏠' },
    { id: 'collection', label: '收藏', icon: '📖' },
    { id: 'battlepass', label: '通行证', icon: '🎫' },
    { id: 'shop', label: '商店', icon: '🛒' },
];

export function BottomNav() {
    const currentScreen = useMetaStore(state => state.currentScreen);
    const setScreen = useMetaStore(state => state.setScreen);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderTop: '2px solid #ffb69f',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        }}>
            {SCREENS.map(screen => (
                <button
                    key={screen.id}
                    onClick={() => setScreen(screen.id)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 16px',
                        background: currentScreen === screen.id ? '#ffb69f' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: currentScreen === screen.id ? 'bold' : 'normal',
                        color: currentScreen === screen.id ? 'white' : '#333',
                        transition: 'all 0.2s',
                    }}
                >
                    <span style={{ fontSize: '20px' }}>{screen.icon}</span>
                    <span>{screen.label}</span>
                </button>
            ))}
        </div>
    );
}
