import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { BoardState, BoardCell, ItemInstance, ToolType } from '@/shared/types';
import { BOARD_ROWS, BOARD_COLS } from '@/shared/constants';
import { ITEM_MAP } from '@/data/items';
import { useCollectionStore } from './useCollectionStore';

interface BoardStore extends BoardState {
    // Actions
    spawnItem: (launcherRow: number, launcherCol: number, itemDefId: string) => boolean;
    moveItem: (fromRow: number, fromCol: number, toRow: number, toCol: number) => boolean;
    mergeItems: (rowA: number, colA: number, rowB: number, colB: number) => boolean;
    clearCell: (row: number, col: number) => void;
    setActiveTool: (tool: ToolType | null) => void;
    unlockCell: (row: number, col: number) => boolean;
}

function initializeBoard(): BoardCell[][] {
    const cells: BoardCell[][] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
        cells[row] = [];
        for (let col = 0; col < BOARD_COLS; col++) {
            cells[row][col] = {
                row,
                col,
                type: 'normal',
                item: null,
                launcherId: null,
            };
        }
    }
    
    // Set up launcher cells at top
    cells[0][2].type = 'launcher';
    cells[0][2].launcherId = 'bread_basket';
    
    cells[0][4].type = 'launcher';
    cells[0][4].launcherId = 'coffee_machine';
    
    cells[0][6].type = 'launcher';
    cells[0][6].launcherId = 'veggie_crate';
    
    // Lock some cells for progression
    for (let row = 5; row < 7; row++) {
        for (let col = 6; col < 9; col++) {
            cells[row][col].type = 'locked';
            cells[row][col].unlockCost = { currency: 'coins', amount: 50 * (row + col) };
        }
    }
    
    return cells;
}

export const useBoardStore = create<BoardStore>()(
    immer((set, get) => ({
        rows: BOARD_ROWS,
        cols: BOARD_COLS,
        cells: initializeBoard(),
        activeTool: null,

        spawnItem: (launcherRow, launcherCol, itemDefId) => {
            const state = get();
            const launcherCell = state.cells[launcherRow]?.[launcherCol];
            
            if (!launcherCell || launcherCell.type !== 'launcher') {
                return false;
            }

            // Find adjacent empty cell
            const adjacentPositions = [
                [launcherRow + 1, launcherCol],
                [launcherRow, launcherCol + 1],
                [launcherRow, launcherCol - 1],
                [launcherRow - 1, launcherCol],
            ];

            for (const [r, c] of adjacentPositions) {
                if (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS) {
                    const cell = state.cells[r][c];
                    if (cell.type === 'normal' && !cell.item) {
                        set((draft) => {
                            draft.cells[r][c].item = {
                                instanceId: nanoid(),
                                definitionId: itemDefId,
                                createdAt: Date.now(),
                            };
                        });
                        
                        // Record in collection
                        useCollectionStore.getState().recordItemCreation(itemDefId);
                        
                        return true;
                    }
                }
            }
            
            return false;
        },

        moveItem: (fromRow, fromCol, toRow, toCol) => {
            const state = get();
            const fromCell = state.cells[fromRow]?.[fromCol];
            const toCell = state.cells[toRow]?.[toCol];

            if (!fromCell || !toCell || !fromCell.item) {
                return false;
            }

            if (toCell.type !== 'normal' || toCell.item) {
                return false;
            }

            set((draft) => {
                draft.cells[toRow][toCol].item = fromCell.item;
                draft.cells[fromRow][fromCol].item = null;
            });

            return true;
        },

        mergeItems: (rowA, colA, rowB, colB) => {
            const state = get();
            const cellA = state.cells[rowA]?.[colA];
            const cellB = state.cells[rowB]?.[colB];

            if (!cellA?.item || !cellB?.item) {
                return false;
            }

            const itemA = ITEM_MAP[cellA.item.definitionId];
            const itemB = ITEM_MAP[cellB.item.definitionId];

            // Check if items can merge (same definition and has mergesInto)
            if (itemA.id !== itemB.id || !itemA.mergesInto) {
                return false;
            }

            // Merge into cellA position
            set((draft) => {
                draft.cells[rowA][colA].item = {
                    instanceId: nanoid(),
                    definitionId: itemA.mergesInto!,
                    createdAt: Date.now(),
                };
                draft.cells[rowB][colB].item = null;
            });
            
            // Record the merged item in collection
            useCollectionStore.getState().recordItemCreation(itemA.mergesInto!);

            return true;
        },

        clearCell: (row, col) => {
            set((draft) => {
                draft.cells[row][col].item = null;
            });
        },

        setActiveTool: (tool) => {
            set((draft) => {
                draft.activeTool = tool;
            });
        },

        unlockCell: (row, col) => {
            const state = get();
            const cell = state.cells[row]?.[col];
            
            if (!cell || cell.type !== 'locked') {
                return false;
            }

            set((draft) => {
                draft.cells[row][col].type = 'normal';
                draft.cells[row][col].unlockCost = undefined;
            });

            return true;
        },
    }))
);
