'use client';

import Link from 'next/link';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function RecommendationsPage() {
  const query = useRecommendations();

  if (query.isPending) {
    return <div className="card">Loading recommendations...</div>;
  }

  if (query.isError || !query.data) {
    return <div className="card">Unable to load recommendations.</div>;
  }

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>Recommended For You</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>People</h3>
          {query.data.people.map((item) => (
            <p key={item.user._id} style={{ margin: '0.4rem 0' }}>
              {item.user.name} ({item.sharedSkills.join(', ') || 'General'})
            </p>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Jobs</h3>
          {query.data.jobs.map((job) => (
            <p key={job._id} style={{ margin: '0.4rem 0' }}>
              <Link href={`/jobs/${job._id}`}>{job.title}</Link> • score {job.score}
            </p>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Posts</h3>
          {query.data.posts.map((post) => (
            <p key={post._id} style={{ margin: '0.4rem 0' }}>
              {post.author?.name || 'User'}: {post.content.slice(0, 60)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
