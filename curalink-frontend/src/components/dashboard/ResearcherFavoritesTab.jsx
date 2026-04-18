export default function ResearcherFavoritesTab({ 
  favorites, 
  loadingFavTab, 
  timeAgo, 
  handleRemoveFavorite 
}) {
  return (
    <div>
      {loadingFavTab ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          Loading...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>
              📄 Publications ({favorites.filter(f => f.type === 'publication').length})
            </div>
            {favorites.filter(f => f.type === 'publication').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {favorites.filter(f => f.type === 'publication').map((fav, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#f3f0ff',
                          color: '#7c3aed'
                        }}>
                          📄 Publication
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {fav.createdAt ? timeAgo(fav.createdAt) : ''}
                        </span>
                      </div>
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1e293b',
                          textDecoration: 'none'
                        }}
                      >
                        {fav.title}
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '13px',
                          color: '#7c3aed',
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        View →
                      </a>
                      <button
                        onClick={() => handleRemoveFavorite(fav)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#fff5f5',
                          color: '#dc2626',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '13px'
              }}>
                No saved publications yet.
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>
              🧪 Trials ({favorites.filter(f => f.type === 'trial').length})
            </div>
            {favorites.filter(f => f.type === 'trial').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {favorites.filter(f => f.type === 'trial').map((fav, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#eff6ff',
                          color: '#2563eb'
                        }}>
                          🧪 Trial
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {fav.createdAt ? timeAgo(fav.createdAt) : ''}
                        </span>
                      </div>
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1e293b',
                          textDecoration: 'none'
                        }}
                      >
                        {fav.title}
                      </a>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '13px',
                          color: '#7c3aed',
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        View →
                      </a>
                      <button
                        onClick={() => handleRemoveFavorite(fav)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#fff5f5',
                          color: '#dc2626',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '13px'
              }}>
                No saved trials yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
