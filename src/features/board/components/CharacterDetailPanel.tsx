export function CharacterDetailPanel() {
    // Character activity data - matching activity_UI.jpg design
    // TODO: Connect to game state store when character activity system is implemented
    const characterActivities = [
        { avatar: '🦊', progress: '10/12', timeLabel: null },
        { avatar: '👧', progress: null, timeLabel: '2天20时' },
        { avatar: '🐻', progress: null, timeLabel: null },
        { avatar: '🎭', progress: null, timeLabel: '2天13时' },
    ];

    return (
        <div style={{
            width: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '12px 8px',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            alignSelf: 'flex-start',
        }}>
            {characterActivities.map((activity, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '12px 8px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        minHeight: '80px',
                    }}
                >
                    {/* Character avatar */}
                    <div style={{
                        fontSize: '40px',
                        marginBottom: '2px',
                    }}>
                        {activity.avatar}
                    </div>

                    {/* Progress indicator */}
                    {activity.progress && (
                        <div style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#333',
                            background: 'rgba(255, 200, 100, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                        }}>
                            {activity.progress}
                        </div>
                    )}

                    {/* Time label */}
                    {activity.timeLabel && (
                        <div style={{
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#666',
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                        }}>
                            {activity.timeLabel}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
