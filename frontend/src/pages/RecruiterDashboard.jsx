import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Building, Plus, Users, Briefcase } from 'lucide-react'

export default function RecruiterDashboard({ session, profile }) {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0 })

    useEffect(() => {
        const fetchRecruiterData = async () => {
            // Fetch jobs posted by this recruiter
            const { data: jobsData, error } = await supabase
                .from('jobs')
                .select('*, applications(count)')
                .eq('recruiter_id', session.user.id)
                .order('created_at', { ascending: false })

            if (jobsData) {
                setJobs(jobsData)

                // Calculate basic stats
                const totalApps = jobsData.reduce((acc, job) => acc + (job.applications?.[0]?.count || 0), 0)
                setStats({ totalJobs: jobsData.length, totalApplications: totalApps })
            }
            setLoading(false)
        }

        fetchRecruiterData()
    }, [session])

    if (loading) return <div>Loading Recruiter Workspace...</div>

    return (
        <div>
            {/* Recruiter Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Active Jobs</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalJobs}</h3>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Candidates</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalApplications}</h3>
                    </div>
                </div>
            </div>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building size={20} /> My Posted Jobs
                    </h2>
                    <button
                        onClick={() => navigate('/post-job')}
                        className="btn btn-primary"
                        style={{ gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Post New Job
                    </button>
                </div>

                {jobs.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>You haven't posted any jobs yet.</p>
                        <button
                            onClick={() => navigate('/post-job')}
                            className="btn btn-primary"
                            style={{ marginTop: '1rem' }}
                        >
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {jobs.map(job => (
                            <div key={job.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>{job.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            Posted on {new Date(job.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        backgroundColor: '#F1F5F9',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500'
                                    }}>
                                        {job.type || 'Full-time'}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <Users size={16} color="var(--text-muted)" />
                                            <span>
                                                <strong>{job.applications?.[0]?.count || 0}</strong> Applicants
                                            </span>
                                        </div>
                                    </div>
                                    <button className="btn" style={{ fontSize: '0.875rem', border: '1px solid var(--border)' }}>View Applications</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
