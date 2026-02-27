import { useEconomyStore } from '@/store/useEconomyStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { MAX_STAMINA } from '@/shared/constants';
import { useEffect, useState } from 'react';

export function HUD() {
    const coins = useEconomyStore(state => state.coins);
    const gems = useEconomyStore(state => state.gems);
    const stamina = useEconomyStore(state => state.stamina);
    const level = usePlayerStore(state => state.level);
    const [timer, setTimer] = useState('00:00:00');

    // Timer effect
    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            setTimer(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
            {/* Circular Level Indicator */}
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff9a76 0%, #ff6b9d 100%)',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
            }}>
                {level}
            </div>

            {/* Title */}
            <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
            }}>
                梦幻消除战
            </div>

            {/* Resources Row */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
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
                    <span style={{ fontSize: '18px' }}>🧺</span>
                    <span style={{ fontWeight: 'bold' }}>{stamina}</span>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginLeft: '4px',
                        paddingLeft: '8px',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                    }}>
                        <span style={{ fontSize: '14px' }}>➕</span>
                    </div>
                    <span style={{ fontSize: '11px', opacity: 0.9 }}>{timer}</span>
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

                {/* Gems */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    color: 'white',
                }}>
                    <span style={{ fontSize: '18px' }}>💎</span>
                    <span style={{ fontWeight: 'bold' }}>{gems}</span>
                </div>

                {/* Battery/Energy indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    color: 'white',
                }}>
                    <span style={{ fontSize: '18px' }}>🔋</span>
                    <span style={{ fontWeight: 'bold', color: '#4caf50' }}>158K</span>
                    <span style={{ opacity: 0.7 }}>/2137</span>
                </div>

                {/* Hearts */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                }}>
                    <span style={{ fontSize: '20px' }}>❤️</span>
                    <span style={{ fontSize: '20px' }}>❤️</span>
                    <span style={{ fontSize: '20px' }}>❤️</span>
                </div>
            </div>

            {/* Menu buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
            }}>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px',
                }}>
                    ⋯
                </button>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px',
                }}>
                    ➖
                </button>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px',
                }}>
                    ⛶
                </button>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px',
                }}>
                    ⊙
                </button>
            </div>
        </div>
    );
}
