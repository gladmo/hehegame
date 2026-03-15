// Item chain types
// Generator chains: the mother piece (母棋) that produces child pieces
// Child chains: the child pieces (子棋) that can only be merged
export type ItemChainType =
  | 'poultry'    // 老母鸡 generator chain (auto-gen, 10 levels)
  | 'egg'        // 鸡蛋 child chain (7 levels)
  | 'teapot'     // 茶壶 generator chain (11 levels, produces from Lv4)
  | 'coolTea'    // 凉茶 child chain (14 levels)
  | 'riceBall'   // 酒酝圆子 rare child chain (7 levels)
  | 'craftBox'   // 手作盒 generator chain (11 levels, produces from Lv5)
  | 'lantern'    // 灯笼 child chain (12 levels)
  | 'basket'     // 食篓 generator chain (11 levels, produces from Lv5)
  | 'dough'      // 面团 child chain (15 levels)
  | 'watermelon' // 西瓜 rare child chain (7 levels)
  | 'dresser'    // 妆奁 generator chain (11 levels, produces from Lv5)
  | 'ring'       // 戒指 child chain (11 levels)
  | 'peaceLock'  // 平安扣 rare child chain (7 levels)
  | 'loom'       // 织布机 generator chain (11 levels, produces from Lv5)
  | 'fabric'     // 布匹 child chain (5 levels; Lv5 also generates 荷包)
  | 'pouch'      // 荷包 child chain (10 levels)
  | 'redBox'     // 红色漆盒 reward gift box (2 levels; produces 茶壶/食篓/织布机)
  | 'greenBox'   // 绿色漆盒 reward gift box (2 levels; produces 老母鸡/妆奁/手作盒)

/** Weighted random generation option */
export interface GenerationOption {
  itemId: string
  baseWeight: number   // base probability weight at minimum generator level
  levelBonus?: number  // additional weight added per generator level (scales rarity up with level)
}

export interface ItemDef {
  id: string
  chainType: ItemChainType
  level: number
  name: string
  emoji: string
  icon?: string
  /** Can produce child items (either auto or click) */
  isGenerator?: boolean
  /** Auto-generates on a timer without energy cost (老母鸡 only) */
  isAutoGenerator?: boolean
  /** Weighted list of items this generator can produce */
  generates?: GenerationOption[]
  /** Primary generated item ID (used for display and as fallback) */
  generatesId?: string
  /** Max items stored before requiring player action (auto-gen only) */
  storageCapacity?: number
  /** Cooldown in ms between auto-gen cycles */
  cooldownMs?: number
  /** Energy cost per click-generation (default 1) */
  energyCost?: number
  mergeResultId?: string
}

// ─── Helper: build a generator definition for a given level range ─────────────
function makeGen(
  id: string, chainType: ItemChainType, level: number, name: string, emoji: string,
  generates: GenerationOption[], generatesId: string,
  mergeResultId?: string,
  icon?: string,
): ItemDef {
  return { id, chainType, level, name, emoji, icon, isGenerator: true, generates, generatesId, mergeResultId }
}

function makeAutoGen(
  id: string, chainType: ItemChainType, level: number, name: string, emoji: string,
  generates: GenerationOption[], generatesId: string,
  mergeResultId?: string,
  icon?: string,
): ItemDef {
  return {
    id, chainType, level, name, emoji, icon,
    isGenerator: true, isAutoGenerator: true,
    generates, generatesId,
    storageCapacity: 6, cooldownMs: 3_600_000,  // 1 hour
    mergeResultId,
  }
}

// ─── 老母鸡 chain (auto-generator, 10 levels) ─────────────────────────────────
// Lv1-5: merge only (not yet producing), Lv6-10: auto-gen 鸡蛋
// After each batch of 6 eggs, 1-hour cooldown starts
const poultryChain: ItemDef[] = [
  { id: 'poultry_1',  chainType: 'poultry', level: 1,  name: '老母鸡', emoji: '🐔', icon: './assets/poultry_gen.png', mergeResultId: 'poultry_2' },
  { id: 'poultry_2',  chainType: 'poultry', level: 2,  name: '老母鸡', emoji: '🐔', mergeResultId: 'poultry_3' },
  { id: 'poultry_3',  chainType: 'poultry', level: 3,  name: '老母鸡', emoji: '🐔', mergeResultId: 'poultry_4' },
  { id: 'poultry_4',  chainType: 'poultry', level: 4,  name: '老母鸡', emoji: '🐔', mergeResultId: 'poultry_5' },
  { id: 'poultry_5',  chainType: 'poultry', level: 5,  name: '老母鸡', emoji: '🐔', mergeResultId: 'poultry_6' },
  makeAutoGen('poultry_6',  'poultry', 6,  '老母鸡', '🐔', [{ itemId: 'egg_1', baseWeight: 100 }], 'egg_1', 'poultry_7', './assets/poultry_gen.png'),
  makeAutoGen('poultry_7',  'poultry', 7,  '老母鸡', '🐔', [{ itemId: 'egg_1', baseWeight: 100 }], 'egg_1', 'poultry_8'),
  makeAutoGen('poultry_8',  'poultry', 8,  '老母鸡', '🐔', [{ itemId: 'egg_1', baseWeight: 100 }], 'egg_1', 'poultry_9'),
  makeAutoGen('poultry_9',  'poultry', 9,  '老母鸡', '🐔', [{ itemId: 'egg_1', baseWeight: 100 }], 'egg_1', 'poultry_10'),
  makeAutoGen('poultry_10', 'poultry', 10, '老母鸡', '🐔', [{ itemId: 'egg_1', baseWeight: 100 }], 'egg_1'),
]

