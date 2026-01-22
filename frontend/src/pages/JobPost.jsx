import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function JobPost({ session }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: ''
    })

    // Basic check - real app needs better role protection
    if (!session) {
        return <div className="container" style={{ marginTop: '2rem' }}>Please login to post jobs.</div>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)

            const { error } = await supabase
                .from('jobs')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    skills_required: skillsArray,
                    recruiter_id: session.user.id
                })

            if (error) throw error

            navigate('/dashboard')
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ marginTop: '3rem', maxWidth: '700px' }}>
            <div className="card">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Post a New Job</h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Job Title</label>
                        <input
                            required
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            required
                            rows={6}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Skills Required (comma separated)</label>
                        <input
                            placeholder="e.g. Python, React, Leadership"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            value={formData.skills}
                            onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary" type="submit">
                        {loading ? 'Posting...' : 'Create Job Posting'}
                    </button>
                </form>
            </div>
        </div>
    )
}
