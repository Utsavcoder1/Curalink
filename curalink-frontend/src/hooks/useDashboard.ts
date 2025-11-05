// src/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api'; // Change to named import
import { ClinicalTrial, Publication, Expert } from '@/types';

interface DashboardData {
  user: {
    id: string;
    email: string;
    role: string;
    profile: any;
  };
  recommended: {
    clinicalTrials: ClinicalTrial[];
    publications: Publication[];
    experts?: Expert[];
    collaborators?: Expert[];
  };
}

// src/hooks/useDashboard.ts
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const response = await dashboardAPI.getDashboard();
      // Adjust this based on your actual API response structure
      return response.data.data; // or just response.data if that's the structure
    },
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      // Use the named export instead of default api
      const response = await dashboardAPI.getFavorites();
      return response.data.data;
    },
  });
};