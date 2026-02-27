import { useBoardStore } from '@/store/useBoardStore';
import { useToolStore } from '@/store/useToolStore';
import type { ToolType } from '@/shared/types';

const TOOLS: { type: ToolType; icon: string; name: string; description: string }[] = [
    { type: 'scissors', icon: '✂️', name: '剪刀', description: '将高级物品拆分为2个低一级物品' },
    { type: 'hourglass', icon: '⏳', name: '沙漏', description: '重置订单倒计时或加速发射器' },
    { type: 'wildcard', icon: '🃏', name: '万能牌', description: '与任意物品合成升级' },
];

export function ToolBar() {
    const activeTool = useBoardStore(state => state.activeTool);
    const setActiveTool = useBoardStore(state => state.setActiveTool);
    const scissors = useToolStore(state => state.scissors);
    const hourglass = useToolStore(state => state.hourglass);
    const wildcard = useToolStore(state => state.wildcard);

    const getToolCount = (type: ToolType): number => {
        switch (type) {
            case 'scissors': return scissors;
            case 'hourglass': return hourglass;
            case 'wildcard': return wildcard;
        }
    };

    const handleToolClick = (type: ToolType) => {
        if (getToolCount(type) > 0) {
            setActiveTool(activeTool === type ? null : type);
        }
    };

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
            {TOOLS.map(tool => {
                const count = getToolCount(tool.type);
                const isActive = activeTool === tool.type;
                
                return (
                    <button
                        key={tool.type}
                        onClick={() => handleToolClick(tool.type)}
                        disabled={count <= 0}
                        title={tool.description}
                        style={{
                            position: 'relative',
                            padding: '12px',
                            background: isActive ? '#4caf50' : count > 0 ? '#ffb69f' : '#ddd',
                            color: isActive || count > 0 ? 'white' : '#999',
                            border: isActive ? '3px solid #2e7d32' : 'none',
                            borderRadius: '8px',
                            cursor: count > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '24px',
                            width: '60px',
                            height: '60px',
                            transition: 'all 0.2s',
                            opacity: count > 0 ? 1 : 0.5,
                        }}
                    >
                        <span>{tool.icon}</span>
                        <span style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: count > 0 ? '#ff5722' : '#999',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                        }}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
