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
    ghostX: number;
    ghostY: number;
    itemDefId: string;
}

export function BoardGrid() {
    const cells = useBoardStore(state => state.cells);
    const spawnItem = useBoardStore(state => state.spawnItem);
    const moveItem = useBoardStore(state => state.moveItem);
    const mergeItems = useBoardStore(state => state.mergeItems);
    const spendStamina = useEconomyStore(state => state.spendStamina);
    
    const [dragState, setDragState] = useState<DragState | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent, row: number, col: number) => {
        const cell = cells[row][col];
        
        if (cell.item) {
            // Start dragging an item
            setDragState({
                isDragging: true,
                sourceRow: row,
                sourceCol: col,
                ghostX: e.clientX,
                ghostY: e.clientY,
                itemDefId: cell.item.definitionId,
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
        if (dragState?.isDragging) {
            setDragState(prev => prev ? {
                ...prev,
                ghostX: e.clientX,
                ghostY: e.clientY,
            } : null);
        }
    }, [dragState]);

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
                {cells.map((row, rowIdx) =>
                    row.map((cell) => (
                        <Cell
                            key={`${cell.row}-${cell.col}`}
                            cell={cell}
                            onPointerDown={handlePointerDown}
                            isDraggingFrom={dragState?.sourceRow === cell.row && dragState?.sourceCol === cell.col}
                        />
                    ))
                )}
            </div>
            
            {/* Drag ghost */}
            {dragState?.isDragging && (
                <div
                    style={{
                        position: 'fixed',
                        left: dragState.ghostX - CELL_SIZE / 2,
                        top: dragState.ghostY - CELL_SIZE / 2,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        pointerEvents: 'none',
                        opacity: 0.7,
                        zIndex: 1000,
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
