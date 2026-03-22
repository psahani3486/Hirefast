'use client';

import { useEffect } from 'react';
import { useMarkNotificationRead, useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('hirefast_token');
    if (!token) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const streamUrl = `${apiBase.replace('/api', '')}/api/realtime/notifications/stream?token=${encodeURIComponent(token)}`;

    const source = new EventSource(streamUrl);
    source.addEventListener('notifications', () => {
      notifications.refetch();
    });

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, [notifications.refetch]);

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>Notifications</h1>
      {notifications.isPending ? <div className="card">Loading notifications...</div> : null}
      <div className="grid">
        {notifications.data?.map((item) => (
          <article key={item._id} className="card" style={{ display: 'grid', gap: '0.45rem' }}>
            <p style={{ margin: 0 }}>{item.message}</p>
            <p style={{ margin: 0, color: 'var(--muted)' }}>{new Date(item.createdAt).toLocaleString()}</p>
            {!item.read ? (
              <button className="btn btn-primary" onClick={() => markRead.mutate(item._id)}>
                Mark as read
              </button>
            ) : (
              <span style={{ color: 'var(--muted)' }}>Read</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
