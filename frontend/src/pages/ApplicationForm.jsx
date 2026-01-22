import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function ApplicationForm({ session }) {
    const { jobId } = useParams()
    const navigate = useNavigate()

    const [job, setJob] = useState(null)
    const [file, setFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!session) {
            // Save intended destination?
            navigate(`/auth?mode=login`)
            return
        }

        // Fetch Job Details
        const fetchJob = async () => {
            const { data } = await supabase.from('jobs').select('*').eq('id', jobId).single()
            setJob(data)
        }
        fetchJob()
    }, [jobId, session, navigate])

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

            alert('Application Received!')
            navigate('/dashboard')

        } catch (err) {
            console.error(err)
            setError(err.message || 'Failed to submit application.')
        } finally {
            setSubmitting(false)
        }
    }

    if (!job) return <div className="container" style={{ marginTop: '2rem' }}>Loading Job Details...</div>

    return (
        <div className="container" style={{ marginTop: '4rem', maxWidth: '600px' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Apply for {job.title}</h2>
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
