export function BattlePassScreen() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            padding: '20px',
            overflow: 'auto',
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <h1 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>🎫</h1>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#333' }}>战斗通行证</h2>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>即将推出...</p>
            <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#999' }}>
                完成任务获得豪华奖励
            </p>
        </div>
    );
}
