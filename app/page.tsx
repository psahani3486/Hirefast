'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const LeftSidebar = dynamic(() => import('@/components/LeftSidebar'));
const RightSidebar = dynamic(() => import('@/components/RightSidebar'));

const featureCards = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized search and instant results' },
  { icon: '🎯', title: 'Smart Recommendations', desc: 'AI-powered job suggestions' },
  { icon: '🤝', title: 'Real Networking', desc: 'Build meaningful connections' },
  { icon: '📊', title: 'Rich Analytics', desc: 'Track profile views & engagement' },
  { icon: '🔒', title: 'Privacy First', desc: 'Control who sees your profile' },
  { icon: '🌐', title: 'Global Community', desc: 'Access worldwide opportunities' }
];

const stats = [
  { stat: '50K+', label: 'Active Jobs' },
  { stat: '100K+', label: 'Professionals' },
  { stat: '5000+', label: 'Companies' },
  { stat: '98%', label: 'Satisfaction' }
];

export default function HomePage() {
  return (
    <div className="home-shell">
      {/* Left Sidebar */}
      <div className="home-left">
        <LeftSidebar />
      </div>

      {/* Center Feed */}
      <div className="home-center">
        {/* Hero Section */}
        <section style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #005fa3 100%)', color: 'white', padding: 'clamp(2rem, 8vw, 4rem) 2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, margin: 0 }}>
              Welcome to HireFast
            </p>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', margin: '1rem 0', fontWeight: 800, lineHeight: 1.2 }}>
              Your next opportunity is here
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.95, margin: '1.5rem 0' }}>
              Connect with top talent, discover amazing jobs, and accelerate your career. HireFast brings the best opportunities and professionals together.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link href="/feed" style={{
                padding: '0.85rem 2rem',
                background: 'white',
                color: '#0a66c2',
                textDecoration: 'none',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                Start Exploring
              </Link>
              <Link href="/jobs" style={{
                padding: '0.85rem 2rem',
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '1rem',
                border: '2px solid white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}>
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 800 }}>Why HireFast?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {featureCards.map((feature, idx) => (
              <div key={idx} className="card" style={{
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0a66c2';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(10, 102, 194, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ margin: '0.5rem 0', fontWeight: 700, fontSize: '1.05rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.5, fontSize: '0.9rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="card" style={{ padding: '2rem', background: '#f3f2ef', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((item, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0a66c2', marginBottom: '0.5rem' }}>{item.stat}</div>
                <div style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, #0a66c2 0%, #005fa3 100%)', color: 'white', padding: '3rem 2rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 800 }}>Ready to accelerate your career?</h2>
            <p style={{ fontSize: '1.05rem', opacity: 0.95, marginBottom: '2rem', lineHeight: 1.6 }}>
              Join thousands of professionals already using HireFast.
            </p>
            <Link href="/auth/signup" style={{
              padding: '1rem 2.5rem',
              background: 'white',
              color: '#0a66c2',
              textDecoration: 'none',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Get Started Now
            </Link>
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="home-right">
        <RightSidebar />
      </div>
    </div>
  );
}
