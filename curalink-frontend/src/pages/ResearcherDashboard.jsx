/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import ChatInterface from '../components/ChatInterface'
import ProfileCompletionGate from '../components/ProfileCompletionGate'
import ResearcherSidebar from '../components/dashboard/ResearcherSidebar'
import ResearcherOverviewTab from '../components/dashboard/ResearcherOverviewTab'
import PublicationsTab from '../components/dashboard/PublicationsTab'
import TrialsTab from '../components/dashboard/TrialsTab'
import ResearcherFavoritesTab from '../components/dashboard/ResearcherFavoritesTab'
import ResearcherForumTab from '../components/dashboard/ResearcherForumTab'
import ResearcherMeetingsTab from '../components/dashboard/ResearcherMeetingsTab'
import ResearcherNetworkTab from '../components/dashboard/ResearcherNetworkTab'
import ResearcherProfileTab from '../components/dashboard/ResearcherProfileTab'
import ResearcherMeetingModal from '../components/dashboard/ResearcherMeetingModal'
import { useAuth } from '../context/AuthContext'
import { useToasts } from '../hooks/useToasts'
import { useMeetings } from '../hooks/useMeetings'
import { useForum } from '../hooks/useForum'
import { useNetwork } from '../hooks/useNetwork'
import { useFavorites } from '../hooks/useFavorites'
import { useSearch } from '../hooks/useSearch'
import { useProfile } from '../hooks/useProfile'
import {
  TAB_TITLES,
  getInitials,
  timeAgo,
  getStatusColor,
  getMeetingStatusBadge
} from '../utils/dashboardUtils'

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

