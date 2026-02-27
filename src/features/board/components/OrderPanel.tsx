import { useOrderStore } from '@/store/useOrderStore';
import { useEconomyStore } from '@/store/useEconomyStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useBoardStore } from '@/store/useBoardStore';
import { ITEM_MAP } from '@/data/items';

export function OrderPanel() {
    const orders = useOrderStore(state => state.orders);
    const deliverItem = useOrderStore(state => state.deliverItem);
    const completeOrder = useOrderStore(state => state.completeOrder);
    const addCoins = useEconomyStore(state => state.addCoins);
    const addXp = usePlayerStore(state => state.addXp);
    const cells = useBoardStore(state => state.cells);
    const clearCell = useBoardStore(state => state.clearCell);

    const handleDeliverItem = (orderId: string, itemDefId: string) => {
        // Find and remove item from board
        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                const cell = cells[row][col];
                if (cell.item && cell.item.definitionId === itemDefId) {
                    if (deliverItem(orderId, itemDefId)) {
                        clearCell(row, col);
                        
                        // Check if order is complete
                        const order = orders.find(o => o.id === orderId);
                        if (order) {
                            let isComplete = true;
                            for (const req of order.requirements) {
                                const fulfilled = order.fulfilled[req.itemDefinitionId] || 0;
                                if (fulfilled < req.quantity) {
                                    isComplete = false;
                                    break;
                                }
                            }
                            
                            if (isComplete) {
                                const completedOrder = completeOrder(orderId);
                                if (completedOrder) {
                                    addCoins(completedOrder.rewards.coins);
                                    addXp(completedOrder.rewards.xp);
                                }
                            }
                        }
                        return;
                    }
                }
            }
        }
    };

    return (
        <div style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
        }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                📋 Orders
            </h2>
            
            {orders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    No active orders
                </div>
            )}
            
            {orders.map(order => {
                const timeRemaining = order.timeLimitMs 
                    ? Math.max(0, order.timeLimitMs - (Date.now() - order.startedAt))
                    : Infinity;
                const timeRemainingSeconds = Math.floor(timeRemaining / 1000);
                
                return (
                    <div
                        key={order.id}
                        style={{
                            padding: '12px',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px' }}>{order.customerAvatar}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {order.customerName}
                                </div>
                                {timeRemaining !== Infinity && (
                                    <div style={{ fontSize: '12px', color: timeRemaining < 30000 ? '#ff4444' : '#666' }}>
                                        ⏱️ {timeRemainingSeconds}s
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            {order.requirements.map((req, idx) => {
                                const item = ITEM_MAP[req.itemDefinitionId];
                                const fulfilled = order.fulfilled[req.itemDefinitionId] || 0;
                                const isComplete = fulfilled >= req.quantity;
                                
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => !isComplete && handleDeliverItem(order.id, req.itemDefinitionId)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '4px 8px',
                                            background: isComplete ? '#d4edda' : '#f8f9fa',
                                            borderRadius: '4px',
                                            marginBottom: '4px',
                                            cursor: isComplete ? 'default' : 'pointer',
                                            opacity: isComplete ? 0.7 : 1,
                                        }}
                                    >
                                        <span style={{ fontSize: '20px' }}>{item?.emoji || '❓'}</span>
                                        <span style={{ fontSize: '12px', flex: 1 }}>
                                            {item?.name || 'Unknown'}
                                        </span>
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: isComplete ? '#28a745' : '#666',
                                        }}>
                                            {fulfilled}/{req.quantity}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            fontSize: '12px',
                            color: '#666',
                        }}>
                            <span>🪙 {order.rewards.coins}</span>
                            <span>⭐ {order.rewards.xp} XP</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
