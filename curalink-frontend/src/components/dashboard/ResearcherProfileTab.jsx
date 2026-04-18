/* eslint-disable no-unused-vars */
import { useState } from 'react'

export default function ResearcherProfileTab({
  user,
  handleSaveProfile,
  isSavingProfile,
  profileForm,
  setProfileForm,
  specialtyInput,
  setSpecialtyInput,
  handleAddSpecialty,
  handleRemoveSpecialty,
  interestInput,
  setInterestInput,
  handleAddInterest,
  handleRemoveInterest,
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

  const commonSpecialtyOptions = [
    'Oncology',
    'Neurology',
    'Cardiology',
    'Psychiatry',
    'Endocrinology',
    'Immunology',
    'Pediatrics',
    'Surgery'
  ]

  const commonInterestOptions = [
    'Drug Development',
    'Clinical Trials',
    'Genetics',
    'AI in Medicine',
    'Precision Medicine',
    'Public Health'
  ]

  const toggleSpecialty = (specialty) => {
    if (profileForm.specialties.includes(specialty)) {
      handleRemoveSpecialty(specialty)
    } else {
      setProfileForm((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }))
    }
  }

  const toggleInterest = (interest) => {
    if (profileForm.researchInterests.includes(interest)) {
      handleRemoveInterest(interest)
    } else {
      setProfileForm((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, interest]
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
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
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
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
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
              Institution
            </label>
            <input
              type="text"
              placeholder="University, hospital, lab, or organization"
              value={profileForm.institution}
              onChange={(event) =>
                setProfileForm((prev) => ({ ...prev, institution: event.target.value }))
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
              ORCID ID
            </label>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              value={profileForm.orcidId}
              onChange={(event) =>
                setProfileForm((prev) => ({ ...prev, orcidId: event.target.value }))
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
              rows={4}
              value={profileForm.bio}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, bio: event.target.value }))}
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
            Research Profile
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
              Specialties
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {commonSpecialtyOptions.map((specialty, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: profileForm.specialties.includes(specialty)
                      ? '2px solid #7c3aed'
                      : '2px solid #e2e8f0',
                    backgroundColor: profileForm.specialties.includes(specialty)
                      ? '#7c3aed'
                      : '#ffffff',
                    color: profileForm.specialties.includes(specialty) ? '#ffffff' : '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileForm.specialties.includes(specialty)) {
                      e.target.style.borderColor = '#7c3aed'
                      e.target.style.color = '#7c3aed'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileForm.specialties.includes(specialty)) {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.color = '#374151'
                    }
                  }}
                >
                  {specialty}
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
              {profileForm.specialties
                .filter((s) => !commonSpecialtyOptions.includes(s))
                .map((specialty, index) => (
                  <span
                    key={`custom-${index}`}
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
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
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
              placeholder="Type specialty and press Enter"
              value={specialtyInput}
              onChange={(event) => setSpecialtyInput(event.target.value)}
              onKeyDown={handleAddSpecialty}
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
                marginBottom: '8px'
              }}
            >
              Research Interests
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              {commonInterestOptions.map((interest, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    border: profileForm.researchInterests.includes(interest)
                      ? '2px solid #2563eb'
                      : '2px solid #e2e8f0',
                    backgroundColor: profileForm.researchInterests.includes(interest)
                      ? '#2563eb'
                      : '#ffffff',
                    color: profileForm.researchInterests.includes(interest) ? '#ffffff' : '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileForm.researchInterests.includes(interest)) {
                      e.target.style.borderColor = '#2563eb'
                      e.target.style.color = '#2563eb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileForm.researchInterests.includes(interest)) {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.color = '#374151'
                    }
                  }}
                >
                  {interest}
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
              {profileForm.researchInterests
                .filter((i) => !commonInterestOptions.includes(i))
                .map((interest, index) => (
                  <span
                    key={`custom-${index}`}
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
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
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
              placeholder="Type research interest and press Enter"
              value={interestInput}
              onChange={(event) => setInterestInput(event.target.value)}
              onKeyDown={handleAddInterest}
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

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
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
                Availability
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Available', 'Busy', 'On Leave'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setProfileForm((prev) => ({ ...prev, availability: option }))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: profileForm.availability === option ? '#7c3aed' : '#e2e8f0',
                      backgroundColor: profileForm.availability === option ? '#7c3aed' : '#ffffff',
                      color: profileForm.availability === option ? '#ffffff' : '#374151',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
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
                Contact Preference
              </label>
              <select
                value={profileForm.contactPreference}
                onChange={(event) =>
                  setProfileForm((prev) => ({ ...prev, contactPreference: event.target.value }))
                }
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  width: '100%',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed'
                  e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <option value="Via Platform">Via Platform</option>
                <option value="Email Preferred">Email Preferred</option>
                <option value="Meeting First">Meeting First</option>
              </select>
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
              Researcher
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
