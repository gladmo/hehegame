// ─── Game Balance Constants ───

// Board
export const BOARD_ROWS = 7;
export const BOARD_COLS = 9;
export const CELL_SIZE = 64;

// Economy
export const INITIAL_COINS = 100;
export const INITIAL_GEMS = 20;
export const INITIAL_STAMINA = 30;
export const MAX_STAMINA = 30;
export const STAMINA_REGEN_MS = 180_000; // 3 minutes per point
export const STAMINA_BUY_COST_GEMS = 50;

// Progression
export const XP_BASE = 100;
export const XP_EXPONENT = 1.5;
export const MAX_LEVEL = 50;

// Orders
export const MAX_ACTIVE_ORDERS = 4;
export const ORDER_BASE_TIME_MS = 120_000; // 2 minutes
export const ORDER_REFRESH_DELAY_MS = 5_000;

// Battle Pass
export const BP_SEASON_DAYS = 30;
export const BP_MAX_TIER = 30;
export const BP_XP_PER_TIER = 100;

// Tools
export const INITIAL_SCISSORS = 2;
export const INITIAL_HOURGLASS = 2;
export const INITIAL_WILDCARD = 1;
export const TOOL_COST_GEMS: Record<string, number> = {
    scissors: 15,
    hourglass: 10,
    wildcard: 25,
};

// Loot Box
export const LOOTBOX_RARITY_WEIGHTS = {
    bronze: { common: 0.7, rare: 0.25, epic: 0.04, legendary: 0.01 },
    silver: { common: 0.5, rare: 0.35, epic: 0.12, legendary: 0.03 },
    gold: { common: 0.3, rare: 0.4, epic: 0.22, legendary: 0.08 },
} as const;

// Events
export const EVENT_CONTEST_DURATION_MS = 180_000; // 3 minutes

// Card Collection
export const CARDS_PER_SET = 12;
export const DUPLICATE_FRAGMENT_VALUE = 5;
export const FRAGMENTS_PER_CARD = 20;

// XP calculation helper
export function xpForLevel(level: number): number {
    return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}
