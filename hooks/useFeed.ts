'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { FeedResponse, Post } from '@/types/social';

const feedKey = ['posts', 'feed'];

export const useFeed = () =>
  useQuery({
    queryKey: feedKey,
    queryFn: async () => {
      const { data } = await api.get<FeedResponse>('/posts/feed', {
        params: { page: 1, limit: 20 }
      });
      return data;
    }
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { content: string; imageUrl?: string }) => {
      const { data } = await api.post<Post>('/posts', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKey });
    }
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.post<Post>(`/posts/${postId}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKey });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
    }
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const { data } = await api.post<Post>(`/posts/${postId}/comments`, { text });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedKey });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
    }
  });
};
