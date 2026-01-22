import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Upload, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'

// Sample job data for demo purposes
const sampleJobsData = {
    'sample-1': { id: 'sample-1', title: 'Senior Frontend Developer', company_name: 'TechCorp Solutions', description: 'Build modern web applications using React, TypeScript, and Next.js.' },
    'sample-2': { id: 'sample-2', title: 'Machine Learning Engineer', company_name: 'AI Innovations Inc', description: 'Design and implement ML models for our recommendation engine.' },
    'sample-3': { id: 'sample-3', title: 'Product Designer', company_name: 'DesignHub', description: 'Create beautiful user experiences for our mobile and web applications.' },
    'sample-4': { id: 'sample-4', title: 'Backend Developer', company_name: 'CloudScale Systems', description: 'Build scalable APIs and microservices using Node.js and Python.' },
    'sample-5': { id: 'sample-5', title: 'DevOps Engineer', company_name: 'InfraCloud Tech', description: 'Manage cloud infrastructure on AWS and GCP.' },
    'sample-6': { id: 'sample-6', title: 'Data Analyst', company_name: 'DataDriven Co', description: 'Analyze business data and create actionable insights.' },
    'sample-7': { id: 'sample-7', title: 'Mobile Developer (React Native)', company_name: 'AppWorks Studio', description: 'Build cross-platform mobile apps for iOS and Android.' },
    'sample-8': { id: 'sample-8', title: 'Full Stack Developer', company_name: 'StartupXYZ', description: 'Work on both frontend and backend of our SaaS platform.' },
    'sample-9': { id: 'sample-9', title: 'Cybersecurity Analyst', company_name: 'SecureNet Solutions', description: 'Monitor security systems and respond to incidents.' },
    'sample-10': { id: 'sample-10', title: 'Technical Project Manager', company_name: 'Enterprise Solutions Ltd', description: 'Lead agile development teams and manage project timelines.' },
    'sample-11': { id: 'sample-11', title: 'QA Engineer', company_name: 'QualityFirst Tech', description: 'Design and execute test plans for web and mobile applications.' },
    'sample-12': { id: 'sample-12', title: 'Cloud Solutions Architect', company_name: 'CloudFirst Consulting', description: 'Design and implement cloud architectures for enterprise clients.' },
    'sample-13': { id: 'sample-13', title: 'Junior Web Developer', company_name: 'GrowthTech Academy', description: 'Learn and grow with our team building web applications.' },
    'sample-14': { id: 'sample-14', title: 'Data Engineer', company_name: 'BigData Systems', description: 'Build and maintain data pipelines and ETL processes.' },
    'sample-15': { id: 'sample-15', title: 'iOS Developer', company_name: 'MobileFirst Apps', description: 'Build native iOS applications using Swift and SwiftUI.' },
    'sample-16': { id: 'sample-16', title: 'Technical Writer', company_name: 'DevDocs Inc', description: 'Create documentation for APIs and developer tools.' },
    'sample-17': { id: 'sample-17', title: 'Blockchain Developer', company_name: 'Web3 Innovations', description: 'Build decentralized applications and smart contracts.' },
    'sample-18': { id: 'sample-18', title: 'UX Researcher', company_name: 'UserFirst Design', description: 'Conduct user research studies and usability testing.' },
    'sample-19': { id: 'sample-19', title: 'Site Reliability Engineer', company_name: 'UptimeGuard', description: 'Ensure system reliability and uptime.' },
    'sample-20': { id: 'sample-20', title: 'Software Engineering Intern', company_name: 'TechGiants Corp', description: 'Summer internship opportunity for students.' }
}

export default function ApplicationForm({ session }) {
    const { jobId } = useParams()
    const navigate = useNavigate()

    const [job, setJob] = useState(null)
    const [file, setFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const isSampleJob = jobId?.startsWith('sample-')

    useEffect(() => {
        if (!session) {
            navigate(`/auth?mode=login`)
            return
        }

        // Check if it's a sample job
        if (isSampleJob) {
            const sampleJob = sampleJobsData[jobId]
            if (sampleJob) {
                setJob(sampleJob)
            } else {
                setError('Job not found')
            }
            return
        }

        // Fetch real job from database
        const fetchJob = async () => {
            const { data, error: fetchError } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .single()

            if (fetchError) {
                console.error('Error fetching job:', fetchError)
                setError('Job not found')
            } else {
                setJob(data)
            }
        }
        fetchJob()
    }, [jobId, session, navigate, isSampleJob])

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (selected && selected.type === 'application/pdf') {
            setFile(selected)
            setError(null)
        } else {
            setError('Please upload a PDF file.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return setError('Please select a resume to upload.')

        setSubmitting(true)
        setError(null)

        // Handle sample job application (demo mode)
        if (isSampleJob) {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess(true)
            setSubmitting(false)
            return
        }

        // Handle real job application
        try {
            const userId = session.user.id
            const filePath = `${userId}/${jobId}/${file.name}`

            // 1. Upload Resume
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file, {
                    upsert: true,
                    metadata: { owner_id: userId }
                })

            if (uploadError) throw uploadError

            // 2. Create Application Record
            const { error: dbError } = await supabase
                .from('applications')
                .insert({
                    job_id: jobId,
                    candidate_id: userId,
                    resume_path: filePath,
                    status: 'submitted'
                })

            if (dbError) throw dbError

            setSuccess(true)

        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to submit application.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!job && !error) return <div className="container" style={{ marginTop: '2rem' }}>Loading Job Details...</div>

    // Success State
    if (success) {
        return (
            <div className="container" style={{ marginTop: '4rem', maxWidth: '600px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle size={40} style={{ color: '#16A34A' }} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', color: '#16A34A' }}>Application Submitted!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Your application for {job?.title} has been received. The recruiter will review your profile soon.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            className="btn"
                            style={{ border: '1px solid var(--border)' }}
                            onClick={() => navigate('/jobs')}
                        >
                            Browse More Jobs
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '600px' }}>
            <div className="card">
                <h2 style={{ marginBottom: '0.5rem' }}>Apply for {job?.title}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '1.5rem' }}>
                    {job?.company_name}
                </p>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Upload your resume to apply. Our secure AI system will review your qualifications.
                </p>

                {error && (
                    <div style={{
                        padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem',
                        backgroundColor: '#FEF2F2', color: '#991B1B', display: 'flex', gap: '0.5rem'
                    }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem', border: '2px dashed var(--border)', borderRadius: '1rem', padding: '2rem', textAlign: 'center' }}>
                        <Upload size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Upload Resume (PDF)</p>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="resume-upload"
                        />
                        {file ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                                <CheckCircle size={18} /> {file.name}
                            </div>
                        ) : (
                            <label htmlFor="resume-upload" className="btn" style={{ border: '1px solid var(--border)', cursor: 'pointer' }}>
                                Select File
                            </label>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={submitting || !file}
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    )
}
