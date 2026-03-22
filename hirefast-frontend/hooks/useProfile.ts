'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { DiscoverProfile, Profile } from '@/types/social';

export const useMyProfile = () =>
  useQuery({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data } = await api.get<Profile>('/profiles/me');
      return data;
    }
  });

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Profile>) => {
      const { data } = await api.put<Profile>('/profiles/me', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    }
  });
};

export const useDiscoverProfiles = (q: string) =>
  useQuery({
    queryKey: ['profiles', 'discover', q],
    queryFn: async () => {
      const { data } = await api.get<DiscoverProfile[]>('/profiles/discover', {
        params: { q }
      });
      return data;
    }
  });

export const useProfileByUserId = (userId: string) =>
  useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await api.get(`/profiles/${userId}`);
      return data;
    },
    enabled: Boolean(userId)
  });
