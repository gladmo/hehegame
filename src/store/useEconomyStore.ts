import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

interface EconomyState {
  coins: number
  energy: number
  maxEnergy: number
  gems: number
  level: number
  exp: number
  maxExp: number
  lastEnergyRefill: number  // timestamp when energy was last refilled
}

interface EconomyActions {
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  addEnergy: (amount: number) => void
  spendEnergy: (amount: number) => boolean
  addGems: (amount: number) => void
  addExp: (amount: number) => void
  tickEnergy: () => void  // call every 2 minutes to auto-restore energy
}

export const useEconomyStore = create<EconomyState & EconomyActions>()(
  persist(
    immer((set, get) => ({
    coins: 0,
    energy: 100,
    maxEnergy: 100,
    gems: 0,
    level: 0,
    exp: 0,
    maxExp: 200,
    lastEnergyRefill: Date.now(),

    addCoins: (amount) => {
      set(state => { state.coins += amount })
    },

    spendCoins: (amount) => {
      const { coins } = get()
      if (coins < amount) return false
      set(state => { state.coins -= amount })
      return true
    },

    addEnergy: (amount) => {
      set(state => { state.energy = Math.min(state.energy + amount, state.maxEnergy) })
    },

    spendEnergy: (amount) => {
      const { energy } = get()
      if (energy < amount) return false
      set(state => { state.energy -= amount })
      return true
    },

    addGems: (amount) => {
      set(state => { state.gems += amount })
    },

    addExp: (amount) => {
      set(state => {
        state.exp += amount
        while (state.exp >= state.maxExp) {
          state.exp -= state.maxExp
          state.level += 1
          state.maxExp = Math.floor(state.maxExp * 1.3)
          state.energy = state.maxEnergy // full energy on level up
        }
      })
    },

    tickEnergy: () => {
      const { energy, maxEnergy, lastEnergyRefill } = get()
      if (energy >= maxEnergy) return
      const now = Date.now()
      const minutesPassed = Math.floor((now - lastEnergyRefill) / (2 * 60 * 1000))
      if (minutesPassed <= 0) return
      set(state => {
        state.energy = Math.min(state.energy + minutesPassed, state.maxEnergy)
        state.lastEnergyRefill = now
      })
    },
  })),
  {
    name: 'hehegame-economy',
  }
))
