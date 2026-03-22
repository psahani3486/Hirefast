'use client';

import { useEffect, useMemo, useState } from 'react';
import { debounce } from '@/utils/debounce';

type FiltersProps = {
  onChange: (values: { q: string; location: string; company: string }) => void;
};

export default function Filters({ onChange }: FiltersProps) {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');

  const debouncedChange = useMemo(
    () => debounce((values: { q: string; location: string; company: string }) => onChange(values), 350),
    [onChange]
  );

  useEffect(() => {
    debouncedChange({ q, location, company });
  }, [q, location, company, debouncedChange]);

  return (
    <section className="card grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Job Title</label>
        <input className="input" placeholder="e.g. Developer, Designer" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: '0.8rem 0.9rem' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Location</label>
        <input className="input" placeholder="e.g. San Francisco" value={location} onChange={(e) => setLocation(e.target.value)} style={{ padding: '0.8rem 0.9rem' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Company</label>
        <input className="input" placeholder="e.g. Google, Apple" value={company} onChange={(e) => setCompany(e.target.value)} style={{ padding: '0.8rem 0.9rem' }} />
      </div>
    </section>
  );
}
