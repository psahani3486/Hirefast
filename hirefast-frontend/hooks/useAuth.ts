'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
  role?: 'candidate' | 'recruiter';
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const persistAuth = (data: AuthResponse) => {
  localStorage.setItem('hirefast_token', data.token);
  localStorage.setItem('hirefast_user', JSON.stringify(data.user));
};

export const useLogin = () =>
  useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload);
      persistAuth(data);
      return data;
    }
  });

export const useSignup = () =>
  useMutation({
    mutationFn: async (payload: AuthPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/signup', payload);
      persistAuth(data);
      return data;
    }
  });
