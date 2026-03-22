'use client';

import { useMemo, useState } from 'react';
import Filters from '@/components/Filters';
import JobsVirtualList from '@/components/JobsVirtualList';
import Loader from '@/components/Loader';
import { useInfiniteJobs } from '@/hooks/useJobs';

export default function JobsPage() {
  const [filters, setFilters] = useState({ q: '', location: '', company: '' });
  const query = useInfiniteJobs(filters);

  const jobs = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) || [],
    [query.data]
  );

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Browse Jobs</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Find your next opportunity</p>
      </div>
      <Filters onChange={setFilters} />

      {query.isPending ? <Loader /> : null}
      {!query.isPending && jobs.length === 0 ? <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No jobs found.</div> : null}

      {jobs.length > 0 ? <JobsVirtualList jobs={jobs} /> : null}

      {query.hasNextPage ? (
        <button className="btn btn-primary" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage} style={{ padding: '0.8rem 1.5rem', marginTop: '1rem' }}>
          {query.isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      ) : null}
    </section>
  );
}
