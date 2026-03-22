'use client';

import { useEffect, useState } from 'react';
import {
  useMyConnections,
  useRemoveConnection,
  useRespondConnectionRequest,
  useSendConnectionRequest
} from '@/hooks/useConnections';
import { useDiscoverProfiles } from '@/hooks/useProfile';

export default function NetworkPage() {
  const [query, setQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const user = JSON.parse(localStorage.getItem('hirefast_user') || '{}');
    setCurrentUserId(user.id || '');
  }, []);

  const discover = useDiscoverProfiles(query);
  const connections = useMyConnections();
  const sendRequest = useSendConnectionRequest();
  const respond = useRespondConnectionRequest();
  const remove = useRemoveConnection();

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>My Network</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Discover professionals and grow your connections</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Discover People</h3>
        <input
          className="input"
          placeholder="Search people by name or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ padding: '0.9rem 1rem', marginBottom: '1.5rem' }}
        />
        <div className="grid" style={{ gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {discover.data?.map((item) => (
            <article key={item.user._id} className="card" style={{ display: 'grid', gap: '1rem', padding: '1.5rem' }}>
              <div>
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>{item.user.name}</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--muted)', fontSize: '0.9rem' }}>{item.user.email}</p>
                <p style={{ margin: '0.75rem 0 0 0', lineHeight: 1.5 }}>{item.profile?.headline || 'No headline yet'}</p>
              </div>
              {item.connectionStatus === 'none' ? (
                <button className="btn btn-primary" onClick={() => sendRequest.mutate(item.user._id)} style={{ padding: '0.7rem 1rem' }}>
                  + Connect
                </button>
              ) : (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', padding: '0.5rem 0', textAlign: 'center' }}>Status: <strong>{item.connectionStatus}</strong></p>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>Incoming Requests ({connections.data?.incoming.length || 0})</h3>
        {connections.data?.incoming && connections.data.incoming.length > 0 ? (
          <div className="grid" style={{ gap: '1rem' }}>
            {connections.data.incoming.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#f9f7f2', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ flex: 1 }}><strong>{item.requester.name}</strong></span>
                <button className="btn btn-primary" onClick={() => respond.mutate({ id: item._id, action: 'accept' })} style={{ padding: '0.6rem 1rem' }}>
                  ✓ Accept
                </button>
                <button className="btn btn-secondary" onClick={() => respond.mutate({ id: item._id, action: 'reject' })} style={{ padding: '0.6rem 1rem' }}>
                  ✕ Reject
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', margin: 0 }}>No pending requests</p>
        )}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem' }}>My Connections ({connections.data?.accepted.length || 0})</h3>
        {connections.data?.accepted && connections.data.accepted.length > 0 ? (
          <div className="grid" style={{ gap: '1rem' }}>
            {connections.data.accepted.map((item) => {
              const meIsRequester = item.requester._id === currentUserId;
              const other = meIsRequester ? item.recipient : item.requester;

              return (
                <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#f9f7f2', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ flex: 1 }}><strong>{other?.name || 'Connection'}</strong></span>
                  <button className="btn btn-secondary" onClick={() => remove.mutate(item._id)} style={{ padding: '0.6rem 1rem' }}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', textAlign: 'center', margin: 0 }}>No connections yet</p>
        )}
      </div>
    </section>
  );
}
