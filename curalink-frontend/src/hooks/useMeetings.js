import { useState } from 'react'
import { EMPTY_MEETING_FORM, normalizeParticipants } from '../utils/dashboardUtils'

export function useMeetings(api, showToast, loadMeetings, loadStats) {
  const [meetings, setMeetings] = useState([])
  const [loadingMeetings, setLoadingMeetings] = useState(false)
  const [meetingsFilter, setMeetingsFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [meetingForm, setMeetingForm] = useState(EMPTY_MEETING_FORM)

  const openCreateMeeting = () => {
    setEditingMeeting(null)
    setMeetingForm(EMPTY_MEETING_FORM)
    setShowCreateModal(true)
  }

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting)
    setMeetingForm({
      title: meeting.title || '',
      date: meeting.date || '',
      time: meeting.time || '',
      location: meeting.location || '',
      meetingLink: meeting.meetingLink || '',
      participants: meeting.participants?.join(', ') || '',
      description: meeting.description || '',
      status: meeting.status || 'scheduled'
    })
    setShowCreateModal(true)
  }

  const handleSaveMeeting = async (event) => {
    event.preventDefault()
    const payload = {
      ...meetingForm,
      participants: normalizeParticipants(meetingForm.participants)
    }

    try {
      if (editingMeeting?._id) {
        await api.put(`/meetings/${editingMeeting._id}`, payload)
        showToast('Meeting updated!', 'success')
      } else {
        await api.post('/meetings', payload)
        showToast('Meeting scheduled!', 'success')
      }
      setShowCreateModal(false)
      setEditingMeeting(null)
      setMeetingForm(EMPTY_MEETING_FORM)
      loadMeetings()
      loadStats()
    } catch (error) {
      console.error('Failed to save meeting:', error)
      showToast('Failed to save meeting', 'error')
    }
  }

  const handleMarkMeetingComplete = async (meetingId) => {
    if (!meetingId) {
      showToast('Meeting ID missing', 'error')
      return
    }
    try {
      await api.put(`/meetings/${meetingId}`, { status: 'completed' })
      setMeetings(prev => prev.map(m => m._id === meetingId ? { ...m, status: 'completed' } : m))
      loadStats()
      showToast('Meeting marked complete!', 'success')
    } catch (error) {
      console.error('Failed to mark complete:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update'
      showToast(errorMsg, 'error')
      alert(errorMsg)
    }
  }

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await api.delete(`/meetings/${meetingId}`)
      loadMeetings()
      loadStats()
      showToast('Meeting deleted!', 'success')
    } catch (error) {
      console.error('Failed to delete meeting:', error)
      showToast('Failed to delete', 'error')
    }
  }

  const filteredMeetings = meetingsFilter === 'all' ? meetings : meetings.filter((meeting) => meeting.status === meetingsFilter)

  const upcomingMeetings = [...meetings]
    .filter((meeting) => meeting.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  return {
    meetings,
    setMeetings,
    loadingMeetings,
    setLoadingMeetings,
    meetingsFilter,
    setMeetingsFilter,
    showCreateModal,
    setShowCreateModal,
    editingMeeting,
    setEditingMeeting,
    meetingForm,
    setMeetingForm,
    openCreateMeeting,
    handleEditMeeting,
    handleSaveMeeting,
    handleMarkMeetingComplete,
    handleDeleteMeeting,
    filteredMeetings,
    upcomingMeetings
  }
}
