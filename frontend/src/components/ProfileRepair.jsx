import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ProfileRepair({ session, onProfileCreated }) {
    const [role, setRole] = useState('recruiter')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createProfile = async () => {
        setLoading(true)
        setError(null)

        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: session.user.id,
                        email: session.user.email,
                        role: role,
                        full_name: session.user.email?.split('@')[0] || 'User'
                    }
                ])

            if (profileError) {
                throw profileError
            }

            alert(`Profile created successfully as ${role}!`)
            onProfileCreated({ id: session.user.id, role, email: session.user.email })
        } catch (err) {
            console.error('Profile creation error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Complete Your Profile
                </h2>
                
                <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    <p><strong>Profile Missing:</strong> Your account exists but needs a profile to continue.</p>
                    <p>This usually happens when the initial signup didn't complete properly.</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Select Your Role:
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => setRole('candidate')}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: role === 'candidate' ? '2px solid var(--primary)' : '1px solid var(--border)',
                                backgroundColor: role === 'candidate' ? '#EEF2FF' : 'white',
                                color: role === 'candidate' ? 'var(--primary)' : 'inherit'
                            }}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('recruiter')}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: role === 'recruiter' ? '2px solid var(--primary)' : '1px solid var(--border)',
                                backgroundColor: role === 'recruiter' ? '#EEF2FF' : 'white',
                                color: role === 'recruiter' ? 'var(--primary)' : 'inherit'
                            }}
                        >
                            Recruiter
                        </button>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                        <strong>Account:</strong> {session.user.email}<br/>
                        <strong>Selected Role:</strong> {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
                    </p>
                </div>

                <button
                    onClick={createProfile}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
                </button>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        onClick={() => supabase.auth.signOut()}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Sign out and try different account
                    </button>
                </div>
            </div>
        </div>
    )
}