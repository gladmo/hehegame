## Plan: 浪漫餐厅风格二合小游戏全功能实现

> **注意**: 您选择了 Next.js + Vite，但 Next.js 自带构建系统（不支持 Vite）。由于本项目是纯客户端游戏，无需 SSR/路由，**建议使用 React + TypeScript + Vite**，这是最佳组合。Next.js 对游戏场景过重且无收益。

### TL;DR

使用 React 19 + TypeScript + Vite 构建一个完整的二合（Merge-2）餐厅经营游戏。采用 Zustand 管理复杂游戏状态，Framer Motion 处理动画，原生 Pointer Events 实现拖拽合成，内联 SVG 组件作为手绘风格图标。项目按功能切片（Feature-sliced）组织，将游戏逻辑与 UI 解耦为纯函数，确保可测试性。分 5 个阶段递进实现 4 层功能体系。

---

### Steps

#### 阶段 1: 项目脚手架 & 核心棋盘

**1.1** 使用 `npm create vite@latest hehegame -- --template react-ts` 初始化项目，安装依赖：`zustand`、`immer`、`framer-motion`、`nanoid`

**1.2** 创建项目目录结构：
```
src/
├── app/         (App.tsx, screens/, layouts/)
├── features/    (board/, orders/, economy/, renovation/, progression/, battlepass/, collection/, tools/, events/, lootbox/)
├── shared/      (components/, hooks/, utils/, constants.ts)
├── data/        (items.ts, orders.ts, renovations.ts, battlepass.ts, events.ts, story.ts)
├── store/       (useBoardStore.ts, usePlayerStore.ts, useEconomyStore.ts, useProgressionStore.ts, useMetaStore.ts)
├── assets/svg/  (items/, ui/, decorations/)
├── styles/      (tokens.css, global.css)
└── main.tsx
```

**1.3** 定义核心 TypeScript 类型系统：
- `ItemDefinition` — 物品定义（id, typeChain, tier, name, mergesInto, sellValue）
- `ItemInstance` — 棋盘上的物品实例（instanceId via nanoid, definitionId, createdAt）
- `BoardCell` — 格子（row, col, type: normal/locked/blocked/launcher, item, launcherId）
- `BoardState` — 棋盘（rows, cols, cells[][], activeTool）
- `LauncherDefinition` & `LauncherInstance` — 发射器定义与实例

**1.4** 实现 `useBoardStore`（Zustand + Immer）：
- 初始化 7×9 棋盘网格
- `spawnItem(launcherPos)` — 发射器产出物品到相邻空格
- `moveItem(from, to)` — 移动物品
- `mergeItems(cellA, cellB)` — 合成两个同级物品为高级物品
- `clearCell(pos)` — 清空格子

**1.5** 实现棋盘 UI 组件：
- `BoardGrid` — 渲染 7×9 格子
- `Cell` — 单个格子（React.memo 优化），显示物品 SVG 或发射器图标
- `ItemSprite` — 根据 itemId 查找 SVG 注册表渲染对应图标
- 拖拽系统：使用原生 `onPointerDown/Move/Up`，拖拽时创建绝对定位的幽灵元素跟随指针，`pointerup` 时通过坐标计算目标格子，执行合成/移动

**1.6** 创建初始 SVG 物品素材（手绘风格，strokeLinecap: round）：
- 甜点链（5 级）：🍞面包 → 🥐牛角包 → 🧁纸杯蛋糕 → 🎂蛋糕 → 🏆豪华蛋糕
- 饮料链（5 级）：☕咖啡豆 → 浓缩咖啡 → 拿铁 → 摩卡 → 特调咖啡
- 沙拉链（5 级）：🥬生菜 → 沙拉 → 凯撒沙拉 → 精品沙拉 → 主厨特制
- UI 图标：金币、钻石、体力心、星星、经验值

**1.7** 合成动画（Framer Motion）：
- 物品生成：`scale: 0 → 1` + 轻微旋转的弹簧动画
- 合成：两个源物品 `scale → 0` + `opacity → 0`，结果物品 `scale: 0 → 1.2 → 1` 弹跳出现
- 高亮有效放置目标：CSS `box-shadow` 脉冲动画

---

#### 阶段 2: 订单系统 & 经济循环

