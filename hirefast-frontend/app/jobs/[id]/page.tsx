'use client';

import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
import { useJob } from '@/hooks/useJobs';

const JobDetailsPanel = dynamic(() => import('@/components/JobDetailsPanel'), {
  loading: () => <Loader />
});

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const query = useJob(params.id);

  if (query.isPending) {
    return <Loader />;
  }

  if (!query.data) {
    return <div className="card">Job not found.</div>;
  }

  return <JobDetailsPanel job={query.data} />;
}