const ResearcherDashboard = () => {
  const { user, token, logout, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)

  const [chatMessages, setChatMessages] = useState([WELCOME_MESSAGE])
  const [chatSessionId, setChatSessionId] = useState(null)
  const [chatPublications, setChatPublications] = useState([])
  const [chatTrials, setChatTrials] = useState([])
  const [chatStats, setChatStats] = useState(null)

  const api = useMemo(() => axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
    headers: { Authorization: `Bearer ${token}` }
  }), [token])

  const { toast, showToast } = useToasts()

  const loadStats = async () => {
    try {
      setLoadingStats(true)
      const res = await api.get('/users/stats')
      setStats(res.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const loadForum = async () => {
    try {
      forumHook.setLoadingForum(true)
      const res = await api.get('/forum')
      forumHook.setForumPosts(res.data || [])
    } catch (error) {
      console.error('Failed to load forum:', error)
    } finally {
      forumHook.setLoadingForum(false)
    }
  }

  const loadMeetings = async () => {
    try {
      meetingsHook.setLoadingMeetings(true)
      const res = await api.get('/meetings')
      meetingsHook.setMeetings(res.data || [])
    } catch (error) {
      console.error('Failed to load meetings:', error)
    } finally {
      meetingsHook.setLoadingMeetings(false)
    }
  }

  const loadResearchers = async () => {
    try {
      networkHook.setLoadingResearchers(true)
      const res = await api.get('/network/researchers')
      networkHook.setResearchers(res.data || [])
    } catch (error) {
      console.error('Failed to load researchers:', error)
    } finally {
      networkHook.setLoadingResearchers(false)
    }
  }

  const loadConnections = async () => {
    try {
      networkHook.setLoadingConnections(true)
      const res = await api.get('/network/connections')
      networkHook.setConnections(res.data || [])
    } catch (error) {
      console.error('Failed to load connections:', error)
    } finally {
      networkHook.setLoadingConnections(false)
    }
  }

  const loadRequests = async () => {
    try {
      networkHook.setLoadingRequests(true)
      const [incoming, outgoing] = await Promise.all([
        api.get('/network/requests'),
        api.get('/network/sent')
      ])
      networkHook.setIncomingRequests(incoming.data || [])
      networkHook.setOutgoingRequests(outgoing.data || [])
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      networkHook.setLoadingRequests(false)
    }
  }

  const favoritesHook = useFavorites(api, showToast, loadStats)
  const meetingsHook = useMeetings(api, showToast, loadMeetings, loadStats)
  const forumHook = useForum(api, showToast, loadForum, loadStats)
  const networkHook = useNetwork(api, showToast, loadRequests, loadConnections, loadResearchers, loadStats)
  const searchHook = useSearch(api, showToast)
  const profileHook = useProfile(user, updateProfile, showToast, loadStats)

  useEffect(() => {
    if (!user) return

    loadStats()
    favoritesHook.loadRecentFavorites()
    loadForum()
    loadMeetings()
    profileHook.setProfileForm({
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      institution: user.profile?.institution || '',
      orcidId: user.profile?.orcidId || '',
      bio: user.profile?.bio || '',
      specialties: user.profile?.specialties || [],
      researchInterests: user.profile?.researchInterests || [],
      availability: user.profile?.availability || 'Available',
      contactPreference: user.profile?.contactPreference || 'Via Platform'
    })
  }, [user])

  useEffect(() => {
    if (activeTab === 'favorites') favoritesHook.loadFavoritesTab()
    if (activeTab === 'forum') loadForum()
    if (activeTab === 'meetings') loadMeetings()
    if (activeTab !== 'network') return

    if (networkHook.networkTab === 'discover') loadResearchers()
    if (networkHook.networkTab === 'connections') loadConnections()
    if (networkHook.networkTab === 'requests') loadRequests()
  }, [activeTab, networkHook.networkTab])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ResearcherOverviewTab
            user={user}
            stats={stats}
            loadingStats={loadingStats}
            recentFavorites={favoritesHook.recentFavorites}
            loadingFavorites={favoritesHook.loadingFavorites}
            loadingForum={forumHook.loadingForum}
            forumPosts={forumHook.forumPosts}
            loadingMeetings={meetingsHook.loadingMeetings}
            upcomingMeetings={meetingsHook.upcomingMeetings}
            getInitials={getInitials}
            timeAgo={timeAgo}
            setActiveTab={setActiveTab}
            isMobile={isMobile}
          />
        )
      case 'ai-research':
        return (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#060a10',
              zIndex: 100
            }}
          >
            <ChatInterface
              embedded
              defaultDisease={user?.profile?.researchInterests?.[0] || ''}
              persistedMessages={chatMessages}
              onMessagesChange={setChatMessages}
              persistedSessionId={chatSessionId}
              onSessionIdChange={setChatSessionId}
              onResultsUpdate={(results) => {
                setChatPublications(results.publications || [])
                setChatTrials(results.clinicalTrials || [])
                setChatStats(results.stats)
                searchHook.setSharedPublications(results.publications || [])
                searchHook.setSharedTrials(results.clinicalTrials || [])
              }}
            />
          </div>
        )
      case 'publications':
        return (
          <PublicationsTab
            sharedPublications={chatPublications}
            pubSearchQuery={searchHook.pubSearchQuery}
            setPubSearchQuery={searchHook.setPubSearchQuery}
            pubSourceFilter={searchHook.pubSourceFilter}
            setPubSourceFilter={searchHook.setPubSourceFilter}
            pubYearFilter={searchHook.pubYearFilter}
            setPubYearFilter={searchHook.setPubYearFilter}
            pubSort={searchHook.pubSort}
            setPubSort={searchHook.setPubSort}
            pubResults={searchHook.pubResults}
            isSearchingPubs={searchHook.isSearchingPubs}
            hasSearchedPubs={searchHook.hasSearchedPubs}
            savedPubUrls={favoritesHook.savedPubUrls}
            handleSearchPubs={searchHook.handleSearchPubs}
            handleSaveFavorite={favoritesHook.handleSaveFavorite}
            isMobile={isMobile}
          />
        )
      case 'trials':
        return (
          <TrialsTab
            sharedTrials={chatTrials}
            trialSearchQuery={searchHook.trialSearchQuery}
            setTrialSearchQuery={searchHook.setTrialSearchQuery}
            trialStatusFilter={searchHook.trialStatusFilter}
            setTrialStatusFilter={searchHook.setTrialStatusFilter}
            trialResults={searchHook.trialResults}
            isSearchingTrials={searchHook.isSearchingTrials}
            hasSearchedTrials={searchHook.hasSearchedTrials}
            savedTrialUrls={favoritesHook.savedTrialUrls}
            handleSearchTrials={searchHook.handleSearchTrials}
            handleSaveFavorite={favoritesHook.handleSaveFavorite}
            isMobile={isMobile}
          />
        )
      case 'network':
        return (
          <ResearcherNetworkTab
            networkTab={networkHook.networkTab}
            setNetworkTab={networkHook.setNetworkTab}
            loadingResearchers={networkHook.loadingResearchers}
            researchers={networkHook.researchers}
            getInitials={getInitials}
            handleSendConnectionRequest={networkHook.handleSendConnectionRequest}
            loadingConnections={networkHook.loadingConnections}
            connections={networkHook.connections}
            loadingRequests={networkHook.loadingRequests}
            incomingRequests={networkHook.incomingRequests}
            outgoingRequests={networkHook.outgoingRequests}
            handleRespondToRequest={networkHook.handleRespondToRequest}
            isMobile={isMobile}
          />
        )
      case 'forum':
        return (
          <ResearcherForumTab
            newPostContent={forumHook.newPostContent}
            setNewPostContent={forumHook.setNewPostContent}
            newPostDisease={forumHook.newPostDisease}
            setNewPostDisease={forumHook.setNewPostDisease}
            isPosting={forumHook.isPosting}
            handleCreatePost={forumHook.handleCreatePost}
            loadingForum={forumHook.loadingForum}
            forumPosts={forumHook.forumPosts}
            getInitials={getInitials}
            timeAgo={timeAgo}
            handleDeletePost={forumHook.handleDeletePost}
            isMobile={isMobile}
          />
        )
      case 'meetings':
        return (
          <ResearcherMeetingsTab
            onCreateMeeting={meetingsHook.openCreateMeeting}
            meetingsFilter={meetingsHook.meetingsFilter}
            setMeetingsFilter={meetingsHook.setMeetingsFilter}
            loadingMeetings={meetingsHook.loadingMeetings}
            filteredMeetings={meetingsHook.filteredMeetings}
            getMeetingStatusBadge={getMeetingStatusBadge}
            handleEditMeeting={meetingsHook.handleEditMeeting}
            handleMarkMeetingComplete={meetingsHook.handleMarkMeetingComplete}
            handleDeleteMeeting={meetingsHook.handleDeleteMeeting}
            isMobile={isMobile}
          />
        )
      case 'favorites':
        return (
          <ResearcherFavoritesTab
            favorites={favoritesHook.favorites}
            loadingFavTab={favoritesHook.loadingFavTab}
            timeAgo={timeAgo}
            handleRemoveFavorite={favoritesHook.handleRemoveFavorite}
            isMobile={isMobile}
          />
        )
      case 'profile':
        return (
          <ResearcherProfileTab
            user={user}
            handleSaveProfile={profileHook.handleSaveProfile}
            isSavingProfile={profileHook.isSavingProfile}
            profileForm={profileHook.profileForm}
            setProfileForm={profileHook.setProfileForm}
            specialtyInput={profileHook.specialtyInput}
            setSpecialtyInput={profileHook.setSpecialtyInput}
            handleAddSpecialty={profileHook.handleAddSpecialty}
            handleRemoveSpecialty={profileHook.handleRemoveSpecialty}
            interestInput={profileHook.interestInput}
            setInterestInput={profileHook.setInterestInput}
            handleAddInterest={profileHook.handleAddInterest}
            handleRemoveInterest={profileHook.handleRemoveInterest}
            isMobile={isMobile}
          />
        )
      default:
        return null
    }
  }

  return (
    <ProfileCompletionGate>
      <div
        className="dashboard-container"
        style={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#f1f5f9',
          position: 'relative'
        }}
      >
        <div className={`dashboard-sidebar ${isSidebarOpen ? 'dashboard-sidebar-open' : ''}`} style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          height: '100%',
          width: isSidebarOpen ? '240px' : '0px',
          minWidth: isSidebarOpen ? '240px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.2s, min-width 0.2s, transform 0.2s',
          backgroundColor: '#ffffff',
          zIndex: 50,
          transform: isMobile ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none'
        }}>
          <ResearcherSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false);
            }}
            handleLogout={handleLogout}
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div
          className="dashboard-main"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              height: '48px',
              minHeight: '48px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#374151',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isSidebarOpen ? '✕' : '☰'}
                </button>
              )}
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1e293b'
              }}>
                {TAB_TITLES[activeTab]}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Welcome back, {user?.username || 'User'}!
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                {getInitials(user?.username)}
              </div>
            </div>
          </div>

          <div className="dashboard-main-content" style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '24px' }}>{renderActiveTab()}</div>
        </div>

        <ResearcherMeetingModal
        open={meetingsHook.showCreateModal}
        editingMeeting={meetingsHook.editingMeeting}
        meetingForm={meetingsHook.meetingForm}
        setMeetingForm={meetingsHook.setMeetingForm}
        onClose={() => {
          meetingsHook.setShowCreateModal(false)
          meetingsHook.setEditingMeeting(null)
        }}
        onSubmit={meetingsHook.handleSaveMeeting}
        isMobile={isMobile}
      />

        {toast && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10000,
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor:
                toast.type === 'success'
                  ? '#d1fae5'
                  : toast.type === 'error'
                    ? '#fee2e2'
                    : '#dbeafe',
              color:
                toast.type === 'success'
                  ? '#065f46'
                  : toast.type === 'error'
                    ? '#991b1b'
                    : '#1e40af',
              borderLeft: `4px solid ${
                toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#dc2626' : '#3b82f6'
              }`
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </ProfileCompletionGate>
  )
}

export default ResearcherDashboard
