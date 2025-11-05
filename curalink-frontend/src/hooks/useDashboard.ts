import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ClinicalTrial, Publication, Expert } from '@/types';

interface DashboardData {
  user: any;
  recommended: {
    clinicalTrials: ClinicalTrial[];
    publications: Publication[];
    experts?: Expert[];
    collaborators?: Expert[];
  };
}

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: DashboardData }>('/dashboard');
      return response.data.data;
    },
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await api.get('/dashboard/favorites');
      return response.data.data;
    },
  });
};