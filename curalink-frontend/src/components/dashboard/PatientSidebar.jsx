export default function PatientSidebar({ activeTab, setActiveTab, handleLogout }) {
  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'ai-research', icon: '🧬', label: 'AI Research' },
    { id: 'trials', icon: '🧪', label: 'Clinical Trials' },
    { id: 'publications', icon: '📄', label: 'Publications' },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'forum', icon: '💬', label: 'Forum' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ]

  return (
    <div className="dashboard-sidebar" style={{
      width: '240px',
      minWidth: '240px',
      height: '100%',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CuraLink
        </div>
        <div style={{
          fontSize: '11px',
          color: '#64748b',
          marginTop: '2px'
        }}>
          Patient Dashboard
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 0'
      }}>
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '8px',
              margin: '2px 8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === item.id ? 600 : 500,
              transition: 'all 0.15s',
              backgroundColor: activeTab === item.id ? '#f3f0ff' : 'transparent',
              color: activeTab === item.id ? '#7c3aed' : '#64748b'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.backgroundColor = '#f8faff'
                e.currentTarget.style.color = '#374151'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#64748b'
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 'auto',
          margin: '16px',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #fecaca',
          color: '#dc2626',
          backgroundColor: '#fff5f5',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500
        }}
      >
        🚪 Logout
      </button>
    </div>
  )
}
