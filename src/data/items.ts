// Item chain type
export type ItemChainType = 'poultry' | 'tea' | 'pastry' | 'lantern' | 'jewelry' | 'tool'

export interface ItemDef {
  id: string          // unique key like "poultry_1"
  chainType: ItemChainType
  level: number
  name: string
  emoji: string
  isGenerator?: boolean  // clicking spawns a child item
  generatesId?: string   // which item it generates
  mergeResultId?: string // what two of this item merge into
}

// ─── Poultry chain (auto-generator) ──────────────────────────────────────────
// hen (auto-gen) → egg → hatchling → chick → steam-egg → egg-soup → phoenix-egg
const poultryChain: ItemDef[] = [
  { id: 'poultry_gen', chainType: 'poultry', level: 0, name: '老母鸡', emoji: '🐔', isGenerator: true, generatesId: 'poultry_1' },
  { id: 'poultry_1',   chainType: 'poultry', level: 1, name: '鸡蛋',   emoji: '🥚', mergeResultId: 'poultry_2' },
  { id: 'poultry_2',   chainType: 'poultry', level: 2, name: '孵化蛋', emoji: '🐣', mergeResultId: 'poultry_3' },
  { id: 'poultry_3',   chainType: 'poultry', level: 3, name: '小鸡',   emoji: '🐥', mergeResultId: 'poultry_4' },
  { id: 'poultry_4',   chainType: 'poultry', level: 4, name: '嫩蒸蛋', emoji: '🍳', mergeResultId: 'poultry_5' },
  { id: 'poultry_5',   chainType: 'poultry', level: 5, name: '荷包蛋', emoji: '🫕', mergeResultId: 'poultry_6' },
  { id: 'poultry_6',   chainType: 'poultry', level: 6, name: '荷叶蒸鸡', emoji: '🍜', mergeResultId: 'poultry_7' },
  { id: 'poultry_7',   chainType: 'poultry', level: 7, name: '凤凰蛋', emoji: '🪺' },
]

// ─── Tea chain ────────────────────────────────────────────────────────────────
const teaChain: ItemDef[] = [
  { id: 'tea_1', chainType: 'tea', level: 1, name: '嫩茶芽',   emoji: '🌿', mergeResultId: 'tea_2' },
  { id: 'tea_2', chainType: 'tea', level: 2, name: '鲜茶叶',   emoji: '🍃', mergeResultId: 'tea_3' },
  { id: 'tea_3', chainType: 'tea', level: 3, name: '晒青茶',   emoji: '🌱', mergeResultId: 'tea_4' },
  { id: 'tea_4', chainType: 'tea', level: 4, name: '日铸雪芽茶', emoji: '🍵', mergeResultId: 'tea_5' },
  { id: 'tea_5', chainType: 'tea', level: 5, name: '碧螺春',   emoji: '☕', mergeResultId: 'tea_6' },
  { id: 'tea_6', chainType: 'tea', level: 6, name: '乌龙茶',   emoji: '🫖', mergeResultId: 'tea_7' },
  { id: 'tea_7', chainType: 'tea', level: 7, name: '普洱茶',   emoji: '🧉' },
]

// ─── Pastry chain ─────────────────────────────────────────────────────────────
const pastryChain: ItemDef[] = [
  { id: 'pastry_1', chainType: 'pastry', level: 1, name: '小麦',   emoji: '🌾', mergeResultId: 'pastry_2' },
  { id: 'pastry_2', chainType: 'pastry', level: 2, name: '面粉',   emoji: '🍞', mergeResultId: 'pastry_3' },
  { id: 'pastry_3', chainType: 'pastry', level: 3, name: '豆沙包', emoji: '🥐', mergeResultId: 'pastry_4' },
  { id: 'pastry_4', chainType: 'pastry', level: 4, name: '桃渡糕', emoji: '🧁', mergeResultId: 'pastry_5' },
  { id: 'pastry_5', chainType: 'pastry', level: 5, name: '海棠糕', emoji: '🎂', mergeResultId: 'pastry_6' },
  { id: 'pastry_6', chainType: 'pastry', level: 6, name: '宫廷糕点', emoji: '🍰', mergeResultId: 'pastry_7' },
  { id: 'pastry_7', chainType: 'pastry', level: 7, name: '玉兔摘柿盒', emoji: '🍮' },
]