**2.1** 定义订单类型：
- `Order` — id, customerName, customerAvatar, requirements[{itemDefId, quantity}], fulfilled{}, rewards{coins, xp, gems?}, timeLimitMs, difficulty
- `OrderRequirement` — 单个物品需求

**2.2** 实现 `useOrderStore`：
- `generateOrder(difficulty)` — 根据当前等级和已解锁物品链生成随机订单
- `deliverItem(orderId, itemDefId)` — 向订单交付物品
- `completeOrder(orderId)` — 完成订单，触发奖励发放
- `expireOrder(orderId)` — 超时处理
- 同时显示 3-5 个活跃订单，完成后自动补充

**2.3** 订单面板 UI：
- 棋盘右侧或顶部显示订单卡片列表
- 每张订单卡片展示：客户头像、需求物品图标 + 数量、进度条、倒计时、奖励预览
- 拖拽物品到订单卡片上交付，或点击物品 → 点击订单交付

**2.4** 实现 `useEconomyStore`：
- 金币、钻石、体力值管理
- `spendStamina(amount)` — 发射器消耗体力
- `addCoins/addGems/addXp` — 奖励发放
- 体力恢复计时器：每 3 分钟恢复 1 点，上限 30 点
- 钻石购买体力：50 钻石 = 满体力

**2.5** 顶部 HUD 栏 UI：
- 始终显示：体力条（带恢复倒计时）、金币数、钻石数、等级 + 经验进度条
- 数值变化时使用 Framer Motion `useMotionValue` 做数字滚动动画
- 完成订单时金币图标从订单飞向 HUD 的金币计数器

---

#### 阶段 3: 装修系统 & 剧情推进

**3.1** 定义装修数据模型：
- `DecorationDefinition` — id, name, area, slot, cost, xpReward, variants[3 种风格], prerequisite
- `RenovationState` — areas{areaId: {unlocked, decorations{slot: {decorationId, variantIndex}}, completionPercent}}
- 初始区域：吧台区 → 室内用餐区 → 厨房 → 户外露台 → 花园（按等级解锁）

**3.2** 实现 `useProgressionStore`：
- 等级系统：每级所需 XP 递增（公式：`100 * level^1.5`）
- 升级解锁新发射器、新物品链、新装修区域
- 剧情章节追踪：`storyChapter` + `storyStep`

**3.3** 装修视图（RenovationScreen）：
- 展示当前区域的俯视/45度视角餐厅 SVG 场景
- 可交互的装饰点位（高亮脉冲提示可装修）
- 点击点位 → 弹出 3 种风格选择面板（每种显示 SVG 预览 + 花费）
- 选择后消耗金币，播放安装动画，刷新场景
- 区域完成度进度条，100% 解锁剧情对话

**3.4** 剧情对话系统（StoryDialogScreen — 模态覆盖层）：
- 以主角 Quinn 回家重振餐厅为主线，穿插纵火/家族秘密
- 对话数据定义在 `data/story.ts`：章节 → 步骤 → {speaker, avatar, text, choices?}
- 逐字显示文本 + 角色头像，支持选项分支
- 5 个章节：回归发现 → 初步修复 → 神秘线索 → 真相大白 → 盛大重开

**3.5** 装修 SVG 素材：
- 每个区域的基础场景 SVG（破损状态 + 修复状态）
- 各装饰点位的 3 种风格变体 SVG
- 约 5 个区域 × 6 个点位 × 3 个变体 = ~90 个装饰 SVG 组件

---

#### 阶段 4: 数值 & 元系统

**4.1** 道具系统（features/tools/）：
- 剪刀 ✂️ — 将高级物品拆分为 2 个低一级物品
- 沙漏 ⏳ — 重置订单倒计时 / 加速发射器冷却
- 万能牌 🃏 — 与任意物品合成，产出该物品的上一级
- 道具来源：商店购买、订单奖励、战斗通行证、宝箱
- 工具栏 UI 在棋盘下方，点击激活后下一次点击目标生效

**4.2** 通行证系统（features/battlepass/）：
- 赛季制：30 天一季，30 个等级
- 每个等级有免费奖励 + 高级奖励
- 通行证 XP 通过完成订单、合成里程碑、每日任务获取
- 奖励类型：金币、钻石、体力、道具、装饰品、宝箱
- Battle Pass 界面：横向滚动的奖励轨道 + 当前进度

