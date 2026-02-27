import type { ItemDefinition } from '@/shared/types';

// ─── Dessert Chain (甜点链) ───
const dessertChain: ItemDefinition[] = [
    { id: 'bread', typeChain: 'dessert', tier: 1, name: '面包', emoji: '🍞', mergesInto: 'croissant', sellValue: 1, spawnWeight: 40 },
    { id: 'croissant', typeChain: 'dessert', tier: 2, name: '牛角包', emoji: '🥐', mergesInto: 'cupcake', sellValue: 3, spawnWeight: 25 },
    { id: 'cupcake', typeChain: 'dessert', tier: 3, name: '纸杯蛋糕', emoji: '🧁', mergesInto: 'cake', sellValue: 8, spawnWeight: 10 },
    { id: 'cake', typeChain: 'dessert', tier: 4, name: '蛋糕', emoji: '🎂', mergesInto: 'grand_cake', sellValue: 20, spawnWeight: 3 },
    { id: 'grand_cake', typeChain: 'dessert', tier: 5, name: '豪华蛋糕', emoji: '🏆', mergesInto: null, sellValue: 50 },
];

// ─── Beverage Chain (饮料链) ───
const beverageChain: ItemDefinition[] = [
    { id: 'coffee_bean', typeChain: 'beverage', tier: 1, name: '咖啡豆', emoji: '☕', mergesInto: 'espresso', sellValue: 1, spawnWeight: 40 },
    { id: 'espresso', typeChain: 'beverage', tier: 2, name: '浓缩咖啡', emoji: '🫘', mergesInto: 'latte', sellValue: 3, spawnWeight: 25 },
    { id: 'latte', typeChain: 'beverage', tier: 3, name: '拿铁', emoji: '🥛', mergesInto: 'mocha', sellValue: 8, spawnWeight: 10 },
    { id: 'mocha', typeChain: 'beverage', tier: 4, name: '摩卡', emoji: '🍫', mergesInto: 'special_brew', sellValue: 20, spawnWeight: 3 },
    { id: 'special_brew', typeChain: 'beverage', tier: 5, name: '特调咖啡', emoji: '✨', mergesInto: null, sellValue: 50 },
];

// ─── Salad Chain (沙拉链) ───
const saladChain: ItemDefinition[] = [
    { id: 'lettuce', typeChain: 'salad', tier: 1, name: '生菜', emoji: '🥬', mergesInto: 'salad', sellValue: 1, spawnWeight: 40 },
    { id: 'salad', typeChain: 'salad', tier: 2, name: '沙拉', emoji: '🥗', mergesInto: 'caesar_salad', sellValue: 3, spawnWeight: 25 },
    { id: 'caesar_salad', typeChain: 'salad', tier: 3, name: '凯撒沙拉', emoji: '🥒', mergesInto: 'premium_salad', sellValue: 8, spawnWeight: 10 },
    { id: 'premium_salad', typeChain: 'salad', tier: 4, name: '精品沙拉', emoji: '🌿', mergesInto: 'chef_special', sellValue: 20, spawnWeight: 3 },
    { id: 'chef_special', typeChain: 'salad', tier: 5, name: '主厨特制', emoji: '👨‍🍳', mergesInto: null, sellValue: 50 },
];

// ─── Pasta Chain (意面链 — unlocked at level 5) ───
const pastaChain: ItemDefinition[] = [
    { id: 'flour', typeChain: 'pasta', tier: 1, name: '面粉', emoji: '🌾', mergesInto: 'dough', sellValue: 1, spawnWeight: 40 },
    { id: 'dough', typeChain: 'pasta', tier: 2, name: '面团', emoji: '🫓', mergesInto: 'noodles', sellValue: 3, spawnWeight: 25 },
    { id: 'noodles', typeChain: 'pasta', tier: 3, name: '手工面', emoji: '🍝', mergesInto: 'pasta_dish', sellValue: 8, spawnWeight: 10 },
    { id: 'pasta_dish', typeChain: 'pasta', tier: 4, name: '意面', emoji: '🍜', mergesInto: 'truffle_pasta', sellValue: 20, spawnWeight: 3 },
    { id: 'truffle_pasta', typeChain: 'pasta', tier: 5, name: '松露意面', emoji: '🍄', mergesInto: null, sellValue: 50 },
];

// ─── Sushi Chain (寿司链 — unlocked at level 10) ───
const sushiChain: ItemDefinition[] = [
    { id: 'rice', typeChain: 'sushi', tier: 1, name: '米饭', emoji: '🍚', mergesInto: 'rice_ball', sellValue: 1, spawnWeight: 40 },
    { id: 'rice_ball', typeChain: 'sushi', tier: 2, name: '饭团', emoji: '🍙', mergesInto: 'maki', sellValue: 3, spawnWeight: 25 },
    { id: 'maki', typeChain: 'sushi', tier: 3, name: '寿司卷', emoji: '🍣', mergesInto: 'sashimi', sellValue: 8, spawnWeight: 10 },
    { id: 'sashimi', typeChain: 'sushi', tier: 4, name: '刺身', emoji: '🐟', mergesInto: 'omakase', sellValue: 20, spawnWeight: 3 },
    { id: 'omakase', typeChain: 'sushi', tier: 5, name: '主厨寿司', emoji: '🏯', mergesInto: null, sellValue: 50 },
];

// ─── All Items Registry ───
export const ALL_ITEMS: ItemDefinition[] = [
    ...dessertChain,
    ...beverageChain,
    ...saladChain,
    ...pastaChain,
    ...sushiChain,
];

export const ITEM_MAP: Record<string, ItemDefinition> = {};
for (const item of ALL_ITEMS) {
    ITEM_MAP[item.id] = item;
}

export const CHAINS: Record<string, ItemDefinition[]> = {
    dessert: dessertChain,
    beverage: beverageChain,
    salad: saladChain,
    pasta: pastaChain,
    sushi: sushiChain,
};

// Chain unlock levels
export const CHAIN_UNLOCK_LEVELS: Record<string, number> = {
    dessert: 1,
    beverage: 1,
    salad: 1,
    pasta: 5,
    sushi: 10,
};

export function getItemDef(id: string): ItemDefinition {
    const def = ITEM_MAP[id];
    if (!def) throw new Error(`Unknown item: ${id}`);
    return def;
}

export function getChainItems(chainId: string): ItemDefinition[] {
    return CHAINS[chainId] ?? [];
}

export function getUnlockedChains(level: number): string[] {
    return Object.entries(CHAIN_UNLOCK_LEVELS)
        .filter(([, lvl]) => level >= lvl)
        .map(([chain]) => chain);
}
