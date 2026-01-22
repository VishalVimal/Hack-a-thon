import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { 
    User, Mail, Phone, MapPin, Star, Calendar, 
    MessageSquare, CheckCircle, XCircle, Clock,
    Download, Eye, ArrowLeft, Filter
} from 'lucide-react'

export default function ApplicationManagement({ session }) {
    const { jobId } = useParams()
    const navigate = useNavigate()
    
    const [job, setJob] = useState(null)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('score')

    useEffect(() => {
        if (!session) {
            navigate('/auth')
            return
        }
        fetchJobAndApplications()
    }, [jobId, session])

    const fetchJobAndApplications = async () => {
        try {
            // Fetch job details
            const { data: jobData, error: jobError } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', jobId)
                .eq('recruiter_id', session.user.id)
                .single()

            if (jobError) throw jobError
            setJob(jobData)

            // Fetch applications
            const { data: appsData, error: appsError } = await supabase
                .from('applications')
                .select(`
                    *,
                    profiles!candidate_id(
                        full_name, email, phone, location, skills, 
                        experience_years, bio, linkedin_url, portfolio_url
                    )
                `)
                .eq('job_id', jobId)
                .order('score', { ascending: false })

            if (appsError) throw appsError
            setApplications(appsData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
            if (error.message.includes('Row Level Security')) {
                alert('You are not authorized to view applications for this job.')
                navigate('/dashboard')
            }
        } finally {
            setLoading(false)
        }
    }

    const updateApplicationStatus = async (applicationId, status, notes = '') => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ 
                    status, 
                    recruiter_notes: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationId)

            if (error) throw error

            // Update local state
            setApplications(apps => 
                apps.map(app => 
                    app.id === applicationId 
                        ? { ...app, status, recruiter_notes: notes }
                        : app
                )
            )

            // TODO: Send email notification to candidate
            alert(`Application ${status} successfully!`)
        } catch (error) {
            console.error('Error updating application:', error)
            alert('Failed to update application status')
        }
    }

    const rateApplication = async (applicationId, rating) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ rating })
                .eq('id', applicationId)

            if (error) throw error

            setApplications(apps => 
                apps.map(app => 
                    app.id === applicationId 
                        ? { ...app, rating }
                        : app
                )
            )
        } catch (error) {
            console.error('Error rating application:', error)
        }
    }

    const scheduleInterview = async (applicationId) => {
        // TODO: Implement interview scheduling
        alert('Interview scheduling feature coming soon!')
    }

    const downloadResume = async (resumePath) => {
        try {
            const { data, error } = await supabase.storage
                .from('resumes')
                .download(resumePath)

            if (error) throw error

            // Create download link
            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = resumePath.split('/').pop()
            a.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading resume:', error)
            alert('Failed to download resume')
        }
    }

    const filteredApplications = applications
        .filter(app => statusFilter === 'all' || app.status === statusFilter)
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return (b.score || 0) - (a.score || 0)
                case 'date':
                    return new Date(b.created_at) - new Date(a.created_at)
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0)
                default:
                    return 0
            }
        })

    const getStatusColor = (status) => {
        const colors = {
            'submitted': '#3B82F6',
            'reviewed': '#F59E0B',
            'shortlisted': '#8B5CF6',
            'interviewed': '#06B6D4',
            'accepted': '#10B981',
            'rejected': '#EF4444'
        }
        return colors[status] || '#6B7280'
    }

    const getStatusLabel = (status) => {
        const labels = {
            'submitted': 'New Application',
            'reviewed': 'Under Review',
            'shortlisted': 'Shortlisted',
            'interviewed': 'Interviewed',
            'accepted': 'Accepted',
            'rejected': 'Rejected'
        }
        return labels[status] || status
    }

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading applications...
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>Job not found or access denied</h2>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        marginBottom: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Applications for "{job.title}"
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {applications.length} total applications
                </p>
            </div>

            {/* Filters and sorting */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={16} />
                        <span style={{ fontWeight: '500' }}>Filter:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        >
                            <option value="all">All Applications</option>
                            <option value="submitted">New</option>
                            <option value="reviewed">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>Sort by:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)' }}
                        >
                            <option value="score">Match Score</option>
                            <option value="date">Application Date</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications list */}
            {filteredApplications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {statusFilter === 'all' 
                            ? 'No applications yet for this job.'
                            : `No applications with status "${statusFilter}".`
                        }
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredApplications.map(application => (
                        <div key={application.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {/* Candidate info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {application.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {application.profiles?.full_name || 'Unknown Candidate'}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {application.profiles?.email && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Mail size={14} />
                                                        {application.profiles.email}
                                                    </div>
                                                )}
                                                {application.profiles?.location && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <MapPin size={14} />
                                                        {application.profiles.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {application.profiles?.skills && application.profiles.skills.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {application.profiles.skills.slice(0, 5).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#F3F4F6',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {application.profiles.skills.length > 5 && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        +{application.profiles.skills.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Application meta */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
                                        {application.score && (
                                            <span>Match Score: {Math.round(application.score)}%</span>
                                        )}
                                        {application.profiles?.experience_years && (
                                            <span>{application.profiles.experience_years} years experience</span>
                                        )}
                                    </div>
                                </div>

                                {/* Status and actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                    {/* Status badge */}
                                    <span style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        backgroundColor: `${getStatusColor(application.status)}20`,
                                        color: getStatusColor(application.status)
                                    }}>
                                        {getStatusLabel(application.status)}
                                    </span>

                                    {/* Rating */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={16}
                                                style={{
                                                    cursor: 'pointer',
                                                    fill: star <= (application.rating || 0) ? '#F59E0B' : 'none',
                                                    color: star <= (application.rating || 0) ? '#F59E0B' : '#D1D5DB'
                                                }}
                                                onClick={() => rateApplication(application.id, star)}
                                            />
                                        ))}
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => downloadResume(application.resume_path)}
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: '0.25rem',
                                                background: 'white',
                                                cursor: 'pointer'
                                            }}
                                            title="Download Resume"
                                        >
                                            <Download size={16} />
                                        </button>
                                        
                                        <button
                                            onClick={() => setSelectedApplication(application)}
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: '0.25rem',
                                                background: 'white',
                                                cursor: 'pointer'
                                            }}
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    {/* Quick actions */}
                                    {application.status === 'submitted' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#10B981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Shortlist
                                            </button>
                                            <button
                                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application detail modal */}
            {selectedApplication && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {selectedApplication.profiles?.full_name}
                            </h2>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Detailed candidate info */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Contact Information</h3>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                <div>Email: {selectedApplication.profiles?.email}</div>
                                {selectedApplication.profiles?.phone && (
                                    <div>Phone: {selectedApplication.profiles.phone}</div>
                                )}
                                {selectedApplication.profiles?.location && (
                                    <div>Location: {selectedApplication.profiles.location}</div>
                                )}
                                {selectedApplication.profiles?.linkedin_url && (
                                    <div>
                                        LinkedIn: 
                                        <a 
                                            href={selectedApplication.profiles.linkedin_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}
                                        >
                                            View Profile
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedApplication.profiles?.bio && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Bio</h3>
                                <p>{selectedApplication.profiles.bio}</p>
                            </div>
                        )}

                        {/* Status update */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Update Status</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateApplicationStatus(selectedApplication.id, status)
                                            setSelectedApplication(null)
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: selectedApplication.status === status ? getStatusColor(status) : 'white',
                                            color: selectedApplication.status === status ? 'white' : getStatusColor(status),
                                            border: `1px solid ${getStatusColor(status)}`,
                                            borderRadius: '0.25rem',
                                            fontSize: '0.875rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {getStatusLabel(status)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => downloadResume(selectedApplication.resume_path)}
                                className="btn"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Download size={16} />
                                Download Resume
                            </button>
                            <button
                                onClick={() => scheduleInterview(selectedApplication.id)}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Calendar size={16} />
                                Schedule Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}