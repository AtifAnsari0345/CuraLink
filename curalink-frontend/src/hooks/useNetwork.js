import { useState } from 'react'

export function useNetwork(api, showToast, loadRequests, loadConnections, loadResearchers, loadStats) {
  const [networkTab, setNetworkTab] = useState('discover')
  const [researchers, setResearchers] = useState([])
  const [loadingResearchers, setLoadingResearchers] = useState(false)
  const [connections, setConnections] = useState([])
  const [loadingConnections, setLoadingConnections] = useState(false)
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  const handleSendConnectionRequest = async (researcherId) => {
    try {
      await api.post('/network/request', { toUserId: researcherId })
      setResearchers((prev) =>
        prev.map((researcher) =>
          researcher._id === researcherId ? { ...researcher, connectionStatus: 'pending' } : researcher
        )
      )
      showToast('Request sent!', 'success')
    } catch (error) {
      console.error('Failed to send request:', error)
      showToast('Failed to send request', 'error')
    }
  }

  const handleRespondToRequest = async (requestId, action) => {
    try {
      await api.put(`/network/request/${requestId}`, { action })
      loadRequests()
      loadConnections()
      loadResearchers()
      loadStats()
      showToast(`Request ${action}ed!`, 'success')
    } catch (error) {
      console.error('Failed to respond to request:', error)
      showToast('Failed to respond', 'error')
    }
  }

  return {
    networkTab,
    setNetworkTab,
    researchers,
    setResearchers,
    loadingResearchers,
    setLoadingResearchers,
    connections,
    setConnections,
    loadingConnections,
    setLoadingConnections,
    incomingRequests,
    setIncomingRequests,
    outgoingRequests,
    setOutgoingRequests,
    loadingRequests,
    setLoadingRequests,
    handleSendConnectionRequest,
    handleRespondToRequest
  }
}
