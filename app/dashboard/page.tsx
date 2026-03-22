'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import Loader from '@/components/Loader';

type DashboardResponse = {
  totalJobs: number;
  totalApplicants: number;
  jobs: { _id: string; title: string }[];
  latestApplicants: {
    _id: string;
    candidate?: { name: string; email: string };
    job?: { title: string };
  }[];
};

export default function DashboardPage() {
  const query = useQuery({
    queryKey: ['recruiter-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>('/recruiter/dashboard');
      return data;
    }
  });

  if (query.isPending) {
    return <Loader />;
  }

  if (query.isError) {
    return <div className="card">Login as recruiter to view dashboard.</div>;
  }

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>Recruiter Dashboard</h1>
      <div>
        <Link href="/dashboard/jobs" className="btn btn-primary">
          Manage Jobs
        </Link>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="card">
          <strong>Total Jobs</strong>
          <p>{query.data?.totalJobs}</p>
        </div>
        <div className="card">
          <strong>Total Applicants</strong>
          <p>{query.data?.totalApplicants}</p>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Applicants</h3>
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          {query.data?.latestApplicants.map((item) => (
            <li key={item._id}>
              {item.candidate?.name || 'Unknown'} applied for {item.job?.title || 'Unknown'}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