// ─── 鸡蛋 child chain (7 levels) ─────────────────────────────────────────────
const eggChain: ItemDef[] = [
  { id: 'egg_1', chainType: 'egg', level: 1, name: '鸡蛋',    emoji: '🥚', icon: './assets/poultry_1.png', mergeResultId: 'egg_2' },
  { id: 'egg_2', chainType: 'egg', level: 2, name: '荷包蛋',  emoji: '🍳', icon: './assets/poultry_2.png', mergeResultId: 'egg_3' },
  { id: 'egg_3', chainType: 'egg', level: 3, name: '蛋炒饭',  emoji: '🍚', icon: './assets/poultry_3.png', mergeResultId: 'egg_4' },
  { id: 'egg_4', chainType: 'egg', level: 4, name: '蛋炒盖饭', emoji: '🍛', icon: './assets/poultry_4.png', mergeResultId: 'egg_5' },
  { id: 'egg_5', chainType: 'egg', level: 5, name: '鸡腿盖饭', emoji: '🍗', icon: './assets/poultry_5.png', mergeResultId: 'egg_6' },
  { id: 'egg_6', chainType: 'egg', level: 6, name: '飘香烤鸡', emoji: '🍖', icon: './assets/poultry_6.png', mergeResultId: 'egg_7' },
  { id: 'egg_7', chainType: 'egg', level: 7, name: '荷叶蒸鸡', emoji: '🪺', icon: './assets/poultry_7.png' },
]

// ─── 茶壶 generator chain (11 levels) ────────────────────────────────────────
// Lv1-3: merge only; Lv4-11: produces 凉茶 (main) + 酒酝圆子 (rare, prob scales with level)
// Higher level: also small chance to produce Lv2 凉茶 directly
const teaGen: GenerationOption[] = [
  { itemId: 'coolTea_1', baseWeight: 85, levelBonus: 0 },
  { itemId: 'coolTea_2', baseWeight: 0,  levelBonus: 2  }, // Lv4→8, Lv11→22 (higher-tier bonus)
  { itemId: 'riceBall_1', baseWeight: 5, levelBonus: 1  }, // Lv4→9, Lv11→16 (rare bonus)
]
const teapotChain: ItemDef[] = [
  { id: 'teapot_1',  chainType: 'teapot', level: 1,  name: '茶壶', emoji: '🫖', icon: './assets/63.png', mergeResultId: 'teapot_2' },
  { id: 'teapot_2',  chainType: 'teapot', level: 2,  name: '茶壶', emoji: '🫖', mergeResultId: 'teapot_3' },
  { id: 'teapot_3',  chainType: 'teapot', level: 3,  name: '茶壶', emoji: '🫖', mergeResultId: 'teapot_4' },
  makeGen('teapot_4',  'teapot', 4,  '茶炉',   '🫖', teaGen, 'coolTea_1', 'teapot_5',  './assets/63.png'),
  makeGen('teapot_5',  'teapot', 5,  '茶炉',   '🫖', teaGen, 'coolTea_1', 'teapot_6'),
  makeGen('teapot_6',  'teapot', 6,  '茶炉',   '🫖', teaGen, 'coolTea_1', 'teapot_7'),
  makeGen('teapot_7',  'teapot', 7,  '高级茶炉', '🫖', teaGen, 'coolTea_1', 'teapot_8'),
  makeGen('teapot_8',  'teapot', 8,  '高级茶炉', '🫖', teaGen, 'coolTea_1', 'teapot_9'),
  makeGen('teapot_9',  'teapot', 9,  '高级茶炉', '🫖', teaGen, 'coolTea_1', 'teapot_10'),
  makeGen('teapot_10', 'teapot', 10, '顶级茶炉', '🫖', teaGen, 'coolTea_1', 'teapot_11'),
  makeGen('teapot_11', 'teapot', 11, '顶级茶炉', '🫖', teaGen, 'coolTea_1'),
]

