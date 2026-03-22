'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGlobalSearch } from '@/hooks/useSearch';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => clearTimeout(timer);
  }, [q]);

  const search = useGlobalSearch(debouncedQ);

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Global Search</h1>
      <input className="input" placeholder="Search people, jobs, companies, posts" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: '0.9rem 1rem', fontSize: '1rem' }} />

      {!q.trim() ? <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Type at least 2 letters to search.</div> : null}
      {search.isFetching ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'grid', gap: '0.9rem' }}>
              <div className="skeleton skeleton-title" style={{ width: '45%' }} />
              <div className="skeleton skeleton-line" style={{ width: '100%' }} />
              <div className="skeleton skeleton-line" style={{ width: '85%' }} />
              <div className="skeleton skeleton-line" style={{ width: '92%' }} />
              <div className="skeleton skeleton-line" style={{ width: '70%' }} />
            </div>
          ))}
        </div>
      ) : null}

      {search.data ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>People ({search.data.people.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {search.data.people.map((item) => (
                <p key={item.user._id} style={{ margin: 0, padding: '0.5rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <strong>{item.user.name}</strong> <br /> <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{item.profile?.headline || 'No headline'}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Jobs ({search.data.jobs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {search.data.jobs.map((job) => (
                <p key={job._id} style={{ margin: 0, padding: '0.5rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <Link href={`/jobs/${job._id}`} style={{ fontWeight: 600, color: '#0a66c2' }}>{job.title}</Link> <br /> <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{job.company}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Companies ({search.data.companies.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {search.data.companies.map((company) => (
                <p key={company._id} style={{ margin: 0, padding: '0.5rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                  <strong>{company.name}</strong> <br /> <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{company.industry || 'General'}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Posts ({search.data.posts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {search.data.posts.map((post) => (
                <p key={post._id} style={{ margin: 0, padding: '0.75rem 0', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', lineHeight: 1.5 }}>
                  <strong>{post.author?.name || 'User'}</strong>: {post.content.slice(0, 80)}...
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
