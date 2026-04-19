import { useState } from 'react'

export function useSearch(api, showToast) {
  const [pubSearchQuery, setPubSearchQuery] = useState('')
  const [pubSourceFilter, setPubSourceFilter] = useState('all')
  const [pubYearFilter, setPubYearFilter] = useState('all')
  const [pubSort, setPubSort] = useState('relevance')
  const [pubResults, setPubResults] = useState([])
  const [isSearchingPubs, setIsSearchingPubs] = useState(false)
  const [hasSearchedPubs, setHasSearchedPubs] = useState(false)
  const [trialSearchQuery, setTrialSearchQuery] = useState('')
  const [trialStatusFilter, setTrialStatusFilter] = useState('all')
  const [trialResults, setTrialResults] = useState([])
  const [isSearchingTrials, setIsSearchingTrials] = useState(false)
  const [hasSearchedTrials, setHasSearchedTrials] = useState(false)
  const [sharedPublications, setSharedPublications] = useState([])
  const [sharedTrials, setSharedTrials] = useState([])

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
        trials = trials.filter((trial) => trial.status === trialStatusFilter)
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
        pubs = pubs.filter((pub) => pub.source === pubSourceFilter)
      }
      if (pubYearFilter !== 'all') {
        pubs = pubs.filter((pub) => pub.year && pub.year >= parseInt(pubYearFilter, 10))
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

  const handleClearTrials = () => {
    setTrialResults([])
    setTrialSearchQuery('')
    setHasSearchedTrials(false)
  }

  const handleClearPublications = () => {
    setPubResults([])
    setPubSearchQuery('')
    setHasSearchedPubs(false)
  }

  return {
    pubSearchQuery,
    setPubSearchQuery,
    pubSourceFilter,
    setPubSourceFilter,
    pubYearFilter,
    setPubYearFilter,
    pubSort,
    setPubSort,
    pubResults,
    setPubResults,
    isSearchingPubs,
    setIsSearchingPubs,
    hasSearchedPubs,
    setHasSearchedPubs,
    trialSearchQuery,
    setTrialSearchQuery,
    trialStatusFilter,
    setTrialStatusFilter,
    trialResults,
    setTrialResults,
    isSearchingTrials,
    setIsSearchingTrials,
    hasSearchedTrials,
    setHasSearchedTrials,
    sharedPublications,
    setSharedPublications,
    sharedTrials,
    setSharedTrials,
    handleSearchPubs,
    handleSearchTrials,
    handleClearTrials,
    handleClearPublications
  }
}