// ─── 凉茶 child chain (14 levels) ────────────────────────────────────────────
const coolTeaChain: ItemDef[] = [
  { id: 'coolTea_1',  chainType: 'coolTea', level: 1,  name: '凉茶',    emoji: '🍵', icon: './assets/4.png',  mergeResultId: 'coolTea_2' },
  { id: 'coolTea_2',  chainType: 'coolTea', level: 2,  name: '菊花茶',  emoji: '🌼', icon: './assets/10.png', mergeResultId: 'coolTea_3' },
  { id: 'coolTea_3',  chainType: 'coolTea', level: 3,  name: '枸杞茶',  emoji: '🍒', icon: './assets/15.png', mergeResultId: 'coolTea_4' },
  { id: 'coolTea_4',  chainType: 'coolTea', level: 4,  name: '罗汉果茶', emoji: '🍐', mergeResultId: 'coolTea_5' },
  { id: 'coolTea_5',  chainType: 'coolTea', level: 5,  name: '薄荷茶',  emoji: '🌿', mergeResultId: 'coolTea_6' },
  { id: 'coolTea_6',  chainType: 'coolTea', level: 6,  name: '茅根竹蔗水', emoji: '🎋', mergeResultId: 'coolTea_7' },
  { id: 'coolTea_7',  chainType: 'coolTea', level: 7,  name: '夏枯草茶', emoji: '🌾', mergeResultId: 'coolTea_8' },
  { id: 'coolTea_8',  chainType: 'coolTea', level: 8,  name: '淡竹叶茶', emoji: '🍃', mergeResultId: 'coolTea_9' },
  { id: 'coolTea_9',  chainType: 'coolTea', level: 9,  name: '祛湿茶',  emoji: '💧', mergeResultId: 'coolTea_10' },
  { id: 'coolTea_10', chainType: 'coolTea', level: 10, name: '五花茶',  emoji: '🌺', mergeResultId: 'coolTea_11' },
  { id: 'coolTea_11', chainType: 'coolTea', level: 11, name: '二十四味茶', emoji: '🧪', mergeResultId: 'coolTea_12' },
  { id: 'coolTea_12', chainType: 'coolTea', level: 12, name: '固元茶',  emoji: '🫙', mergeResultId: 'coolTea_13' },
  { id: 'coolTea_13', chainType: 'coolTea', level: 13, name: '玉容茶',  emoji: '🌸', mergeResultId: 'coolTea_14' },
  { id: 'coolTea_14', chainType: 'coolTea', level: 14, name: '千年古茶', emoji: '🧉' },
]

