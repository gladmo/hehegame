import type { GameEvent, CardSet } from '@/shared/types';

// ─── Timed Events ───
const now = Date.now();
const DAY = 86_400_000;

export const GAME_EVENTS: GameEvent[] = [
    {
        id: 'cooking_contest_1',
        type: 'cooking_contest',
        name: '厨艺大赛·第一季',
        description: '在限时3分钟内合成尽可能多的高级物品，争夺排行榜奖励！',
        startsAt: now,
        endsAt: now + 7 * DAY,
        rewards: [
            { type: 'coins', amount: 500 },
            { type: 'gems', amount: 30 },
            { type: 'lootbox', itemId: 'gold' },
        ],
    },
    {
        id: 'holiday_spring',
        type: 'holiday_decor',
        name: '春日花园节',
        description: '限时春日主题装饰品上架！完成专属订单获得独家奖励。',
        startsAt: now + 3 * DAY,
        endsAt: now + 10 * DAY,
        rewards: [
            { type: 'decoration', itemId: 'garden_flower' },
            { type: 'coins', amount: 300 },
        ],
    },
    {
        id: 'card_event_1',
        type: 'card_collection',
        name: '美食卡牌·甜蜜系列',
        description: '收集12张甜蜜系列卡牌，集齐获得限定花园装饰！',
        startsAt: now,
        endsAt: now + 14 * DAY,
        rewards: [
            { type: 'decoration', itemId: 'garden_gazebo' },
            { type: 'gems', amount: 50 },
        ],
    },
];

// ─── Card Collection Sets ───
export const CARD_SETS: CardSet[] = [
    {
        id: 'sweet_series',
        name: '甜蜜系列',
        cards: [
            'card_macaron', 'card_tiramisu', 'card_creme_brulee', 'card_chocolate',
            'card_strawberry_cake', 'card_mille_feuille', 'card_eclair', 'card_profiterole',
            'card_tart', 'card_mousse', 'card_souffle', 'card_parfait',
        ],
        completionReward: { type: 'decoration', itemId: 'garden_gazebo' },
    },
    {
        id: 'coffee_series',
        name: '咖啡鉴赏',
        cards: [
            'card_americano', 'card_cappuccino', 'card_macchiato', 'card_affogato',
            'card_irish_coffee', 'card_cold_brew', 'card_flat_white', 'card_cortado',
            'card_turkish', 'card_vietnamese', 'card_pour_over', 'card_siphon',
        ],
        completionReward: { type: 'gems', amount: 100 },
    },
];

// ─── Leaderboard AI Names ───
export const AI_PLAYER_NAMES = [
    '厨神小白', '甜品达人', '咖啡女王', '寿司大师', '烘焙高手',
    '美食猎人', '星级厨师', '面包王子', '沙拉公主', '意面骑士',
    '料理天才', '味道探险家', '糕点专家', '可可大师', '抹茶控',
    '柠檬女孩', '草莓先生', '奶油战士', '焦糖精灵', '薄荷少女',
];
