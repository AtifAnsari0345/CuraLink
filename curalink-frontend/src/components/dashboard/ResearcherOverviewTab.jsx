/* eslint-disable no-unused-vars */
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import curalinkLogo from '../../assets/Curalink logo.jpg'

export default function ResearcherOverviewTab({ 
  user, 
  stats, 
  loadingStats, 
  recentFavorites, 
  loadingFavorites, 
  loadingForum, 
  forumPosts, 
  loadingMeetings, 
  upcomingMeetings, 
  getInitials, 
  timeAgo, 
  setActiveTab,
  isMobile
}) {
  const COLORS = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b']

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
        <div style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>
          Loading stats...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <>
      {/* AI Research Tool Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
        flexDirection: isMobile ? 'column' : 'row'
      }} 
      onClick={() => setActiveTab('ai-research')}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.25)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
            <img src={curalinkLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(196,181,253,0.8)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              CORE FEATURE
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
              AI Research Assistant
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(196,181,253,0.9)', lineHeight: 1.5, maxWidth: isMobile ? '100%' : '420px' }}>
              Search PubMed, OpenAlex & ClinicalTrials.gov with AI-powered insights. Get structured research answers personalized to your specialties.
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 600,
          flexShrink: 0,
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '12px' : 0
        }}>
          Open Research Tool →
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: isMobile ? '10px' : '16px',
        marginBottom: '24px'
      }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #7c3aed', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#7c3aed' }}>{stats?.publicationsSaved || 0}</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>📚 Publications Saved</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #2563eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb' }}>{stats?.connectionsCount || 0}</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>🤝 Network Connections</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #10b981', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>{stats?.meetingsCount || 0}</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>📅 Upcoming Meetings</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b' }}>{stats?.forumPostsCount || 0}</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>💬 Forum Posts</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Your Activity</div>
          {(() => {
            const data = [
              { name: 'Publications', value: stats?.publicationsSaved || 0 },
              { name: 'Clinical Trials', value: stats?.trialsSaved || 0 },
              { name: 'Forum Posts', value: stats?.forumPostsCount || 0 },
            ].filter(item => item.value > 0);

            if (data.length === 0) {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                  <div style={{ width: '120px', height: '120px', border: '3px dashed #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>No data yet</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Your activity will appear here</div>
                </div>
              );
            }

            return (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            );
          })()}
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Saved vs Viewed vs Skipped</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { label: 'Saved', count: (stats?.publicationsSaved || 0) + (stats?.trialsSaved || 0) },
              { label: 'Viewed', count: Math.max(((stats?.publicationsSaved || 0) + (stats?.trialsSaved || 0)) * 3, 1) },
              { label: 'Skipped', count: Math.max(((stats?.publicationsSaved || 0) + (stats?.trialsSaved || 0)) * 6, 2) }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {[
                  <Cell key="saved" fill="#7c3aed" />,
                  <Cell key="viewed" fill="#2563eb" />,
                  <Cell key="skipped" fill="#94a3b8" />
                ]}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section - Now 2 Columns (Forum + Meetings) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
        
        {/* Forum Activity */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>Forum Activity</div>
          {loadingForum ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
          ) : forumPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {forumPosts.slice(0, 4).map((post) => (
                <div key={post._id} style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      backgroundColor: post.authorRole === 'researcher' ? '#10b981' : '#7c3aed',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600
                    }}>
                      {getInitials(post.authorName)}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{post.authorName}</span>
                    <span style={{
                      padding: '2px 7px', borderRadius: '999px', fontSize: '10px', fontWeight: 600,
                      backgroundColor: post.authorRole === 'researcher' ? '#d1fae5' : '#f3f0ff',
                      color: post.authorRole === 'researcher' ? '#065f46' : '#7c3aed'
                    }}>
                      {post.authorRole}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto' }}>
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
                    {post.content?.substring(0, 95)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              No recent forum activity
            </div>
          )}
        </div>

        {/* Upcoming Meetings */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>Upcoming Meetings</div>
            <button onClick={() => setActiveTab('meetings')} style={{ color: '#7c3aed', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              View all →
            </button>
          </div>
          {loadingMeetings ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
          ) : upcomingMeetings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingMeetings.slice(0, 3).map((meeting, idx) => (
                <div key={idx} style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '4px' }}>{meeting.title}</div>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                    📅 {new Date(meeting.date).toLocaleDateString()} • {meeting.time}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              No upcoming meetings scheduled
            </div>
          )}
        </div>
      </div>
    </>
  )
}