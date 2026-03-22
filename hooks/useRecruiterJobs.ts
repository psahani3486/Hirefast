'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/types/job';

export type JobPayload = {
  title: string;
  company: string;
  location: string;
  description: string;
  skills?: string[];
  salaryRange?: string;
  status?: 'open' | 'closed';
};

const recruiterJobsKey = ['recruiter-jobs'];

export const useRecruiterJobs = () =>
  useQuery({
    queryKey: recruiterJobsKey,
    queryFn: async () => {
      const { data } = await api.get<Job[]>('/jobs/me/posted');
      return data;
    }
  });

export const useCreateRecruiterJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: JobPayload) => {
      const { data } = await api.post<Job>('/jobs', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterJobsKey });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-dashboard'] });
    }
  });
};

export const useUpdateRecruiterJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<JobPayload> }) => {
      const { data } = await api.put<Job>(`/jobs/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterJobsKey });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-dashboard'] });
    }
  });
};

export const useDeleteRecruiterJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterJobsKey });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-dashboard'] });
    }
  });
};
