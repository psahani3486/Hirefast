'use client';

import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useSignup } from '@/hooks/useAuth';

export default function SignupPage() {
  const signup = useSignup();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    signup.mutate(
      { name, email, password, role },
      {
        onError: (error) => {
          if (axios.isAxiosError<{ message?: string }>(error)) {
            setErrorMessage(error.response?.data?.message || 'Signup failed');
            return;
          }

          setErrorMessage('Signup failed');
        }
      }
    );
  };

  return (
    <section className="card" style={{ maxWidth: '500px', marginInline: 'auto' }}>
      <h1 style={{ marginTop: 0 }}>Create Account</h1>
      <form className="grid" onSubmit={handleSubmit}>
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as 'candidate' | 'recruiter')}>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button className="btn btn-primary" type="submit" disabled={signup.isPending}>
          {signup.isPending ? 'Creating account...' : 'Signup'}
        </button>
      </form>
      {errorMessage ? <p style={{ color: '#b91c1c' }}>{errorMessage}</p> : null}
    </section>
  );
}
