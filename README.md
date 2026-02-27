# HeheGame - Quinn's Kitchen

A React-based merge-2 restaurant management game.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit http://localhost:3000 to play the game.

### Build
```bash
npm run build
```

### Deploy to GitHub Pages
The project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch. The site will be available at `https://gladmo.github.io/hehegame/`.

To manually trigger a deployment, go to the Actions tab on GitHub and run the "Deploy to GitHub Pages" workflow.

## How to Play

1. **Spawn Items**: Click on the launcher icons (🧺 🍵 📦) at the top of the board to spawn items. Each spawn costs stamina (❤️).

2. **Merge Items**: Drag two identical items together to merge them into a higher-tier item. For example:
   - 🍞 + 🍞 = 🥐
   - ☕ + ☕ = 🫘
   - 🥬 + 🥬 = 🥗

3. **Complete Orders**: Check the order panel on the right side. Click on the items in orders to deliver them from your board. Complete orders to earn:
   - 🪙 Coins - Used to unlock cells and buy upgrades
   - ⭐ XP - Gain levels to unlock new features

4. **Progression**: 
   - Level up by earning XP from completed orders
   - Unlock new item chains at higher levels (Pasta at Lv.5, Sushi at Lv.10)
   - Stamina regenerates automatically (1 point per 3 minutes, max 30)

## Architecture

### Tech Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand + Immer** - State management
- **Framer Motion** - Animations
- **Native Pointer Events** - Drag and drop

### Project Structure
```
src/
├── App.tsx              - Main app component
├── main.tsx             - Entry point
├── store/               - Zustand stores
│   ├── useBoardStore.ts    - Board state and game logic
│   ├── useEconomyStore.ts  - Coins, gems, stamina
│   ├── usePlayerStore.ts   - Level, XP, progression
│   └── useOrderStore.ts    - Order management
├── features/board/      - Board feature
│   ├── components/
│   │   ├── BoardGrid.tsx   - Main game board
│   │   ├── Cell.tsx        - Individual cell component
│   │   ├── HUD.tsx         - Top stats bar
│   │   └── OrderPanel.tsx  - Orders sidebar
│   └── types.ts         - Type definitions
├── data/                - Game data definitions
│   ├── items.ts         - Item chains and definitions
│   ├── launchers.ts     - Launcher definitions
│   ├── orders.ts        - Order templates
│   └── ...
└── shared/              - Shared utilities
    ├── constants.ts     - Game balance constants
    └── types.ts         - Shared type definitions
```

### State Management

The game uses Zustand with Immer middleware for immutable state updates:

- **useBoardStore**: Manages the 7×9 game board, item instances, merging logic
- **useEconomyStore**: Tracks currencies and stamina regeneration
- **usePlayerStore**: Handles leveling, XP, and unlocks
- **useOrderStore**: Generates and manages customer orders

### Game Mechanics

**Board System**:
- 7 rows × 9 columns grid
- Launchers spawn tier-1 items
- Items can be dragged to move or merge
- Some cells are locked and can be unlocked with coins

**Merging**:
- Two identical items merge into the next tier
- Each chain has 5 tiers
- Tier 5 items are the highest and cannot merge further

**Economy**:
- Coins: Primary currency, earned from orders
- Gems: Premium currency for special purchases
- Stamina: Required to spawn items, regenerates over time

**Orders**:
- Up to 4 active orders at once
- Easy/Medium/Hard difficulties based on player level
- Orders have time limits and give rewards upon completion

## Implementation Status

### ✅ Completed (Stage 1)
- Core board mechanics with drag-and-drop
- Item spawning and merging
- Order system with delivery
- Economy and progression systems
- Basic UI with HUD and order panel
- Framer Motion animations

### 🚧 Planned Features (Stages 2-5)
- Renovation system with restaurant decorations
- Story dialog system
- Battle Pass and loot boxes
- Collection/achievement system
- Tools (Scissors, Hourglass, Wildcard)
- Limited-time events and leaderboards
- Card collection mini-game

## License

ISC
