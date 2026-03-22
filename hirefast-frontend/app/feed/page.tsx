'use client';

import { FormEvent, useState } from 'react';
import { useAddComment, useCreatePost, useFeed, useToggleLike } from '@/hooks/useFeed';

export default function FeedPage() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  const feed = useFeed();
  const createPost = useCreatePost();
  const toggleLike = useToggleLike();
  const addComment = useAddComment();

  const submitPost = (event: FormEvent) => {
    event.preventDefault();
    createPost.mutate(
      { content, imageUrl },
      {
        onSuccess: () => {
          setContent('');
          setImageUrl('');
        }
      }
    );
  };

  return (
    <section className="grid" style={{ gap: '2rem' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Feed</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Share updates and engage with your network</p>
      </div>

      <form className="card grid" onSubmit={submitPost} style={{ gap: '1.5rem', padding: '2rem' }}>
        <textarea
          className="input"
          rows={4}
          placeholder="Share an update..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          style={{ padding: '1rem', minHeight: '120px' }}
        />
        <input
          className="input"
          placeholder="Optional image URL"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          style={{ padding: '0.9rem 1rem' }}
        />
        <button className="btn btn-primary" type="submit" disabled={createPost.isPending} style={{ padding: '0.8rem 1.5rem', fontWeight: 700 }}>
          {createPost.isPending ? 'Posting...' : 'Post'}
        </button>
      </form>

      {feed.isPending ? (
        <div className="grid" style={{ gap: '1rem' }}>
          {[1, 2, 3].map((idx) => (
            <article key={idx} className="card" style={{ display: 'grid', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex: 1, display: 'grid', gap: '0.5rem' }}>
                  <div className="skeleton skeleton-title" style={{ width: '40%' }} />
                  <div className="skeleton skeleton-line" style={{ width: '28%' }} />
                </div>
              </div>
              <div className="skeleton skeleton-line" style={{ width: '95%' }} />
              <div className="skeleton skeleton-line" style={{ width: '82%' }} />
              <div className="skeleton" style={{ height: '180px' }} />
            </article>
          ))}
        </div>
      ) : null}

      <div className="grid" style={{ gap: '2rem' }}>
        {feed.data?.data.map((post) => (
          <article key={post._id} className="card" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.1rem' }}>{post.author?.name || 'Unknown'}</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{post.content}</p>
            {post.imageUrl ? (
              <img src={post.imageUrl} alt="post" style={{ width: '100%', borderRadius: '10px', maxHeight: '400px', objectFit: 'cover' }} />
            ) : null}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" type="button" onClick={() => toggleLike.mutate(post._id)} style={{ padding: '0.6rem 1rem' }}>
                👍 Like ({post.likes.length})
              </button>
            </div>

            <div className="grid" style={{ gap: '1rem', padding: '1rem', background: '#f9f7f2', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Comments ({post.comments.length})</h4>
              {post.comments.map((comment) => (
                <div key={comment._id} style={{ padding: '1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <strong>{comment.user?.name || 'User'}</strong>
                  <p style={{ margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>{comment.text}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                const text = (commentMap[post._id] || '').trim();
                if (!text) return;

                addComment.mutate(
                  { postId: post._id, text },
                  {
                    onSuccess: () => {
                      setCommentMap((prev) => ({ ...prev, [post._id]: '' }));
                    }
                  }
                );
              }}
              style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}
            >
              <input
                className="input"
                placeholder="Write a comment"
                value={commentMap[post._id] || ''}
                onChange={(event) =>
                  setCommentMap((prev) => ({
                    ...prev,
                    [post._id]: event.target.value
                  }))
                }
              />
              <button className="btn btn-secondary" type="submit">
                Comment
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
