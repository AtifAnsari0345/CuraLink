/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

export default function PatientProfileTab({
  user,
  handleSaveProfile,
  isSavingProfile,
  profileForm,
  setProfileForm,
  conditionInput,
  setConditionInput,
  handleAddCondition,
  handleRemoveCondition,
  medicationInput,
  setMedicationInput,
  handleAddMedication,
  handleRemoveMedication,
  isMobile
}) {
  const [saveMessage, setSaveMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleSaveProfile(e)
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Failed to save profile' })
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const commonConditionOptions = [
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Cancer',
    'Heart Disease'
  ]

  const commonMedicationOptions = [
    'Metformin',
    'Lisinopril',
    'Albuterol',
    'Ibuprofen',
    'Sertraline',
    'Omeprazole'
  ]

  const toggleCondition = (cond) => {
    if (profileForm.conditions.includes(cond)) {
      handleRemoveCondition(cond)
    } else {
      setProfileForm((prev) => ({
        ...prev,
        conditions: [...prev.conditions, cond]
      }))
    }
  }

  const toggleMedication = (med) => {
    if (profileForm.medications.includes(med)) {
      handleRemoveMedication(med)
    } else {
      setProfileForm((prev) => ({
        ...prev,
        medications: [...prev.medications, med]
      }))
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            border: '1px solid #e8edf5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '10px',
              marginBottom: '18px'
            }}
          >
            Personal Information
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                First Name
              </label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Location
            </label>
            <input
              type="text"
              placeholder="City, Country"
              value={profileForm.location}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, location: e.target.value }))
              }
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Date of Birth
            </label>
            <input
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))
              }
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Bio
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={4}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            border: '1px solid #e8edf5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '10px',
              marginBottom: '18px'
            }}
          >
            Medical Information
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Conditions
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {commonConditionOptions.map((cond, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCondition(cond)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: profileForm.conditions.includes(cond)
                      ? '2px solid #7c3aed'
                      : '2px solid #e2e8f0',
                    backgroundColor: profileForm.conditions.includes(cond)
                      ? '#7c3aed'
                      : '#ffffff',
                    color: profileForm.conditions.includes(cond) ? '#ffffff' : '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileForm.conditions.includes(cond)) {
                      e.target.style.borderColor = '#7c3aed'
                      e.target.style.color = '#7c3aed'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileForm.conditions.includes(cond)) {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.color = '#374151'
                    }
                  }}
                >
                  {cond}
                </button>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {profileForm.conditions
                .filter((c) => !commonConditionOptions.includes(c))
                .map((cond, idx) => (
                  <span
                    key={`custom-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: '#f3f0ff',
                      color: '#7c3aed',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    {cond}
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#7c3aed',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0,
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
            <input
              type="text"
              placeholder="Type condition and press Enter"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              onKeyDown={handleAddCondition}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed'
                e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Medications
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {commonMedicationOptions.map((med, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleMedication(med)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: profileForm.medications.includes(med)
                      ? '2px solid #2563eb'
                      : '2px solid #e2e8f0',
                    backgroundColor: profileForm.medications.includes(med)
                      ? '#2563eb'
                      : '#ffffff',
                    color: profileForm.medications.includes(med) ? '#ffffff' : '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileForm.medications.includes(med)) {
                      e.target.style.borderColor = '#2563eb'
                      e.target.style.color = '#2563eb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileForm.medications.includes(med)) {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.color = '#374151'
                    }
                  }}
                >
                  {med}
                </button>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {profileForm.medications
                .filter((m) => !commonMedicationOptions.includes(m))
                .map((med, idx) => (
                  <span
                    key={`custom-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    {med}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(med)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#2563eb',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0,
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
            <input
              type="text"
              placeholder="Type medication and press Enter"
              value={medicationInput}
              onChange={(e) => setMedicationInput(e.target.value)}
              onKeyDown={handleAddMedication}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb'
                e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            border: '1px solid #e8edf5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1e293b',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '10px',
              marginBottom: '18px'
            }}
          >
            Account
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'inherit',
                  backgroundColor: '#f1f5f9',
                  cursor: 'not-allowed'
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748b',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'inherit',
                  backgroundColor: '#f1f5f9',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              Role:
            </label>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: '#f3f0ff',
                color: '#7c3aed'
              }}
            >
              Patient
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSavingProfile}
          style={{
            width: '100%',
            height: '46px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: '#ffffff',
            cursor: isSavingProfile ? 'not-allowed' : 'pointer',
            opacity: isSavingProfile ? 0.7 : 1,
            marginTop: '8px'
          }}
        >
          {isSavingProfile ? 'Saving...' : 'Save Profile'}
        </button>

        {saveMessage && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: saveMessage.type === 'success' ? '#10b981' : '#dc2626'
            }}
          >
            {saveMessage.text}
          </div>
        )}
      </form>
    </div>
  )
}
