import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { useEconomyStore } from '@/store/useEconomyStore';
import { Cell } from './Cell';
import { CELL_SIZE, DROP_TARGET_COLOR, DRAG_THROTTLE_MS } from '@/shared/constants';
import { LAUNCHER_MAP } from '@/data/launchers';
import { ITEM_MAP } from '@/data/items';
import { throttle, canItemsMerge } from '@/shared/utils';

interface DragState {
    isDragging: boolean;
    sourceRow: number;
    sourceCol: number;
    itemDefId: string;
    targetRow: number | null;
    targetCol: number | null;
    canMerge: boolean;
    initialX: number;
    initialY: number;
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
                initialX: e.clientX,
                initialY: e.clientY,
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

    // Throttled state update for visual feedback
    const updateDragTarget = useMemo(() => throttle((
        targetRow: number | null,
        targetCol: number | null,
        canMerge: boolean
    ) => {
        setDragState(prev => prev ? {
            ...prev,
            targetRow,
            targetCol,
            canMerge,
        } : null);
    }, DRAG_THROTTLE_MS), []); // 60fps throttle

    // Cleanup throttled function on unmount
    useEffect(() => {
        return () => {
            updateDragTarget.cancel();
        };
    }, [updateDragTarget]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (dragState?.isDragging && boardRef.current) {
            // Update ghost position directly via ref for performance (no re-render)
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
                
                // Determine if merge is possible using utility function
                const canMerge = canItemsMerge(
                    targetCell.item?.definitionId,
                    sourceCell.item?.definitionId,
                    ITEM_MAP
                );

                // Only proceed if target cell or merge status changed
                if (targetRow === dragState.targetRow && 
                    targetCol === dragState.targetCol && 
                    canMerge === dragState.canMerge) {
                    return;
                }

                // Throttled state update
                updateDragTarget(targetRow, targetCol, canMerge);
            } else {
                // Dragging outside board - clear target only if needed
                if (dragState.targetRow !== null || dragState.targetCol !== null) {
                    updateDragTarget(null, null, false);
                }
            }
        }
    }, [dragState, cells, updateDragTarget]);

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

            // Try to merge if items can be merged (use utility function)
            if (canItemsMerge(targetCell.item?.definitionId, sourceCell.item?.definitionId, ITEM_MAP)) {
                mergeItems(dragState.sourceRow, dragState.sourceCol, targetRow, targetCol);
            } else if (!targetCell.item && targetCell.type === 'normal') {
                // Move to empty cell
                moveItem(dragState.sourceRow, dragState.sourceCol, targetRow, targetCol);
            }
        }

        setDragState(null);
    }, [dragState, cells, moveItem, mergeItems]);

    // Memoize board style to prevent recalculation on every render
    const boardStyle = useMemo(() => ({
        display: 'grid',
        gridTemplateRows: `repeat(${cells.length}, ${CELL_SIZE}px)`,
        gridTemplateColumns: `repeat(${cells[0]?.length || 0}, ${CELL_SIZE}px)`,
        gap: '2px',
        background: 'rgba(255, 255, 255, 0.3)',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }), [cells.length, cells[0]?.length]);

    return (
        <div style={{ position: 'relative', userSelect: 'none' }}>
            <div
                ref={boardRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragState(null)}
                style={boardStyle}
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
                        left: dragState.initialX - CELL_SIZE / 2,
                        top: dragState.initialY - CELL_SIZE / 2,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        pointerEvents: 'none',
                        opacity: 0.8,
                        zIndex: 1000,
                        transform: 'scale(1.1)',
                        filter: dragState.canMerge ? `drop-shadow(0 0 8px ${DROP_TARGET_COLOR})` : 'none',
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
