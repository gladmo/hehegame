import { BoardGrid } from './components/BoardGrid';
import { HUD } from './components/HUD';
import { CharacterPanel } from './components/CharacterPanel';
import { CharacterDetailPanel } from './components/CharacterDetailPanel';
import { LeftActivityPanel } from './components/LeftActivityPanel';
import { ToolBar } from '@/features/tools/components/ToolBar';
import { ItemDetailBar } from './components/ItemDetailBar';

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
                position: 'relative',
            }}>
                {/* Left-side Activity Panels - matching activity_UI.jpg */}
                <LeftActivityPanel />

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

                {/* Right-side Activity Buttons - matching activity_UI.jpg */}
                <div style={{
                    position: 'absolute',
                    right: '32px',
                    top: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 10,
                }}>
                    {/* Eye Button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(200, 200, 200, 0.5)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="查看"
                    >
                        👁️
                    </button>

                    {/* List/Menu Button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(200, 200, 200, 0.5)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="列表"
                    >
                        ≡
                    </button>

                    {/* Shop Button */}
                    <button style={{
                        width: '56px',
                        height: '56px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(200, 200, 200, 0.5)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title="商店"
                    >
                        🏪
                    </button>
                </div>
            </div>

            {/* Bottom Item Detail Bar */}
            <div style={{ padding: '0 24px 16px' }}>
                <ItemDetailBar />
            </div>
        </div>
    );
}
