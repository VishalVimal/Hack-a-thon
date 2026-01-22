import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ session }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
                <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Recruitment<span style={{ color: 'var(--primary)' }}>Portal</span>
                </Link>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/jobs" style={{ fontWeight: '500' }}>Jobs</Link>

                    {session ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: '500' }}>Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className="btn"
                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth?mode=login" className="btn" style={{ color: 'var(--text-muted)' }}>
                                Login
                            </Link>
                            <Link to="/auth?mode=register" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
