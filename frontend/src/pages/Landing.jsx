import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    The Future of <br />
                    <span style={{ color: 'var(--primary)' }}>Intelligent Recruitment</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Secure, AI-powered matching to connect the best talent with the right opportunities.
                    Privacy-first resume parsing and bias-free ranking.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/auth?mode=register&role=candidate" className="btn btn-primary">
                        Find Jobs
                    </Link>
                    <Link to="/auth?mode=register&role=recruiter" className="btn" style={{ backgroundColor: 'white', border: '1px solid var(--border)' }}>
                        Post a Job
                    </Link>
                </div>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛡️</div>
                    <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Secure & Private</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Your data is encrypted. We use Role-Based Access Control to ensure only authorized recruiters see your details.
                    </p>
                </div>

                <div className="card">
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                    <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>AI Powered Matching</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Our smart algorithms parse your resume to find jobs that actually match your skills and experience.
                    </p>
                </div>

                <div className="card">
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                    <h3 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Efficient Hiring</h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Recruiters get a prioritized list of top candidates, saving hours of manual screening time.
                    </p>
                </div>
            </section>
        </div>
    )
}
