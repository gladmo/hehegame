import { useEffect } from 'react';
import { useEconomyStore } from './store/useEconomyStore';
import { useOrderStore } from './store/useOrderStore';
import { usePlayerStore } from './store/usePlayerStore';
import { useMetaStore } from './store/useMetaStore';
import { BottomNav } from './shared/components/BottomNav';
import { GameScreen } from './features/board/GameScreen';
import { RenovationScreen } from './features/renovation/components/RenovationScreen';
import { CollectionScreen } from './features/collection/CollectionScreen';
import { BattlePassScreen } from './features/battlepass/BattlePassScreen';
import { ShopScreen } from './features/shop/ShopScreen';

function App() {
    const tickStaminaRegen = useEconomyStore(state => state.tickStaminaRegen);
    const refreshOrders = useOrderStore(state => state.refreshOrders);
    const playerLevel = usePlayerStore(state => state.level);
    const currentScreen = useMetaStore(state => state.currentScreen);

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

    const renderScreen = () => {
        switch (currentScreen) {
            case 'game':
                return <GameScreen />;
            case 'renovation':
                return <RenovationScreen />;
            case 'collection':
                return <CollectionScreen />;
            case 'battlepass':
                return <BattlePassScreen />;
            case 'shop':
                return <ShopScreen />;
            default:
                return <GameScreen />;
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            overflow: 'hidden',
        }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {renderScreen()}
            </div>
            <BottomNav />
        </div>
    );
}

export default App;
