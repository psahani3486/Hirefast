'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

type Applicant = {
  _id: string;
  status: string;
  candidate?: {
    name: string;
    email: string;
  };
  createdAt: string;
};

export default function ApplicantsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const query = useQuery({
    queryKey: ['job-applicants', jobId],
    queryFn: async () => {
      const { data } = await api.get<Applicant[]>(`/recruiter/jobs/${jobId}/applicants`);
      return data;
    },
    enabled: Boolean(jobId)
  });

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>Applicants</h1>
        <Link href="/dashboard/jobs" className="btn btn-primary">
          Back to Manage Jobs
        </Link>
      </div>

      {query.isPending ? <div className="card">Loading applicants...</div> : null}
      {query.isError ? <div className="card">Unable to load applicants. Login as recruiter.</div> : null}
      {!query.isPending && !query.isError && query.data?.length === 0 ? (
        <div className="card">No applicants yet for this job.</div>
      ) : null}

      <div className="grid">
        {query.data?.map((item) => (
          <article key={item._id} className="card" style={{ display: 'grid', gap: '0.4rem' }}>
            <h3 style={{ margin: 0 }}>{item.candidate?.name || 'Unknown candidate'}</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>{item.candidate?.email || 'No email available'}</p>
            <p style={{ margin: 0 }}>Status: {item.status}</p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              Applied on: {new Date(item.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
