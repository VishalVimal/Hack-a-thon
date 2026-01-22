import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, MapPin, Briefcase, TrendingUp, Users, Building, ArrowRight, Shield, CheckCircle } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const [searchTitle, setSearchTitle] = useState('')
    const [searchLocation, setSearchLocation] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        // Determine query params
        const params = new URLSearchParams()
        if (searchTitle) params.append('q', searchTitle)
        if (searchLocation) params.append('l', searchLocation)
        navigate(`/jobs?${params.toString()}`)
    }

    const categories = [
        { name: 'Remote', icon: <Briefcase size={18} />, count: '2.5k+' },
        { name: 'Engineering', icon: <TrendingUp size={18} />, count: '5k+' },
        { name: 'MNCs', icon: <Building size={18} />, count: '1.2k+' },
        { name: 'Marketing', icon: <Users size={18} />, count: '800+' },
        { name: 'Data Science', icon: <TrendingUp size={18} />, count: '1.5k+' },
    ]

    const companies = [
        { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
        { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
        { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
        { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com' },
        { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
        { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
        { name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com' },
        { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com' },
    ]

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section - Indeed/LinkedIn Style */}
            <div style={{
                backgroundColor: '#F8FAFC',
                padding: '4rem 1rem',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                            color: '#1E293B'
                        }}>
                            Find your dream job now
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: '#64748B',
                            marginBottom: '2.5rem',
                            fontWeight: '500'
                        }}>
                            5 lakh+ jobs for you to explore
                        </p>

                        {/* Search Bar - Indeed Style */}
                        <form onSubmit={handleSearch} style={{
                            display: 'flex',
                            gap: '1rem',
                            backgroundColor: 'white',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                            flexWrap: 'wrap',
                            border: '1px solid #E2E8F0'
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px', paddingLeft: '0.5rem' }}>
                                <Search size={22} color="#94A3B8" />
                                <input
                                    type="text"
                                    placeholder="Job title, skills, or company"
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '1.1rem',
                                        color: '#334155'
                                    }}
                                />
                            </div>
                            <div style={{ width: '1px', backgroundColor: '#E2E8F0', margin: '0 0.5rem', display: window.innerWidth > 768 ? 'block' : 'none' }}></div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '200px' }}>
                                <MapPin size={22} color="#94A3B8" />
                                <input
                                    type="text"
                                    placeholder="City, state, or zip"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '1.1rem',
                                        color: '#334155'
                                    }}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem', borderRadius: '0.75rem' }}>
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="float" style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: '300px', height: '300px',
                    background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 100%)',
                    borderRadius: '50%', filter: 'blur(80px)', opacity: 0.7
                }}></div>
                <div className="float-delayed" style={{
                    position: 'absolute', bottom: '-10%', right: '-5%',
                    width: '300px', height: '300px',
                    background: 'linear-gradient(135deg, var(--secondary-light) 0%, var(--primary-light) 100%)',
                    borderRadius: '50%', filter: 'blur(80px)', opacity: 0.7
                }}></div>

                {/* Floating Icons */}
                <div className="float" style={{ position: 'absolute', top: '15%', right: '15%', opacity: 0.1 }}>
                    <Briefcase size={64} />
                </div>
                <div className="float-delayed" style={{ position: 'absolute', bottom: '20%', left: '10%', opacity: 0.1 }}>
                    <TrendingUp size={64} />
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', padding: '2rem 1rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Live Jobs', value: '120k+' },
                        { label: 'Companies', value: '50k+' },
                        { label: 'Candidates', value: '2.5M+' },
                        { label: 'New Jobs Today', value: '5,000+' }
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{stat.value}</div>
                            <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Categories - Naukri Style */}
            <div className="container" style={{ marginTop: '5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Trending Categories</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                    {categories.map((cat, i) => (
                        <Link to={`/jobs?q=${cat.name}`} key={i} style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 1.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '50px',
                            color: '#334155',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E2E8F0'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ color: 'var(--primary)', display: 'flex' }}>{cat.icon}</div>
                            <span style={{ fontWeight: '600' }}>{cat.name}</span>
                            <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', color: '#64748B' }}>{cat.count}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Companies */}
            <div className="container" style={{ marginTop: '5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center' }}>Trusted by Top Companies</h2>
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', alignItems: 'center',
                    background: 'var(--bg-surface)', padding: '3rem', borderRadius: '2rem',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {companies.map((company, i) => (
                        <div key={i} style={{ textAlign: 'center', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                style={{
                                    height: '45px',
                                    objectFit: 'contain',
                                    filter: 'grayscale(100%) opacity(0.7)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = 'grayscale(100%) opacity(0.7)'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'block'
                                }}
                            />
                            {/* Fallback text if image fails */}
                            <span style={{
                                display: 'none',
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                color: 'var(--text-muted)',
                                cursor: 'default'
                            }}>
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="container" style={{ marginTop: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', padding: '0 1rem' }}>
                    <div className="card" style={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
                        <div style={{
                            width: '50px', height: '50px', backgroundColor: '#EEF2FF', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem'
                        }}>
                            <Shield size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Secure & Private</h3>
                        <p style={{ color: '#64748B', lineHeight: 1.6 }}>Your data is encrypted and protected. We value your privacy and only share your details with verified recruiters.</p>
                    </div>
                    <div className="card" style={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
                        <div style={{
                            width: '50px', height: '50px', backgroundColor: '#F0FDF4', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', marginBottom: '1.5rem'
                        }}>
                            <Users size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>AI Matching</h3>
                        <p style={{ color: '#64748B', lineHeight: 1.6 }}>Our advanced AI algorithms ensure you match with jobs that fit your skills and career goals perfectly.</p>
                    </div>
                    <div className="card" style={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
                        <div style={{
                            width: '50px', height: '50px', backgroundColor: '#FEF2F2', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', marginBottom: '1.5rem'
                        }}>
                            <CheckCircle size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Verified Jobs</h3>
                        <p style={{ color: '#64748B', lineHeight: 1.6 }}>All job postings are from verified companies. No spam, no scams, just high-quality opportunities.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section - Indeed/Recruiter Banner Style */}
            <div className="container" style={{ marginTop: '6rem' }}>
                <div style={{
                    backgroundColor: '#1E293B',
                    borderRadius: '2rem',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Hiring for your company?</h2>
                        <p style={{ fontSize: '1.25rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Post jobs to millions of candidates and use our AI tools to filter for the best talent instantly.
                        </p>
                        <Link to="/auth?mode=register&role=recruiter" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Post a Job for Free
                        </Link>
                    </div>

                    {/* Background decoration */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1 }}>
                        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '600px', height: '600px', borderRadius: '50%', backgroundColor: 'var(--primary)', filter: 'blur(100px)' }}></div>
                        <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '600px', height: '600px', borderRadius: '50%', backgroundColor: 'var(--secondary)', filter: 'blur(100px)' }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
