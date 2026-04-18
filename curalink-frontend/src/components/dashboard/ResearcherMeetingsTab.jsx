export default function ResearcherMeetingsTab({
  onCreateMeeting,
  meetingsFilter,
  setMeetingsFilter,
  loadingMeetings,
  filteredMeetings,
  getMeetingStatusBadge,
  handleEditMeeting,
  handleMarkMeetingComplete,
  handleDeleteMeeting,
  isMobile
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>My Meetings</div>
        <button
          onClick={onCreateMeeting}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Schedule Meeting
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'scheduled', 'completed', 'cancelled'].map((filterValue) => (
          <button
            key={filterValue}
            onClick={() => setMeetingsFilter(filterValue)}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: meetingsFilter === filterValue ? '#7c3aed' : '#ffffff',
              color: meetingsFilter === filterValue ? '#ffffff' : '#64748b',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {filterValue}
          </button>
        ))}
      </div>

      {loadingMeetings ? (
        <div style={{ textAlign: 'center', padding: '80px' }}>Loading meetings...</div>
      ) : filteredMeetings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>Meetings</div>
          <div style={{ marginBottom: '16px' }}>No meetings scheduled</div>
          <button
            onClick={onCreateMeeting}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7c3aed',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Schedule your first meeting
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredMeetings.map((meeting) => {
            const badge = getMeetingStatusBadge(meeting.status)
            return (
              <div
                key={meeting._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: badge.bg,
                      color: badge.color
                    }}
                  >
                    {badge.text}
                  </span>
                  {meeting.location && (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: '#f1f5f9',
                        color: '#64748b'
                      }}
                    >
                      {meeting.location}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                  {meeting.title}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  {new Date(meeting.date).toLocaleDateString()} • {meeting.time}
                </div>
                {meeting.participants?.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    {meeting.participants.join(', ')}
                  </div>
                )}
                {meeting.description && (
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
                    {meeting.description}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditMeeting(meeting)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #7c3aed',
                      backgroundColor: '#ffffff',
                      color: '#7c3aed',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  {meeting.status === 'scheduled' && (
                    <button
                      onClick={() => handleMarkMeetingComplete(meeting._id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: '1px solid #10b981',
                        backgroundColor: '#ffffff',
                        color: '#10b981',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMeeting(meeting._id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #dc2626',
                      backgroundColor: '#ffffff',
                      color: '#dc2626',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
