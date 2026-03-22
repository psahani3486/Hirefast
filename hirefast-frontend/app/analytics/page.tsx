'use client';

import { useMyAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const query = useMyAnalytics();

  if (query.isPending) {
    return <div className="card">Loading analytics...</div>;
  }

  if (query.isError || !query.data) {
    return <div className="card">Unable to load analytics.</div>;
  }

  const data = query.data;

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>My Analytics</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="card"><strong>Profile Views (7d)</strong><p>{data.profileViews7d}</p></div>
        <div className="card"><strong>Profile Views (30d)</strong><p>{data.profileViews30d}</p></div>
        <div className="card"><strong>Total Posts</strong><p>{data.totalPosts}</p></div>
        <div className="card"><strong>Total Likes</strong><p>{data.totalLikes}</p></div>
        <div className="card"><strong>Total Comments</strong><p>{data.totalComments}</p></div>
      </div>
      <div className="card grid">
        <h3 style={{ margin: 0 }}>Top Posts</h3>
        {data.topPosts.map((post) => (
          <div key={post._id} className="card">
            <p style={{ margin: 0 }}>{post.contentPreview}</p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              Engagement: {post.engagement} (likes {post.likes}, comments {post.comments})
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
