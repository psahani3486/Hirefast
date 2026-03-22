'use client';

import axios from 'axios';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
  JobPayload,
  useCreateRecruiterJob,
  useDeleteRecruiterJob,
  useRecruiterJobs,
  useUpdateRecruiterJob
} from '@/hooks/useRecruiterJobs';

const initialForm: JobPayload = {
  title: '',
  company: '',
  location: '',
  description: '',
  skills: [],
  salaryRange: '',
  status: 'open'
};

export default function ManageJobsPage() {
  const [form, setForm] = useState<JobPayload>(initialForm);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

  const jobsQuery = useRecruiterJobs();
  const createJob = useCreateRecruiterJob();
  const updateJob = useUpdateRecruiterJob();
  const deleteJob = useDeleteRecruiterJob();

  const sortedJobs = useMemo(() => jobsQuery.data || [], [jobsQuery.data]);

  const normalizePayload = (payload: JobPayload) => ({
    ...payload,
    skills: payload.skills?.filter(Boolean) || []
  });

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    createJob.mutate(normalizePayload(form), {
      onSuccess: () => {
        setMessage('Job created successfully.');
        setForm(initialForm);
      },
      onError: (error) => {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          setMessage(error.response?.data?.message || 'Failed to create job');
          return;
        }
        setMessage('Failed to create job');
      }
    });
  };

  const beginEdit = (job: JobPayload & { _id: string; skills?: string[] }) => {
    setEditingId(job._id);
    setMessage('');
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills || [],
      salaryRange: job.salaryRange || '',
      status: job.status || 'open'
    });
  };

  const handleUpdate = (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;

    setMessage('');
    updateJob.mutate(
      { id: editingId, payload: normalizePayload(form) },
      {
        onSuccess: () => {
          setMessage('Job updated successfully.');
          setEditingId(null);
          setForm(initialForm);
        },
        onError: (error) => {
          if (axios.isAxiosError<{ message?: string }>(error)) {
            setMessage(error.response?.data?.message || 'Failed to update job');
            return;
          }
          setMessage('Failed to update job');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    setMessage('');
    deleteJob.mutate(id, {
      onSuccess: () => {
        setMessage('Job deleted successfully.');
        setPendingDelete(null);
        if (editingId === id) {
          setEditingId(null);
          setForm(initialForm);
        }
      },
      onError: (error) => {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          setMessage(error.response?.data?.message || 'Failed to delete job');
          return;
        }
        setMessage('Failed to delete job');
      }
    });
  };

  const isSaving = createJob.isPending || updateJob.isPending;

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>Manage Jobs</h1>

      <form className="card grid" onSubmit={editingId ? handleUpdate : handleCreate}>
        <input
          className="input"
          placeholder="Job title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          required
        />
        <textarea
          className="input"
          placeholder="Description"
          rows={5}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
        <input
          className="input"
          placeholder="Skills (comma separated)"
          value={(form.skills || []).join(', ')}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              skills: e.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
            }))
          }
        />
        <input
          className="input"
          placeholder="Salary range"
          value={form.salaryRange || ''}
          onChange={(e) => setForm((prev) => ({ ...prev, salaryRange: e.target.value }))}
        />
        <select
          className="input"
          value={form.status || 'open'}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'open' | 'closed' }))}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" type="submit" disabled={isSaving}>
            {editingId ? 'Update Job' : 'Create Job'}
          </button>
          {editingId ? (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      {message ? <div className="card">{message}</div> : null}

      <div className="grid">
        {jobsQuery.isPending ? <div className="card">Loading jobs...</div> : null}
        {!jobsQuery.isPending && sortedJobs.length === 0 ? <div className="card">No posted jobs yet.</div> : null}
        {sortedJobs.map((job) => (
          <article key={job._id} className="card" style={{ display: 'grid', gap: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>{job.title}</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              {job.company} • {job.location}
            </p>
            <p style={{ margin: 0 }}>
              Status:{' '}
              <strong style={{ color: job.status === 'open' ? 'var(--brand)' : '#b45309' }}>
                {job.status}
              </strong>
            </p>
            <p style={{ margin: 0 }}>{job.description}</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => beginEdit(job)}>
                Edit
              </button>
              <Link href={`/dashboard/jobs/${job._id}/applicants`} className="btn btn-primary">
                View Applicants
              </Link>
              <button className="btn btn-secondary" onClick={() => setPendingDelete({ id: job._id, title: job.title })}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {pendingDelete ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 100
          }}
        >
          <div className="card" style={{ width: 'min(500px, calc(100% - 1rem))' }}>
            <h3 style={{ marginTop: 0 }}>Delete Job?</h3>
            <p>
              This will permanently delete <strong>{pendingDelete.title}</strong> and related applications.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button className="btn" type="button" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => handleDelete(pendingDelete.id)}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
