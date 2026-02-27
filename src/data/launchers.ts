import type { LauncherDefinition } from '@/shared/types';

export const LAUNCHERS: LauncherDefinition[] = [
    {
        id: 'bread_basket',
        name: '面包篮',
        emoji: '🧺',
        produces: ['bread'],
        spawnWeights: [1],
        cooldownMs: 0,
        staminaCost: 1,
        unlockLevel: 1,
    },
    {
        id: 'coffee_machine',
        name: '咖啡机',
        emoji: '☕',
        produces: ['coffee_bean'],
        spawnWeights: [1],
        cooldownMs: 0,
        staminaCost: 1,
        unlockLevel: 1,
    },
    {
        id: 'veggie_crate',
        name: '蔬菜箱',
        emoji: '📦',
        produces: ['lettuce'],
        spawnWeights: [1],
        cooldownMs: 0,
        staminaCost: 1,
        unlockLevel: 1,
    },
    {
        id: 'pasta_maker',
        name: '面条机',
        emoji: '🍝',
        produces: ['flour'],
        spawnWeights: [1],
        cooldownMs: 2000,
        staminaCost: 2,
        unlockLevel: 5,
    },
    {
        id: 'sushi_bar',
        name: '寿司台',
        emoji: '🍣',
        produces: ['rice'],
        spawnWeights: [1],
        cooldownMs: 3000,
        staminaCost: 2,
        unlockLevel: 10,
    },
    {
        id: 'deluxe_oven',
        name: '豪华烤箱',
        emoji: '🔥',
        produces: ['bread', 'croissant'],
        spawnWeights: [60, 40],
        cooldownMs: 5000,
        staminaCost: 3,
        unlockLevel: 8,
    },
];

export const LAUNCHER_MAP: Record<string, LauncherDefinition> = {};
for (const l of LAUNCHERS) {
    LAUNCHER_MAP[l.id] = l;
}

export function getUnlockedLaunchers(level: number): LauncherDefinition[] {
    return LAUNCHERS.filter(l => level >= l.unlockLevel);
}
