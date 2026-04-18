export const EMPTY_MEETING_FORM = {
  title: '',
  date: '',
  time: '',
  location: '',
  meetingLink: '',
  participants: '',
  description: '',
  status: 'scheduled'
}

export const EMPTY_PROFILE_FORM = {
  firstName: '',
  lastName: '',
  institution: '',
  orcidId: '',
  bio: '',
  specialties: [],
  researchInterests: [],
  availability: 'Available',
  contactPreference: 'Via Platform'
}

export const TAB_TITLES = {
  overview: 'Overview',
  'ai-research': 'AI Research Tool',
  publications: 'My Publications',
  trials: 'Clinical Trials',
  network: 'My Network',
  forum: 'Community Forum',
  meetings: 'Meetings',
  favorites: 'Favorites',
  profile: 'Profile'
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
}

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return `${Math.floor(interval)}y ago`
  interval = seconds / 2592000
  if (interval > 1) return `${Math.floor(interval)}m ago`
  interval = seconds / 86400
  if (interval > 1) return `${Math.floor(interval)}d ago`
  interval = seconds / 3600
  if (interval > 1) return `${Math.floor(interval)}h ago`
  interval = seconds / 60
  if (interval > 1) return `${Math.floor(interval)}m ago`
  return 'just now'
}

export const getStatusColor = (status) => {
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

export const getMeetingStatusBadge = (status) => {
  switch (status) {
    case 'scheduled':
      return { bg: '#d1fae5', color: '#065f46', text: 'Scheduled' }
    case 'completed':
      return { bg: '#f1f5f9', color: '#64748b', text: 'Completed' }
    case 'cancelled':
      return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelled' }
    default:
      return { bg: '#f1f5f9', color: '#64748b', text: status }
  }
}

export const normalizeParticipants = (participants = '') =>
  participants
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

export const syncSavedUrls = (items = [], setSavedPubUrls, setSavedTrialUrls) => {
  setSavedPubUrls(new Set(items.filter((item) => item.type === 'publication').map((item) => item.url)))
  setSavedTrialUrls(new Set(items.filter((item) => item.type === 'trial').map((item) => item.url)))
}
