'use client';

import api from '@/lib/api';
import { Job } from '@/types/job';
import { useState } from 'react';

type Props = {
  job: Job;
};

export default function JobDetailsPanel({ job }: Props) {
  const [message, setMessage] = useState('');

  const apply = async () => {
    try {
      await api.post(`/jobs/${job._id}/apply`);
      setMessage('Applied successfully');
    } catch (error) {
      setMessage('Login as candidate to apply');
    }
  };

  const save = async () => {
    try {
      await api.post(`/jobs/${job._id}/save`);
      setMessage('Saved successfully');
    } catch (_error) {
      setMessage('Login as candidate to save jobs');
    }
  };

  return (
    <section className="card" style={{ display: 'grid', gap: '0.8rem' }}>
      <h1 style={{ margin: 0 }}>{job.title}</h1>
      <p style={{ margin: 0, color: 'var(--muted)' }}>
        {job.company} • {job.location}
      </p>
      <p style={{ margin: 0 }}>{job.description}</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={apply}>
          Apply Now
        </button>
        <button className="btn btn-secondary" onClick={save}>
          Save Job
        </button>
      </div>
      {message ? <p style={{ margin: 0, color: 'var(--brand)' }}>{message}</p> : null}
    </section>
  );
}
