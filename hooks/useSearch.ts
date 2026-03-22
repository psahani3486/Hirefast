'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

type SearchResult = {
  people: Array<{
    user: { _id: string; name: string; email: string; role: string };
    profile: { headline?: string; location?: string } | null;
    isConnected: boolean;
  }>;
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
  }>;
  companies: Array<{
    _id: string;
    name: string;
    industry: string;
    location: string;
    website: string;
  }>;
  posts: Array<{
    _id: string;
    content: string;
    author?: { name: string };
  }>;
};

export const useGlobalSearch = (q: string) =>
  useQuery({
    queryKey: ['search', q],
    queryFn: async () => {
      const { data } = await api.get<SearchResult>('/search/global', { params: { q } });
      return data;
    },
    enabled: q.trim().length > 1,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1
  });
