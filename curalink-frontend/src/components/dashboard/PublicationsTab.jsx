import { useState } from 'react'

export default function PublicationsTab({
  sharedPublications,
  pubSearchQuery,
  setPubSearchQuery,
  pubSourceFilter,
  setPubSourceFilter,
  pubYearFilter,
  setPubYearFilter,
  pubSort,
  setPubSort,
  pubResults,
  isSearchingPubs,
  hasSearchedPubs,
  savedPubUrls,
  handleSearchPubs,
  handleSaveFavorite,
  handleClearPublications,
  isMobile
}) {
  const [searchError, setSearchError] = useState(null)

  const filteredPubResults = pubResults.filter((pub) => {
    if (pubSourceFilter !== 'all' && pub.source !== pubSourceFilter) return false
    if (pubYearFilter !== 'all') {
      if (!pub.year || String(pub.year) < pubYearFilter) return false
    }
    return true
  })

  const sortedPubResults = pubSort === 'year'
    ? [...filteredPubResults].sort((a, b) => (b.year || 0) - (a.year || 0))
    : filteredPubResults

  const showShared = sharedPublications && sharedPublications.length > 0
  const showSearchResults = hasSearchedPubs && sortedPubResults.length > 0

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
              placeholder="Search for research papers..."
              value={pubSearchQuery}
              onChange={(e) => {
                setPubSearchQuery(e.target.value)
                setSearchError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pubSearchQuery.length >= 3) handleSearchPubs()
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
              onClick={handleSearchPubs}
              disabled={isSearchingPubs || pubSearchQuery.length < 3}
              style={{
                height: '52px',
                padding: '0 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isSearchingPubs || pubSearchQuery.length < 3 ? 'not-allowed' : 'pointer',
                opacity: isSearchingPubs || pubSearchQuery.length < 3 ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                minWidth: 'unset'
              }}
              onMouseEnter={(e) => {
                if (isSearchingPubs || pubSearchQuery.length < 3) return
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.35)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'none'
                e.target.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.25)'
              }}
            >
              {isSearchingPubs ? 'Searching...' : 'Search'}
            </button>
            {(pubResults.length > 0 || hasSearchedPubs || pubSearchQuery) && (
              <button
                onClick={handleClearPublications}
                style={{
                  height: '52px',
                  padding: '0 20px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minWidth: 'unset'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#dc2626'
                  e.target.style.color = '#dc2626'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.color = '#64748b'
                  e.target.style.transform = 'none'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {searchError && <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{searchError}</div>}
          {pubSearchQuery.length > 0 && pubSearchQuery.length < 3 && (
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
              Please enter at least 3 characters to search
            </div>
          )}
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={pubSourceFilter}
            onChange={(e) => setPubSourceFilter(e.target.value)}
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
            onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
          >
            <option value="all">All Sources</option>
            <option value="PubMed">PubMed</option>
            <option value="OpenAlex">OpenAlex</option>
          </select>

          <select
            value={pubYearFilter}
            onChange={(e) => setPubYearFilter(e.target.value)}
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
            onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
          >
            <option value="all">All Years</option>
            <option value="2024">2024+</option>
            <option value="2023">2023+</option>
            <option value="2022">2022+</option>
            <option value="2021">2021+</option>
          </select>

          <select
            value={pubSort}
            onChange={(e) => setPubSort(e.target.value)}
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
            onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="year">Sort: Year (Most Recent)</option>
          </select>
        </div>
      </div>

      {isSearchingPubs && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '80px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#7c3aed',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          <div style={{ marginTop: '16px', color: '#64748b' }}>
            Searching publications...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {!isSearchingPubs && (
        <>
          {showShared && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                  🧠 From AI Research Session
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#7c3aed',
                    background: 'rgba(124, 58, 237, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '999px'
                  }}
                >
                  {sharedPublications.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sharedPublications.map((pub, idx) => (
                  <PublicationCard
                    key={`shared-pub-${idx}`}
                    pub={pub}
                    savedPubUrls={savedPubUrls}
                    handleSaveFavorite={handleSaveFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {showSearchResults && (
            <div>
              {(showShared || showSearchResults) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    marginTop: showShared ? '24px' : 0
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                    🔍 Search Results
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#7c3aed',
                      background: 'rgba(124, 58, 237, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '999px'
                    }}
                  >
                    {sortedPubResults.length}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sortedPubResults.map((pub, idx) => (
                  <PublicationCard
                    key={`search-pub-${idx}`}
                    pub={pub}
                    savedPubUrls={savedPubUrls}
                    handleSaveFavorite={handleSaveFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {!showShared && hasSearchedPubs && sortedPubResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No publications found. Try a different search term.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PublicationCard({ pub, savedPubUrls, handleSaveFavorite }) {
  const isSaved = savedPubUrls.has(pub.url)
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '18px',
        border: '1px solid #e8edf5',
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: pub.source === 'PubMed' ? '#fef2f2' : '#ecfdf5',
              color: pub.source === 'PubMed' ? '#991b1b' : '#065f46'
            }}
          >
            {pub.source}
          </span>
          {pub.year && (
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {pub.year}
            </span>
          )}
        </div>
        <button
          onClick={() => handleSaveFavorite({ type: 'publication', title: pub.title, url: pub.url })}
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
        href={pub.url}
        target="_blank"
        rel="noreferrer"
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1e293b',
          textDecoration: 'none',
          display: 'block',
          marginBottom: '8px',
          lineHeight: '1.4'
        }}
      >
        {pub.title}
      </a>
      {pub.authors && (
        <div
          style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {pub.authors}
        </div>
      )}
      {pub.abstract && (
        <div
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {(pub.abstract || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
        </div>
      )}
      <a
        href={pub.url}
        target="_blank"
        rel="noreferrer"
        style={{
          fontSize: '12px',
          color: '#2563eb',
          textDecoration: 'none',
          marginTop: '10px',
          display: 'inline-block',
          fontWeight: 500
        }}
      >
        Read full paper →
      </a>
    </div>
  )
}