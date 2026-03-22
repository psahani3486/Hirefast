'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useMyProfile, useUpdateMyProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const profileQuery = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'connections' | 'private'>('public');

  const profile = profileQuery.data;

  useEffect(() => {
    if (!profile) return;
    setHeadline(profile.headline || '');
    setAbout(profile.about || '');
    setLocation(profile.location || '');
    setSkills((profile.skills || []).join(', '));
    setVisibility((profile.visibility as 'public' | 'connections' | 'private') || 'public');
  }, [profile]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile.mutate({
      headline,
      about,
      location,
      visibility,
      skills: skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    });
  };

  return (
    <section className="grid" style={{ gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>My Profile</h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Manage your professional information</p>
      </div>
      
      <div className="card" style={{ padding: '2rem', borderLeft: '4px solid #0a66c2' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Account
        </p>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', fontWeight: 700 }}>
          {profile?.user?.name || 'User'}
        </p>
        <p style={{ color: 'var(--muted)', margin: 0 }}>{profile?.user?.email || ''}</p>
      </div>

      <form className="card grid" onSubmit={submit} style={{ gap: '2rem', padding: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Headline</label>
          <input
            className="input"
            placeholder="e.g. Full Stack Developer at Tech Co"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            style={{ padding: '0.9rem 1rem' }}
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.5rem' }}>A brief professional title</small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>About</label>
          <textarea
            className="input"
            rows={5}
            placeholder="Tell professionals about yourself, your experience, and goals..."
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            style={{ padding: '0.9rem 1rem', minHeight: '140px' }}
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.5rem' }}>Your professional bio</small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Location</label>
          <input
            className="input"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            style={{ padding: '0.9rem 1rem' }}
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.5rem' }}>Your current location</small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Skills</label>
          <input
            className="input"
            placeholder="React, JavaScript, Node.js, Python"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            style={{ padding: '0.9rem 1rem' }}
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.5rem' }}>Separate skills with commas</small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Profile Visibility</label>
          <select
            className="input"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as 'public' | 'connections' | 'private')}
            style={{ padding: '0.9rem 1rem' }}
          >
            <option value="public">🌐 Public - Everyone can see</option>
            <option value="connections">🤝 Connections - Only your connections</option>
            <option value="private">🔒 Private - Only you</option>
          </select>
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '0.5rem' }}>Control who can view your profile</small>
        </div>

        <button className="btn btn-primary" type="submit" disabled={updateProfile.isPending} style={{ padding: '0.85rem 1.5rem', fontWeight: 700, alignSelf: 'start' }}>
          {updateProfile.isPending ? '💾 Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </section>
  );
}
