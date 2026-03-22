'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ConnectionsBundle } from '@/types/social';

const key = ['connections', 'me'];

export const useMyConnections = () =>
  useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<ConnectionsBundle>('/connections/me');
      return data;
    }
  });

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipientId: string) => {
      const { data } = await api.post('/connections/request', { recipientId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ['profiles', 'discover'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
    }
  });
};

export const useRespondConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'reject' }) => {
      const { data } = await api.patch(`/connections/${id}/respond`, { action });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    }
  });
};

export const useRemoveConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/connections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    }
  });
};
