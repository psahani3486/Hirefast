'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type Conversation = {
  user: { _id: string; name: string; email: string; role: string };
  lastMessage: {
    _id: string;
    text: string;
    createdAt: string;
    sender: string;
    recipient: string;
  };
  unreadCount: number;
};

type Message = {
  _id: string;
  sender: { _id: string; name: string; email: string; role: string };
  recipient: { _id: string; name: string; email: string; role: string };
  text: string;
  read: boolean;
  createdAt: string;
};

const convKey = ['messages', 'conversations'];

export const useConversations = () =>
  useQuery({
    queryKey: convKey,
    queryFn: async () => {
      const { data } = await api.get<Conversation[]>('/messages/conversations');
      return data;
    }
  });

export const useThread = (userId: string) =>
  useQuery({
    queryKey: ['messages', 'thread', userId],
    queryFn: async () => {
      const { data } = await api.get<Message[]>(`/messages/${userId}`);
      return data;
    },
    enabled: Boolean(userId)
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, text }: { userId: string; text: string }) => {
      const { data } = await api.post<Message>(`/messages/${userId}`, { text });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: convKey });
      queryClient.invalidateQueries({ queryKey: ['messages', 'thread', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread'] });
    }
  });
};

export const useUnreadMessageCount = () =>
  useQuery({
    queryKey: ['messages', 'unread'],
    queryFn: async () => {
      const { data } = await api.get<{ unread: number }>('/messages/unread-count');
      return data.unread;
    }
  });
