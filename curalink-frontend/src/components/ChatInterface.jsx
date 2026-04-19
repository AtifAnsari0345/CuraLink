/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import chatThemeStyles from '../App.css?raw'
import curalinkLogo from '../assets/Curalink logo.jpg'

const SUGGESTIONS = [
  { label: 'Latest treatment for lung cancer', disease: 'lung cancer', query: 'Latest treatment for lung cancer' },
  { label: 'Clinical trials for diabetes', disease: 'diabetes', query: 'Clinical trials for diabetes' },
  { label: 'Top researchers in Alzheimer\u2019s disease', disease: 'Alzheimer\'s disease', query: 'Top researchers in Alzheimer\u2019s disease' },
  { label: 'Recent studies on heart disease', disease: 'heart disease', query: 'Recent studies on heart disease' },
]

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `## Welcome to Curalink

I'm your AI-powered medical research assistant. I search across:
- **PubMed** — peer-reviewed medical publications
- **OpenAlex** — global research database  
- **ClinicalTrials.gov** — active and completed trials

**To get started:**
1. Enter a **condition or disease** in the sidebar
2. Ask me anything about treatments, research, or trials
3. Click the Research Results tab to see all sources

*I retrieve 100+ research papers and rank the best ones for you.*`,
  timestamp: new Date()
}

function StatusBadge({ status }) {
  const s = (status || '').toUpperCase()
  let cls = 'status-badge status-other', label = status || 'Unknown'
  if (s.includes('RECRUITING') && !s.includes('NOT')) { cls = 'status-badge status-recruiting'; label = '🟢 Recruiting' }
  else if (s.includes('COMPLETED')) { cls = 'status-badge status-completed'; label = '✓ Completed' }
  else if (s.includes('ACTIVE')) { cls = 'status-badge status-active'; label = '🔵 Active' }
  return <span className={cls}>{label}</span>
}

function PublicationCard({ pub }) {
  const badgeClass = pub.source === 'PubMed' ? 'source-badge badge-pubmed' : 'source-badge badge-openalex'
  return (
    <div className="result-card">
      <div className="card-header">
        <span className={badgeClass}>{pub.source?.toUpperCase()}</span>
        <span className="card-meta">{pub.year}</span>
      </div>
      <div className="card-title">
        <a href={pub.url} target="_blank" rel="noreferrer">{pub.title}</a>
      </div>
      <div className="card-meta">👥 {pub.authors}</div>
      <div className="card-abstract">{pub.abstract}</div>
      <a href={pub.url} target="_blank" rel="noreferrer" className="card-link">
        Read full paper →
      </a>
    </div>
  )
}

function TrialCard({ trial }) {
  const statusClass =
    (trial.status || '').toUpperCase().includes('RECRUITING') && !trial.status?.toUpperCase().includes('NOT')
      ? 'trial-card-recruiting'
      : (trial.status || '').toUpperCase().includes('COMPLETED')
        ? 'trial-card-completed'
        : 'trial-card-active'

  return (
    <div className={`result-card ${statusClass}`}>
      <div className="card-header">
        <span className="source-badge badge-trial">CLINICAL TRIAL</span>
        <StatusBadge status={trial.status} />
      </div>
      <div className="card-title">
        <a href={trial.url} target="_blank" rel="noreferrer">{trial.title}</a>
      </div>
      <div className="card-meta">Phase: {trial.phase} • Started: {trial.startDate}</div>
      {trial.locations && trial.locations !== 'Location not specified' && (
        <div className="card-location">📍 {trial.locations}</div>
      )}
      {trial.contact && trial.contact !== 'Contact not available' && (
        <div className="card-contact">📞 {trial.contact}</div>
      )}
      <a href={trial.url} target="_blank" rel="noreferrer" className="card-link">
        View trial details →
      </a>
    </div>
  )
}

