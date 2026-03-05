// Item chain type
export type ItemChainType = 'poultry' | 'tea' | 'pastry' | 'lantern' | 'jewelry' | 'textile'

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
// 老母鸡 (auto-gen) → 鸡蛋 → 荷包蛋 → 鸡仔 → 嫩鸡 → 荷叶蒸鸡 → 凤凰蛋
const poultryChain: ItemDef[] = [
  { id: 'poultry_gen', chainType: 'poultry', level: 0, name: '老母鸡',   emoji: '🐔', isGenerator: true, generatesId: 'poultry_1' },
  { id: 'poultry_1',   chainType: 'poultry', level: 1, name: '鸡蛋',     emoji: '🥚', mergeResultId: 'poultry_2' },
  { id: 'poultry_2',   chainType: 'poultry', level: 2, name: '荷包蛋',   emoji: '🍳', mergeResultId: 'poultry_3' },
  { id: 'poultry_3',   chainType: 'poultry', level: 3, name: '鸡仔',     emoji: '🐣', mergeResultId: 'poultry_4' },
  { id: 'poultry_4',   chainType: 'poultry', level: 4, name: '嫩鸡',     emoji: '🐥', mergeResultId: 'poultry_5' },
  { id: 'poultry_5',   chainType: 'poultry', level: 5, name: '荷叶蒸鸡', emoji: '🍜', mergeResultId: 'poultry_6' },
  { id: 'poultry_6',   chainType: 'poultry', level: 6, name: '凤凰蛋',   emoji: '🪺' },
]

// ─── Tea chain (click-generator) ─────────────────────────────────────────────
// 茶壶 (click-gen) → 热茶 → 日驻雪芽茶 → 方山露芽茶 → 碧螺春 → 特级龙井 → 普洱茶
const teaChain: ItemDef[] = [
  { id: 'tea_gen', chainType: 'tea', level: 0, name: '茶壶',       emoji: '🫖', isGenerator: true, generatesId: 'tea_1' },
  { id: 'tea_1',   chainType: 'tea', level: 1, name: '热茶',       emoji: '🍵', mergeResultId: 'tea_2' },
  { id: 'tea_2',   chainType: 'tea', level: 2, name: '日驻雪芽茶', emoji: '🌿', mergeResultId: 'tea_3' },
  { id: 'tea_3',   chainType: 'tea', level: 3, name: '方山露芽茶', emoji: '🍃', mergeResultId: 'tea_4' },
  { id: 'tea_4',   chainType: 'tea', level: 4, name: '碧螺春',     emoji: '🌱', mergeResultId: 'tea_5' },
  { id: 'tea_5',   chainType: 'tea', level: 5, name: '特级龙井',   emoji: '☕', mergeResultId: 'tea_6' },
  { id: 'tea_6',   chainType: 'tea', level: 6, name: '普洱茶',     emoji: '🧉' },
]

// ─── Pastry chain (click-generator) ──────────────────────────────────────────
// 竹华食篓 (click-gen) → 柿柿如意盒 → 桂花糖糕 → 玫瑰鲜花饼 → 蛋黄酥 → 海棠糕 → 宫廷糕点 → 玉兔摘柿盒
const pastryChain: ItemDef[] = [
  { id: 'pastry_gen', chainType: 'pastry', level: 0, name: '竹华食篓',   emoji: '🧺', isGenerator: true, generatesId: 'pastry_1' },
  { id: 'pastry_1',   chainType: 'pastry', level: 1, name: '柿柿如意盒', emoji: '🎑', mergeResultId: 'pastry_2' },
  { id: 'pastry_2',   chainType: 'pastry', level: 2, name: '桂花糖糕',   emoji: '🍡', mergeResultId: 'pastry_3' },
  { id: 'pastry_3',   chainType: 'pastry', level: 3, name: '玫瑰鲜花饼', emoji: '🌸', mergeResultId: 'pastry_4' },
  { id: 'pastry_4',   chainType: 'pastry', level: 4, name: '蛋黄酥',     emoji: '🥐', mergeResultId: 'pastry_5' },
  { id: 'pastry_5',   chainType: 'pastry', level: 5, name: '海棠糕',     emoji: '🎂', mergeResultId: 'pastry_6' },
  { id: 'pastry_6',   chainType: 'pastry', level: 6, name: '宫廷糕点',   emoji: '🍰', mergeResultId: 'pastry_7' },
  { id: 'pastry_7',   chainType: 'pastry', level: 7, name: '玉兔摘柿盒', emoji: '🍮' },
]

