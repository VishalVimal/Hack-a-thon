import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import JobListings from './pages/JobListings'
import ApplicationForm from './pages/ApplicationForm'
import JobPost from './pages/JobPost'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar session={session} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<JobListings session={session} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard session={session} />} />
          <Route path="/apply/:jobId" element={<ApplicationForm session={session} />} />
          <Route path="/post-job" element={<JobPost session={session} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
