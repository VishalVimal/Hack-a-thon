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

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', justifyContent: 'space-between' }}>
                            <span>I am a...</span>
                            {isLogin && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Select before Google Sign-In)</span>}
                        </label>
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            setLoading(true)
                            const { error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: window.location.origin + '/dashboard',
                                    data: { role }
                                }
                            })
                            if (error) {
                                alert(error.message)
                                setLoading(false)
                            }
                        }}
                        className="btn"
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.449 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        Sign in with Google
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
