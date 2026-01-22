import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, Search, Filter } from 'lucide-react'

// Sample Jobs Data - 20 diverse job postings
const sampleJobs = [
    {
        id: 'sample-1',
        title: 'Senior Frontend Developer',
        description: 'Build modern web applications using React, TypeScript, and Next.js. Lead frontend architecture decisions and mentor junior developers.',
        company_name: 'TechCorp Solutions',
        skills_required: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        salary_min: 120000,
        salary_max: 160000,
        location: 'San Francisco, CA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-2',
        title: 'Machine Learning Engineer',
        description: 'Design and implement ML models for our recommendation engine. Work with large datasets and deploy models to production.',
        company_name: 'AI Innovations Inc',
        skills_required: ['Python', 'TensorFlow', 'PyTorch', 'AWS'],
        salary_min: 140000,
        salary_max: 190000,
        location: 'New York, NY',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-3',
        title: 'Product Designer',
        description: 'Create beautiful user experiences for our mobile and web applications. Conduct user research and create design systems.',
        company_name: 'DesignHub',
        skills_required: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
        salary_min: 90000,
        salary_max: 130000,
        location: 'Austin, TX',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-4',
        title: 'Backend Developer',
        description: 'Build scalable APIs and microservices using Node.js and Python. Design database schemas and optimize performance.',
        company_name: 'CloudScale Systems',
        skills_required: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
        salary_min: 110000,
        salary_max: 150000,
        location: 'Seattle, WA',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-5',
        title: 'DevOps Engineer',
        description: 'Manage cloud infrastructure on AWS and GCP. Implement CI/CD pipelines and ensure system reliability.',
        company_name: 'InfraCloud Tech',
        skills_required: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
        salary_min: 125000,
        salary_max: 170000,
        location: 'Denver, CO',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-6',
        title: 'Data Analyst',
        description: 'Analyze business data and create actionable insights. Build dashboards and reports for stakeholders.',
        company_name: 'DataDriven Co',
        skills_required: ['SQL', 'Python', 'Tableau', 'Excel'],
        salary_min: 75000,
        salary_max: 100000,
        location: 'Chicago, IL',
        job_type: 'full-time',
        experience_level: 'entry',
        remote_ok: false,
        status: 'open',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-7',
        title: 'Mobile Developer (React Native)',
        description: 'Build cross-platform mobile apps for iOS and Android. Collaborate with designers and backend teams.',
        company_name: 'AppWorks Studio',
        skills_required: ['React Native', 'JavaScript', 'iOS', 'Android'],
        salary_min: 100000,
        salary_max: 140000,
        location: 'Los Angeles, CA',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-8',
        title: 'Full Stack Developer',
        description: 'Work on both frontend and backend of our SaaS platform. Build features from concept to deployment.',
        company_name: 'StartupXYZ',
        skills_required: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
        salary_min: 95000,
        salary_max: 135000,
        location: 'Boston, MA',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-9',
        title: 'Cybersecurity Analyst',
        description: 'Monitor security systems and respond to incidents. Conduct vulnerability assessments and security audits.',
        company_name: 'SecureNet Solutions',
        skills_required: ['Security', 'SIEM', 'Penetration Testing', 'Compliance'],
        salary_min: 105000,
        salary_max: 145000,
        location: 'Washington, DC',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: false,
        status: 'open',
        created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-10',
        title: 'Technical Project Manager',
        description: 'Lead agile development teams and manage project timelines. Bridge communication between technical and business teams.',
        company_name: 'Enterprise Solutions Ltd',
        skills_required: ['Agile', 'Scrum', 'JIRA', 'Leadership'],
        salary_min: 115000,
        salary_max: 155000,
        location: 'Atlanta, GA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-11',
        title: 'QA Engineer',
        description: 'Design and execute test plans for web and mobile applications. Implement automated testing frameworks.',
        company_name: 'QualityFirst Tech',
        skills_required: ['Selenium', 'Jest', 'Cypress', 'API Testing'],
        salary_min: 80000,
        salary_max: 110000,
        location: 'Portland, OR',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-12',
        title: 'Cloud Solutions Architect',
        description: 'Design and implement cloud architectures for enterprise clients. Provide technical leadership and best practices.',
        company_name: 'CloudFirst Consulting',
        skills_required: ['AWS', 'Azure', 'Architecture', 'Microservices'],
        salary_min: 150000,
        salary_max: 200000,
        location: 'Miami, FL',
        job_type: 'full-time',
        experience_level: 'lead',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-13',
        title: 'Junior Web Developer',
        description: 'Learn and grow with our team building web applications. Great opportunity for recent graduates.',
        company_name: 'GrowthTech Academy',
        skills_required: ['HTML', 'CSS', 'JavaScript', 'React'],
        salary_min: 55000,
        salary_max: 75000,
        location: 'Phoenix, AZ',
        job_type: 'full-time',
        experience_level: 'entry',
        remote_ok: false,
        status: 'open',
        created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-14',
        title: 'Data Engineer',
        description: 'Build and maintain data pipelines and ETL processes. Work with big data technologies and cloud platforms.',
        company_name: 'BigData Systems',
        skills_required: ['Python', 'Spark', 'Airflow', 'Snowflake'],
        salary_min: 120000,
        salary_max: 160000,
        location: 'San Jose, CA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-15',
        title: 'iOS Developer',
        description: 'Build native iOS applications using Swift and SwiftUI. Work on innovative consumer-facing products.',
        company_name: 'MobileFirst Apps',
        skills_required: ['Swift', 'SwiftUI', 'Xcode', 'Core Data'],
        salary_min: 110000,
        salary_max: 150000,
        location: 'San Diego, CA',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-16',
        title: 'Technical Writer',
        description: 'Create documentation for APIs and developer tools. Write tutorials, guides, and reference materials.',
        company_name: 'DevDocs Inc',
        skills_required: ['Technical Writing', 'API Documentation', 'Markdown', 'Git'],
        salary_min: 70000,
        salary_max: 95000,
        location: 'Remote',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-17',
        title: 'Blockchain Developer',
        description: 'Build decentralized applications and smart contracts. Work with Ethereum and other blockchain platforms.',
        company_name: 'Web3 Innovations',
        skills_required: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts'],
        salary_min: 130000,
        salary_max: 180000,
        location: 'Remote',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-18',
        title: 'UX Researcher',
        description: 'Conduct user research studies and usability testing. Generate insights to improve product experiences.',
        company_name: 'UserFirst Design',
        skills_required: ['User Research', 'Usability Testing', 'Analytics', 'Surveys'],
        salary_min: 85000,
        salary_max: 120000,
        location: 'New York, NY',
        job_type: 'full-time',
        experience_level: 'mid',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-19',
        title: 'Site Reliability Engineer',
        description: 'Ensure system reliability and uptime. Implement monitoring, alerting, and incident response procedures.',
        company_name: 'UptimeGuard',
        skills_required: ['Linux', 'Prometheus', 'Grafana', 'Python'],
        salary_min: 130000,
        salary_max: 175000,
        location: 'Seattle, WA',
        job_type: 'full-time',
        experience_level: 'senior',
        remote_ok: true,
        status: 'open',
        created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'sample-20',
        title: 'Software Engineering Intern',
        description: 'Summer internship opportunity for students. Work on real projects with experienced mentors.',
        company_name: 'TechGiants Corp',
        skills_required: ['Python', 'Java', 'Problem Solving', 'Git'],
        salary_min: 40000,
        salary_max: 60000,
        location: 'Multiple Locations',
        job_type: 'internship',
        experience_level: 'entry',
        remote_ok: false,
        status: 'open',
        application_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
]

export default function JobListings({ session }) {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [locationTerm, setLocationTerm] = useState('')
    const [savedJobIds, setSavedJobIds] = useState(new Set())
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const q = params.get('q')
        const l = params.get('l')
        if (q) setSearchTerm(q)
        if (l) setLocationTerm(l)
    }, [location.search])

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*, profiles!recruiter_id(full_name)')
                .eq('status', 'open')
                .order('created_at', { ascending: false })

            // Process database jobs
            const dbJobs = (data || []).map((job) => ({
                ...job,
                company: job.company_name || job.profiles?.full_name || 'Company',
                logoUrl: job.company_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${job.company_name || job.title}&backgroundColor=4F46E5`,
                salary: job.salary_min && job.salary_max
                    ? `$${(job.salary_min / 1000)}k - $${(job.salary_max / 1000)}k`
                    : 'Competitive',
                type: job.job_type || 'full-time',
                location: job.location || 'Remote',
                isRemote: job.remote_ok,
                isUrgent: job.application_deadline && new Date(job.application_deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                postedAt: new Date(job.created_at).toLocaleDateString(),
                isSample: false
            }))

            // Process sample jobs with same enrichment
            const enrichedSampleJobs = sampleJobs.map((job) => ({
                ...job,
                company: job.company_name,
                logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${job.company_name}&backgroundColor=4F46E5`,
                salary: job.salary_min && job.salary_max
                    ? `$${(job.salary_min / 1000)}k - $${(job.salary_max / 1000)}k`
                    : 'Competitive',
                type: job.job_type || 'full-time',
                isRemote: job.remote_ok,
                isUrgent: job.application_deadline && new Date(job.application_deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                postedAt: new Date(job.created_at).toLocaleDateString(),
                isSample: true
            }))

            // Combine: database jobs first, then sample jobs
            const allJobs = [...dbJobs, ...enrichedSampleJobs]
            setJobs(allJobs)

            if (error) {
                console.error('Error fetching jobs:', error)
            }
            setLoading(false)
        }

        const fetchSavedJobs = async () => {
            if (session?.user?.id) {
                const { data } = await supabase
                    .from('saved_jobs')
                    .select('job_id')
                    .eq('candidate_id', session.user.id)

                if (data) {
                    setSavedJobIds(new Set(data.map(item => item.job_id)))
                }
            }
        }

        fetchJobs()
        fetchSavedJobs()
    }, [session])

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleSaveJob = async (jobId, e) => {
        e.stopPropagation()

        if (!session) {
            alert('Please login to save jobs')
            navigate('/auth?mode=login')
            return
        }

        const isSaved = savedJobIds.has(jobId)

        try {
            if (isSaved) {
                // Unsave job
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('candidate_id', session.user.id)
                    .eq('job_id', jobId)

                if (error) throw error

                setSavedJobIds(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(jobId)
                    return newSet
                })
            } else {
                // Save job
                const { error } = await supabase
                    .from('saved_jobs')
                    .insert([{ candidate_id: session.user.id, job_id: jobId }])

                if (error) throw error

                setSavedJobIds(prev => new Set([...prev, jobId]))
            }
        } catch (error) {
            console.error('Error toggling save job:', error)
            alert('Failed to ' + (isSaved ? 'unsave' : 'save') + ' job')
        }
    }

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
                        <div
                            key={job.id}
                            className="card"
                            style={{
                                position: 'relative', display: 'flex', flexDirection: 'column',
                                border: '1px solid var(--border)', transition: 'all 0.3s ease', cursor: 'pointer',
                                overflow: 'hidden'
                            }}
                            onClick={() => navigate(`/jobs/${job.id}`)}
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
                                    <MapPin size={12} /> {job.location}
                                </span>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <Clock size={14} /> {job.postedAt}
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className="btn"
                                        style={{
                                            padding: '0.5rem',
                                            color: savedJobIds.has(job.id) ? 'var(--primary)' : 'var(--text-muted)',
                                            backgroundColor: savedJobIds.has(job.id) ? '#EEF2FF' : 'transparent'
                                        }}
                                        title={savedJobIds.has(job.id) ? "Unsave Job" : "Save Job"}
                                        onClick={(e) => toggleSaveJob(job.id, e)}
                                    >
                                        <Bookmark size={20} fill={savedJobIds.has(job.id) ? 'currentColor' : 'none'} />
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/apply/${job.id}`)
                                        }}
                                    >
                                        Apply Now
                                    </button>
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
