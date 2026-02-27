import { useEffect } from 'react';
import { BoardGrid } from './features/board/components/BoardGrid';
import { HUD } from './features/board/components/HUD';
import { OrderPanel } from './features/board/components/OrderPanel';
import { useEconomyStore } from './store/useEconomyStore';
import { useOrderStore } from './store/useOrderStore';
import { usePlayerStore } from './store/usePlayerStore';

function App() {
    const tickStaminaRegen = useEconomyStore(state => state.tickStaminaRegen);
    const refreshOrders = useOrderStore(state => state.refreshOrders);
    const playerLevel = usePlayerStore(state => state.level);

    // Stamina regen ticker
    useEffect(() => {
        const interval = setInterval(() => {
            tickStaminaRegen();
        }, 1000);
        return () => clearInterval(interval);
    }, [tickStaminaRegen]);

    // Initialize orders
    useEffect(() => {
        refreshOrders(playerLevel);
    }, [playerLevel, refreshOrders]);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            overflow: 'hidden',
        }}>
            <HUD />
            <div style={{
                flex: 1,
                display: 'flex',
                gap: '16px',
                padding: '16px',
                overflow: 'hidden',
            }}>
                <BoardGrid />
                <OrderPanel />
            </div>
        </div>
    );
}

export default App;