// ─── Lantern chain (max level 5) ──────────────────────────────────────────────
const lanternChain: ItemDef[] = [
  { id: 'lantern_1', chainType: 'lantern', level: 1, name: '小蜡烛',  emoji: '🕯️', mergeResultId: 'lantern_2' },
  { id: 'lantern_2', chainType: 'lantern', level: 2, name: '红灯笼',  emoji: '🏮', mergeResultId: 'lantern_3' },
  { id: 'lantern_3', chainType: 'lantern', level: 3, name: '彩灯笼',  emoji: '🪔', mergeResultId: 'lantern_4' },
  { id: 'lantern_4', chainType: 'lantern', level: 4, name: '宫廷灯',  emoji: '💡', mergeResultId: 'lantern_5' },
  { id: 'lantern_5', chainType: 'lantern', level: 5, name: '九龙玉灯', emoji: '🔆' },
]

// ─── Jewelry chain (max level 5) ─────────────────────────────────────────────
const jewelryChain: ItemDef[] = [
  { id: 'jewelry_1', chainType: 'jewelry', level: 1, name: '铜环',   emoji: '⭕', mergeResultId: 'jewelry_2' },
  { id: 'jewelry_2', chainType: 'jewelry', level: 2, name: '银钗',   emoji: '📿', mergeResultId: 'jewelry_3' },
  { id: 'jewelry_3', chainType: 'jewelry', level: 3, name: '翡翠镯', emoji: '💚', mergeResultId: 'jewelry_4' },
  { id: 'jewelry_4', chainType: 'jewelry', level: 4, name: '金钗',   emoji: '💛', mergeResultId: 'jewelry_5' },
  { id: 'jewelry_5', chainType: 'jewelry', level: 5, name: '龙凤佩', emoji: '💎' },
]

// ─── Tool / resource chain (generator, produces coins) ───────────────────────
const toolChain: ItemDef[] = [
  { id: 'tool_gen', chainType: 'tool', level: 0, name: '竹华食篓', emoji: '🧺', isGenerator: true, generatesId: 'tool_1' },
  { id: 'tool_1', chainType: 'tool', level: 1, name: '铜板',   emoji: '🪙', mergeResultId: 'tool_2' },
  { id: 'tool_2', chainType: 'tool', level: 2, name: '银两',   emoji: '💰', mergeResultId: 'tool_3' },
  { id: 'tool_3', chainType: 'tool', level: 3, name: '金元宝', emoji: '🏅', mergeResultId: 'tool_4' },
  { id: 'tool_4', chainType: 'tool', level: 4, name: '宝箱',   emoji: '📦', mergeResultId: 'tool_5' },
  { id: 'tool_5', chainType: 'tool', level: 5, name: '珍宝箱', emoji: '🎁' },
]

// ─── All items map ────────────────────────────────────────────────────────────
export const ALL_ITEMS: ItemDef[] = [
  ...poultryChain,
  ...teaChain,
  ...pastryChain,
  ...lanternChain,
  ...jewelryChain,
  ...toolChain,
]

export const ITEM_MAP: Record<string, ItemDef> = {}
for (const item of ALL_ITEMS) {
  ITEM_MAP[item.id] = item
}

// Helper: get the merge result for two identical items
export function getMergeResult(itemId: string): string | null {
  return ITEM_MAP[itemId]?.mergeResultId ?? null
}

// Helper: check if two items can merge
export function canItemsMerge(a: string, b: string): boolean {
  return a === b && !!getMergeResult(a)
}

// Helper: items that can be used to unlock a locked item (same chain, lower level)
export function canUnlock(lockedItemId: string, draggingItemId: string): boolean {
  const locked = ITEM_MAP[lockedItemId]
  const dragging = ITEM_MAP[draggingItemId]
  if (!locked || !dragging) return false
  return locked.chainType === dragging.chainType && dragging.level < locked.level
}
