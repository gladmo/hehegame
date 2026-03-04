export interface OrderRequirement {
  itemId: string
  count: number
}

export interface OrderTemplate {
  id: string
  name: string
  requirements: OrderRequirement[]
  coinReward: number
  expReward: number
  timeLimit: number // seconds
}

export const ORDER_TEMPLATES: OrderTemplate[] = [
  {
    id: 'order_tea_basic',
    name: '茶馆日常',
    requirements: [{ itemId: 'tea_1', count: 2 }],
    coinReward: 20,
    expReward: 10,
    timeLimit: 3600,
  },
  {
    id: 'order_tea_mid',
    name: '碧螺春订单',
    requirements: [{ itemId: 'tea_4', count: 1 }],
    coinReward: 50,
    expReward: 25,
    timeLimit: 7200,
  },
  {
    id: 'order_pastry_basic',
    name: '点心铺',
    requirements: [{ itemId: 'pastry_1', count: 3 }],
    coinReward: 30,
    expReward: 15,
    timeLimit: 3600,
  },
  {
    id: 'order_pastry_mid',
    name: '糕点宴',
    requirements: [
      { itemId: 'pastry_3', count: 1 },
      { itemId: 'tea_2', count: 1 },
    ],
    coinReward: 80,
    expReward: 40,
    timeLimit: 7200,
  },
  {
    id: 'order_egg_basic',
    name: '鸡蛋供应',
    requirements: [{ itemId: 'poultry_1', count: 3 }],
    coinReward: 25,
    expReward: 12,
    timeLimit: 3600,
  },
  {
    id: 'order_egg_mid',
    name: '荷包蛋宴',
    requirements: [{ itemId: 'poultry_4', count: 1 }],
    coinReward: 60,
    expReward: 30,
    timeLimit: 7200,
  },
  {
    id: 'order_lantern_basic',
    name: '灯笼节',
    requirements: [{ itemId: 'lantern_1', count: 2 }],
    coinReward: 20,
    expReward: 10,
    timeLimit: 3600,
  },
  {
    id: 'order_multi_1',
    name: '茶点双绝',
    requirements: [
      { itemId: 'tea_3', count: 1 },
      { itemId: 'pastry_2', count: 2 },
    ],
    coinReward: 100,
    expReward: 50,
    timeLimit: 10800,
  },
  {
    id: 'order_jewelry_basic',
    name: '首饰铺',
    requirements: [{ itemId: 'jewelry_1', count: 2 }],
    coinReward: 20,
    expReward: 10,
    timeLimit: 3600,
  },
  {
    id: 'order_jewelry_mid',
    name: '翡翠宴',
    requirements: [{ itemId: 'jewelry_3', count: 1 }],
    coinReward: 70,
    expReward: 35,
    timeLimit: 7200,
  },
  {
    id: 'order_big_1',
    name: '茶楼豪宴',
    requirements: [
      { itemId: 'tea_5', count: 1 },
      { itemId: 'pastry_4', count: 1 },
      { itemId: 'poultry_5', count: 1 },
    ],
    coinReward: 250,
    expReward: 120,
    timeLimit: 21600,
  },
  {
    id: 'order_tool_basic',
    name: '铜板收集',
    requirements: [{ itemId: 'tool_1', count: 3 }],
    coinReward: 15,
    expReward: 8,
    timeLimit: 1800,
  },
]

// Pick random order templates (non-repeating)
export function pickRandomOrders(count: number, excludeIds: string[] = []): OrderTemplate[] {
  const available = ORDER_TEMPLATES.filter(t => !excludeIds.includes(t.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
