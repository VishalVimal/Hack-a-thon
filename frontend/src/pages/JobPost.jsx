import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function JobPost({ session }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        salary_min: '',
        salary_max: '',
        remote_ok: false,
        company_name: ''
    })

    if (!session) {
        return (
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Recruiter Access Required</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please login as a recruiter to post jobs.</p>
                    <button onClick={() => navigate('/auth?mode=login')} className="btn btn-primary">Login Now</button>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)

            // Get recruiter profile to fill defaults if missing
            const { data: profile } = await supabase
                .from('profiles')
                .select('company_name')
                .eq('id', session.user.id)
                .single()

            const payload = {
                title: formData.title,
                description: formData.description,
                skills_required: skillsArray,
                recruiter_id: session.user.id,
                location: formData.location,
                job_type: formData.job_type,
                experience_level: formData.experience_level,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
                remote_ok: formData.remote_ok,
                status: 'open',
                company_name: formData.company_name || profile?.company_name || 'Hiring Company',
                created_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('jobs')
                .insert(payload)

            if (error) throw error

            navigate('/dashboard')
        } catch (err) {
            alert('Error posting job: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container fade-in" style={{ marginTop: '3rem', maxWidth: '800px', paddingBottom: '4rem' }}>
            <div className="card" style={{ padding: '2.5rem', borderTop: '4px solid var(--primary)' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Post a New Opportunity</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Reach thousands of qualified candidates.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Job Title</label>
                            <input
                                required
                                placeholder="e.g. Senior Frontend Engineer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Company Name</label>
                                <input
                                    placeholder="Your Company Name"
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Location</label>
                                <input
                                    required
                                    placeholder="e.g. San Francisco or Remote"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Job Type</label>
                                <select
                                    value={formData.job_type}
                                    onChange={e => setFormData({ ...formData, job_type: e.target.value })}
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Experience Level</label>
                                <select
                                    value={formData.experience_level}
                                    onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                                >
                                    <option value="entry">Entry Level</option>
                                    <option value="mid">Mid Level</option>
                                    <option value="senior">Senior Level</option>
                                    <option value="lead">Lead / Manager</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Min Salary ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 80000"
                                    value={formData.salary_min}
                                    onChange={e => setFormData({ ...formData, salary_min: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Max Salary ($)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 120000"
                                    value={formData.salary_max}
                                    onChange={e => setFormData({ ...formData, salary_max: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Description</label>
                            <textarea
                                required
                                rows={8}
                                placeholder="Describe the role, responsibilities, and benefits..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Skills Required</label>
                            <input
                                placeholder="Comma separated, e.g. React, Node.js, TypeScript"
                                value={formData.skills}
                                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Separate multiple skills with commas</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius-sm)' }}>
                            <input
                                type="checkbox"
                                id="remote"
                                style={{ width: 'auto', margin: 0 }}
                                checked={formData.remote_ok}
                                onChange={e => setFormData({ ...formData, remote_ok: e.target.checked })}
                            />
                            <label htmlFor="remote" style={{ fontWeight: '500', cursor: 'pointer' }}>This is a fully remote position</label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/dashboard')}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ flex: 2 }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="spinner"></span> Publishing...
                                </span>
                            ) : 'Post Job Opening'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
