import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { Order, OrderDifficulty, OrderRequirement } from '@/shared/types';
import { MAX_ACTIVE_ORDERS, ORDER_BASE_TIME_MS } from '@/shared/constants';
import { getUnlockedChains } from '@/data/items';
import { CUSTOMER_NAMES } from '@/data/orders';

interface OrderStore {
    orders: Order[];
    // Actions
    generateOrder: (playerLevel: number, difficulty: OrderDifficulty) => void;
    deliverItem: (orderId: string, itemDefId: string) => boolean;
    completeOrder: (orderId: string) => Order | null;
    expireOrder: (orderId: string) => void;
    refreshOrders: (playerLevel: number) => void;
}

function generateRandomOrder(playerLevel: number, difficulty: OrderDifficulty): Order {
    const chains = getUnlockedChains(playerLevel);
    const numRequirements = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    
    const requirements: OrderRequirement[] = [];
    for (let i = 0; i < numRequirements; i++) {
        const tier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        // Pick a random chain and tier-appropriate item
        const chain = chains[Math.floor(Math.random() * chains.length)];
        const itemId = `${chain}_tier${tier}`;
        
        requirements.push({
            itemDefinitionId: itemId,
            quantity,
        });
    }
    
    const timeMult = difficulty === 'easy' ? 1.5 : difficulty === 'medium' ? 1.2 : 1;
    const coinsMult = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    
    return {
        id: nanoid(),
        customerName: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        customerAvatar: '👤',
        requirements,
        fulfilled: {},
        rewards: {
            coins: Math.floor(20 * coinsMult),
            xp: Math.floor(10 * coinsMult),
        },
        timeLimitMs: ORDER_BASE_TIME_MS * timeMult,
        startedAt: Date.now(),
        difficulty,
    };
}

export const useOrderStore = create<OrderStore>()(
    immer((set, get) => ({
        orders: [],

        generateOrder: (playerLevel, difficulty) => {
            const state = get();
            if (state.orders.length >= MAX_ACTIVE_ORDERS) {
                return;
            }

            const order = generateRandomOrder(playerLevel, difficulty);
            set((draft) => {
                draft.orders.push(order);
            });
        },

        deliverItem: (orderId, itemDefId) => {
            const state = get();
            const order = state.orders.find(o => o.id === orderId);
            
            if (!order) {
                return false;
            }

            // Check if this item is required
            const requirement = order.requirements.find(r => r.itemDefinitionId === itemDefId);
            if (!requirement) {
                return false;
            }

            const currentFulfilled = order.fulfilled[itemDefId] || 0;
            if (currentFulfilled >= requirement.quantity) {
                return false;
            }

            set((draft) => {
                const draftOrder = draft.orders.find(o => o.id === orderId);
                if (draftOrder) {
                    draftOrder.fulfilled[itemDefId] = (draftOrder.fulfilled[itemDefId] || 0) + 1;
                }
            });

            return true;
        },

        completeOrder: (orderId) => {
            const state = get();
            const order = state.orders.find(o => o.id === orderId);
            
            if (!order) {
                return null;
            }

            // Check if all requirements are fulfilled
            for (const req of order.requirements) {
                const fulfilled = order.fulfilled[req.itemDefinitionId] || 0;
                if (fulfilled < req.quantity) {
                    return null;
                }
            }

            set((draft) => {
                draft.orders = draft.orders.filter(o => o.id !== orderId);
            });

            return order;
        },

        expireOrder: (orderId) => {
            set((draft) => {
                draft.orders = draft.orders.filter(o => o.id !== orderId);
            });
        },

        refreshOrders: (playerLevel) => {
            const state = get();
            const difficulty: OrderDifficulty = playerLevel < 3 ? 'easy' : playerLevel < 7 ? 'medium' : 'hard';
            
            while (state.orders.length < MAX_ACTIVE_ORDERS) {
                get().generateOrder(playerLevel, difficulty);
            }
        },
    }))
);
