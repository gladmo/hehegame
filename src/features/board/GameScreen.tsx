import { BoardGrid } from './components/BoardGrid';
import { HUD } from './components/HUD';
import { CharacterPanel } from './components/CharacterPanel';
import { CharacterDetailPanel } from './components/CharacterDetailPanel';
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
            {/* Top HUD */}
            <HUD />

            {/* Character Row */}
            <div style={{ padding: '16px 24px 0' }}>
                <CharacterPanel />
            </div>

            {/* Main Game Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                gap: '16px',
                padding: '16px 24px',
                overflow: 'hidden',
                alignItems: 'flex-start',
            }}>
                {/* Left: Board with overlaid Tools */}
                <div style={{ 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <BoardGrid />
                    
                    {/* Tool bar positioned at bottom-left corner of board */}
                    <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                    }}>
                        <ToolBar />
                    </div>
                </div>

                {/* Right: Character Details */}
                <CharacterDetailPanel />
            </div>

            {/* Bottom Red Button */}
            <div style={{
                padding: '0 24px 16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
            }}>
                {/* Left icon */}
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(139, 69, 19, 0.7)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                }}>
                    📜
                </div>

                {/* Red button */}
                <button style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(180deg, #ff6b6b 0%, #d63031 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                }}>
                    点击棋子可在此处<br />阅读其详细信息
                </button>

                {/* Right icon */}
                <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}>
                    🏠
                </div>
            </div>
        </div>
    );
}
