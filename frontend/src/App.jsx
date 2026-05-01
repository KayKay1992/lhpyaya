import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import RegisterEvent from './pages/RegisterEvent'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateEvent from './pages/CreateEvent'
import ViewRegistered from './pages/ViewRegistered'
import AdminDashboard from './pages/AdminDashboard'
import EditEvent from './pages/EditEvent'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterEvent />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

        {/* protected route */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute><CreateEvent/></ProtectedRoute>} />
          <Route path="/view-registered" element={<ProtectedRoute><ViewRegistered /></ProtectedRoute>} />
          <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
    </Routes>
  )
}

export default App