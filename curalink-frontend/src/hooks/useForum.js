/* eslint-disable no-unused-vars */
import { useState } from 'react'

export function useForum(api, showToast, loadForum, loadStats) {
  const [forumPosts, setForumPosts] = useState([])
  const [loadingForum, setLoadingForum] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostDisease, setNewPostDisease] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handleCreatePost = async (event) => {
    event.preventDefault()
    try {
      setIsPosting(true)
      const res = await api.post('/forum', {
        content: newPostContent,
        disease: newPostDisease
      })
      setNewPostContent('')
      setNewPostDisease('')
      setForumPosts(prev => [res.data, ...prev])
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
    if (!window.confirm('Delete this post?')) return
    try {
      const token = localStorage.getItem('curalink_token')
      await api.delete(`/forum/${postId}`)
      setForumPosts(prev => prev.filter(post => post._id !== postId))
      loadStats()
      showToast('Post deleted!', 'success')
    } catch (error) {
      console.error('Failed to delete post:', error)
      showToast(error.response?.data?.message || 'Failed to delete post', 'error')
    }
  }

  return {
    forumPosts,
    setForumPosts,
    loadingForum,
    setLoadingForum,
    newPostContent,
    setNewPostContent,
    newPostDisease,
    setNewPostDisease,
    isPosting,
    handleCreatePost,
    handleDeletePost
  }
}