// ─── 酒酝圆子 rare child chain (7 levels) ─────────────────────────────────────
const riceBallChain: ItemDef[] = [
  { id: 'riceBall_1', chainType: 'riceBall', level: 1, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_2' },
  { id: 'riceBall_2', chainType: 'riceBall', level: 2, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_3' },
  { id: 'riceBall_3', chainType: 'riceBall', level: 3, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_4' },
  { id: 'riceBall_4', chainType: 'riceBall', level: 4, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_5' },
  { id: 'riceBall_5', chainType: 'riceBall', level: 5, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_6' },
  { id: 'riceBall_6', chainType: 'riceBall', level: 6, name: '酒酝圆子', emoji: '🍡', mergeResultId: 'riceBall_7' },
  { id: 'riceBall_7', chainType: 'riceBall', level: 7, name: '极品酒酝圆子', emoji: '🍡' },
]

// ─── 手作盒 generator chain (11 levels) ──────────────────────────────────────
// Lv1-4: merge only; Lv5-11: produces 灯笼 (+ small chance of higher-tier)
const craftBoxGen: GenerationOption[] = [
  { itemId: 'lantern_1', baseWeight: 88, levelBonus: 0 },
  { itemId: 'lantern_2', baseWeight: 0,  levelBonus: 2  }, // higher-tier bonus scales with level
]
const craftBoxChain: ItemDef[] = [
  { id: 'craftBox_1',  chainType: 'craftBox', level: 1,  name: '手作盒', emoji: '📦', mergeResultId: 'craftBox_2' },
  { id: 'craftBox_2',  chainType: 'craftBox', level: 2,  name: '手作盒', emoji: '📦', mergeResultId: 'craftBox_3' },
  { id: 'craftBox_3',  chainType: 'craftBox', level: 3,  name: '手作盒', emoji: '📦', mergeResultId: 'craftBox_4' },
  { id: 'craftBox_4',  chainType: 'craftBox', level: 4,  name: '手作盒', emoji: '📦', mergeResultId: 'craftBox_5' },
  makeGen('craftBox_5',  'craftBox', 5,  '精制手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_6'),
  makeGen('craftBox_6',  'craftBox', 6,  '精制手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_7'),
  makeGen('craftBox_7',  'craftBox', 7,  '精制手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_8'),
  makeGen('craftBox_8',  'craftBox', 8,  '高级手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_9'),
  makeGen('craftBox_9',  'craftBox', 9,  '高级手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_10'),
  makeGen('craftBox_10', 'craftBox', 10, '高级手作盒', '📦', craftBoxGen, 'lantern_1', 'craftBox_11'),
  makeGen('craftBox_11', 'craftBox', 11, '顶级手作盒', '📦', craftBoxGen, 'lantern_1'),
]

// ─── 灯笼 child chain (12 levels) ─────────────────────────────────────────────
const lanternChain: ItemDef[] = [
  { id: 'lantern_1',  chainType: 'lantern', level: 1,  name: '纸糊灯笼', emoji: '🕯️', icon: './assets/lantern_1.png', mergeResultId: 'lantern_2' },
  { id: 'lantern_2',  chainType: 'lantern', level: 2,  name: '圆灯笼',  emoji: '🏮', icon: './assets/lantern_2.png', mergeResultId: 'lantern_3' },
  { id: 'lantern_3',  chainType: 'lantern', level: 3,  name: '彩灯笼',  emoji: '🪔', icon: './assets/lantern_3.png', mergeResultId: 'lantern_4' },
  { id: 'lantern_4',  chainType: 'lantern', level: 4,  name: '宫廷灯',  emoji: '💡', icon: './assets/lantern_4.png', mergeResultId: 'lantern_5' },
  { id: 'lantern_5',  chainType: 'lantern', level: 5,  name: '宫廷灯',  emoji: '💡', icon: './assets/lantern_5.png', mergeResultId: 'lantern_6' },
  { id: 'lantern_6',  chainType: 'lantern', level: 6,  name: '花灯',    emoji: '🎑', icon: './assets/lantern_6.png', mergeResultId: 'lantern_7' },
  { id: 'lantern_7',  chainType: 'lantern', level: 7,  name: '花灯',    emoji: '🎑', icon: './assets/lantern_7.png', mergeResultId: 'lantern_8' },
  { id: 'lantern_8',  chainType: 'lantern', level: 8,  name: '精品花灯', emoji: '✨', icon: './assets/lantern_8.png', mergeResultId: 'lantern_9' },
  { id: 'lantern_9',  chainType: 'lantern', level: 9,  name: '精品花灯', emoji: '✨', icon: './assets/lantern_9.png', mergeResultId: 'lantern_10' },
  { id: 'lantern_10', chainType: 'lantern', level: 10, name: '龙凤花灯', emoji: '🔆', icon: './assets/lantern_10.png', mergeResultId: 'lantern_11' },
  { id: 'lantern_11', chainType: 'lantern', level: 11, name: '龙凤花灯', emoji: '🔆', icon: './assets/lantern_11.png', mergeResultId: 'lantern_12' },
  { id: 'lantern_12', chainType: 'lantern', level: 12, name: '九龙玉灯', emoji: '🌟', icon: './assets/lantern_12.png' },
]

// ─── 食篓 generator chain (11 levels) ────────────────────────────────────────
// Lv1-4: merge only; Lv5-11: produces 面团 (main) + 西瓜 (rare)
const basketGen: GenerationOption[] = [
  { itemId: 'dough_1',      baseWeight: 85, levelBonus: 0 },
  { itemId: 'dough_2',      baseWeight: 0,  levelBonus: 2  },  // higher-tier bonus
  { itemId: 'watermelon_1', baseWeight: 5,  levelBonus: 1  },  // rare scales with level
]
const basketChain: ItemDef[] = [
  { id: 'basket_1',  chainType: 'basket', level: 1,  name: '食篓', emoji: '🧺', icon: './assets/pastry_gen.png', mergeResultId: 'basket_2' },
  { id: 'basket_2',  chainType: 'basket', level: 2,  name: '食篓', emoji: '🧺', mergeResultId: 'basket_3' },
  { id: 'basket_3',  chainType: 'basket', level: 3,  name: '食篓', emoji: '🧺', mergeResultId: 'basket_4' },
  { id: 'basket_4',  chainType: 'basket', level: 4,  name: '食篓', emoji: '🧺', mergeResultId: 'basket_5' },
  makeGen('basket_5',  'basket', 5,  '竹华食篓', '🧺', basketGen, 'dough_1', 'basket_6',  './assets/pastry_gen.png'),
  makeGen('basket_6',  'basket', 6,  '竹华食篓', '🧺', basketGen, 'dough_1', 'basket_7'),
  makeGen('basket_7',  'basket', 7,  '竹华食篓', '🧺', basketGen, 'dough_1', 'basket_8'),
  makeGen('basket_8',  'basket', 8,  '精品食篓', '🧺', basketGen, 'dough_1', 'basket_9'),
  makeGen('basket_9',  'basket', 9,  '精品食篓', '🧺', basketGen, 'dough_1', 'basket_10'),
  makeGen('basket_10', 'basket', 10, '精品食篓', '🧺', basketGen, 'dough_1', 'basket_11'),
  makeGen('basket_11', 'basket', 11, '顶级食篓', '🧺', basketGen, 'dough_1'),
]

// ─── 面团 child chain (15 levels) ────────────────────────────────────────────
const doughChain: ItemDef[] = [
  { id: 'dough_1',  chainType: 'dough', level: 1,  name: '面团',   emoji: '🫓', icon: './assets/pastry_1.png', mergeResultId: 'dough_2' },
  { id: 'dough_2',  chainType: 'dough', level: 2,  name: '汤圆',   emoji: '🍡', icon: './assets/pastry_2.png', mergeResultId: 'dough_3' },
  { id: 'dough_3',  chainType: 'dough', level: 3,  name: '花卷',   emoji: '🥐', icon: './assets/pastry_3.png', mergeResultId: 'dough_4' },
  { id: 'dough_4',  chainType: 'dough', level: 4,  name: '桂花糕', emoji: '🎂', icon: './assets/pastry_4.png', mergeResultId: 'dough_5' },
  { id: 'dough_5',  chainType: 'dough', level: 5,  name: '玫瑰饼', emoji: '🌸', icon: './assets/pastry_5.png', mergeResultId: 'dough_6' },
  { id: 'dough_6',  chainType: 'dough', level: 6,  name: '蛋黄酥', emoji: '🥮', icon: './assets/pastry_6.png', mergeResultId: 'dough_7' },
  { id: 'dough_7',  chainType: 'dough', level: 7,  name: '海棠糕', emoji: '🍮', mergeResultId: 'dough_8' },
  { id: 'dough_8',  chainType: 'dough', level: 8,  name: '宫廷糕点', emoji: '🍰', mergeResultId: 'dough_9' },
  { id: 'dough_9',  chainType: 'dough', level: 9,  name: '艾草青团', emoji: '🟢', mergeResultId: 'dough_10' },
  { id: 'dough_10', chainType: 'dough', level: 10, name: '柿柿如意', emoji: '🎑', mergeResultId: 'dough_11' },
  { id: 'dough_11', chainType: 'dough', level: 11, name: '桃花酥',  emoji: '🌺', mergeResultId: 'dough_12' },
  { id: 'dough_12', chainType: 'dough', level: 12, name: '凤梨酥',  emoji: '🍍', mergeResultId: 'dough_13' },
  { id: 'dough_13', chainType: 'dough', level: 13, name: '杏仁酥',  emoji: '🌰', mergeResultId: 'dough_14' },
  { id: 'dough_14', chainType: 'dough', level: 14, name: '核桃酥',  emoji: '🥜', mergeResultId: 'dough_15' },
  { id: 'dough_15', chainType: 'dough', level: 15, name: '玉兔摘柿盒', emoji: '🐇' },
]

// ─── 西瓜 rare child chain (7 levels) ─────────────────────────────────────────
const watermelonChain: ItemDef[] = [
  { id: 'watermelon_1', chainType: 'watermelon', level: 1, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_2' },
  { id: 'watermelon_2', chainType: 'watermelon', level: 2, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_3' },
  { id: 'watermelon_3', chainType: 'watermelon', level: 3, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_4' },
  { id: 'watermelon_4', chainType: 'watermelon', level: 4, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_5' },
  { id: 'watermelon_5', chainType: 'watermelon', level: 5, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_6' },
  { id: 'watermelon_6', chainType: 'watermelon', level: 6, name: '西瓜', emoji: '🍉', mergeResultId: 'watermelon_7' },
  { id: 'watermelon_7', chainType: 'watermelon', level: 7, name: '极品西瓜', emoji: '🍉' },
]

// ─── 妆奁 generator chain (11 levels) ────────────────────────────────────────
// Lv1-4: merge only; Lv5-11: produces 戒指 (main) + 平安扣 (rare)
const dresserGen: GenerationOption[] = [
  { itemId: 'ring_1',      baseWeight: 85, levelBonus: 0 },
  { itemId: 'ring_2',      baseWeight: 0,  levelBonus: 2  },  // higher-tier bonus
  { itemId: 'peaceLock_1', baseWeight: 5,  levelBonus: 1  },  // rare scales with level
]
const dresserChain: ItemDef[] = [
  { id: 'dresser_1',  chainType: 'dresser', level: 1,  name: '妆奁', emoji: '💄', icon: './assets/80.png', mergeResultId: 'dresser_2' },
  { id: 'dresser_2',  chainType: 'dresser', level: 2,  name: '妆奁', emoji: '💄', mergeResultId: 'dresser_3' },
  { id: 'dresser_3',  chainType: 'dresser', level: 3,  name: '妆奁', emoji: '💄', mergeResultId: 'dresser_4' },
  { id: 'dresser_4',  chainType: 'dresser', level: 4,  name: '妆奁', emoji: '💄', mergeResultId: 'dresser_5' },
  makeGen('dresser_5',  'dresser', 5,  '漆雕妆奁', '💄', dresserGen, 'ring_1', 'dresser_6',  './assets/80.png'),
  makeGen('dresser_6',  'dresser', 6,  '漆雕妆奁', '💄', dresserGen, 'ring_1', 'dresser_7'),
  makeGen('dresser_7',  'dresser', 7,  '漆雕妆奁', '💄', dresserGen, 'ring_1', 'dresser_8'),
  makeGen('dresser_8',  'dresser', 8,  '金丝妆奁', '💄', dresserGen, 'ring_1', 'dresser_9'),
  makeGen('dresser_9',  'dresser', 9,  '金丝妆奁', '💄', dresserGen, 'ring_1', 'dresser_10'),
  makeGen('dresser_10', 'dresser', 10, '金丝妆奁', '💄', dresserGen, 'ring_1', 'dresser_11'),
  makeGen('dresser_11', 'dresser', 11, '顶级妆奁', '💄', dresserGen, 'ring_1'),
]

// ─── 戒指 child chain (11 levels) ─────────────────────────────────────────────
const ringChain: ItemDef[] = [
  { id: 'ring_1',  chainType: 'ring', level: 1,  name: '金戒指',  emoji: '💍', icon: './assets/1.png',  mergeResultId: 'ring_2' },
  { id: 'ring_2',  chainType: 'ring', level: 2,  name: '雕花耳坠', emoji: '📿', icon: './assets/3.png',  mergeResultId: 'ring_3' },
  { id: 'ring_3',  chainType: 'ring', level: 3,  name: '银镯子',  emoji: '⭕', icon: './assets/74.png', mergeResultId: 'ring_4' },
  { id: 'ring_4',  chainType: 'ring', level: 4,  name: '翡翠镯',  emoji: '💚', icon: './assets/72.png', mergeResultId: 'ring_5' },
  { id: 'ring_5',  chainType: 'ring', level: 5,  name: '龙凤佩',  emoji: '💎', icon: './assets/75.png', mergeResultId: 'ring_6' },
  { id: 'ring_6',  chainType: 'ring', level: 6,  name: '金步摇',  emoji: '🌟', mergeResultId: 'ring_7' },
  { id: 'ring_7',  chainType: 'ring', level: 7,  name: '云纹玉佩', emoji: '🔮', mergeResultId: 'ring_8' },
  { id: 'ring_8',  chainType: 'ring', level: 8,  name: '凤钗',    emoji: '🦚', mergeResultId: 'ring_9' },
  { id: 'ring_9',  chainType: 'ring', level: 9,  name: '蝶恋花钗', emoji: '🦋', mergeResultId: 'ring_10' },
  { id: 'ring_10', chainType: 'ring', level: 10, name: '翠玉观音', emoji: '🏺', mergeResultId: 'ring_11' },
  { id: 'ring_11', chainType: 'ring', level: 11, name: '九龙玉璧', emoji: '☯️' },
]

// ─── 平安扣 rare child chain (7 levels) ──────────────────────────────────────
const peaceLockChain: ItemDef[] = [
  { id: 'peaceLock_1', chainType: 'peaceLock', level: 1, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_2' },
  { id: 'peaceLock_2', chainType: 'peaceLock', level: 2, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_3' },
  { id: 'peaceLock_3', chainType: 'peaceLock', level: 3, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_4' },
  { id: 'peaceLock_4', chainType: 'peaceLock', level: 4, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_5' },
  { id: 'peaceLock_5', chainType: 'peaceLock', level: 5, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_6' },
  { id: 'peaceLock_6', chainType: 'peaceLock', level: 6, name: '平安扣', emoji: '🪬', mergeResultId: 'peaceLock_7' },
  { id: 'peaceLock_7', chainType: 'peaceLock', level: 7, name: '极品平安扣', emoji: '🪬' },
]

// ─── 织布机 generator chain (11 levels) ──────────────────────────────────────
// Lv1-4: merge only; Lv5-11: produces 布匹 (+ small chance higher-tier)
const loomGen: GenerationOption[] = [
  { itemId: 'fabric_1', baseWeight: 88, levelBonus: 0 },
  { itemId: 'fabric_2', baseWeight: 0,  levelBonus: 2  },  // higher-tier bonus
]
const loomChain: ItemDef[] = [
  { id: 'loom_1',  chainType: 'loom', level: 1,  name: '织布机', emoji: '🪡', icon: './assets/textile_gen.png', mergeResultId: 'loom_2' },
  { id: 'loom_2',  chainType: 'loom', level: 2,  name: '织布机', emoji: '🪡', mergeResultId: 'loom_3' },
  { id: 'loom_3',  chainType: 'loom', level: 3,  name: '织布机', emoji: '🪡', mergeResultId: 'loom_4' },
  { id: 'loom_4',  chainType: 'loom', level: 4,  name: '织布机', emoji: '🪡', mergeResultId: 'loom_5' },
  makeGen('loom_5',  'loom', 5,  '精制织布机', '🪡', loomGen, 'fabric_1', 'loom_6',  './assets/textile_gen.png'),
  makeGen('loom_6',  'loom', 6,  '精制织布机', '🪡', loomGen, 'fabric_1', 'loom_7'),
  makeGen('loom_7',  'loom', 7,  '精制织布机', '🪡', loomGen, 'fabric_1', 'loom_8'),
  makeGen('loom_8',  'loom', 8,  '高级织布机', '🪡', loomGen, 'fabric_1', 'loom_9'),
  makeGen('loom_9',  'loom', 9,  '高级织布机', '🪡', loomGen, 'fabric_1', 'loom_10'),
  makeGen('loom_10', 'loom', 10, '高级织布机', '🪡', loomGen, 'fabric_1', 'loom_11'),
  makeGen('loom_11', 'loom', 11, '顶级织布机', '🪡', loomGen, 'fabric_1'),
]

// ─── 布匹 child chain (5 levels; Lv5 becomes a generator → produces 荷包) ─────
// 布匹 Lv5 is both the max-level child AND a click-generator for 荷包
const fabricGen: GenerationOption[] = [
  { itemId: 'pouch_1', baseWeight: 90, levelBonus: 0 },
  { itemId: 'pouch_2', baseWeight: 0,  levelBonus: 2  },
]
const fabricChain: ItemDef[] = [
  { id: 'fabric_1', chainType: 'fabric', level: 1, name: '白色布匹', emoji: '🧵', icon: './assets/37.png', mergeResultId: 'fabric_2' },
  { id: 'fabric_2', chainType: 'fabric', level: 2, name: '彩色布匹', emoji: '🎨', icon: './assets/48.png', mergeResultId: 'fabric_3' },
  { id: 'fabric_3', chainType: 'fabric', level: 3, name: '描金布匹', emoji: '✨', icon: './assets/50.png', mergeResultId: 'fabric_4' },
  { id: 'fabric_4', chainType: 'fabric', level: 4, name: '绣花布匹', emoji: '🌺', icon: './assets/49.png', mergeResultId: 'fabric_5' },
  // Lv5: max level AND generator for 荷包
  { id: 'fabric_5', chainType: 'fabric', level: 5, name: '绫罗布匹', emoji: '🎀', icon: './assets/51.png',
    isGenerator: true, generates: fabricGen, generatesId: 'pouch_1' },
]

// ─── 荷包 child chain (10 levels) ─────────────────────────────────────────────
const pouchChain: ItemDef[] = [
  { id: 'pouch_1',  chainType: 'pouch', level: 1,  name: '绣花荷包', emoji: '👛', mergeResultId: 'pouch_2' },
  { id: 'pouch_2',  chainType: 'pouch', level: 2,  name: '绣花荷包', emoji: '👛', mergeResultId: 'pouch_3' },
  { id: 'pouch_3',  chainType: 'pouch', level: 3,  name: '锦绣荷包', emoji: '👜', mergeResultId: 'pouch_4' },
  { id: 'pouch_4',  chainType: 'pouch', level: 4,  name: '锦绣荷包', emoji: '👜', mergeResultId: 'pouch_5' },
  { id: 'pouch_5',  chainType: 'pouch', level: 5,  name: '香囊荷包', emoji: '🎒', mergeResultId: 'pouch_6' },
  { id: 'pouch_6',  chainType: 'pouch', level: 6,  name: '香囊荷包', emoji: '🎒', mergeResultId: 'pouch_7' },
  { id: 'pouch_7',  chainType: 'pouch', level: 7,  name: '云锦荷包', emoji: '💼', mergeResultId: 'pouch_8' },
  { id: 'pouch_8',  chainType: 'pouch', level: 8,  name: '云锦荷包', emoji: '💼', mergeResultId: 'pouch_9' },
  { id: 'pouch_9',  chainType: 'pouch', level: 9,  name: '御赐荷包', emoji: '🏮', mergeResultId: 'pouch_10' },
  { id: 'pouch_10', chainType: 'pouch', level: 10, name: '极品御赐荷包', emoji: '🌟' },
]

// ─── 红色漆盒 reward gift box chain (2 levels) ────────────────────────────────
// Lv1: randomly opens into one of teapot_1 / basket_1 / loom_1 (equal chance)
// Lv2: randomly opens into one of teapot_2 / basket_2 / loom_2 (equal chance)
// Two Lv1 boxes merge into one Lv2 box.
const redBoxLv1Gen: GenerationOption[] = [
  { itemId: 'teapot_1', baseWeight: 1 },
  { itemId: 'basket_1', baseWeight: 1 },
  { itemId: 'loom_1',   baseWeight: 1 },
]
const redBoxLv2Gen: GenerationOption[] = [
  { itemId: 'teapot_2', baseWeight: 1 },
  { itemId: 'basket_2', baseWeight: 1 },
  { itemId: 'loom_2',   baseWeight: 1 },
]
const redBoxChain: ItemDef[] = [
  makeGen('redBox_1', 'redBox', 1, '红色漆盒', '🧧', redBoxLv1Gen, 'teapot_1', 'redBox_2'),
  makeGen('redBox_2', 'redBox', 2, '红色漆盒', '🧧', redBoxLv2Gen, 'teapot_2'),
]

// ─── 绿色漆盒 reward gift box chain (2 levels) ────────────────────────────────
// Lv1: randomly opens into one of poultry_1 / dresser_1 / craftBox_1 (equal chance)
// Lv2: randomly opens into one of poultry_2 / dresser_2 / craftBox_2 (equal chance)
// Two Lv1 boxes merge into one Lv2 box.
const greenBoxLv1Gen: GenerationOption[] = [
  { itemId: 'poultry_1',  baseWeight: 1 },
  { itemId: 'dresser_1',  baseWeight: 1 },
  { itemId: 'craftBox_1', baseWeight: 1 },
]
const greenBoxLv2Gen: GenerationOption[] = [
  { itemId: 'poultry_2',  baseWeight: 1 },
  { itemId: 'dresser_2',  baseWeight: 1 },
  { itemId: 'craftBox_2', baseWeight: 1 },
]
const greenBoxChain: ItemDef[] = [
  makeGen('greenBox_1', 'greenBox', 1, '绿色漆盒', '🎁', greenBoxLv1Gen, 'poultry_1', 'greenBox_2'),
  makeGen('greenBox_2', 'greenBox', 2, '绿色漆盒', '🎁', greenBoxLv2Gen, 'poultry_2'),
]

// ─── All items map ────────────────────────────────────────────────────────────
export const ALL_ITEMS: ItemDef[] = [
  ...poultryChain,
  ...eggChain,
  ...teapotChain,
  ...coolTeaChain,
  ...riceBallChain,
  ...craftBoxChain,
  ...lanternChain,
  ...basketChain,
  ...doughChain,
  ...watermelonChain,
  ...dresserChain,
  ...ringChain,
  ...peaceLockChain,
  ...loomChain,
  ...fabricChain,
  ...pouchChain,
  ...redBoxChain,
  ...greenBoxChain,
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

/**
 * Pick a generated item ID using weighted random selection based on the generator's level.
 * Higher levels increase the weight of options that have a positive levelBonus.
 */
export function selectGeneratedItem(generates: GenerationOption[], generatorLevel: number): string {
  const options = generates.map(opt => ({
    itemId: opt.itemId,
    weight: opt.baseWeight + generatorLevel * (opt.levelBonus ?? 0),
  })).filter(opt => opt.weight > 0)

  if (options.length === 0) return generates[0].itemId

  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0)
  let rand = Math.random() * totalWeight
  for (const opt of options) {
    rand -= opt.weight
    if (rand <= 0) return opt.itemId
  }
  return options[options.length - 1].itemId
}

/**
 * Get the primary (default / most common) generated item ID for a generator.
 * For auto-generators this is always the same item; for click generators it is
 * the first (lowest-weight-bonus) option in the generates array.
 */
export function getPrimaryGeneratedItemId(def: ItemDef): string | null {
  if (def.generatesId) return def.generatesId
  return def.generates?.[0]?.itemId ?? null
}
