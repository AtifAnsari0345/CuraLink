import { useEffect } from 'react'

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const borderColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#2563eb'
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'white',
      borderLeft: `4px solid ${borderColors[type]}`,
      padding: '14px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      fontWeight: '600',
      color: '#1e293b',
      zIndex: '1000',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
