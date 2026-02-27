import { useState, useRef, useCallback } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { useEconomyStore } from '@/store/useEconomyStore';
import { Cell } from './Cell';
import { CELL_SIZE } from '@/shared/constants';
import { LAUNCHER_MAP } from '@/data/launchers';
import { ITEM_MAP } from '@/data/items';

interface DragState {
    isDragging: boolean;
    sourceRow: number;
    sourceCol: number;
    itemDefId: string;
    targetRow: number | null;
    targetCol: number | null;
    canMerge: boolean;
}

export function BoardGrid() {
    const cells = useBoardStore(state => state.cells);
    const spawnItem = useBoardStore(state => state.spawnItem);
    const moveItem = useBoardStore(state => state.moveItem);
    const mergeItems = useBoardStore(state => state.mergeItems);
    const spendStamina = useEconomyStore(state => state.spendStamina);
    
    const [dragState, setDragState] = useState<DragState | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent, row: number, col: number) => {
        const cell = cells[row][col];
        
        if (cell.item) {
            // Start dragging an item
            setDragState({
                isDragging: true,
                sourceRow: row,
                sourceCol: col,
                itemDefId: cell.item.definitionId,
                targetRow: null,
                targetCol: null,
                canMerge: false,
            });
            e.currentTarget.setPointerCapture(e.pointerId);
        } else if (cell.type === 'launcher' && cell.launcherId) {
            // Click launcher to spawn item
            const launcher = LAUNCHER_MAP[cell.launcherId];
            if (launcher && spendStamina(launcher.staminaCost)) {
                const itemId = launcher.produces[0]; // For now, spawn first item
                spawnItem(row, col, itemId);
            }
        }
    }, [cells, spawnItem, spendStamina]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (dragState?.isDragging && boardRef.current) {
            // Update ghost position directly via ref for performance
            if (ghostRef.current) {
                ghostRef.current.style.left = `${e.clientX - CELL_SIZE / 2}px`;
                ghostRef.current.style.top = `${e.clientY - CELL_SIZE / 2}px`;
            }

            // Calculate target cell for visual feedback
            const rect = boardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const targetCol = Math.floor(x / CELL_SIZE);
            const targetRow = Math.floor(y / CELL_SIZE);

            // Check if target is valid and update state only if changed
            if (targetRow >= 0 && targetRow < cells.length &&
                targetCol >= 0 && targetCol < cells[0].length) {
                
                const targetCell = cells[targetRow][targetCol];
                const sourceCell = cells[dragState.sourceRow][dragState.sourceCol];
                
                // Determine if merge is possible
                const canMerge = !!(
                    targetCell.item && 
                    sourceCell.item &&
                    targetCell.item.definitionId === sourceCell.item.definitionId &&
                    ITEM_MAP[targetCell.item.definitionId]?.mergesInto
                );

                // Only update state if target changed or canMerge status changed
                if (targetRow !== dragState.targetRow || 
                    targetCol !== dragState.targetCol || 
                    canMerge !== dragState.canMerge) {
                    setDragState(prev => prev ? {
                        ...prev,
                        targetRow,
                        targetCol,
                        canMerge,
                    } : null);
                }
            } else {
                // Dragging outside board - clear target
                if (dragState.targetRow !== null || dragState.targetCol !== null) {
                    setDragState(prev => prev ? {
                        ...prev,
                        targetRow: null,
                        targetCol: null,
                        canMerge: false,
                    } : null);
                }
            }
        }
    }, [dragState, cells]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!dragState?.isDragging || !boardRef.current) {
            setDragState(null);
            return;
        }

        // Calculate target cell from pointer position
        const rect = boardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const targetCol = Math.floor(x / CELL_SIZE);
        const targetRow = Math.floor(y / CELL_SIZE);

        if (targetRow >= 0 && targetRow < cells.length &&
            targetCol >= 0 && targetCol < cells[0].length) {
            
            const targetCell = cells[targetRow][targetCol];
            const sourceCell = cells[dragState.sourceRow][dragState.sourceCol];

            // Prevent dropping on the same cell
            if (targetRow === dragState.sourceRow && targetCol === dragState.sourceCol) {
                setDragState(null);
                return;
            }

            // Try to merge if target has same item
            if (targetCell.item && sourceCell.item &&
                targetCell.item.definitionId === sourceCell.item.definitionId) {
                mergeItems(dragState.sourceRow, dragState.sourceCol, targetRow, targetCol);
            } else if (!targetCell.item && targetCell.type === 'normal') {
                // Move to empty cell
                moveItem(dragState.sourceRow, dragState.sourceCol, targetRow, targetCol);
            }
        }

        setDragState(null);
    }, [dragState, cells, moveItem, mergeItems]);

    return (
        <div style={{ position: 'relative', userSelect: 'none' }}>
            <div
                ref={boardRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragState(null)}
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${cells.length}, ${CELL_SIZE}px)`,
                    gridTemplateColumns: `repeat(${cells[0]?.length || 0}, ${CELL_SIZE}px)`,
                    gap: '2px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '8px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
            >
                {cells.map((row) =>
                    row.map((cell) => {
                        const isTarget = dragState?.targetRow === cell.row && dragState?.targetCol === cell.col;
                        const canDrop = isTarget && (
                            dragState.canMerge || 
                            (!cell.item && cell.type === 'normal')
                        );
                        
                        return (
                            <Cell
                                key={`${cell.row}-${cell.col}`}
                                cell={cell}
                                onPointerDown={handlePointerDown}
                                isDraggingFrom={dragState?.sourceRow === cell.row && dragState?.sourceCol === cell.col}
                                isDropTarget={canDrop}
                            />
                        );
                    })
                )}
            </div>
            
            {/* Drag ghost */}
            {dragState?.isDragging && (
                <div
                    ref={ghostRef}
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        pointerEvents: 'none',
                        opacity: 0.8,
                        zIndex: 1000,
                        transform: 'scale(1.1)',
                        filter: dragState.canMerge ? 'drop-shadow(0 0 8px #4ade80)' : 'none',
                    }}
                >
                    <ItemSprite itemDefId={dragState.itemDefId} />
                </div>
            )}
        </div>
    );
}

function ItemSprite({ itemDefId }: { itemDefId: string }) {
    const item = ITEM_MAP[itemDefId];
    
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
        }}>
            {item?.emoji || '❓'}
        </div>
    );
}