export default function ChatInterface({
  embedded = false,
  defaultDisease = '',
  defaultPatientName = '',
  onResultsUpdate,
  persistedMessages,
  onMessagesChange,
  persistedSessionId,
  onSessionIdChange
}) {
  const [messages, setMessages] = useState(
    persistedMessages && persistedMessages.length > 0
      ? persistedMessages
      : [WELCOME_MESSAGE]
  )
  const [inputValue, setInputValue] = useState('')
  const [disease, setDisease] = useState(defaultDisease)
  const [patientName, setPatientName] = useState(defaultPatientName)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(persistedSessionId || null)
  const [activeTab, setActiveTab] = useState('chat')
  const [publications, setPublications] = useState([])
  const [clinicalTrials, setClinicalTrials] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [stats, setStats] = useState(null)
  const [modelUsed, setModelUsed] = useState(null)
  const [savedItems, setSavedItems] = useState(new Set())
  const [isTopPanelCollapsed, setIsTopPanelCollapsed] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || 'https://curalink-9la1.onrender.com'

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages)
    }
  }, [messages, onMessagesChange])

  useEffect(() => {
    if (onSessionIdChange) {
      onSessionIdChange(sessionId)
    }
  }, [sessionId, onSessionIdChange])

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('curalink_user')
      if (stored) {
        const u = JSON.parse(stored)
        if (u.profile?.conditions?.length > 0 && !disease) {
          setDisease(u.profile.conditions[0])
        }
        if (u.profile?.firstName && !patientName) {
          setPatientName(u.profile.firstName + ' ' + (u.profile.lastName || ''))
        }
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    const styleId = 'curalink-chat-theme'
    let styleEl = document.getElementById(styleId)

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = chatThemeStyles
      document.head.appendChild(styleEl)
    }

    return () => {
      const mountedChatRoots = document.querySelectorAll('.chat-container')
      if (mountedChatRoots.length <= 1) {
        styleEl?.remove()
      }
    }
  }, [])

  const saveFavorite = async (item, type) => {
    const token = localStorage.getItem('curalink_token')
    if (!token) {
      alert('Login to save favorites')
      return
    }
    try {
      await axios.post(`${API_BASE}/api/users/favorites`, {
        type,
        title: item.title,
        url: item.url
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSavedItems(prev => new Set([...prev, item.url]))
    } catch (err) {
      console.error('Save favorite error:', err)
    }
  }

  const getNavLink = () => {
    const token = localStorage.getItem('curalink_token')
    const userStr = localStorage.getItem('curalink_user')
    if (token && userStr) {
      const user = JSON.parse(userStr)
      return user.role === 'patient' ? '/patient' : '/researcher'
    }
    return '/login'
  }

  const navLinkLabel = () => {
    const token = localStorage.getItem('curalink_token')
    const userStr = localStorage.getItem('curalink_user')
    if (token && userStr) {
      return '← Dashboard'
    }
    return 'Login'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = useCallback(async (overrideMessage) => {
    const messageToSend = (overrideMessage || inputValue).trim()
    if (!messageToSend || isLoading) return

    const userMsg = { role: 'user', content: messageToSend, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        sessionId,
        userMessage: messageToSend,
        disease,
        patientName
      })

      const data = res.data

      setSessionId(data.sessionId)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }])

      if (data.publications?.length > 0) {
        setPublications(data.publications)
      }
      if (data.clinicalTrials?.length > 0) {
        setClinicalTrials(data.clinicalTrials)
      }
      if (data.publications?.length > 0 || data.clinicalTrials?.length > 0) {
        setLastUpdated(new Date().toLocaleTimeString())
        setStats(data.stats)
        if (onResultsUpdate) {
          onResultsUpdate({
            publications: data.publications || [],
            clinicalTrials: data.clinicalTrials || []
          })
        }
      }
      if (data.model) setModelUsed(data.model)

    } catch (err) {
      console.error('Chat error:', err)
      const errMsg = err.response?.data?.error || 'Connection error. Is the backend running on port 5000?'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Error:** ${errMsg}\n\nPlease ensure the backend server is running:\n\`\`\`\ncd curalink-backend && npm run dev\n\`\`\``,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, sessionId, disease, patientName, API_BASE])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestion = (suggestion) => {
    if (!disease && suggestion.disease) setDisease(suggestion.disease)
    setInputValue(suggestion.query)
    textareaRef.current?.focus()
  }

  // FIX: Strip residual HTML tags (e.g. <i>) that come through in LLM source text
  const stripHtml = (str) => {
    if (typeof str !== 'string') return str
    return str.replace(/<[^>]*>/g, '')
  }

  // Recursively clean React children of any string nodes containing HTML tags
  const cleanChildren = (children) => {
    if (typeof children === 'string') return stripHtml(children)
    if (Array.isArray(children)) return children.map(cleanChildren)
    return children
  }

  const markdownComponents = {
    h2: ({ ...props }) => (
      <h2 style={{
        fontSize: '16px',
        fontWeight: 700,
        margin: '14px 0 8px',
        background: '#f3f0ff',
        borderLeft: '3px solid #7c3aed',
        color: '#7c3aed',
        padding: '8px 12px',
        borderRadius: '6px'
      }} {...props} />
    ),
    ul: ({ ...props }) => (
      <ul style={{ margin: '8px 0', paddingLeft: 0, listStyle: 'none' }} {...props} />
    ),
    li: ({ children, ...props }) => (
      <li style={{
        marginBottom: '6px',
        borderLeft: '2px solid #7c3aed',
        padding: '8px 12px',
        background: '#f8faff',
        borderRadius: '6px',
        color: '#374151'
      }} {...props}>{cleanChildren(children)}</li>
    ),
    p: ({ children, ...props }) => (
      <p style={{ margin: '8px 0', color: '#374151', lineHeight: '1.6' }} {...props}>
        {cleanChildren(children)}
      </p>
    ),
    hr: ({ ...props }) => (
      <hr style={{
        border: 'none',
        height: '1px',
        background: '#e8edf5',
        margin: '16px 0'
      }} {...props} />
    ),
    blockquote: ({ ...props }) => (
      <blockquote style={{
        borderLeft: '2px solid #7c3aed',
        padding: '8px 12px',
        background: '#f8faff',
        borderRadius: '6px',
        margin: '8px 0',
        color: '#374151'
      }} {...props} />
    ),
    strong: ({ ...props }) => (
      <strong style={{
        color: '#1e293b',
        fontWeight: 600
      }} {...props} />
    ),
    a: ({ ...props }) => (
      <a target="_blank" rel="noreferrer" style={{
        color: '#7c3aed',
        textDecoration: 'none',
        borderBottom: '1px dashed rgba(124, 58, 237, 0.3)'
      }} {...props} />
    )
  }

  const handleNavLinkMouseEnter = (e) => { e.target.style.textDecoration = 'underline' }
  const handleNavLinkMouseLeave = (e) => { e.target.style.textDecoration = 'none' }

  // FIX: Light-theme suggestion chip styles to match the patient dashboard design
  const embeddedChipBase = {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1.5px solid #e2d9f3',
    backgroundColor: '#ffffff',
    color: '#6d28d9',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(124,58,237,0.08)',
    whiteSpace: 'nowrap',
  }

  const onChipEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#f3f0ff'
    e.currentTarget.style.borderColor = '#7c3aed'
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(124,58,237,0.18)'
  }

  const onChipLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#ffffff'
    e.currentTarget.style.borderColor = '#e2d9f3'
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(124,58,237,0.08)'
  }

  return (
    <div className="chat-container">
      {/* ========== MAIN PANEL ========== */}
      <div className="main-panel" style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Top Nav */}
        <div className="top-nav">
          <div className="nav-tabs">
            <button className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              💬 Chat
            </button>
            {!embedded && (
              <button className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
                📚 Research Results
                {(publications.length + clinicalTrials.length) > 0 && (
                  <span className="nav-tab-badge">{publications.length + clinicalTrials.length}</span>
                )}
              </button>
            )}
          </div>
          <div className="nav-right" style={{ gap: '16px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setIsTopPanelCollapsed(!isTopPanelCollapsed)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#7c3aed',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f0ff'
                e.target.style.borderColor = '#7c3aed'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.borderColor = '#e2e8f0'
              }}
            >
              {isTopPanelCollapsed ? 'Show' : 'Hide'}
            </button>
            <a
              href={getNavLink()}
              style={{
                textDecoration: 'none',
                cursor: 'pointer',
                ...(embedded ? {
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.2s'
                } : {
                  color: '#94a3b8',
                  fontSize: '13px'
                })
              }}
              onMouseEnter={(e) => {
                if (embedded) {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.18)'
                } else {
                  handleNavLinkMouseEnter(e)
                }
              }}
              onMouseLeave={(e) => {
                if (embedded) {
                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.1)'
                } else {
                  handleNavLinkMouseLeave(e)
                }
              }}
            >
              {navLinkLabel()}
            </a>
            <span className="live-dot" />
            <span>Live Research Pipeline</span>
          </div>
        </div>

        {/* Stats Bar */}
        {!isTopPanelCollapsed && stats && (
          <div className="stats-bar">
            <div className="stat-chip">📄 <span className="val">{stats.publicationsFound}</span> publications</div>
            <div className="stat-chip">🧪 <span className="val">{stats.trialsFound}</span> trials</div>
            <div className="stat-chip">⚡ <span className="val">{stats.responseTimeMs}ms</span> response</div>
            {lastUpdated && <div className="stat-chip">🕐 Updated: <span className="val">{lastUpdated}</span></div>}
          </div>
        )}

        {/* ========== CHAT TAB ========== */}
        {activeTab === 'chat' && (
          <div className="chat-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* FIX: Embedded Quick Start chips — white/light theme matching the dashboard + prominent disease input! */}
            {!isTopPanelCollapsed && embedded && (
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e8edf5',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{
                    fontWeight: 700,
                    color: '#dc2626',
                    marginBottom: '8px',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ⚠️ REQUIRED: Condition / Disease
                  </div>
                  <input 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '2px solid #fecaca',
                      backgroundColor: '#fef2f2',
                      color: '#4338ca',
                      fontSize: '15px',
                      fontWeight: 500,
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    value={disease}
                    onChange={e => setDisease(e.target.value)}
                    placeholder="e.g. lung cancer, diabetes, Alzheimer's disease"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7c3aed'
                      e.target.style.backgroundColor = '#ffffff'
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.style.borderColor = '#fecaca'
                        e.target.style.backgroundColor = '#fef2f2'
                      } else {
                        e.target.style.borderColor = '#d1c4e9'
                        e.target.style.backgroundColor = '#ffffff'
                      }
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                    Enter a disease first for accurate, personalized research results!
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <div style={{
                    fontWeight: 600,
                    color: '#4338ca',
                    marginBottom: '12px',
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%'
                  }}>
                    💡 QUICK START
                  </div>
                    
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px' 
                  }}>
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(s)}
                        title={s.query}
                        style={{
                          ...embeddedChipBase,
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                        onMouseEnter={onChipEnter}
                        onMouseLeave={onChipLeave}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="messages-container" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.role}`}>
                  <div className="message-group">
                    <div className="bubble-row">
                      <div className={`msg-avatar ${msg.role === 'assistant' ? 'ai' : 'user-av'}`}>
                        {msg.role === 'assistant' ? <img src={curalinkLogo} alt="AI" /> : '👤'}
                      </div>
                      <div className="msg-bubble">
                        {msg.role === 'assistant'
                          ? <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                          : msg.content
                        }
                      </div>
                    </div>
                    {msg.timestamp && (
                      <div className="msg-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row assistant">
                  <div className="message-group">
                    <div className="loading-row">
                      <div className="msg-avatar ai">
                        <img src={curalinkLogo} alt="AI" />
                      </div>
                      <div className="loading-bubble">
                        <span className="loading-label">🔬 Searching research databases...</span>
                        <div className="dot-loader">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area" style={{ flexShrink: 0, padding: '12px 16px 24px' }}>
              <div className="input-card">
                <div className="input-top-row">
                  <textarea
                    ref={textareaRef}
                    className="chat-input"
                    value={inputValue}
                    onChange={e => {
                      setInputValue(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={disease ? `Ask about treatments, trials, research...` : 'Set a condition in the sidebar, then ask your question...'}
                    rows={1}
                    disabled={isLoading}
                  />
                  <button className="send-btn" onClick={() => sendMessage()} disabled={isLoading || !inputValue.trim()}>
                    {isLoading ? '⏳' : '➤'}
                  </button>
                </div>
                <div className="input-footer-row">
                  <span className="input-hint">Enter to send  •  Shift+Enter for new line</span>
                  <span className="char-count">{inputValue.length}/2000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== RESULTS TAB (only when not embedded) ========== */}
        {!embedded && activeTab === 'results' && (
          <div className="results-panel" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="results-grid">

              {/* Publications Column */}
              <div className="results-column">
                <div className="results-column-header">
                  <div className="results-column-title">
                    <span>📄</span> Publications
                  </div>
                  <span className="results-count-badge">{publications.length}</span>
                </div>
                <div className="results-column-scroll">
                  {publications.length === 0 ? (
                    <div className="results-empty">
                      <div className="results-empty-icon">🔍</div>
                      <div className="results-empty-title">No publications yet</div>
                      <div className="results-empty-sub">Ask a research question in the chat to retrieve papers from PubMed and OpenAlex</div>
                    </div>
                  ) : (
                    publications.map((pub, idx) => {
                      const cleanAbstract = (pub.abstract || '')
                        .replace(/<[^>]*>/g, '')
                        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
                        .replace(/\s+/g, ' ').trim()
                      return (
                        <div key={idx} className="pub-card" style={{ position: 'relative' }}>
                          <div className="pub-card-header">
                            <span className={`pub-source-badge ${pub.source === 'PubMed' ? 'badge-pubmed' : 'badge-openalex'}`}>{pub.source}</span>
                            <span className="pub-year">{pub.year}</span>
                          </div>
                          <button
                            onClick={() => saveFavorite(pub, 'publication')}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              border: 'none',
                              background: savedItems.has(pub.url) ? '#10b981' : 'white',
                              color: savedItems.has(pub.url) ? 'white' : '#7c3aed',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: savedItems.has(pub.url) ? 'default' : 'pointer'
                            }}
                            disabled={savedItems.has(pub.url)}
                          >
                            {savedItems.has(pub.url) ? '⭐ Saved' : '⭐ Save'}
                          </button>
                          <div className="pub-card-body">
                            <div className="pub-title"><a href={pub.url} target="_blank" rel="noreferrer">{pub.title}</a></div>
                            <div className="pub-authors">👥 {pub.authors}</div>
                            {cleanAbstract && <div className="pub-abstract">{cleanAbstract}</div>}
                            <a href={pub.url} target="_blank" rel="noreferrer" className="pub-read-link">Read full paper →</a>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Trials Column */}
              <div className="results-column">
                <div className="results-column-header">
                  <div className="results-column-title">
                    <span>🧪</span> Clinical Trials
                  </div>
                  <span className="results-count-badge">{clinicalTrials.length}</span>
                </div>
                <div className="results-column-scroll">
                  {clinicalTrials.length === 0 ? (
                    <div className="results-empty">
                      <div className="results-empty-icon">🧬</div>
                      <div className="results-empty-title">No trials found</div>
                      <div className="results-empty-sub">Ask about a specific disease to retrieve trials from ClinicalTrials.gov</div>
                    </div>
                  ) : (
                    clinicalTrials.map((trial, idx) => {
                      const s = (trial.status || '').toUpperCase()
                      const isRec = s.includes('RECRUITING') && !s.includes('NOT')
                      const isComp = s.includes('COMPLETED')
                      const isAct = s.includes('ACTIVE')
                      const cardCls = isRec ? 'recruiting' : isComp ? 'completed' : isAct ? 'active-not-recruiting' : ''
                      const pillCls = isRec ? 'status-pill-recruiting' : isComp ? 'status-pill-completed' : isAct ? 'status-pill-active' : 'status-pill-unknown'
                      const pillIcon = isRec ? '🟢' : isComp ? '✓' : isAct ? '🔵' : '⚪'
                      const pillLabel = isRec ? 'Recruiting' : isComp ? 'Completed' : isAct ? 'Active' : (trial.status || 'Unknown')
                      return (
                        <div key={idx} className={`trial-card ${cardCls}`} style={{ position: 'relative' }}>
                          <div className="trial-card-header">
                            <span className="trial-type-badge">CLINICAL TRIAL</span>
                            <span className={`trial-status-pill ${pillCls}`}>{pillIcon} {pillLabel}</span>
                          </div>
                          <button
                            onClick={() => saveFavorite(trial, 'trial')}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              border: 'none',
                              background: savedItems.has(trial.url) ? '#10b981' : 'white',
                              color: savedItems.has(trial.url) ? 'white' : '#7c3aed',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: savedItems.has(trial.url) ? 'default' : 'pointer'
                            }}
                            disabled={savedItems.has(trial.url)}
                          >
                            {savedItems.has(trial.url) ? '⭐ Saved' : '⭐ Save'}
                          </button>
                          <div className="trial-card-body">
                            <div className="trial-title"><a href={trial.url} target="_blank" rel="noreferrer">{trial.title}</a></div>
                            <div className="trial-meta-row"><span className="trial-meta-icon">⚗️</span><span className="trial-meta-text">Phase: {trial.phase} • Started: {trial.startDate}</span></div>
                            {trial.locations && trial.locations !== 'Location not specified' && (
                              <div className="trial-meta-row"><span className="trial-meta-icon">📍</span><span className="trial-meta-text">{trial.locations}</span></div>
                            )}
                            {trial.contact && trial.contact !== 'Contact not available' && (
                              <div className="trial-meta-row"><span className="trial-meta-icon">📞</span><span className="trial-meta-text">{trial.contact}</span></div>
                            )}
                            <a href={trial.url} target="_blank" rel="noreferrer" className="trial-view-link">View trial details →</a>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
