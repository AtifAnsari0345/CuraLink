import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import curalinkLogo from '../../assets/Curalink logo.jpg'

export default function PatientOverviewTab({ 
  user, 
  stats, 
  loadingStats, 
  recentFavorites, 
  loadingFavorites, 
  timelineData, 
  setActiveTab,
  chatSearchTerms,
  isMobile
}) {
  const COLORS = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

  if (loadingStats) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#7c3aed',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{
          marginTop: '16px',
          color: '#64748b',
          fontSize: '14px'
        }}>
          Loading stats...
        </div>
        <style>
          {`@keyframes spin { to { transform: rotate(360deg) } }`}
        </style>
      </div>
    )
  }

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
        flexDirection: isMobile ? 'column' : 'row'
      }} onClick={() => setActiveTab('ai-research')}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(99,102,241,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,0.25)' }}>
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          <div style={{width:64,height:64,borderRadius:16,overflow:'hidden',flexShrink:0,boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
            <img src={curalinkLogo} alt="AI" style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </div>
          <div>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(196,181,253,0.8)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Core Feature</div>
            <div style={{fontSize:'22px',fontWeight:800,color:'white',marginBottom:'6px'}}>AI Research Assistant</div>
            <div style={{fontSize:'14px',color:'rgba(196,181,253,0.9)',lineHeight:1.5,maxWidth: isMobile ? '100%' : '420px'}}>Search PubMed, OpenAlex & ClinicalTrials.gov with AI-powered insights. Get structured research answers personalized to {user?.profile?.conditions?.[0] || 'your condition'}.</div>
          </div>
        </div>
        <div style={{
          background:'rgba(255,255,255,0.15)',
          color:'white',
          border:'1px solid rgba(255,255,255,0.25)',
          borderRadius:'12px',
          padding:'12px 24px',
          fontSize:'14px',
          fontWeight:600,
          flexShrink:0,
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '12px' : 0
        }}>
          Open Research Tool →
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: '4px solid #7c3aed',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#7c3aed'
          }}>
            {stats?.publicationsSaved || 0}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
          }}>
            📄 Publications Saved
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: '4px solid #2563eb',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#2563eb'
          }}>
            {stats?.trialsSaved || 0}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
          }}>
            🧪 Trials Saved
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: '4px solid #10b981',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#10b981'
          }}>
            {stats?.forumPostsCount || 0}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
          }}>
            💬 Forum Posts
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          borderLeft: '4px solid #f59e0b',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#f59e0b'
          }}>
            {stats?.conditions?.length || 0}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#64748b',
            marginTop: '4px'
          }}>
            🏥 Conditions Tracked
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '12px'
          }}>
            Research Topics Distribution
          </div>
          {(() => {
            const allConditions = [
              ...(user?.profile?.conditions || []),
              ...(chatSearchTerms || [])
            ]
            const uniqueConditions = [...new Set(allConditions)]
            if (uniqueConditions.length === 0) {
              return (
                <div style={{
                  color: '#94a3b8',
                  fontSize: '13px',
                  padding: '60px 0',
                  textAlign: 'center'
                }}>
                  Add conditions in your Profile to see Research Topics
                </div>
              )
            }
            const conditionCounts = {}
            uniqueConditions.forEach(c => {
              conditionCounts[c] = (conditionCounts[c] || 0) + 1
            })
            const pieData = Object.keys(conditionCounts).map(c => ({ name: c, value: conditionCounts[c] }))
            return (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    labelLine={true}
                    label={({ name }) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )
          })()}
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '12px'
          }}>
            Recent Activity Timeline
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: '12px'
        }}>
          Recently Saved
        </div>
        {loadingFavorites ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '40px'
          }}>
            Loading...
          </div>
        ) : recentFavorites.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentFavorites.map((fav, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: fav.type === 'publication' ? '#f3f0ff' : '#eff6ff',
                    color: fav.type === 'publication' ? '#7c3aed' : '#2563eb'
                  }}>
                    {fav.type === 'publication' ? '📄 Publication' : '🧪 Trial'}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    maxWidth: '400px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {fav.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
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
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            color: '#94a3b8',
            fontSize: '13px',
            padding: '40px 0',
            textAlign: 'center'
          }}>
            No favorites saved yet. Use the AI Research Assistant to find and save papers.
          </div>
        )}
      </div>
    </>
  )
}