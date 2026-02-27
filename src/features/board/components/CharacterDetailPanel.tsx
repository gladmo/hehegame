export function CharacterDetailPanel() {
    // Mock character items data
    const characterItems = [
        { avatar: '🦊', multiplier: null, items: ['🎂', '🍊', '🍔'] },
        { avatar: '👧', multiplier: 2, items: ['🍪', '🍰'] },
        { avatar: '🐻', multiplier: null, items: [] },
        { avatar: '🎭', multiplier: 3, items: ['🍱', '🧁', '🍕'] },
    ];

    return (
        <div style={{
            width: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px 12px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            alignSelf: 'flex-start',
        }}>
            {characterItems.map((char, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 8px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Multiplier badge */}
                    {char.multiplier && (
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#ff4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}>
                            x{char.multiplier}
                        </div>
                    )}

                    {/* Character avatar */}
                    <div style={{
                        fontSize: '36px',
                        marginBottom: '4px',
                    }}>
                        {char.avatar}
                    </div>

                    {/* Items grid */}
                    {char.items.length > 0 && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '4px',
                            width: '100%',
                        }}>
                            {char.items.map((item, itemIdx) => (
                                <div
                                    key={itemIdx}
                                    style={{
                                        background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Item count badge if applicable */}
                    {char.items.length > 2 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '-8px',
                            right: '-8px',
                            background: '#333',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}>
                            x{char.items.length}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
