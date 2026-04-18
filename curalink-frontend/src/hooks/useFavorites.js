import { useState } from 'react'
import { syncSavedUrls } from '../utils/dashboardUtils'

export function useFavorites(api, showToast, loadStats) {
  const [recentFavorites, setRecentFavorites] = useState([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [loadingFavTab, setLoadingFavTab] = useState(false)
  const [savedTrialUrls, setSavedTrialUrls] = useState(new Set())
  const [savedPubUrls, setSavedPubUrls] = useState(new Set())

  const loadRecentFavorites = async () => {
    try {
      setLoadingFavorites(true)
      const res = await api.get('/users/favorites')
      const data = res.data || []
      setRecentFavorites(data.slice(0, 3))
      syncSavedUrls(data, setSavedPubUrls, setSavedTrialUrls)
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
      const data = res.data || []
      setFavorites(data)
      syncSavedUrls(data, setSavedPubUrls, setSavedTrialUrls)
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoadingFavTab(false)
    }
  }

  const handleSaveFavorite = async (item) => {
    try {
      await api.post('/users/favorites', {
        type: item.type,
        title: item.title,
        url: item.url
      })

      if (item.type === 'trial') {
        setSavedTrialUrls((prev) => new Set([...prev, item.url]))
      } else {
        setSavedPubUrls((prev) => new Set([...prev, item.url]))
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
      await api.delete(`/users/favorites/${btoa(item.url)}`)
      loadFavoritesTab()
      loadStats()
      loadRecentFavorites()
      showToast('Removed!', 'success')
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      showToast('Failed to remove', 'error')
    }
  }

  return {
    recentFavorites,
    setRecentFavorites,
    loadingFavorites,
    setLoadingFavorites,
    favorites,
    setFavorites,
    loadingFavTab,
    setLoadingFavTab,
    savedTrialUrls,
    setSavedTrialUrls,
    savedPubUrls,
    setSavedPubUrls,
    loadRecentFavorites,
    loadFavoritesTab,
    handleSaveFavorite,
    handleRemoveFavorite
  }
}
