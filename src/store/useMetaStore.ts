import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ScreenType, ModalType } from '@/shared/types';

interface MetaStore {
    currentScreen: ScreenType;
    currentModal: ModalType;
    // Actions
    setScreen: (screen: ScreenType) => void;
    setModal: (modal: ModalType) => void;
}

export const useMetaStore = create<MetaStore>()(
    immer((set) => ({
        currentScreen: 'game',
        currentModal: null,

        setScreen: (screen) => {
            set((draft) => {
                draft.currentScreen = screen;
            });
        },

        setModal: (modal) => {
            set((draft) => {
                draft.currentModal = modal;
            });
        },
    }))
);
