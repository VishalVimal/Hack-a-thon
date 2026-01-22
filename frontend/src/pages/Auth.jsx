import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const mode = searchParams.get('mode') || 'login'
    const isLogin = mode === 'login'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('candidate') // candidate or recruiter
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            let result
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({ email, password })
            } else {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { role } // Storing role in user metadata
                    }
                })
            }

            const { data, error: authError } = result

            if (authError) throw authError


            if (authError) throw authError

            // If success
            if (data.user && !isLogin) {
                // Create profile with selected role
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: email,
                            role: role
                        }
                    ])

                if (profileError) {
                    console.error('Error creating profile:', profileError)
                    // Optional: revert auth user creation or show specific error
                }

                alert('Account created! Please check your email to confirm specific details if required, or login now.')
                if (data.session) navigate('/dashboard')
            } else if (data.session) {
                navigate('/dashboard')
            }


        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            required
                            className="input" // defined below inline or add to index.css
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>I am a...</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setRole('candidate')}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
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
                                        padding: '0.5rem',
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
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => navigate(isLogin ? '/auth?mode=register' : '/auth?mode=login')}
                        style={{ color: 'var(--primary)', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )
}
