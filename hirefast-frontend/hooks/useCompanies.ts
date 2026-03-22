'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

type Company = {
  _id: string;
  name: string;
  description: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  logoUrl: string;
  owner?: { _id: string; name: string; email: string; role: string };
};

export type CompanyPayload = {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logoUrl?: string;
};

const companyKey = ['companies'];

export const useCompanies = (q: string) =>
  useQuery({
    queryKey: [...companyKey, q],
    queryFn: async () => {
      const { data } = await api.get<Company[]>('/companies', { params: { q } });
      return data;
    }
  });

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompanyPayload) => {
      const { data } = await api.post<Company>('/companies', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKey });
    }
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CompanyPayload> }) => {
      const { data } = await api.put<Company>(`/companies/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKey });
    }
  });
};

export const useCompanyDetails = (id: string) =>
  useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const { data } = await api.get(`/companies/${id}`);
      return data;
    },
    enabled: Boolean(id)
  });
