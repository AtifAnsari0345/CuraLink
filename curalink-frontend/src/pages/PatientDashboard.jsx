/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import ChatInterface from '../components/ChatInterface'
import ProfileCompletionGate from '../components/ProfileCompletionGate'
import PatientSidebar from '../components/dashboard/PatientSidebar'
import PatientOverviewTab from '../components/dashboard/PatientOverviewTab'
import PublicationsTab from '../components/dashboard/PublicationsTab'
import TrialsTab from '../components/dashboard/TrialsTab'
import PatientFavoritesTab from '../components/dashboard/PatientFavoritesTab'
import PatientForumTab from '../components/dashboard/PatientForumTab'
import PatientProfileTab from '../components/dashboard/PatientProfileTab'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import curalinkLogo from '../assets/Curalink logo.jpg'

const PatientDashboard = () => {
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
  const [recentFavorites, setRecentFavorites] = useState([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  const [toast, setToast] = useState(null)

  const [chatMessages, setChatMessages] = useState([])
  const [chatSessionId, setChatSessionId] = useState(null)
  const [chatSearchTerms, setChatSearchTerms] = useState([])

  const [trialSearchQuery, setTrialSearchQuery] = useState('')
  const [trialStatusFilter, setTrialStatusFilter] = useState('all')
  const [trialResults, setTrialResults] = useState([])
  const [isSearchingTrials, setIsSearchingTrials] = useState(false)
  const [hasSearchedTrials, setHasSearchedTrials] = useState(false)
  const [savedTrialUrls, setSavedTrialUrls] = useState(new Set())

  const [pubSearchQuery, setPubSearchQuery] = useState('')
  const [pubSourceFilter, setPubSourceFilter] = useState('all')
  const [pubYearFilter, setPubYearFilter] = useState('all')
  const [pubSort, setPubSort] = useState('relevance')
  const [pubResults, setPubResults] = useState([])
  const [isSearchingPubs, setIsSearchingPubs] = useState(false)
  const [hasSearchedPubs, setHasSearchedPubs] = useState(false)
  const [savedPubUrls, setSavedPubUrls] = useState(new Set())

  const [favorites, setFavorites] = useState([])
  const [loadingFavTab, setLoadingFavTab] = useState(false)

  const [sharedPublications, setSharedPublications] = useState([])
  const [sharedTrials, setSharedTrials] = useState([])

  const timelineData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      let activity = Math.floor(Math.random() * 5);
      if (i === 0) {
        activity = (stats?.publicationsSaved || 0) + (stats?.trialsSaved || 0) + (stats?.forumPostsCount || 0);
      }
      data.push({ day: dayName, activity });
    }
    return data;
  }, [stats])

  const [forumPosts, setForumPosts] = useState([])
  const [loadingForum, setLoadingForum] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostDisease, setNewPostDisease] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState({})
  const [replyInputs, setReplyInputs] = useState({})

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    location: '',
    dateOfBirth: '',
    bio: '',
    conditions: [],
    medications: []
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [conditionInput, setConditionInput] = useState('')
  const [medicationInput, setMedicationInput] = useState('')

  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const customSelectStyle = {
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    padding: '9px 36px 9px 14px',
    fontSize: '14px',
    color: '#374151',
    background: 'white',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    appearance: 'none',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'Inter'
  }

  const stripHtml = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

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

  const loadRecentFavorites = async () => {
    try {
      setLoadingFavorites(true)
      const res = await api.get('/users/favorites')
      const favs = res.data.slice(0, 3)
      setRecentFavorites(favs)
    } catch (error) {
      console.error('Failed to load recent favorites:', error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const loadFavoritesTab = async () => {
    try {
      setLoadingFavTab(true)
      const res = await api.get('/users/favorites')
      setFavorites(res.data)
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoadingFavTab(false)
    }
  }

  const loadForum = async () => {
    try {
      setLoadingForum(true)
      const res = await api.get('/forum')
      setForumPosts(res.data)
    } catch (error) {
      console.error('Failed to load forum:', error)
    } finally {
      setLoadingForum(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadStats()
      loadRecentFavorites()
      setProfileForm({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        location: user.profile?.location || '',
        dateOfBirth: user.profile?.dateOfBirth || '',
        bio: user.profile?.bio || '',
        conditions: user.profile?.conditions || [],
        medications: user.profile?.medications || []
      })
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadFavoritesTab()
    } else if (activeTab === 'forum') {
      loadForum()
    }
  }, [activeTab])

  const handleLogout = () => {
    logout()
  }

  const handleSaveFavorite = async (item) => {
    try {
      await api.post('/users/favorites', {
        type: item.type,
        title: item.title,
        url: item.url
      })
      
      if (item.type === 'trial') {
        setSavedTrialUrls(prev => new Set([...prev, item.url]))
      } else {
        setSavedPubUrls(prev => new Set([...prev, item.url]))
      }
      
      loadStats()
      loadRecentFavorites()
      showToast('Saved!', 'success')
    } catch (error) {
      console.error('Failed to save favorite:', error)
      showToast('Failed to save', 'error')
    }
  }

  const handleRemoveFavorite = async (item) => {
    try {
      const encodedUrl = btoa(item.url)
      await api.delete(`/users/favorites/${encodedUrl}`)
      loadFavoritesTab()
      loadStats()
      loadRecentFavorites()
      showToast('Removed!', 'success')
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      showToast('Failed to remove', 'error')
    }
  }

  const handleSearchTrials = async () => {
    try {
      setIsSearchingTrials(true)
      setHasSearchedTrials(true)
      const res = await api.post('/research', {
        disease: trialSearchQuery,
        query: trialSearchQuery
      })
      
      let trials = res.data.results?.trials || []
      if (trialStatusFilter !== 'all') {
        trials = trials.filter(t => t.status === trialStatusFilter)
      }
      
      setTrialResults(trials)
    } catch (error) {
      console.error('Failed to search trials:', error)
      showToast('Search failed', 'error')
    } finally {
      setIsSearchingTrials(false)
    }
  }

  const handleSearchPubs = async () => {
    try {
      setIsSearchingPubs(true)
      setHasSearchedPubs(true)
      const res = await api.post('/research', {
        disease: pubSearchQuery,
        query: pubSearchQuery
      })
      
      let pubs = res.data.results?.publications || []
      if (pubSourceFilter !== 'all') {
        pubs = pubs.filter(p => p.source === pubSourceFilter)
      }
      if (pubYearFilter !== 'all') {
        pubs = pubs.filter(p => p.year && p.year >= parseInt(pubYearFilter))
      }
      if (pubSort === 'year') {
        pubs = [...pubs].sort((a, b) => (b.year || 0) - (a.year || 0))
      }
      
      setPubResults(pubs)
    } catch (error) {
      console.error('Failed to search publications:', error)
      showToast('Search failed', 'error')
    } finally {
      setIsSearchingPubs(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      setIsPosting(true)
      await api.post('/forum', {
        content: newPostContent,
        disease: newPostDisease
      })
      setNewPostContent('')
      setNewPostDisease('')
      loadForum()
      loadStats()
      showToast('Posted!', 'success')
    } catch (error) {
      console.error('Failed to create post:', error)
      showToast('Post failed', 'error')
    } finally {
      setIsPosting(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/forum/${postId}`);
      setForumPosts(prev => prev.filter(p => p._id !== postId));
      showToast('Post deleted!', 'success');
    } catch (error) {
      console.error('Failed to delete post:', error);
      showToast('Delete failed', 'error');
    }
  }

  const handleLikePost = async (postId) => {
    try {
      await api.post(`/forum/${postId}/like`)
      loadForum()
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleAddReply = async (postId) => {
    try {
      await api.post(`/forum/${postId}/replies`, {
        content: replyInputs[postId]
      })
      setReplyInputs(prev => ({ ...prev, [postId]: '' }))
      loadForum()
    } catch (error) {
      console.error('Failed to add reply:', error)
    }
  }

  const handleAddCondition = (e) => {
    if (e.key === 'Enter' && conditionInput.trim()) {
      e.preventDefault()
      if (!profileForm.conditions.includes(conditionInput.trim())) {
        setProfileForm(prev => ({
          ...prev,
          conditions: [...prev.conditions, conditionInput.trim()]
        }))
      }
      setConditionInput('')
    }
  }

  const handleRemoveCondition = (condition) => {
    setProfileForm(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c !== condition)
    }))
  }

  const handleAddMedication = (e) => {
    if (e.key === 'Enter' && medicationInput.trim()) {
      e.preventDefault()
      if (!profileForm.medications.includes(medicationInput.trim())) {
        setProfileForm(prev => ({
          ...prev,
          medications: [...prev.medications, medicationInput.trim()]
        }))
      }
      setMedicationInput('')
    }
  }

  const handleRemoveMedication = (med) => {
    setProfileForm(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== med)
    }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await updateProfile(profileForm)
      showToast('Profile saved successfully!', 'success')
      loadStats()
    } catch (error) {
      showToast('Failed to save profile', 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECRUITING': return '#10b981'
      case 'COMPLETED': return '#64748b'
      case 'ACTIVE_NOT_RECRUITING': return '#2563eb'
      default: return '#64748b'
    }
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + 'y ago'
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + 'm ago'
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + 'd ago'
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + 'h ago'
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + 'm ago'
    return 'just now'
  }

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'ai-research', icon: '🧬', label: 'AI Research' },
    { id: 'trials', icon: '🧪', label: 'Clinical Trials' },
    { id: 'publications', icon: '📄', label: 'Publications' },
    { id: 'favorites', icon: '⭐', label: 'Favorites' },
    { id: 'forum', icon: '💬', label: 'Forum' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ]

  const tabTitles = {
    'overview': 'Overview',
    'ai-research': 'AI Research Assistant',
    'trials': 'Clinical Trials',
    'publications': 'Publications',
    'favorites': 'Favorites',
    'forum': 'Community Forum',
    'profile': 'Profile'
  }

  return (
    <ProfileCompletionGate>
    <div className="dashboard-container" style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f1f5f9',
      position: 'relative'
    }}>
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
        <PatientSidebar
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

      <div className="dashboard-main" style={{
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          height: '48px',
          minHeight: '48px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0
        }}>
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
              {tabTitles[activeTab]}
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '13px',
              color: '#64748b'
            }}>
              Welcome back, {user?.username || 'User'}!
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#7c3aed',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600
            }}>
              {getInitials(user?.username)}
            </div>
          </div>
        </div>

        <div className="dashboard-main-content" style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '12px' : '24px'
        }}>
          {activeTab === 'overview' && (
            <PatientOverviewTab
              user={user}
              stats={stats}
              loadingStats={loadingStats}
              recentFavorites={recentFavorites}
              loadingFavorites={loadingFavorites}
              timelineData={timelineData}
              setActiveTab={setActiveTab}
              chatSearchTerms={chatSearchTerms}
              isMobile={isMobile}
            />
          )}

          {activeTab === 'ai-research' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#060a10',
              zIndex: 100
            }}>
              <ChatInterface
                embedded={true}
                defaultDisease={user?.profile?.conditions?.join(', ') || ''}
                defaultPatientName={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()}
                persistedMessages={chatMessages}
                onMessagesChange={setChatMessages}
                persistedSessionId={chatSessionId}
                onSessionIdChange={setChatSessionId}
                onResultsUpdate={(results) => {
                  setSharedPublications(results.publications)
                  setSharedTrials(results.clinicalTrials)
                  if (user?.profile?.conditions?.length > 0) {
                    setChatSearchTerms(prev => [
                      ...new Set([
                        ...prev,
                        ...user.profile.conditions
                      ])
                    ])
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'trials' && (
            <TrialsTab
              sharedTrials={sharedTrials}
              trialSearchQuery={trialSearchQuery}
              setTrialSearchQuery={setTrialSearchQuery}
              trialStatusFilter={trialStatusFilter}
              setTrialStatusFilter={setTrialStatusFilter}
              trialResults={trialResults}
              isSearchingTrials={isSearchingTrials}
              hasSearchedTrials={hasSearchedTrials}
              savedTrialUrls={savedTrialUrls}
              handleSearchTrials={handleSearchTrials}
              handleSaveFavorite={handleSaveFavorite}
              isMobile={isMobile}
            />
          )}

          {activeTab === 'publications' && (
            <PublicationsTab
              sharedPublications={sharedPublications}
              pubSearchQuery={pubSearchQuery}
              setPubSearchQuery={setPubSearchQuery}
              pubSourceFilter={pubSourceFilter}
              setPubSourceFilter={setPubSourceFilter}
              pubYearFilter={pubYearFilter}
              setPubYearFilter={setPubYearFilter}
              pubSort={pubSort}
              setPubSort={setPubSort}
              pubResults={pubResults}
              isSearchingPubs={isSearchingPubs}
              hasSearchedPubs={hasSearchedPubs}
              savedPubUrls={savedPubUrls}
              handleSearchPubs={handleSearchPubs}
              handleSaveFavorite={handleSaveFavorite}
              isMobile={isMobile}
            />
          )}

          {activeTab === 'favorites' && (
            <PatientFavoritesTab
              favorites={favorites}
              loadingFavTab={loadingFavTab}
              timeAgo={timeAgo}
              handleRemoveFavorite={handleRemoveFavorite}
              isMobile={isMobile}
            />
          )}

          {activeTab === 'forum' && (
            <PatientForumTab
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              newPostDisease={newPostDisease}
              setNewPostDisease={setNewPostDisease}
              isPosting={isPosting}
              handleCreatePost={handleCreatePost}
              loadingForum={loadingForum}
              forumPosts={forumPosts}
              getInitials={getInitials}
              timeAgo={timeAgo}
              handleDeletePost={handleDeletePost}
              isMobile={isMobile}
            />
          )}

          {activeTab === 'profile' && (
            <PatientProfileTab
              user={user}
              handleSaveProfile={handleSaveProfile}
              isSavingProfile={isSavingProfile}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              conditionInput={conditionInput}
              setConditionInput={setConditionInput}
              handleAddCondition={handleAddCondition}
              handleRemoveCondition={handleRemoveCondition}
              medicationInput={medicationInput}
              setMedicationInput={setMedicationInput}
              handleAddMedication={handleAddMedication}
              handleRemoveMedication={handleRemoveMedication}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: toast.type === 'success' ? '#d1fae5' : toast.type === 'error' ? '#fee2e2' : '#dbeafe',
          color: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e40af',
          borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#dc2626' : '#3b82f6'}`
        }}>
          {toast.message}
        </div>
      )}
    </div>
    </ProfileCompletionGate>
  )
}

export default PatientDashboard
