'use client';

import Link from 'next/link';
import { useMyProfile } from '@/hooks/useProfile';

export default function LeftSidebar() {
  const profileQuery = useMyProfile();
  const profile = profileQuery.data;

  return (
    <div style={{ position: 'sticky', top: '80px', height: 'fit-content' }}>
      {/* Profile Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #0a66c2 0%, #005fa3 100%)',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 700
        }}>
          {profile?.user?.name?.charAt(0) || 'U'}
        </div>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
          {profile?.user?.name || 'User'}
        </h3>
        <p style={{ margin: '0 0 1rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
          {profile?.headline || 'Add a headline'}
        </p>
        <Link href="/profile" style={{
          display: 'block',
          padding: '0.6rem 1rem',
          borderRadius: '20px',
          background: '#f3f2ef',
          color: '#0a66c2',
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          transition: 'all 0.2s',
          marginBottom: '1rem'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e8e7e0';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = '#f3f2ef';
        }}>
          ✏️ Edit Profile
        </Link>
      </div>

      {/* Connections Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700 }}>Connections</h4>
        <p style={{ margin: '0.25rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
          🤝 Grow your network
        </p>
      </div>

      {/* Quick Links */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <Link href="/recommendations" style={{
            padding: '0.75rem',
            color: '#0a66c2',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f2ef';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            💡 Recommendations
          </Link>
          <Link href="/analytics" style={{
            padding: '0.75rem',
            color: '#0a66c2',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f2ef';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            📊 Analytics
          </Link>
          <Link href="/search" style={{
            padding: '0.75rem',
            color: '#0a66c2',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f2ef';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}>
            🔍 Search
          </Link>
        </div>
      </div>
    </div>
  );
}
