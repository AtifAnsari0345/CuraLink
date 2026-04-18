import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import curalinkLogo from '../assets/Curalink logo.jpg'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f4ff 0%, #eff6ff 100%)',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: isMobile ? '24px 20px' : '48px 40px',
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
  }

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '32px',
    background: 'linear-gradient(90deg, #7c3aed, #2563eb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '600'
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '15px',
    marginBottom: '20px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'opacity 0.2s'
  }

  const errorStyle = {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center'
  }

  const linkStyle = {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px'
  }

  const aStyle = {
    color: '#7c3aed',
    textDecoration: 'none',
    fontWeight: '600'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'patient' ? '/patient' : '/researcher')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={curalinkLogo} alt="Curalink" style={{width:56,height:56,borderRadius:14,objectFit:'cover',display:'block',margin:'0 auto 16px'}} />
        <div style={logoStyle}><span>Curalink</span></div>
        <h2 style={{textAlign:'center', margin:'0 0 8px', color:'#1e293b', fontSize:'24px'}}>Sign In</h2>
        <p style={{textAlign:'center', margin:'0 0 32px', color:'#64748b', fontSize:'14px'}}>Welcome back! Please enter your details.</p>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={linkStyle}>
          Don't have an account? <Link to="/register" style={aStyle}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}
