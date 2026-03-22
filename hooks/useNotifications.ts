'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/types/social';

const key = ['notifications', 'me'];

export const useNotifications = () =>
  useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<Notification[]>('/notifications/me');
      return data;
    }
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    }
  });
};
