export interface OrderRequirement {
  itemId: string
  count: number
}

export interface OrderTemplate {
  id: string
  requirements: OrderRequirement[]  // max 3 items, each count = 1
  coinReward: number
  expReward: number
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
    id: 'order_tool_basic',
    requirements: [{ itemId: 'tool_1', count: 1 }],
    coinReward: 15,
    expReward: 8,
  },
]

// Pick random order templates (non-repeating)
export function pickRandomOrders(count: number, excludeIds: string[] = []): OrderTemplate[] {
  const available = ORDER_TEMPLATES.filter(t => !excludeIds.includes(t.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
