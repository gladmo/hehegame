import { useEconomyStore } from '@/store/useEconomyStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { MAX_STAMINA } from '@/shared/constants';

export function HUD() {
    const coins = useEconomyStore(state => state.coins);
    const gems = useEconomyStore(state => state.gems);
    const stamina = useEconomyStore(state => state.stamina);
    const level = usePlayerStore(state => state.level);
    const xp = usePlayerStore(state => state.xp);
    const xpToNextLevel = usePlayerStore(state => state.xpToNextLevel);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Quinn's Kitchen
            </div>
            
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {/* Level and XP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⭐ Lv.{level}</span>
                    <div style={{
                        width: '100px',
                        height: '12px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${(xp / xpToNextLevel) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #ffd700, #ffa500)',
                            transition: 'width 0.3s',
                        }} />
                    </div>
                    <span style={{ fontSize: '12px' }}>{xp}/{xpToNextLevel}</span>
                </div>

                {/* Stamina */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>❤️</span>
                    <span>{stamina}/{MAX_STAMINA}</span>
                </div>

                {/* Coins */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🪙</span>
                    <span>{coins}</span>
                </div>

                {/* Gems */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💎</span>
                    <span>{gems}</span>
                </div>
            </div>
        </div>
    );
}
