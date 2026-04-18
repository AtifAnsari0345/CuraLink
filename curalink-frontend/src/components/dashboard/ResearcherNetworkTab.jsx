const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
}

export default function ResearcherNetworkTab({
  networkTab,
  setNetworkTab,
  loadingResearchers,
  researchers,
  getInitials: passedGetInitials,
  handleSendConnectionRequest,
  loadingConnections,
  connections,
  loadingRequests,
  incomingRequests,
  outgoingRequests,
  handleRespondToRequest,
  isMobile
}) {
  const getInitialsFunc = passedGetInitials || getInitials

  const renderResearcherCard = (researcher) => {
    const firstName = researcher.profile?.firstName || ''
    const lastName = researcher.profile?.lastName || ''
    const fullName = firstName && lastName 
      ? `${firstName} ${lastName}` 
      : (researcher.username || 'Researcher')
    const email = researcher.email || ''
    const institution = researcher.profile?.institution || ''
    const researchInterests = researcher.profile?.researchInterests || []
    const specialties = researcher.profile?.specialties || []
    const bio = researcher.profile?.bio || ''

    return (
      <div
        key={researcher._id}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '18px',
          border: '1px solid #e8edf5',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700
          }}>
            {getInitialsFunc(fullName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '2px' }}>
              {fullName}
            </div>
            {email && (
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                {email}
              </div>
            )}
            {institution && (
              <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                {institution}
              </div>
            )}
          </div>
        </div>

        {specialties.slice(0, 1).map((s, i) => (
          <span key={`spec-${i}`} style={{
            alignSelf: 'flex-start',
            padding: '3px 8px',
            backgroundColor: '#f3f0ff',
            color: '#7c3aed',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 500
          }}>
            {s}
          </span>
        ))}

        {researchInterests.slice(0, 2).map((i, idx) => (
          <span key={`int-${idx}`} style={{
            alignSelf: 'flex-start',
            padding: '3px 8px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 500
          }}>
            {i}
          </span>
        ))}

        {bio && bio.length > 0 && (
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            {bio.substring(0, 80)}{bio.length > 80 ? '...' : ''}
          </div>
        )}
      </div>
    )
  }

  const renderDiscoverCard = (researcher) => (
    <div key={researcher._id} style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '18px',
      border: '1px solid #e8edf5',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {renderResearcherCard(researcher)}
      <div style={{ marginTop: '8px' }}>
        {researcher.connectionStatus === 'none' && (
          <button
            onClick={() => handleSendConnectionRequest(researcher._id)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '2px solid #7c3aed',
              backgroundColor: '#ffffff',
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Connect →
          </button>
        )}
        {researcher.connectionStatus === 'pending' && (
          <button
            disabled
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              backgroundColor: '#f1f5f9',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'not-allowed'
            }}
          >
            Pending
          </button>
        )}
        {researcher.connectionStatus === 'accepted' && (
          <button
            disabled
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '2px solid #10b981',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'not-allowed'
            }}
          >
            Connected ✓
          </button>
        )}
        {researcher.connectionStatus === 'declined' && (
          <button
            onClick={() => handleSendConnectionRequest(researcher._id)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '2px solid #7c3aed',
              backgroundColor: '#ffffff',
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Connect →
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto'
      }}>
        {['discover', 'connections', 'requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setNetworkTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: networkTab === tab ? '#7c3aed' : '#ffffff',
              color: networkTab === tab ? '#ffffff' : '#64748b',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab === 'discover' ? 'Discover' : tab === 'connections' ? 'Connections' : 'Requests'}
          </button>
        ))}
      </div>

      {networkTab === 'discover' && (
        <div>
          {loadingResearchers ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>Loading researchers...</div>
          ) : researchers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
              No researchers found
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {researchers.map((r) => renderDiscoverCard(r))}
            </div>
          )}
        </div>
      )}

      {networkTab === 'connections' && (
        <div>
          <div style={{ fontSize: '16px', color: '#1e293b', marginBottom: '16px' }}>
            Your Connections ({connections.length})
          </div>
          {loadingConnections ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>Loading connections...</div>
          ) : connections.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
              No connections yet. Discover researchers to connect with.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {connections.map((c) => (
                <div key={c._id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid #e8edf5'
                }}>
                  {renderResearcherCard(c)}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '8px'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      Connected ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {networkTab === 'requests' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px' }}>
              Incoming Requests
            </div>
            {loadingRequests ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : incomingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No incoming requests
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {incomingRequests.map((req) => {
                  const from = req.from || {}
                  const firstName = from.profile?.firstName || ''
                  const lastName = from.profile?.lastName || ''
                  const fullName = firstName && lastName 
                    ? `${firstName} ${lastName}` 
                    : (from.username || 'Researcher')
                  return (
                    <div key={req._id} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #e8edf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600
                        }}>
                          {getInitialsFunc(fullName)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                            {fullName}
                          </div>
                          {from.profile?.institution && (
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {from.profile.institution}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleRespondToRequest(req._id, 'accept')}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(req._id, 'decline')}
                          style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: '1px solid #dc2626',
                            backgroundColor: '#ffffff',
                            color: '#dc2626',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px' }}>
              Sent Requests
            </div>
            {loadingRequests ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : outgoingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No sent requests
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {outgoingRequests.map((req) => {
                  const to = req.to || {}
                  const firstName = to.profile?.firstName || ''
                  const lastName = to.profile?.lastName || ''
                  const fullName = firstName && lastName 
                    ? `${firstName} ${lastName}` 
                    : (to.username || 'Researcher')
                  return (
                    <div key={req._id} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid #e8edf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#7c3aed',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600
                        }}>
                          {getInitialsFunc(fullName)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                            {fullName}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#fef3c7',
                        color: '#92400e'
                      }}>
                        Pending
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
