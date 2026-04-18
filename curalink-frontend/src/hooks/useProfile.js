import { useState } from 'react'
import { EMPTY_PROFILE_FORM } from '../utils/dashboardUtils'

export function useProfile(user, updateProfile, showToast, loadStats) {
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE_FORM)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [interestInput, setInterestInput] = useState('')

  const handleAddSpecialty = (event) => {
    if (event.key !== 'Enter' || !specialtyInput.trim()) return
    event.preventDefault()
    if (!profileForm.specialties.includes(specialtyInput.trim())) {
      setProfileForm((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }))
    }
    setSpecialtyInput('')
  }

  const handleRemoveSpecialty = (specialty) => {
    setProfileForm((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((item) => item !== specialty)
    }))
  }

  const handleAddInterest = (event) => {
    if (event.key !== 'Enter' || !interestInput.trim()) return
    event.preventDefault()
    if (!profileForm.researchInterests.includes(interestInput.trim())) {
      setProfileForm((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, interestInput.trim()]
      }))
    }
    setInterestInput('')
  }

  const handleRemoveInterest = (interest) => {
    setProfileForm((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((item) => item !== interest)
    }))
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setIsSavingProfile(true)
    try {
      await updateProfile(profileForm)
      loadStats()
      showToast('Profile saved successfully!', 'success')
    } catch (error) {
      console.error('Failed to save profile:', error)
      showToast('Failed to save profile', 'error')
    } finally {
      setIsSavingProfile(false)
    }
  }

  return {
    profileForm,
    setProfileForm,
    isSavingProfile,
    setIsSavingProfile,
    specialtyInput,
    setSpecialtyInput,
    interestInput,
    setInterestInput,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleAddInterest,
    handleRemoveInterest,
    handleSaveProfile
  }
}
