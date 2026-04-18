export default function ResearcherPublicationsTab({ 
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
  handleSaveFavorite
}) {
  return (
    <div>
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
          Search Publications
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Search for research papers..."
            value={pubSearchQuery}
            onChange={(e) => setPubSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchPubs()}
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
            onClick={handleSearchPubs}
            disabled={isSearchingPubs}
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: isSearchingPubs ? 'not-allowed' : 'pointer',
              opacity: isSearchingPubs ? 0.7 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 'unset'
            }}
          >
            {isSearchingPubs ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={pubSourceFilter}
            onChange={(e) => setPubSourceFilter(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            <option value="all">All Sources</option>
            <option value="PubMed">PubMed</option>
            <option value="OpenAlex">OpenAlex</option>
          </select>
          <select
            value={pubYearFilter}
            onChange={(e) => setPubYearFilter(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
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
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="year">Sort: Year (Most Recent)</option>
          </select>
        </div>
      </div>

      {isSearchingPubs ? (
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
            Searching publications...
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : hasSearchedPubs && pubResults.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          No publications found. Try a different search term.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pubResults.map((pub, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: pub.source === 'PubMed' ? '#fef2f2' : '#ecfdf5',
                    color: pub.source === 'PubMed' ? '#991b1b' : '#065f46'
                  }}>
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
                  disabled={savedPubUrls.has(pub.url)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: savedPubUrls.has(pub.url) ? '#10b981' : '#e2e8f0',
                    backgroundColor: savedPubUrls.has(pub.url) ? '#d1fae5' : '#ffffff',
                    color: savedPubUrls.has(pub.url) ? '#065f46' : '#64748b',
                    fontSize: '12px',
                    cursor: savedPubUrls.has(pub.url) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {savedPubUrls.has(pub.url) ? '⭐ Saved' : '⭐ Save'}
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
                  marginBottom: '6px'
                }}
              >
                {pub.title}
              </a>
              {pub.authors && (
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                  {pub.authors}
                </div>
              )}
              {pub.abstract && (
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  {pub.abstract.substring(0, 200)}{pub.abstract.length > 200 ? '...' : ''}
                </div>
              )}
              <a
                href={pub.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '12px',
                  color: '#7c3aed',
                  textDecoration: 'none',
                  marginTop: '8px',
                  display: 'inline-block'
                }}
              >
                Read full paper →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
