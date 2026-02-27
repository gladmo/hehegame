import type { OrderDifficulty, OrderRewards } from '@/shared/types';

export interface OrderTemplate {
    difficulty: OrderDifficulty;
    minLevel: number;
    customerNames: string[];
    possibleItems: string[];
    minItems: number;
    maxItems: number;
    baseRewards: OrderRewards;
    timeLimitMs: number | null;
}

export const CUSTOMER_NAMES = [
    '小美', '阿杰', '老王', '莉莉', '大熊',
    '小花', '阿明', '梅姐', '胖虎', '小雪',
    '张叔', '安妮', '大卫', '小红', '阿福',
];

export const CUSTOMER_AVATARS = [
    'customer_1', 'customer_2', 'customer_3', 'customer_4', 'customer_5',
];

export const ORDER_TEMPLATES: OrderTemplate[] = [
    // Easy orders — tier 1-2 items
    {
        difficulty: 'easy',
        minLevel: 1,
        customerNames: CUSTOMER_NAMES,
        possibleItems: ['bread', 'coffee_bean', 'lettuce', 'croissant', 'espresso', 'salad'],
        minItems: 1,
        maxItems: 2,
        baseRewards: { coins: 15, xp: 10, battlePassXp: 5 },
        timeLimitMs: 120_000,
    },
    // Medium orders — tier 2-3 items
    {
        difficulty: 'medium',
        minLevel: 3,
        customerNames: CUSTOMER_NAMES,
        possibleItems: ['croissant', 'espresso', 'salad', 'cupcake', 'latte', 'caesar_salad'],
        minItems: 2,
        maxItems: 3,
        baseRewards: { coins: 40, xp: 25, gems: 2, battlePassXp: 10 },
        timeLimitMs: 180_000,
    },
    // Hard orders — tier 3-5 items
    {
        difficulty: 'hard',
        minLevel: 6,
        customerNames: CUSTOMER_NAMES,
        possibleItems: ['cupcake', 'latte', 'caesar_salad', 'cake', 'mocha', 'premium_salad', 'grand_cake', 'special_brew', 'chef_special'],
        minItems: 2,
        maxItems: 4,
        baseRewards: { coins: 80, xp: 50, gems: 5, battlePassXp: 20 },
        timeLimitMs: 300_000,
    },
];

export function getOrderTemplatesForLevel(level: number): OrderTemplate[] {
    return ORDER_TEMPLATES.filter(t => level >= t.minLevel);
}
