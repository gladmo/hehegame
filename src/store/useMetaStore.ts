import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type Screen = 'game' | 'collection' | 'story'
export type Modal = 'story_dialog' | 'character_detail' | null

interface MetaState {
  currentScreen: Screen
  currentModal: Modal
}

interface MetaActions {
  setScreen: (screen: Screen) => void
  setModal: (modal: Modal) => void
}

export const useMetaStore = create<MetaState & MetaActions>()(
  immer((set) => ({
    currentScreen: 'game',
    currentModal: null,

    setScreen: (screen) => {
      set(state => { state.currentScreen = screen })
    },

    setModal: (modal) => {
      set(state => { state.currentModal = modal })
    },
  }))
)
