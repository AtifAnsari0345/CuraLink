import { useState } from 'react'

const getStatusColor = (status) => {
  switch (status) {
    case 'RECRUITING':
      return '#10b981'
    case 'COMPLETED':
      return '#64748b'
    case 'ACTIVE_NOT_RECRUITING':
      return '#2563eb'
    default:
      return '#64748b'
  }
}

export default function TrialsTab({
  sharedTrials,
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
  isMobile
}) {
  const [searchError, setSearchError] = useState(null)

  const filteredTrialResults = trialResults.filter((trial) => {
    if (trialStatusFilter !== 'all' && trial.status !== trialStatusFilter) return false
    return true
  })

  const showShared = sharedTrials && sharedTrials.length > 0
  const showSearchResults = hasSearchedTrials && filteredTrialResults.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#f8fafc',
          zIndex: 10,
          padding: '20px 0 16px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: '16px', width: '100%', maxWidth: '100%' }}>
          <div style={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
            <input
              type="text"
              placeholder="Enter disease or condition (e.g. Parkinson's disease)"
              value={trialSearchQuery}
              onChange={(e) => {
                setTrialSearchQuery(e.target.value)
                setSearchError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && trialSearchQuery.length >= 3) handleSearchTrials()
              }}
              style={{
                flex: 1,
                minWidth: 0,
                height: '52px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0 16px',
                fontSize: '15px',
                fontFamily: 'Inter',
                outline: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            />
            <button
              onClick={handleSearchTrials}
              disabled={isSearchingTrials || trialSearchQuery.length < 3}
              style={{
                height: '52px',
                padding: '0 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isSearchingTrials || trialSearchQuery.length < 3 ? 'not-allowed' : 'pointer',
                opacity: isSearchingTrials || trialSearchQuery.length < 3 ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                minWidth: 'unset'
              }}
              onMouseEnter={(e) => {
                if (isSearchingTrials || trialSearchQuery.length < 3) return
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.35)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none'
                e.target.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.25)'
              }}
            >
              {isSearchingTrials ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchError && <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{searchError}</div>}
          {trialSearchQuery.length > 0 && trialSearchQuery.length < 3 && (
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
              Please enter at least 3 characters to search
            </div>
          )}
        </div>

        {/* Dropdown */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={trialStatusFilter}
            onChange={(e) => setTrialStatusFilter(e.target.value)}
            style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              padding: '11px 14px',
              fontSize: '14px',
              fontFamily: 'Inter',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '36px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7c3aed'
              e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <option value="all">All Status</option>
            <option value="RECRUITING">Recruiting</option>
            <option value="COMPLETED">Completed</option>
            <option value="ACTIVE_NOT_RECRUITING">Active Not Recruiting</option>
          </select>
        </div>
      </div>

      {/* Rest of your component remains exactly the same */}
      {isSearchingTrials && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ marginTop: '16px', color: '#64748b' }}>Searching ClinicalTrials.gov...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {!isSearchingTrials && (
        <>
          {showShared && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>🧠 From AI Research Session</div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)', padding: '4px 10px', borderRadius: '999px' }}>{sharedTrials.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sharedTrials.map((trial, idx) => (
                  <TrialCard key={`shared-trial-${idx}`} trial={trial} savedTrialUrls={savedTrialUrls} handleSaveFavorite={handleSaveFavorite} />
                ))}
              </div>
            </div>
          )}

          {showSearchResults && (
            <div>
              {(showShared || showSearchResults) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: showShared ? '24px' : 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>🔍 Search Results</div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)', padding: '4px 10px', borderRadius: '999px' }}>{filteredTrialResults.length}</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTrialResults.map((trial, idx) => (
                  <TrialCard key={`search-trial-${idx}`} trial={trial} savedTrialUrls={savedTrialUrls} handleSaveFavorite={handleSaveFavorite} />
                ))}
              </div>
            </div>
          )}

          {!showShared && hasSearchedTrials && filteredTrialResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No trials found. Try a different search term.
            </div>
          )}
        </>
      )}
    </div>
  )
}

// TrialCard component remains unchanged
function TrialCard({ trial, savedTrialUrls, handleSaveFavorite }) {
  const isSaved = savedTrialUrls.has(trial.url)
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e8edf5',
        borderLeft: `4px solid ${getStatusColor(trial.status)}`,
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor:
                trial.status === 'RECRUITING' ? '#d1fae5' : '#f1f5f9',
              color: trial.status === 'RECRUITING' ? '#065f46' : '#64748b'
            }}
          >
            {trial.status || 'Unknown'}
          </span>
          {trial.phase && (
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#e0e7ff',
                color: '#3730a3'
              }}
            >
              {trial.phase}
            </span>
          )}
        </div>
        <button
          onClick={() => handleSaveFavorite({ type: 'trial', title: trial.title, url: trial.url })}
          disabled={isSaved}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: isSaved ? '#f59e0b' : '#64748b',
            fontSize: '14px',
            cursor: isSaved ? 'default' : 'pointer',
            whiteSpace: 'nowrap'
          }}
          title={isSaved ? 'Saved' : 'Save'}
        >
          {isSaved ? '★' : '☆'}
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
  )
}