import { BoardGrid } from './components/BoardGrid';
import { HUD } from './components/HUD';
import { OrderPanel } from './components/OrderPanel';

export function GameScreen() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
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
