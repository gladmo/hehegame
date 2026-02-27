export function LeftActivityPanel() {
    // Character order/activity data - matching activity_UI.jpg left-side panels
    // TODO: Connect to actual order/activity state
    const activities = [
        { 
            icon: '📖', 
            hasNotification: true,
            timeLabel: '2天13时',
            bgColor: 'rgba(255, 200, 150, 0.9)'
        },
        { 
            icon: '📦', 
            hasNotification: false,
            timeLabel: '2天20时',
            bgColor: 'rgba(200, 220, 180, 0.9)'
        },
    ];

    return (
        <div style={{
            position: 'absolute',
            left: '24px',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 10,
        }}>
            {activities.map((activity, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'relative',
                        width: '72px',
                        height: '72px',
                        background: activity.bgColor,
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '3px solid rgba(255, 255, 255, 0.8)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {/* Notification badge */}
                    {activity.hasNotification && (
                        <div style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '24px',
                            height: '24px',
                            background: '#ff4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}>
                            !
                        </div>
                    )}

                    {/* Icon */}
                    <div style={{ marginBottom: '2px' }}>
                        {activity.icon}
                    </div>

                    {/* Time Label */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-16px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#333',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        whiteSpace: 'nowrap',
                    }}>
                        {activity.timeLabel}
                    </div>
                </div>
            ))}
        </div>
    );
}
