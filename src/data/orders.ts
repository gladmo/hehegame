export interface OrderRequirement {
  itemId: string
  count: number
}

export interface OrderTemplate {
  id: string
  requirements: OrderRequirement[]  // max 3 items, each count = 1
  coinReward: number
  expReward: number
  /** Item ID to spawn on the board as an extra reward when this order is fulfilled */
  itemRewardId?: string
}

export const ORDER_TEMPLATES: OrderTemplate[] = [
  {
    id: 'order_tutorial',
    requirements: [{ itemId: 'poultry_1', count: 1 }],
    coinReward: 50,
    expReward: 20,
  },
  {
    id: 'order_tea_basic',
    requirements: [{ itemId: 'tea_1', count: 1 }],
    coinReward: 20,
    expReward: 10,
  },
  {
    id: 'order_tea_mid',
    requirements: [{ itemId: 'tea_4', count: 1 }],
    coinReward: 50,
    expReward: 25,
  },
  {
    id: 'order_pastry_basic',
    requirements: [{ itemId: 'pastry_1', count: 1 }],
    coinReward: 30,
    expReward: 15,
  },
  {
    id: 'order_pastry_mid',
    requirements: [
      { itemId: 'pastry_3', count: 1 },
      { itemId: 'tea_2', count: 1 },
    ],
    coinReward: 80,
    expReward: 40,
  },
  {
    id: 'order_egg_basic',
    requirements: [{ itemId: 'poultry_1', count: 1 }],
    coinReward: 25,
    expReward: 12,
  },
  {
    id: 'order_egg_mid',
    requirements: [{ itemId: 'poultry_4', count: 1 }],
    coinReward: 60,
    expReward: 30,
  },
  {
    id: 'order_lantern_basic',
    requirements: [{ itemId: 'lantern_1', count: 1 }],
    coinReward: 20,
    expReward: 10,
  },
  {
    id: 'order_multi_1',
    requirements: [
      { itemId: 'tea_3', count: 1 },
      { itemId: 'pastry_2', count: 1 },
    ],
    coinReward: 100,
    expReward: 50,
  },
  {
    id: 'order_jewelry_basic',
    requirements: [{ itemId: 'jewelry_1', count: 1 }],
    coinReward: 20,
    expReward: 10,
  },
  {
    id: 'order_jewelry_mid',
    requirements: [{ itemId: 'jewelry_3', count: 1 }],
    coinReward: 70,
    expReward: 35,
  },
  {
    id: 'order_big_1',
    requirements: [
      { itemId: 'tea_5', count: 1 },
      { itemId: 'pastry_4', count: 1 },
      { itemId: 'poultry_5', count: 1 },
    ],
    coinReward: 250,
    expReward: 120,
  },
  {
    id: 'order_textile_basic',
    requirements: [{ itemId: 'textile_1', count: 1 }],
    coinReward: 20,
    expReward: 10,
  },
  {
    id: 'order_textile_mid',
    requirements: [{ itemId: 'textile_3', count: 1 }],
    coinReward: 70,
    expReward: 35,
  },
  {
    id: 'order_multi_textile',
    requirements: [
      { itemId: 'textile_2', count: 1 },
      { itemId: 'jewelry_2', count: 1 },
    ],
    coinReward: 90,
    expReward: 45,
  },
  // ── 礼盒棋子奖励订单 ─────────────────────────────────────────────────────────
  {
    id: 'order_redbox_basic',
    requirements: [
      { itemId: 'coolTea_1', count: 1 },
      { itemId: 'dough_1',   count: 1 },
    ],
    coinReward: 60,
    expReward: 30,
    itemRewardId: 'redBox_1',
  },
  {
    id: 'order_redbox_mid',
    requirements: [
      { itemId: 'coolTea_3', count: 1 },
      { itemId: 'dough_3',   count: 1 },
    ],
    coinReward: 150,
    expReward: 75,
    itemRewardId: 'redBox_2',
  },
  {
    id: 'order_greenbox_basic',
    requirements: [
      { itemId: 'egg_1',  count: 1 },
      { itemId: 'ring_1', count: 1 },
    ],
    coinReward: 60,
    expReward: 30,
    itemRewardId: 'greenBox_1',
  },
  {
    id: 'order_greenbox_mid',
    requirements: [
      { itemId: 'egg_3',  count: 1 },
      { itemId: 'ring_3', count: 1 },
    ],
    coinReward: 150,
    expReward: 75,
    itemRewardId: 'greenBox_2',
  },
]

// Pick random order templates (non-repeating)
export function pickRandomOrders(count: number, excludeIds: string[] = []): OrderTemplate[] {
  const available = ORDER_TEMPLATES.filter(t => !excludeIds.includes(t.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
