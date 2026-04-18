import { useState } from 'react'

export function useToasts() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return {
    toast,
    showToast
  }
}