// ─── Lantern chain (click-generator, max level 5) ────────────────────────────
// 手作盒 (click-gen) → 纸糊灯笼 → 圆灯笼 → 彩灯笼 → 宫廷灯 → 九龙玉灯
const lanternChain: ItemDef[] = [
  { id: 'lantern_gen', chainType: 'lantern', level: 0, name: '手作盒',   emoji: '📦', isGenerator: true, generatesId: 'lantern_1' },
  { id: 'lantern_1',   chainType: 'lantern', level: 1, name: '纸糊灯笼', emoji: '🕯️', mergeResultId: 'lantern_2' },
  { id: 'lantern_2',   chainType: 'lantern', level: 2, name: '圆灯笼',   emoji: '🏮', mergeResultId: 'lantern_3' },
  { id: 'lantern_3',   chainType: 'lantern', level: 3, name: '彩灯笼',   emoji: '🪔', mergeResultId: 'lantern_4' },
  { id: 'lantern_4',   chainType: 'lantern', level: 4, name: '宫廷灯',   emoji: '💡', mergeResultId: 'lantern_5' },
  { id: 'lantern_5',   chainType: 'lantern', level: 5, name: '九龙玉灯', emoji: '🔆' },
]

// ─── Jewelry chain (click-generator, max level 5) ─────────────────────────────
// 妆奁 (click-gen) → 金戒指 → 雕花耳坠 → 银镯子 → 翡翠镯 → 龙凤佩
const jewelryChain: ItemDef[] = [
  { id: 'jewelry_gen', chainType: 'jewelry', level: 0, name: '妆奁',     emoji: '💄', isGenerator: true, generatesId: 'jewelry_1' },
  { id: 'jewelry_1',   chainType: 'jewelry', level: 1, name: '金戒指',   emoji: '💍', mergeResultId: 'jewelry_2' },
  { id: 'jewelry_2',   chainType: 'jewelry', level: 2, name: '雕花耳坠', emoji: '📿', mergeResultId: 'jewelry_3' },
  { id: 'jewelry_3',   chainType: 'jewelry', level: 3, name: '银镯子',   emoji: '⭕', mergeResultId: 'jewelry_4' },
  { id: 'jewelry_4',   chainType: 'jewelry', level: 4, name: '翡翠镯',   emoji: '💚', mergeResultId: 'jewelry_5' },
  { id: 'jewelry_5',   chainType: 'jewelry', level: 5, name: '龙凤佩',   emoji: '💎' },
]

// ─── Textile chain (click-generator, max level 5) ─────────────────────────────
// 纺车 (click-gen) → 白色布匹 → 描金绣花手袋 → 香囊 → 货郎包 → 绸缎
const textileChain: ItemDef[] = [
  { id: 'textile_gen', chainType: 'textile', level: 0, name: '纺车',       emoji: '🪡', isGenerator: true, generatesId: 'textile_1' },
  { id: 'textile_1',   chainType: 'textile', level: 1, name: '白色布匹',   emoji: '🧵', mergeResultId: 'textile_2' },
  { id: 'textile_2',   chainType: 'textile', level: 2, name: '描金绣花手袋', emoji: '👜', mergeResultId: 'textile_3' },
  { id: 'textile_3',   chainType: 'textile', level: 3, name: '香囊',       emoji: '🎒', mergeResultId: 'textile_4' },
  { id: 'textile_4',   chainType: 'textile', level: 4, name: '货郎包',     emoji: '💼', mergeResultId: 'textile_5' },
  { id: 'textile_5',   chainType: 'textile', level: 5, name: '绸缎',       emoji: '🎀' },
]

// ─── All items map ────────────────────────────────────────────────────────────
export const ALL_ITEMS: ItemDef[] = [
  ...poultryChain,
  ...teaChain,
  ...pastryChain,
  ...lanternChain,
  ...jewelryChain,
  ...textileChain,
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
