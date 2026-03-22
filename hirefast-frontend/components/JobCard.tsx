import Link from 'next/link';
import { Job } from '@/types/job';

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  return (
    <article className="card" style={{ display: 'grid', gap: '0.6rem' }}>
      <div>
        <h3 style={{ margin: 0 }}>{job.title}</h3>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)' }}>
          {job.company} • {job.location}
        </p>
      </div>
      <p style={{ margin: 0, color: 'var(--muted)' }}>{job.description.slice(0, 130)}...</p>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <Link href={`/jobs/${job._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </article>
  );
}