**4.3** 宝箱系统（features/lootbox/）：
- 宝箱类型：铜/银/金，通过合成里程碑或任务获得
- 打开时旋转动画 + 依次揭示 3-5 个奖励
- 奖励池按稀有度分层：普通 60%、稀有 30%、史诗 8%、传说 2%

**4.4** 收集系统（features/collection/）：
- 爱心图鉴：记录所有已发现/合成的物品，显示合成链关系图
- 特色菜谱：完成特定订单解锁
- 收集里程碑：发现 10/25/50/全部物品获得奖励
- CollectionScreen：网格展示所有物品（已发现的彩色，未发现的灰色剪影）

**4.5** 商店系统（ShopScreen）：
- 金币包、钻石包（模拟付费，按钮 + 数量显示）
- 体力补充（广告模拟：点击按钮等待 3 秒获得 5 体力）
- 道具购买
- 通行证升级

---

#### 阶段 5: 社交 & 活动层

**5.1** 限时活动（features/events/）：
- 厨艺大赛：独立小棋盘，限时 3 分钟内合成尽可能多的高级物品，计分排名
- 节日装扮：特殊节日主题装饰限时可购买，专属订单
- 活动有开始/结束时间，UI 显示倒计时和活动详情
- EventScreen：活动列表 + 参与入口

**5.2** 排行榜：
- 本地模拟排行榜（生成 AI 玩家名 + 随机分数）
- 显示当前玩家排名 + 上下 5 名玩家
- 奖励按排名发放

**5.3** 卡包集齐活动：
- 每期推出 12 张收集卡（通过完成特定任务获得随机卡片）
- 重复卡可兑换碎片，碎片兑换缺失卡
- 集齐整套获得限定装饰品或大量奖励

---

### 关键架构决策

| 决策 | 选择 | 原因 |
|---|---|---|
| 构建工具 | **React + Vite**（非 Next.js） | 纯客户端游戏无需 SSR，Vite 更快更轻 |
| 状态管理 | **Zustand + Immer** | 低样板、支持跨 store 访问、游戏逻辑可脱离 React |
| 拖拽方案 | **原生 Pointer Events** | 比 react-dnd 更轻（-15KB），自动支持移动端触控 |
| 动画 | **Framer Motion** | 弹簧物理 + layoutId + AnimatePresence 完美匹配合成动画需求 |
| 路由 | **无路由（状态驱动切屏）** | 游戏屏幕不是网页，用 `currentScreen` 状态条件渲染即可 |
| SVG 策略 | **React 组件 + 注册表 Map** | 可 CSS 样式化 + 可动画 + 类型安全 |
| 存储 | **纯内存（后续可加 `zustand/persist`）** | 按需求暂不持久化 |

### 文件规模估算

| 模块 | 预估文件数 | 预估代码行 |
|---|---|---|
| 棋盘 & 合成核心 | ~15 | ~1500 |
| 订单系统 | ~8 | ~600 |
| 经济系统 | ~6 | ~400 |
| 装修系统 | ~12 | ~1000 |
| 剧情系统 | ~5 | ~500 |
| 通行证/宝箱/收集 | ~10 | ~800 |
| 道具系统 | ~5 | ~300 |
| 活动/排行/卡包 | ~10 | ~700 |
| SVG 素材组件 | ~100+ | ~3000 |
| 共享组件/工具 | ~10 | ~500 |
| 数据定义 | ~6 | ~800 |
| Store | ~5 | ~600 |
| **合计** | **~190+** | **~10,700+** |

---

### Verification

- **阶段 1 验收**: 打开浏览器可看到 7×9 棋盘，点击发射器产出物品，拖拽两个相同物品触发合成动画，产出高一级物品
- **阶段 2 验收**: 订单面板显示 NPC 需求，交付正确物品后获得金币，HUD 数值实时更新，体力消耗与恢复正常
- **阶段 3 验收**: 切换到装修视图可看到餐厅场景，选择装饰花费金币，完成区域触发剧情对话
- **阶段 4 验收**: 道具可正常使用，通行证轨道可领取奖励，宝箱开启动画，收集图鉴展示进度
- **阶段 5 验收**: 限时活动可参与并计分，排行榜显示排名，卡包可收集和兑换
- **全局测试**: `npx vitest` 运行 `features/*/logic/` 下的纯函数单元测试
