'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job, JobListResponse } from '@/types/job';

type JobFilters = {
  q?: string;
  location?: string;
  company?: string;
};

const buildParams = (filters: JobFilters, page = 1) => ({
  page,
  limit: 10,
  ...filters
});

export const useInfiniteJobs = (filters: JobFilters) => {
  return useInfiniteQuery({
    queryKey: ['jobs', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<JobListResponse>('/jobs', {
        params: buildParams(filters, pageParam)
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 60 * 1000
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await api.get<Job>(`/jobs/${id}`);
      return data;
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000
  });
};
