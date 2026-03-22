'use client';

import axios from 'axios';
import { FormEvent, useMemo, useState } from 'react';
import {
  CompanyPayload,
  useCompanies,
  useCompanyDetails,
  useCreateCompany
} from '@/hooks/useCompanies';

const initialForm: CompanyPayload = {
  name: '',
  description: '',
  website: '',
  industry: '',
  size: '',
  location: '',
  logoUrl: ''
};

export default function CompaniesPage() {
  const [q, setQ] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [form, setForm] = useState<CompanyPayload>(initialForm);

  const companies = useCompanies(q);
  const details = useCompanyDetails(selectedCompanyId);
  const createCompany = useCreateCompany();

  const selectedDetails = useMemo(() => details.data || null, [details.data]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    createCompany.mutate(form, {
      onSuccess: () => {
        setMessage('Company created successfully.');
        setForm(initialForm);
      },
      onError: (error) => {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          setMessage(error.response?.data?.message || 'Failed to create company');
          return;
        }
        setMessage('Failed to create company');
      }
    });
  };

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Companies</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Explore companies and discover opportunities</p>
      </div>

      <form className="card grid" onSubmit={submit} style={{ gap: '1.5rem', padding: '2rem' }}>
        <div>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Create Company (Recruiter)</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Add your company to HireFast</p>
        </div>
        <input className="input" placeholder="Company Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={{ padding: '0.9rem 1rem' }} />
        <input className="input" placeholder="Industry" value={form.industry || ''} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} style={{ padding: '0.9rem 1rem' }} />
        <input className="input" placeholder="Location" value={form.location || ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} style={{ padding: '0.9rem 1rem' }} />
        <input className="input" placeholder="Website" value={form.website || ''} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} style={{ padding: '0.9rem 1rem' }} />
        <textarea className="input" rows={3} placeholder="Company Description" value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ padding: '0.9rem 1rem' }} />
        <button className="btn btn-primary" type="submit" disabled={createCompany.isPending} style={{ padding: '0.85rem 1.5rem', fontWeight: 700 }}>
          {createCompany.isPending ? '⏳ Saving...' : '✓ Create Company'}
        </button>
      </form>

      {message ? <div className="card" style={{ padding: '1.5rem', background: '#f0fdf4', borderLeft: '4px solid #16a34a' }}>{message}</div> : null}

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Search Companies</h3>
        <input className="input" placeholder="Search companies by name, industry, location..." value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: '0.9rem 1rem', marginBottom: '1.5rem' }} />
        <div className="grid" style={{ gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {companies.data && companies.data.length > 0 ? (
            companies.data.map((company) => (
              <article key={company._id} className="card" style={{ display: 'grid', gap: '1rem', padding: '1.5rem' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>{company.name}</strong>
                  <p style={{ margin: '0.25rem 0', color: 'var(--muted)', fontSize: '0.95rem' }}>
                    {company.industry || 'General'} • {company.location || 'N/A'}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setSelectedCompanyId(company._id)} style={{ padding: '0.7rem 1rem' }}>
                  View Company Page
                </button>
              </article>
            ))
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', gridColumn: '1/-1' }}>No companies found</p>
          )}
        </div>
      </div>

      {selectedDetails ? (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>{selectedDetails.company.name}</h3>
          <p style={{ margin: '0 0 1.5rem 0', lineHeight: 1.6, color: 'var(--muted)', fontSize: '0.95rem' }}>{selectedDetails.company.description || 'No description yet.'}</p>
          
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Open Jobs ({selectedDetails.jobs.length})</h4>
            {selectedDetails.jobs.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '1rem' }}>No open jobs yet.</p>
            ) : (
              <div className="grid" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {selectedDetails.jobs.map((job: { _id: string; title: string; location: string }) => (
                  <div key={job._id} className="card" style={{ padding: '1.5rem' }}>
                    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{job.title}</strong>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>📍 {job.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
