import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Briefcase, User, LogOut } from 'lucide-react'

export default function Navbar({ session }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
                <Link 
                    to="/" 
                    style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Briefcase size={24} style={{ color: 'var(--primary)' }} />
                    Recruitment<span style={{ color: 'var(--primary)' }}>Portal</span>
                </Link>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link 
                        to="/jobs" 
                        style={{ 
                            fontWeight: '500',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all var(--duration-fast) var(--ease)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--primary-light)'
                            e.currentTarget.style.color = 'var(--primary)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'inherit'
                        }}
                    >
                        Jobs
                    </Link>

                    {session ? (
                        <>
                            <Link 
                                to="/dashboard" 
                                style={{ 
                                    fontWeight: '500',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all var(--duration-fast) var(--ease)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--primary-light)'
                                    e.currentTarget.style.color = 'var(--primary)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = 'inherit'
                                }}
                            >
                                <User size={16} />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline"
                                style={{ 
                                    fontSize: '0.9rem', 
                                    padding: '0.5rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth?mode=login" className="btn btn-outline">
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
