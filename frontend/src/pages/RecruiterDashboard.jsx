import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Building, Plus, Users, Briefcase, TrendingUp, Eye } from 'lucide-react'

export default function RecruiterDashboard({ session, profile }) {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        pendingReviews: 0
    })

    useEffect(() => {
        const fetchRecruiterData = async () => {
            // Fetch jobs posted by this recruiter
            const { data: jobsData, error } = await supabase
                .from('jobs')
                .select(`
                    *, 
                    applications(
                        count,
                        status
                    )
                `)
                .eq('recruiter_id', session.user.id)
                .order('created_at', { ascending: false })

            if (jobsData) {
                setJobs(jobsData)

                // Calculate detailed stats
                const activeJobs = jobsData.filter(job => job.status === 'open').length

                let totalApps = 0
                let pendingReviews = 0

                jobsData.forEach(job => {
                    if (job.applications && Array.isArray(job.applications)) {
                        totalApps += job.applications.length
                        pendingReviews += job.applications.filter(app => app.status === 'submitted').length
                    }
                })

                setStats({
                    totalJobs: jobsData.length,
                    totalApplications: totalApps,
                    activeJobs,
                    pendingReviews
                })
            }
            setLoading(false)
        }

        fetchRecruiterData()
    }, [session])

    const getApplicationCount = (job) => {
        if (job.applications && Array.isArray(job.applications)) {
            return job.applications.length
        }
        return 0
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'open': { className: 'badge badge-success', label: 'Active' },
            'closed': { className: 'badge badge-error', label: 'Closed' },
            'draft': { className: 'badge', style: { backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)' }, label: 'Draft' },
            'paused': { className: 'badge badge-warning', label: 'Paused' }
        }
        const config = statusConfig[status] || statusConfig.open
        return (
            <span className={config.className} style={config.style}>
                {config.label}
            </span>
        )
    }

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading dashboard...</p>
        </div>
    )

    return (
        <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {profile?.full_name || 'Recruiter'}</p>
                </div>
                <button
                    onClick={() => navigate('/post-job')}
                    className="btn btn-primary pulse"
                    style={{ gap: '0.5rem' }}
                >
                    <Plus size={18} /> Post New Job
                </button>
            </div>

            {/* Recruiter Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Active Jobs</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.activeJobs}</h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Candidates</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.totalApplications}</h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#FEF3C7', color: 'var(--warning)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Pending Reviews</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--warning)' }}>{stats.pendingReviews}</h3>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#F3F4F6', color: 'var(--text-muted)' }}>
                            <Building size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Jobs Posted</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{stats.totalJobs}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={24} className="text-primary" /> My Posted Jobs
                    </h2>
                </div>

                {jobs.length === 0 ? (
                    <div className="card" style={{
                        padding: '4rem',
                        textAlign: 'center',
                        background: 'linear-gradient(to bottom, var(--bg-surface), var(--bg-body))'
                    }}>
                        <Briefcase size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem', opacity: 0.5 }} />
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No jobs posted yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start attracting top talent by posting your first job opening</p>
                        <button onClick={() => navigate('/post-job')} className="btn btn-primary">
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {jobs.map(job => (
                            <div key={job.id} className="card" style={{
                                transition: 'all var(--duration) var(--ease)',
                                cursor: 'pointer',
                                borderLeft: `4px solid ${job.status === 'open' ? 'var(--success)' : 'var(--text-muted)'}`
                            }}
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontWeight: '600', fontSize: '1.125rem' }}>{job.title}</h3>
                                            {getStatusBadge(job.status || 'open')}
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            Posted on {new Date(job.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                            {job.location && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    📍 {job.location}
                                                </span>
                                            )}
                                            {job.job_type && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    💼 {job.job_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    borderTop: '1px solid var(--border)',
                                    paddingTop: '1rem',
                                    marginTop: '0.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                            <Users size={18} color="var(--primary)" />
                                            <span>
                                                <strong style={{ color: 'var(--primary)' }}>{getApplicationCount(job)}</strong>
                                                <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Applicants</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.875rem', gap: '0.5rem', padding: '0.5rem 1rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/jobs/${job.id}`)
                                            }}
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.875rem', gap: '0.5rem', padding: '0.5rem 1rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/jobs/${job.id}/applications`)
                                            }}
                                        >
                                            <Users size={16} /> Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
