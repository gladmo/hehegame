// ─── Item System ───
export type ItemTypeId = string;
export type ItemTier = number;

export interface ItemDefinition {
    id: string;
    typeChain: ItemTypeId;
    tier: ItemTier;
    name: string;
    emoji: string;
    mergesInto: string | null;
    sellValue: number;
    spawnWeight?: number;
}

export interface ItemInstance {
    instanceId: string;
    definitionId: string;
    createdAt: number;
}

// ─── Launcher / Generator ───
export interface LauncherDefinition {
    id: string;
    name: string;
    emoji: string;
    produces: string[];
    spawnWeights: number[];
    cooldownMs: number;
    staminaCost: number;
    unlockLevel: number;
}

export interface LauncherInstance {
    definitionId: string;
    position: [number, number];
    currentCooldown: number;
    isReady: boolean;
}

// ─── Board ───
export type CellType = 'normal' | 'locked' | 'blocked' | 'launcher' | 'obstacle';

export interface BoardCell {
    row: number;
    col: number;
    type: CellType;
    item: ItemInstance | null;
    launcherId: string | null;
    unlockCost?: { currency: Currency; amount: number };
}

export type ToolType = 'scissors' | 'hourglass' | 'wildcard';

export interface BoardState {
    rows: number;
    cols: number;
    cells: BoardCell[][];
    activeTool: ToolType | null;
}

// ─── Orders ───
export interface OrderRequirement {
    itemDefinitionId: string;
    quantity: number;
}

export type OrderDifficulty = 'easy' | 'medium' | 'hard';

export interface Order {
    id: string;
    customerName: string;
    customerAvatar: string;
    requirements: OrderRequirement[];
    fulfilled: Record<string, number>;
    rewards: OrderRewards;
    timeLimitMs: number | null;
    startedAt: number;
    difficulty: OrderDifficulty;
}

export interface OrderRewards {
    coins: number;
    xp: number;
    gems?: number;
    specialItem?: string;
    battlePassXp?: number;
}

// ─── Economy ───
export type Currency = 'coins' | 'gems';

export interface EconomyState {
    coins: number;
    gems: number;
    stamina: number;
    maxStamina: number;
    staminaRegenMs: number;
    lastStaminaTick: number;
}

// ─── Player / Progression ───
export interface PlayerState {
    level: number;
    xp: number;
    xpToNextLevel: number;
    storyChapter: number;
    storyStep: number;
    unlockedAreas: string[];
    currentArea: string;
}

// ─── Renovation ───
export interface DecorationVariant {
    id: string;
    name: string;
    svgKey: string;
}

export interface DecorationDefinition {
    id: string;
    name: string;
    area: string;
    slot: string;
    cost: { currency: Currency; amount: number };
    xpReward: number;
    variants: DecorationVariant[];
    prerequisite?: string;
}

export interface PlacedDecoration {
    decorationId: string;
    variantIndex: number;
}

export interface AreaState {
    unlocked: boolean;
    decorations: Record<string, PlacedDecoration>;
    completionPercent: number;
}

export interface RenovationState {
    areas: Record<string, AreaState>;
}

// ─── Battle Pass ───
export interface Reward {
    type: 'coins' | 'gems' | 'stamina' | 'item' | 'decoration' | 'lootbox' | 'tool';
    amount?: number;
    itemId?: string;
    toolType?: ToolType;
}

export interface BattlePassTier {
    tier: number;
    xpRequired: number;
    freeReward: Reward;
    premiumReward: Reward;
}

export interface BattlePassState {
    season: number;
    isPremium: boolean;
    currentXp: number;
    claimedFree: number[];
    claimedPremium: number[];
    expiresAt: number;
}

// ─── Collection ───
export interface CollectionEntry {
    itemDefinitionId: string;
    discovered: boolean;
    firstDiscoveredAt: number | null;
    timesCreated: number;
    timesUsedInOrders: number;
}

export interface CollectionState {
    entries: Record<string, CollectionEntry>;
    totalDiscovered: number;
    totalPossible: number;
    milestonesClaimed: number[];
}

// ─── Tools ───
export interface ToolInventory {
    scissors: number;
    hourglass: number;
    wildcard: number;
}

// ─── Loot Box ───
export type LootBoxRarity = 'bronze' | 'silver' | 'gold';

export interface LootBox {
    id: string;
    rarity: LootBoxRarity;
    rewards: Reward[];
}

// ─── Events ───
export type EventType = 'cooking_contest' | 'holiday_decor' | 'card_collection';

export interface GameEvent {
    id: string;
    type: EventType;
    name: string;
    description: string;
    startsAt: number;
    endsAt: number;
    rewards: Reward[];
}

// ─── Story ───
export interface DialogLine {
    speaker: string;
    avatar: string;
    text: string;
    choices?: { text: string; nextStep: number }[];
}

export interface StoryChapter {
    id: number;
    title: string;
    dialogs: DialogLine[];
    unlockCondition: string;
}

// ─── Card Collection ───
export interface CollectibleCard {
    id: string;
    name: string;
    setId: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    svgKey: string;
    owned: boolean;
    count: number;
}

export interface CardSet {
    id: string;
    name: string;
    cards: string[];
    completionReward: Reward;
}

// ─── Leaderboard ───
export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    isPlayer: boolean;
}

// ─── Screen Navigation ───
export type ScreenType =
    | 'game'
    | 'renovation'
    | 'shop'
    | 'collection'
    | 'events'
    | 'battlepass'
    | 'settings';

export type ModalType =
    | 'story'
    | 'levelUp'
    | 'lootbox'
    | 'orderComplete'
    | null;
