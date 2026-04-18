export default function LoadingSpinner({ size = 'md', color = '#7c3aed' }) {
  const sizes = {
    sm: '20px',
    md: '32px',
    lg: '48px'
  }

  const sizePx = sizes[size]

  return (
    <div style={{
      width: sizePx,
      height: sizePx,
      border: `3px solid ${color}20`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
