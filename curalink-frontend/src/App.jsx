/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PatientDashboard from './pages/PatientDashboard'
import ResearcherDashboard from './pages/ResearcherDashboard'
import ChatInterface from './components/ChatInterface'

function ProtectedRoute({ children, requiredRole }) {
  const { user, token, isLoading } = useAuth()
  if (isLoading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Inter,sans-serif',color:'#7c3aed',fontSize:'18px'}}>Loading...</div>
  if (!token || !user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'patient' ? '/patient' : '/researcher'} replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { user, token, isLoading } = useAuth()
  if (isLoading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Inter,sans-serif',color:'#7c3aed',fontSize:'18px'}}>Loading...</div>
  if (token && user) {
    return <Navigate to={user.role === 'patient' ? '/patient' : '/researcher'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/researcher" element={<ProtectedRoute requiredRole="researcher"><ResearcherDashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<div className="dark-chat-mode" style={{width:'100%',minHeight:'100vh',overflow:'hidden'}}><ChatInterface /></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
