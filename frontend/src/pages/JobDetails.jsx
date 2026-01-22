import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import {
    MapPin, Clock, DollarSign, Users, Building,
    Calendar, CheckCircle, Bookmark, BookmarkCheck,
    ArrowLeft, Send, Sparkles
} from 'lucide-react'

// Sample job data for demo purposes
const sampleJobsData = {
    'sample-1': { id: 'sample-1', title: 'Senior Frontend Developer', company_name: 'TechCorp Solutions', description: 'Build modern web applications using React, TypeScript, and Next.js. Lead frontend architecture decisions and mentor junior developers.\n\nResponsibilities:\n• Design and implement responsive, accessible UI components\n• Review code and provide mentorship to junior developers\n• Collaborate with designers and backend engineers\n• Optimize application performance\n• Write comprehensive unit and integration tests', skills_required: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'], salary_min: 120000, salary_max: 160000, location: 'San Francisco, CA', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Health Insurance', '401k Match', 'Unlimited PTO', 'Remote Work'], created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-2': { id: 'sample-2', title: 'Machine Learning Engineer', company_name: 'AI Innovations Inc', description: 'Design and implement ML models for our recommendation engine. Work with large datasets and deploy models to production.\n\nYou will:\n• Build and optimize ML pipelines\n• Work with TensorFlow and PyTorch\n• Deploy models to AWS/GCP\n• Collaborate with data scientists', skills_required: ['Python', 'TensorFlow', 'PyTorch', 'AWS'], salary_min: 140000, salary_max: 190000, location: 'New York, NY', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Equity', 'Health Insurance', 'Learning Budget'], created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-3': { id: 'sample-3', title: 'Product Designer', company_name: 'DesignHub', description: 'Create beautiful user experiences for our mobile and web applications. Conduct user research and create design systems.', skills_required: ['Figma', 'UI/UX', 'Prototyping', 'User Research'], salary_min: 90000, salary_max: 130000, location: 'Austin, TX', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Flexible Hours', 'Health Insurance'], created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-4': { id: 'sample-4', title: 'Backend Developer', company_name: 'CloudScale Systems', description: 'Build scalable APIs and microservices using Node.js and Python. Design database schemas and optimize performance.', skills_required: ['Node.js', 'Python', 'PostgreSQL', 'Docker'], salary_min: 110000, salary_max: 150000, location: 'Seattle, WA', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Stock Options', 'Health Insurance', 'Gym Membership'], created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-5': { id: 'sample-5', title: 'DevOps Engineer', company_name: 'InfraCloud Tech', description: 'Manage cloud infrastructure on AWS and GCP. Implement CI/CD pipelines and ensure system reliability.', skills_required: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'], salary_min: 125000, salary_max: 170000, location: 'Denver, CO', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Remote Work', 'Health Insurance', 'Annual Bonus'], created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-6': { id: 'sample-6', title: 'Data Analyst', company_name: 'DataDriven Co', description: 'Analyze business data and create actionable insights. Build dashboards and reports for stakeholders.', skills_required: ['SQL', 'Python', 'Tableau', 'Excel'], salary_min: 75000, salary_max: 100000, location: 'Chicago, IL', job_type: 'full-time', experience_level: 'entry', remote_ok: false, benefits: ['Health Insurance', 'Training Programs'], created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-7': { id: 'sample-7', title: 'Mobile Developer (React Native)', company_name: 'AppWorks Studio', description: 'Build cross-platform mobile apps for iOS and Android. Collaborate with designers and backend teams.', skills_required: ['React Native', 'JavaScript', 'iOS', 'Android'], salary_min: 100000, salary_max: 140000, location: 'Los Angeles, CA', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Health Insurance', 'Equipment Budget'], created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-8': { id: 'sample-8', title: 'Full Stack Developer', company_name: 'StartupXYZ', description: 'Work on both frontend and backend of our SaaS platform. Build features from concept to deployment.', skills_required: ['React', 'Node.js', 'MongoDB', 'GraphQL'], salary_min: 95000, salary_max: 135000, location: 'Boston, MA', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Equity', 'Flexible Hours'], created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-9': { id: 'sample-9', title: 'Cybersecurity Analyst', company_name: 'SecureNet Solutions', description: 'Monitor security systems and respond to incidents. Conduct vulnerability assessments and security audits.', skills_required: ['Security', 'SIEM', 'Penetration Testing', 'Compliance'], salary_min: 105000, salary_max: 145000, location: 'Washington, DC', job_type: 'full-time', experience_level: 'mid', remote_ok: false, benefits: ['Security Clearance Support', 'Health Insurance'], created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-10': { id: 'sample-10', title: 'Technical Project Manager', company_name: 'Enterprise Solutions Ltd', description: 'Lead agile development teams and manage project timelines. Bridge communication between technical and business teams.', skills_required: ['Agile', 'Scrum', 'JIRA', 'Leadership'], salary_min: 115000, salary_max: 155000, location: 'Atlanta, GA', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Performance Bonus', 'Health Insurance'], created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-11': { id: 'sample-11', title: 'QA Engineer', company_name: 'QualityFirst Tech', description: 'Design and execute test plans for web and mobile applications. Implement automated testing frameworks.', skills_required: ['Selenium', 'Jest', 'Cypress', 'API Testing'], salary_min: 80000, salary_max: 110000, location: 'Portland, OR', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Health Insurance', 'Professional Development'], created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-12': { id: 'sample-12', title: 'Cloud Solutions Architect', company_name: 'CloudFirst Consulting', description: 'Design and implement cloud architectures for enterprise clients. Provide technical leadership and best practices.', skills_required: ['AWS', 'Azure', 'Architecture', 'Microservices'], salary_min: 150000, salary_max: 200000, location: 'Miami, FL', job_type: 'full-time', experience_level: 'lead', remote_ok: true, benefits: ['Executive Health Plan', 'Stock Options'], created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-13': { id: 'sample-13', title: 'Junior Web Developer', company_name: 'GrowthTech Academy', description: 'Learn and grow with our team building web applications. Great opportunity for recent graduates.', skills_required: ['HTML', 'CSS', 'JavaScript', 'React'], salary_min: 55000, salary_max: 75000, location: 'Phoenix, AZ', job_type: 'full-time', experience_level: 'entry', remote_ok: false, benefits: ['Mentorship Program', 'Health Insurance'], created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-14': { id: 'sample-14', title: 'Data Engineer', company_name: 'BigData Systems', description: 'Build and maintain data pipelines and ETL processes. Work with big data technologies and cloud platforms.', skills_required: ['Python', 'Spark', 'Airflow', 'Snowflake'], salary_min: 120000, salary_max: 160000, location: 'San Jose, CA', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Health Insurance', 'Learning Budget'], created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-15': { id: 'sample-15', title: 'iOS Developer', company_name: 'MobileFirst Apps', description: 'Build native iOS applications using Swift and SwiftUI. Work on innovative consumer-facing products.', skills_required: ['Swift', 'SwiftUI', 'Xcode', 'Core Data'], salary_min: 110000, salary_max: 150000, location: 'San Diego, CA', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Latest MacBook', 'Health Insurance'], created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-16': { id: 'sample-16', title: 'Technical Writer', company_name: 'DevDocs Inc', description: 'Create documentation for APIs and developer tools. Write tutorials, guides, and reference materials.', skills_required: ['Technical Writing', 'API Documentation', 'Markdown', 'Git'], salary_min: 70000, salary_max: 95000, location: 'Remote', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Fully Remote', 'Flexible Hours'], created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-17': { id: 'sample-17', title: 'Blockchain Developer', company_name: 'Web3 Innovations', description: 'Build decentralized applications and smart contracts. Work with Ethereum and other blockchain platforms.', skills_required: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts'], salary_min: 130000, salary_max: 180000, location: 'Remote', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['Crypto Salary Option', 'Equity'], created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-18': { id: 'sample-18', title: 'UX Researcher', company_name: 'UserFirst Design', description: 'Conduct user research studies and usability testing. Generate insights to improve product experiences.', skills_required: ['User Research', 'Usability Testing', 'Analytics', 'Surveys'], salary_min: 85000, salary_max: 120000, location: 'New York, NY', job_type: 'full-time', experience_level: 'mid', remote_ok: true, benefits: ['Health Insurance', 'Research Conferences'], created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-19': { id: 'sample-19', title: 'Site Reliability Engineer', company_name: 'UptimeGuard', description: 'Ensure system reliability and uptime. Implement monitoring, alerting, and incident response procedures.', skills_required: ['Linux', 'Prometheus', 'Grafana', 'Python'], salary_min: 130000, salary_max: 175000, location: 'Seattle, WA', job_type: 'full-time', experience_level: 'senior', remote_ok: true, benefits: ['On-Call Compensation', 'Health Insurance'], created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString() },
    'sample-20': { id: 'sample-20', title: 'Software Engineering Intern', company_name: 'TechGiants Corp', description: 'Summer internship opportunity for students. Work on real projects with experienced mentors.', skills_required: ['Python', 'Java', 'Problem Solving', 'Git'], salary_min: 40000, salary_max: 60000, location: 'Multiple Locations', job_type: 'internship', experience_level: 'entry', remote_ok: false, application_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), benefits: ['Mentorship', 'Housing Stipend', 'Return Offer Potential'], created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() }
}

export default function JobDetails({ session }) {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const isSampleJob = jobId?.startsWith('sample-')

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        fetchJobDetails()
        if (session) {
            if (!isSampleJob) {
                checkApplicationStatus()
                checkSavedStatus()
            }
            fetchProfile()
        }
    }, [jobId, session, isSampleJob])

    const fetchJobDetails = async () => {
        // Handle sample jobs
        if (isSampleJob) {
            const sampleJob = sampleJobsData[jobId]
            if (sampleJob) {
                setJob(sampleJob)
            }
            setLoading(false)
            return
        }

        // Fetch real job from database
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    *,
                    profiles!recruiter_id(full_name, email, company_name)
                `)
                .eq('id', jobId)
                .single()

            if (error) throw error
            setJob(data)
        } catch (error) {
            console.error('Error fetching job:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProfile = async () => {
        if (!session) return
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
        setProfile(data)
    }

    const checkApplicationStatus = async () => {
        if (!session) return
        const { data } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', jobId)
            .eq('candidate_id', session.user.id)
            .single()

        setHasApplied(!!data)
    }

    const checkSavedStatus = async () => {
        if (!session) return
        const { data } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('job_id', jobId)
            .eq('candidate_id', session.user.id)
            .single()

        setIsSaved(!!data)
    }

    const handleSaveJob = async () => {
        if (!session) {
            navigate('/auth?mode=login')
            return
        }

        try {
            if (isSaved) {
                await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('job_id', jobId)
                    .eq('candidate_id', session.user.id)
                setIsSaved(false)
            } else {
                await supabase
                    .from('saved_jobs')
                    .insert({
                        job_id: jobId,
                        candidate_id: session.user.id
                    })
                setIsSaved(true)
            }
        } catch (error) {
            console.error('Error saving job:', error)
        }
    }

    const handleApply = () => {
        if (!session) {
            navigate('/auth?mode=login')
            return
        }

        if (profile?.role !== 'candidate') {
            alert('Only candidates can apply for jobs')
            return
        }

        navigate(`/apply/${jobId}`)
    }

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not specified'
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
        if (min) return `From $${min.toLocaleString()}`
        if (max) return `Up to $${max.toLocaleString()}`
    }

    const getExperienceLabel = (level) => {
        const labels = {
            'entry': 'Entry Level',
            'mid': 'Mid Level',
            'senior': 'Senior Level',
            'lead': 'Lead/Principal'
        }
        return labels[level] || level
    }

    const getJobTypeLabel = (type) => {
        const labels = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'contract': 'Contract',
            'internship': 'Internship'
        }
        return labels[type] || type
    }

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading job details...
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>Job not found</h2>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                    cursor: 'pointer'
                }}
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* Job header */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {job.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Building size={16} />
                            <span style={{ fontWeight: '500' }}>
                                {job.company_name || job.profiles?.company_name || job.profiles?.full_name}
                            </span>
                        </div>
                    </div>

                    {session && profile?.role === 'candidate' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleSaveJob}
                                style={{
                                    padding: '0.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: '0.5rem',
                                    background: 'white',
                                    cursor: 'pointer',
                                    color: isSaved ? 'var(--primary)' : 'var(--text-muted)'
                                }}
                                title={isSaved ? 'Remove from saved' : 'Save job'}
                            >
                                {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Job meta info */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} color="var(--text-muted)" />
                        <span>{job.location || 'Location not specified'}</span>
                        {job.remote_ok && (
                            <span style={{
                                fontSize: '0.75rem',
                                backgroundColor: '#EEF2FF',
                                color: 'var(--primary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem'
                            }}>
                                Remote OK
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="var(--text-muted)" />
                        <span>{getJobTypeLabel(job.job_type)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} color="var(--text-muted)" />
                        <span>{getExperienceLabel(job.experience_level)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={16} color="var(--text-muted)" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                </div>

                {/* Application deadline */}
                {job.application_deadline && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: '#FEF3C7',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <Calendar size={16} />
                        <span>Application deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                    </div>
                )}

                {/* Apply button */}
                {session && profile?.role === 'candidate' && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {hasApplied ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#16A34A',
                                fontWeight: '500'
                            }}>
                                <CheckCircle size={20} />
                                Already Applied
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Send size={16} />
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                )}

                {!session && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ marginBottom: '1rem' }}>Sign in to apply for this job</p>
                        <button
                            onClick={() => navigate('/auth?mode=login')}
                            className="btn btn-primary"
                        >
                            Sign In
                        </button>
                    </div>
                )}
            </div>

            {/* Job description */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Job Description
                </h2>
                <div style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    color: 'var(--text-primary)'
                }}>
                    {job.description}
                </div>
            </div>

            {/* Skills required */}
            {job.skills_required && job.skills_required.length > 0 && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Required Skills
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {job.skills_required.map((skill, index) => (
                            <span
                                key={index}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#EEF2FF',
                                    color: 'var(--primary)',
                                    borderRadius: '999px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500'
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Benefits & Perks
                    </h2>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                        {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Company info */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    About the Company
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        {(job.company_name || job.profiles?.company_name || job.profiles?.full_name || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            {job.company_name || job.profiles?.company_name || job.profiles?.full_name}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Posted {new Date(job.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}