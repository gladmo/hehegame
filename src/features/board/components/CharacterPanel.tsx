import { useOrderStore } from '@/store/useOrderStore';

interface CharacterCardProps {
    avatar: string;
    name: string;
    health: number;
    maxHealth: number;
    multiplier?: number;
    badge?: number;
    color: string;
}

function CharacterCard({ avatar, name, health, maxHealth, multiplier, badge, color }: CharacterCardProps) {
    const healthPercent = (health / maxHealth) * 100;

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
        }}>
            {/* Number badge (top-left) */}
            {badge && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '-8px',
                    background: '#ff4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    zIndex: 10,
                }}>
                    {badge}
                </div>
            )}

            {/* Multiplier badge (top-right) */}
            {multiplier && multiplier > 1 && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ff4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    zIndex: 10,
                }}>
                    x{multiplier}
                </div>
            )}

            {/* Character Avatar */}
            <div style={{
                width: '80px',
                height: '100px',
                background: color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.5)',
            }}>
                {avatar}
            </div>

            {/* Health Bar */}
            <div style={{
                width: '90px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '4px',
                position: 'relative',
            }}>
                <div style={{
                    width: `${healthPercent}%`,
                    height: '8px',
                    background: 'linear-gradient(90deg, #ff6b6b, #ff4757)',
                    borderRadius: '4px',
                    transition: 'width 0.3s',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}>
                    {health}/{maxHealth}
                </div>
            </div>

            {/* Character Name Label */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#333',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
                {name}
            </div>
        </div>
    );
}

export function CharacterPanel() {
    // Mock character data - in real implementation, this would come from store
    const characters = [
        { avatar: '🐱', name: '小猫猫', health: 35, maxHealth: 80, color: 'linear-gradient(135deg, #a8e6cf, #6bc9a8)' },
        { avatar: '🤖', name: 'JND2247', health: 35, maxHealth: 80, color: 'linear-gradient(135deg, #85c1e9, #5dade2)' },
        { avatar: '🐶', name: '梦想团子', health: 9, maxHealth: 40, badge: 1, color: 'linear-gradient(135deg, #ffb3ba, #ff6b8a)' },
        { avatar: '👧', name: '未开启', health: 9, maxHealth: 40, multiplier: 2, color: 'rgba(200, 200, 200, 0.5)' },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '16px',
            padding: '16px 24px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            justifyContent: 'center',
        }}>
            {characters.map((char, idx) => (
                <CharacterCard
                    key={idx}
                    avatar={char.avatar}
                    name={char.name}
                    health={char.health}
                    maxHealth={char.maxHealth}
                    multiplier={char.multiplier}
                    badge={char.badge}
                    color={char.color}
                />
            ))}
        </div>
    );
}
