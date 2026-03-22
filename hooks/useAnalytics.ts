'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

type Analytics = {
  profileViews30d: number;
  profileViews7d: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  topPosts: Array<{
    _id: string;
    contentPreview: string;
    likes: number;
    comments: number;
    engagement: number;
    createdAt: string;
  }>;
};

export const useMyAnalytics = () =>
  useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: async () => {
      const { data } = await api.get<Analytics>('/analytics/me');
      return data;
    }
  });
