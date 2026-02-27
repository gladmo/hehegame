import { BoardGrid } from './components/BoardGrid';
import { HUD } from './components/HUD';
import { OrderPanel } from './components/OrderPanel';
import { ToolBar } from '@/features/tools/components/ToolBar';

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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <BoardGrid />
                    <ToolBar />
                </div>
                <OrderPanel />
            </div>
        </div>
    );
}
