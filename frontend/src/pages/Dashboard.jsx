import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Building, FileText, Plus } from 'lucide-react'

export default function Dashboard({ session }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    // Data for views
    const [applications, setApplications] = useState([])
    const [recruiterJobs, setRecruiterJobs] = useState([])

    useEffect(() => {
        if (!session) {
            navigate('/auth')
            return
        }

        const fetchData = async () => {
            // Retry logic for new signups where profile creation might lag slightly
            let userProfile = null
            let attempts = 0

            while (!userProfile && attempts < 5) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (data) {
                    userProfile = data
                } else {
                    // Wait 500ms before retry
                    await new Promise(r => setTimeout(r, 500))
                    attempts++
                }
            }

            // Fallback: If profile missing in DB, check Auth Metadata (Auto-Heal)
            if (!userProfile) {
                console.warn('Profile missing in DB. Attempting recovery from Auth Metadata...')
                const metaRole = session.user.user_metadata?.role

                if (metaRole) {
                    // Auto-create/Heal the profile
                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: session.user.id,
                            email: session.user.email,
                            role: metaRole,
                            full_name: session.user.email?.split('@')[0] // Default name
                        }])

                    if (!insertError) {
                        console.log('Profile auto-healed!')
                        userProfile = { id: session.user.id, role: metaRole }
                    } else {
                        console.error('Failed to auto-heal profile:', insertError)
                    }
                }
            }

            // Final safety fallback
            if (!userProfile) {
                userProfile = { role: 'candidate' } // Default only if absolutely nothing else works
            }

            console.log('Final Effective Profile:', userProfile)
            setProfile(userProfile)

            // 2. Load Data based on Role
            if (userProfile.role === 'recruiter') {
                console.log('Loading Recruiter Data...')
                const { data: jobs } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('recruiter_id', session.user.id)
                setRecruiterJobs(jobs || [])
            } else {
                console.log('Loading Candidate Data...')
                const { data: apps } = await supabase
                    .from('applications')
                    .select('*, job:jobs(title)')
                    .eq('candidate_id', session.user.id)
                setApplications(apps || [])
            }

            setLoading(false)
        }

        fetchData()
    }, [session, navigate])

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading Dashboard...</div>

    // Debugging UI for development if profile is missing
    if (!profile) return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <p>Error loading profile. Please refresh or try logging in again.</p>
            <button class="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
    )

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Welcome back, {profile?.full_name || session?.user?.email}
                            <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '0.5rem' }}>
                                (Role: {profile?.role ? `"${profile.role}"` : 'undefined'})
                            </span>
                        </p>
                        <span style={{
                            fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px',
                            backgroundColor: profile?.role === 'recruiter' ? '#EEF2FF' : '#F0FDF4',
                            color: profile?.role === 'recruiter' ? 'var(--primary)' : 'var(--secondary)',
                            border: '1px solid currentColor'
                        }}>
                            {profile?.role?.toUpperCase()}
                        </span>
                    </div>
                </div>
                {profile?.role === 'recruiter' && (
                    <button
                        onClick={() => navigate('/post-job')}
                        className="btn btn-primary"
                        style={{ gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Post New Job
                    </button>
                )}
            </header>

            {profile?.role !== 'recruiter' ? (
                <>
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '8px', fontSize: '1rem' }}>AI</span>
                            Resume Analyzer
                        </h2>

                        <div className="card" style={{ background: 'linear-gradient(to right, #ffffff, #F8FAFC)' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Upload your Resume (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if (!file) return

                                            // 1. Analyze Resume
                                            const formData = new FormData()
                                            formData.append('file', file)

                                            try {
                                                const res = await fetch('http://localhost:8000/parse-resume', {
                                                    method: 'POST',
                                                    body: formData
                                                })
                                                const data = await res.json()

                                                if (data.skills) {
                                                    alert(`Resume Parsed! Found ${data.skills.length} skills: ${data.skills.slice(0, 5).join(', ')}...`)

                                                    // 2. Get Recommendations
                                                    const { data: allJobs } = await supabase.from('jobs').select('*')

                                                    const recRes = await fetch('http://localhost:8000/recommend', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            resume_text: data.full_text,
                                                            jobs: allJobs || []
                                                        })
                                                    })
                                                    const recData = await recRes.json()

                                                    if (recData.recommendations?.length > 0) {
                                                        const jobsString = recData.recommendations.map(j => `\n- ${j.title} (${j.score}%)`).join('')
                                                        alert(`Top Recommendations:${jobsString}`)
                                                    } else {
                                                        alert('No strong matches found yet.')
                                                    }
                                                }

                                            } catch (err) {
                                                console.error(err)
                                                alert('Error: Check if backend is running (localhost:8000)')
                                            }
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <p>Our AI will extract your skills and instantly match you with the best open positions.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} /> My Applications
                        </h2>
                        {applications.length === 0 ? (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>You haven't applied to any jobs yet.</p>
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {applications.map(app => (
                                    <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontWeight: '600' }}>{app.job?.title || 'Unknown Job'}</h3>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            backgroundColor: app.status === 'submitted' ? '#DBEAFE' : '#D1FAE5',
                                            color: app.status === 'submitted' ? '#1E40AF' : '#065F46'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            ) : (
                <section>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building size={20} /> My Posted Jobs
                    </h2>
                    {recruiterJobs.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>You haven't posted any jobs yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {recruiterJobs.map(job => (
                                <div key={job.id} className="card">
                                    <h3 style={{ fontWeight: '600' }}>{job.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        Posted on {new Date(job.created_at).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn" style={{ fontSize: '0.875rem', border: '1px solid var(--border)' }}>View Applications</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}
