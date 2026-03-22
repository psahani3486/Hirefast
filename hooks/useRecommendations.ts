'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

type Recommendations = {
  people: Array<{
    user: { _id: string; name: string; email: string; role: string };
    profile: { headline?: string; location?: string; skills?: string[] };
    sharedSkills: string[];
    score: number;
  }>;
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    score: number;
    matchSkills: string[];
  }>;
  posts: Array<{
    _id: string;
    content: string;
    author?: { name: string };
    score: number;
  }>;
};

export const useRecommendations = () =>
  useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data } = await api.get<Recommendations>('/recommendations');
      return data;
    }
  });
