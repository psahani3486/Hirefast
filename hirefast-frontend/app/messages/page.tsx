'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useConversations, useSendMessage, useThread } from '@/hooks/useMessages';

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [draft, setDraft] = useState('');

  const conversations = useConversations();
  const thread = useThread(selectedUserId);
  const send = useSendMessage();

  const selectedConversation = useMemo(
    () => conversations.data?.find((item) => item.user._id === selectedUserId) || null,
    [conversations.data, selectedUserId]
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!selectedUserId || !text) return;

    send.mutate(
      { userId: selectedUserId, text },
      {
        onSuccess: () => {
          setDraft('');
        }
      }
    );
  };

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Messages</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Stay connected with your network</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(280px, 1fr) minmax(350px, 2fr)', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem', display: 'grid', gap: '1rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem' }}>Conversations</h3>
          {conversations.isPending ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="card" style={{ padding: '1rem', display: 'grid', gap: '0.6rem' }}>
                  <div className="skeleton skeleton-title" style={{ width: '55%' }} />
                  <div className="skeleton skeleton-line" style={{ width: '95%' }} />
                  <div className="skeleton skeleton-line" style={{ width: '35%' }} />
                </div>
              ))}
            </div>
          ) : conversations.data && conversations.data.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {conversations.data.map((conv) => (
                <button
                  key={conv.user._id}
                  className="card"
                  style={{ 
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    padding: '1rem',
                    border: selectedUserId === conv.user._id ? '2px solid #0a66c2' : '1px solid var(--border)',
                    background: selectedUserId === conv.user._id ? '#f0f7ff' : 'white'
                  }}
                  onClick={() => setSelectedUserId(conv.user._id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                    <strong>{conv.user.name}</strong>
                    {conv.unreadCount > 0 ? (
                      <span style={{ background: '#b45309', color: 'white', borderRadius: '999px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                        {conv.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p style={{ margin: '0.75rem 0 0.5rem 0', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.4 }}>{conv.lastMessage.text.slice(0, 80)}</p>
                  <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(conv.lastMessage.createdAt).toLocaleString()}</small>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', margin: 0 }}>No conversations yet</p>
          )}
        </div>

        <div className="card" style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>{selectedConversation ? `Chat with ${selectedConversation.user.name}` : 'Select a conversation'}</h3>
          <div className="grid" style={{ maxHeight: '450px', overflowY: 'auto', gap: '1rem', padding: '1rem', background: '#f9f7f2', borderRadius: '8px', minHeight: '300px' }}>
            {thread.isPending && selectedUserId ? (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[1, 2, 3].map((idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', display: 'grid', gap: '0.65rem' }}>
                    <div className="skeleton skeleton-title" style={{ width: '40%' }} />
                    <div className="skeleton skeleton-line" style={{ width: '100%' }} />
                    <div className="skeleton skeleton-line" style={{ width: '70%' }} />
                  </div>
                ))}
              </div>
            ) : thread.data && thread.data.length > 0 ? (
              thread.data.map((msg) => (
                <div key={msg._id} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{msg.sender.name}</strong>
                  <p style={{ margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>{msg.text}</p>
                  <small style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', textAlign: 'center', margin: 'auto' }}>No messages yet</p>
            )}
          </div>
          <form onSubmit={submit} style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <input 
              className="input" 
              placeholder="Type a message..." 
              value={draft} 
              onChange={(e) => setDraft(e.target.value)}
              style={{ padding: '0.9rem 1rem' }}
              disabled={!selectedUserId}
            />
            <button className="btn btn-primary" type="submit" disabled={!selectedUserId || send.isPending} style={{ padding: '0.7rem 1.5rem', fontWeight: 700 }}>
              {send.isPending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
