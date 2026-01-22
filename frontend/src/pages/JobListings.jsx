import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, Search, Filter } from 'lucide-react'

export default function JobListings() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching jobs:', error)
            } else {
                // Enriched data for UI demo (Mocking fields not yet in DB)
                const enrichedJobs = (data || []).map((job, index) => ({
                    ...job,
                    company: ['TechCorp', 'InnovateX', 'SoftSys', 'DataFlow'][index % 4],
                    logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${job.title}&backgroundColor=4F46E5`,
                    salary: ['$80k - $100k', '$120k - $150k', '$90k - $110k', 'Competitive'][index % 4],
                    type: ['Full-time', 'Contract', 'Remote', 'Full-time'][index % 4],
                    isUrgent: index % 3 === 0, // Mock urgent status
                    postedAt: new Date(job.created_at).toLocaleDateString()
                }))
                setJobs(enrichedJobs)
            }
            setLoading(false)
        }

        fetchJobs()
    }, [])

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container" style={{ marginTop: '3rem', paddingBottom: '4rem' }}>

            {/* Header Section */}
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                    Find Your <span style={{ color: 'var(--primary)', position: 'relative' }}>
                        Next Chapter
                        <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '10px', color: 'var(--secondary)', opacity: 0.5 }} viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                    </span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Discover opportunities at top companies.
                    <br />Apply in seconds with our AI-powered platform.
                </p>

                {/* Search Bar */}
                <div className="glass" style={{
                    display: 'flex', alignItems: 'center', maxWidth: '700px', margin: '0 auto',
                    padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <Search className="text-muted" size={20} style={{ margin: '0 1rem', color: 'var(--text-muted)' }} />
                    <input
                        placeholder="Search by job title, skill, or keyword..."
                        style={{
                            flex: 1, border: 'none', background: 'transparent', fontSize: '1rem',
                            padding: '0.75rem', outline: 'none', color: 'var(--text-main)'
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
                        Search
                    </button>
                </div>
            </header>

            {/* Jobs Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading opportunities...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                    {filteredJobs.map(job => (
                        <div key={job.id} className="card" style={{
                            position: 'relative', display: 'flex', flexDirection: 'column',
                            border: '1px solid var(--border)', transition: 'all 0.3s ease', cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)'
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                e.currentTarget.style.borderColor = 'var(--primary)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                e.currentTarget.style.borderColor = 'var(--border)'
                            }}
                        >

                            {/* Urgent Badge */}
                            {job.isUrgent && (
                                <div style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    backgroundColor: '#FEF2F2', color: '#DC2626',
                                    fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.75rem',
                                    borderRadius: '999px', letterSpacing: '0.05em'
                                }}>
                                    URGENT
                                </div>
                            )}

                            {/* Card Header */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                                <img
                                    src={job.logoUrl}
                                    alt="Company Logo"
                                    style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }}
                                />
                                <div style={{ marginTop: '0.25rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.25rem' }}>{job.title}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{job.company}</p>
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                    fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '8px',
                                    backgroundColor: '#EEF2FF', color: 'var(--primary)', fontWeight: '600'
                                }}>
                                    <Briefcase size={12} /> {job.type}
                                </span>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                    fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '8px',
                                    backgroundColor: '#F0FDF4', color: 'var(--secondary)', fontWeight: '600'
                                }}>
                                    <DollarSign size={12} /> {job.salary}
                                </span>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                    fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '8px',
                                    backgroundColor: '#F8FAFC', color: 'var(--text-muted)', fontWeight: '600', border: '1px solid var(--border)'
                                }}>
                                    <MapPin size={12} /> Remote
                                </span>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <Clock size={14} /> {job.postedAt}
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }} title="Save Job">
                                        <Bookmark size={20} />
                                    </button>
                                    <Link to={`/apply/${job.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                                        Apply Now
                                    </Link>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Empty State */}
                    {!loading && filteredJobs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>No jobs found matching "{searchTerm}"</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
