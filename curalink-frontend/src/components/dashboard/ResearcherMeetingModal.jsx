export default function ResearcherMeetingModal({
  open,
  editingMeeting,
  meetingForm,
  setMeetingForm,
  onClose,
  onSubmit,
  isMobile
}) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: isMobile ? '20px' : '24px',
          width: isMobile ? '95vw' : '100%',
          maxWidth: isMobile ? '95vw' : '560px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
          {editingMeeting ? 'Edit Meeting' : 'Schedule Meeting'}
        </h2>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={meetingForm.title}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, title: event.target.value }))
              }
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                Date *
              </label>
              <input
                type="date"
                required
                value={meetingForm.date}
                onChange={(event) =>
                  setMeetingForm((prev) => ({ ...prev, date: event.target.value }))
                }
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                Time *
              </label>
              <input
                type="time"
                required
                value={meetingForm.time}
                onChange={(event) =>
                  setMeetingForm((prev) => ({ ...prev, time: event.target.value }))
                }
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0 12px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Location
            </label>
            <input
              type="text"
              placeholder="Virtual / Lab 201 / Zoom link"
              value={meetingForm.location}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, location: event.target.value }))
              }
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Meeting Link
            </label>
            <input
              type="text"
              placeholder="https://zoom.us/..."
              value={meetingForm.meetingLink}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, meetingLink: event.target.value }))
              }
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Participants
            </label>
            <input
              type="text"
              placeholder="Comma separated names or emails"
              value={meetingForm.participants}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, participants: event.target.value }))
              }
              style={{
                width: '100%',
                height: '40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0 12px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={meetingForm.description}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, description: event.target.value }))
              }
              style={{
                width: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
