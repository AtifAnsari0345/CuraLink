/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
export default function PatientForumTab({ 
  newPostContent, 
  setNewPostContent, 
  newPostDisease, 
  setNewPostDisease, 
  isPosting, 
  handleCreatePost, 
  loadingForum, 
  forumPosts, 
  getInitials, 
  timeAgo,
  handleDeletePost
}) {
  const getCurrentUser = () => {
    try {
      const stored = localStorage.getItem('curalink_user')
      if (stored) return JSON.parse(stored)
    } catch (e) {}
    return null
  }

  const currentUser = getCurrentUser()
  const isOwnPost = (post) => {
    if (!currentUser) return false
    return post.authorName === currentUser.username || String(post.author) === String(currentUser._id)
  }

  const getRoleStyles = (role) => {
    return role === 'Patient' 
      ? { bg: '#f3f0ff', color: '#7c3aed', avatarBg: '#7c3aed' } 
      : { bg: '#ecfdf5', color: '#059669', avatarBg: '#0d9488' }
  }

  return (
    <div>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="Share your experience, ask questions, or discuss research..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              resize: 'vertical',
              minHeight: '90px',
              fontSize: '14px',
              fontFamily: 'Inter',
              outline: 'none',
              transition: 'all 0.2s',
              marginBottom: '8px',
              whiteSpace: 'pre-wrap'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#7c3aed';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              {newPostContent.length}/2000
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Tag a condition (optional)"
              value={newPostDisease}
              onChange={(e) => setNewPostDisease(e.target.value)}
              style={{
                flex: 1,
                height: '40px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0 14px',
                fontSize: '14px',
                fontFamily: 'Inter',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={!newPostContent.trim() || isPosting || newPostContent.length > 2000}
              style={{
                height: '40px',
                padding: '0 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                cursor: (!newPostContent.trim() || isPosting || newPostContent.length > 2000) ? 'not-allowed' : 'pointer',
                opacity: (!newPostContent.trim() || isPosting || newPostContent.length > 2000) ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {loadingForum ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          Loading forum...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {forumPosts.map((post) => {
            const roleStyles = getRoleStyles(post.authorRole)
            return (
              <div key={post._id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                {isOwnPost(post) && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      color: '#dc2626',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '8px 12px',
                      transition: 'all 0.2s'
                    }}
                    title="Delete post"
                    onMouseEnter={(e) => {
                      e.target.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#fef2f2'
                    }}
                  >
                    Delete
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: roleStyles.avatarBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: 700
                  }}>
                    {getInitials(post.authorName)}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    {post.authorName}
                  </span>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: roleStyles.bg,
                    color: roleStyles.color
                  }}>
                    {post.authorRole}
                  </span>
                  {post.disease && (
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 500,
                      backgroundColor: '#eff6ff',
                      color: '#2563eb'
                    }}>
                      #{post.disease}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}>
                  {post.content}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
