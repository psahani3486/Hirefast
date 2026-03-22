'use client';

import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const login = useLogin();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    login.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          const nextRoute = response.user.role === 'recruiter' ? '/dashboard' : '/jobs';
          router.push(nextRoute);
        },
        onError: (error) => {
          if (axios.isAxiosError<{ message?: string }>(error)) {
            setErrorMessage(error.response?.data?.message || 'Invalid credentials');
            return;
          }

          setErrorMessage('Invalid credentials');
        }
      }
    );
  };

  return (
    <section className="card" style={{ maxWidth: '450px', marginInline: 'auto' }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <form className="grid" onSubmit={handleSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={login.isPending}>
          {login.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {errorMessage ? <p style={{ color: '#b91c1c' }}>{errorMessage}</p> : null}
    </section>
  );
}
