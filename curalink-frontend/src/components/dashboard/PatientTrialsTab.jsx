/* eslint-disable no-unused-vars */
export default function PatientTrialsTab({ 
  sharedTrials, 
  sharedPublications, 
  trialSearchQuery, 
  setTrialSearchQuery, 
  trialStatusFilter, 
  setTrialStatusFilter, 
  trialResults, 
  isSearchingTrials, 
  hasSearchedTrials, 
  savedTrialUrls, 
  handleSearchTrials, 
  handleSaveFavorite, 
  customSelectStyle,
  getStatusColor
}) {
  return (
    <div>
      {sharedTrials.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
              Results from your AI Research session
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#7c3aed',
              background: 'rgba(124, 58, 237, 0.1)',
              padding: '4px 10px',
              borderRadius: '999px'
            }}>
              {sharedTrials.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sharedTrials.map((trial, idx) => (
              <div key={`shared-trial-${idx}`} style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${getStatusColor(trial.status)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: trial.status === 'RECRUITING' ? '#d1fae5' : '#f1f5f9',
                      color: trial.status === 'RECRUITING' ? '#065f46' : '#64748b'
                    }}>
                      {trial.status || 'Unknown'}
                    </span>
                    {trial.phase && (
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: '#e0e7ff',
                        color: '#3730a3'
                      }}>
                        {trial.phase}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleSaveFavorite({ type: 'trial', title: trial.title, url: trial.url })}
                    disabled={savedTrialUrls.has(trial.url)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: savedTrialUrls.has(trial.url) ? '#10b981' : '#e2e8f0',
                      backgroundColor: savedTrialUrls.has(trial.url) ? '#d1fae5' : '#ffffff',
                      color: savedTrialUrls.has(trial.url) ? '#065f46' : '#64748b',
                      fontSize: '12px',
                      cursor: savedTrialUrls.has(trial.url) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {savedTrialUrls.has(trial.url) ? '⭐ Saved' : '⭐ Save'}
                  </button>
                </div>
                <a
                  href={trial.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1e293b',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  {trial.title}
                </a>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  {trial.locations && <span>📍 {trial.locations}</span>}
                  {trial.contact && <span> | 📞 {trial.contact}</span>}
                </div>
                {trial.startDate && (
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Start date: {trial.startDate}
                  </div>
                )}
                <a
                  href={trial.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '12px',
                    color: '#2563eb',
                    textDecoration: 'none',
                    marginTop: '8px',
                    display: 'inline-block'
                  }}
                >
                  View on ClinicalTrials.gov →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: '12px'
        }}>
          Search Clinical Trials
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Enter disease or condition (e.g. Parkinson's disease)"
            value={trialSearchQuery}
            onChange={(e) => setTrialSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchTrials()}
            style={{
              flex: 1,
              minWidth: 0,
              height: '40px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0 12px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSearchTrials}
            disabled={isSearchingTrials}
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: isSearchingTrials ? 'not-allowed' : 'pointer',
              opacity: isSearchingTrials ? 0.7 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 'unset'
            }}
          >
            {isSearchingTrials ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={trialStatusFilter}
            onChange={(e) => setTrialStatusFilter(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            <option value="all">All Status</option>
            <option value="RECRUITING">Recruiting</option>
            <option value="COMPLETED">Completed</option>
            <option value="ACTIVE_NOT_RECRUITING">Active Not Recruiting</option>
          </select>
        </div>
      </div>

      {isSearchingTrials ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '80px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ marginTop: '16px', color: '#64748b' }}>
            Searching ClinicalTrials.gov...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : hasSearchedTrials && trialResults.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          No trials found. Try a different search term.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trialResults.map((trial, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderLeft: `4px solid ${getStatusColor(trial.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: trial.status === 'RECRUITING' ? '#d1fae5' : '#f1f5f9',
                    color: trial.status === 'RECRUITING' ? '#065f46' : '#64748b'
                  }}>
                    {trial.status || 'Unknown'}
                  </span>
                  {trial.phase && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3'
                    }}>
                      {trial.phase}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleSaveFavorite({ type: 'trial', title: trial.title, url: trial.url })}
                  disabled={savedTrialUrls.has(trial.url)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: savedTrialUrls.has(trial.url) ? '#10b981' : '#e2e8f0',
                    backgroundColor: savedTrialUrls.has(trial.url) ? '#d1fae5' : '#ffffff',
                    color: savedTrialUrls.has(trial.url) ? '#065f46' : '#64748b',
                    fontSize: '12px',
                    cursor: savedTrialUrls.has(trial.url) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savedTrialUrls.has(trial.url) ? '⭐ Saved' : '⭐ Save'}
                </button>
              </div>
              <a
                href={trial.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1e293b',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '8px'
                }}
              >
                {trial.title}
              </a>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {trial.locations && <span>📍 {trial.locations}</span>}
                {trial.contact && <span> | 📞 {trial.contact}</span>}
              </div>
              {trial.startDate && (
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Start date: {trial.startDate}
                </div>
              )}
              <a
                href={trial.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '12px',
                  color: '#2563eb',
                  textDecoration: 'none',
                  marginTop: '8px',
                  display: 'inline-block'
                }}
              >
                View on ClinicalTrials.gov →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
