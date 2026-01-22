import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Briefcase, TrendingUp, Award, Calendar } from 'lucide-react'

export default function ResumeAnalysisResults() {
    const location = useLocation()
    const navigate = useNavigate()
    const { analysisData, recommendations } = location.state || {}

    if (!analysisData) {
        return (
            <div className="container" style={{ marginTop: '3rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>No Analysis Data Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Please upload a resume from the dashboard to see results.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
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
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        padding: '1rem',
                        borderRadius: '1rem',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)'
                    }}>
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            Resume Analysis Complete
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            File: {analysisData.filename}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem', 
                marginBottom: '2rem' 
            }}>
                <div className="card" style={{ 
                    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                    border: '1px solid var(--primary)',
                    borderLeft: '4px solid var(--primary)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Award size={28} style={{ color: 'var(--primary)' }} />
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                Skills Detected
                            </p>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {analysisData.total_skills_found || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                {analysisData.years_of_experience > 0 && (
                    <div className="card" style={{ 
                        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                        border: '1px solid var(--secondary)',
                        borderLeft: '4px solid var(--secondary)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Calendar size={28} style={{ color: 'var(--secondary)' }} />
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                    Experience
                                </p>
                                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                    {analysisData.years_of_experience}
                                    <span style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '0.5rem' }}>
                                        years
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {recommendations && recommendations.length > 0 && (
                    <div className="card" style={{ 
                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                        border: '1px solid var(--warning)',
                        borderLeft: '4px solid var(--warning)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <TrendingUp size={28} style={{ color: 'var(--warning)' }} />
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                    Job Matches
                                </p>
                                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                    {recommendations.length}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Skills Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Award size={24} style={{ color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Extracted Skills</h2>
                </div>

                {analysisData.skills && analysisData.skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {analysisData.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="badge badge-primary"
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    border: '1px solid var(--primary)',
                                    transition: 'all var(--duration-fast) var(--ease)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary)'
                                    e.currentTarget.style.color = 'white'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-light)'
                                    e.currentTarget.style.color = 'var(--primary)'
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No skills detected</p>
                )}
            </div>

            {/* Resume Preview */}
            {analysisData.extracted_text_preview && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Resume Preview
                    </h3>
                    <div style={{
                        backgroundColor: '#F8FAFC',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        color: 'var(--text-main)',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {analysisData.extracted_text_preview}
                    </div>
                </div>
            )}

            {/* Job Recommendations */}
            {recommendations && recommendations.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Briefcase size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Recommended Jobs
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {recommendations.slice(0, 5).map((job, index) => (
                            <div 
                                key={job.id || index}
                                className="card"
                                style={{
                                    background: 'linear-gradient(to right, #ffffff, #F8FAFC)',
                                    cursor: 'pointer',
                                    transition: 'all var(--duration) var(--ease)'
                                }}
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(8px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                                {job.title}
                                            </h3>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                background: `linear-gradient(135deg, 
                                                    ${job.score >= 80 ? '#DCFCE7' : job.score >= 60 ? '#FEF3C7' : '#FEE2E2'}, 
                                                    ${job.score >= 80 ? '#BBF7D0' : job.score >= 60 ? '#FDE68A' : '#FECACA'})`,
                                                color: job.score >= 80 ? '#166534' : job.score >= 60 ? '#92400E' : '#991B1B',
                                                border: `2px solid ${job.score >= 80 ? '#10B981' : job.score >= 60 ? '#F59E0B' : '#EF4444'}`
                                            }}>
                                                {job.score}% Match
                                            </span>
                                        </div>
                                        <p style={{ 
                                            color: 'var(--text-muted)', 
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {job.description}
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ marginLeft: '1rem', fontSize: '0.875rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/apply/${job.id}`)
                                        }}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/jobs')}
                        className="btn btn-outline"
                        style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                        View All Jobs
                    </button>
                </div>
            )}

            {/* No Recommendations */}
            {(!recommendations || recommendations.length === 0) && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(to bottom, white, #F8FAFC)' }}>
                    <Briefcase size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        No Job Matches Found
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        We couldn't find strong matches based on your resume. Try checking back later or browse all available jobs.
                    </p>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="btn btn-primary"
                    >
                        Browse All Jobs
                    </button>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-outline"
                >
                    Upload Another Resume
                </button>
                <button
                    onClick={() => navigate('/jobs')}
                    className="btn btn-primary"
                >
                    Browse All Jobs
                </button>
            </div>
        </div>
    )
}
