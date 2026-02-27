import { memo } from 'react';
import { motion } from 'framer-motion';
import type { BoardCell } from '@/shared/types';
import { ITEM_MAP } from '@/data/items';
import { LAUNCHER_MAP } from '@/data/launchers';
import { CELL_SIZE } from '@/shared/constants';

interface CellProps {
    cell: BoardCell;
    onPointerDown: (e: React.PointerEvent, row: number, col: number) => void;
    isDraggingFrom: boolean;
    isDropTarget?: boolean;
}

export const Cell = memo(function Cell({ cell, onPointerDown, isDraggingFrom, isDropTarget = false }: CellProps) {
    const getCellStyle = () => {
        const baseStyle: React.CSSProperties = {
            width: CELL_SIZE,
            height: CELL_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
        };

        if (cell.type === 'locked') {
            return {
                ...baseStyle,
                background: 'rgba(0, 0, 0, 0.2)',
                cursor: 'not-allowed',
            };
        }

        if (cell.type === 'launcher') {
            return {
                ...baseStyle,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            };
        }

        if (isDraggingFrom) {
            return {
                ...baseStyle,
                background: 'rgba(255, 255, 255, 0.5)',
                opacity: 0.5,
            };
        }

        if (isDropTarget) {
            return {
                ...baseStyle,
                background: 'rgba(74, 222, 128, 0.3)',
                border: '2px solid #4ade80',
                boxShadow: '0 0 12px rgba(74, 222, 128, 0.6)',
            };
        }

        return {
            ...baseStyle,
            background: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
        };
    };

    const renderContent = () => {
        if (cell.item) {
            const itemDef = ITEM_MAP[cell.item.definitionId];
            return (
                <motion.div
                    key={cell.item.instanceId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <div>{itemDef?.emoji || '❓'}</div>
                    <div style={{ fontSize: '8px', marginTop: '-4px' }}>T{itemDef?.tier}</div>
                </motion.div>
            );
        }

        if (cell.type === 'launcher' && cell.launcherId) {
            const launcher = LAUNCHER_MAP[cell.launcherId];
            return launcher?.emoji || '🏭';
        }

        if (cell.type === 'locked') {
            return '🔒';
        }

        return null;
    };

    return (
        <div
            style={getCellStyle()}
            onPointerDown={(e) => onPointerDown(e, cell.row, cell.col)}
        >
            {renderContent()}
        </div>
    );
});
