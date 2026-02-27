export function ItemDetailBar() {
    // Placeholder data matching activity_UI.jpg design
    // TODO: Connect to selected item from board state
    const selectedItem = {
        name: '日铸雪芽茶',
        level: 4,
        description: '合成相同棋子，进行升级。',
    };

    const handleDelete = () => {
        // TODO: Implement item deletion when board item selection is implemented
        console.log('Delete item:', selectedItem.name);
    };

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
        }}>
            {/* Left: Furniture/Building Icon */}
            <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(139, 69, 19, 0.8)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                flexShrink: 0,
            }}>
                🏠
            </div>

            {/* Middle: Item Info Panel */}
            <div style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
            }}>
                {/* Search Icon */}
                <div style={{
                    fontSize: '24px',
                    flexShrink: 0,
                }}>
                    🔍
                </div>

                {/* Item Details */}
                <div style={{ flex: 1 }}>
                    {/* Item Name with Level Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                    }}>
                        <span style={{
                            fontSize: '15px',
                            fontWeight: 'bold',
                            color: '#2e7d32',
                            background: 'rgba(76, 175, 80, 0.15)',
                            padding: '4px 12px',
                            borderRadius: '16px',
                        }}>
                            {selectedItem.name}(等级{selectedItem.level})
                        </span>
                    </div>
                    
                    {/* Description */}
                    <div style={{
                        fontSize: '13px',
                        color: '#555',
                    }}>
                        {selectedItem.description}
                    </div>
                </div>

                {/* Delete Button */}
                <button 
                onClick={handleDelete}
                style={{
                    width: '48px',
                    height: '48px',
                    background: '#ff6b6b',
                    border: 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ff5252'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ff6b6b'}
                title="删除"
                >
                    🗑️
                </button>
            </div>

            {/* Right: Building/Shop Icon */}
            <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(100, 200, 100, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                flexShrink: 0,
            }}>
                🏛️
            </div>
        </div>
    );
}
