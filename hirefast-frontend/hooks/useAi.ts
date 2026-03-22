'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

type AiMatchItem = {
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  aiMatchScore: number;
  rationale: string;
};

export const useAiJobRecommendations = () =>
  useQuery({
    queryKey: ['ai', 'jobs', 'recommendations'],
    queryFn: async () => {
      const { data } = await api.get<AiMatchItem[]>('/ai/jobs/recommendations');
      return data;
    }
  });

export const useScoreResumeAgainstJobs = () =>
  useMutation({
    mutationFn: async (resumeText: string) => {
      const { data } = await api.post<AiMatchItem[]>('/ai/jobs/score-resume', { resumeText });
      return data;
    }
  });
