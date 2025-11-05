// src/hooks/useClinicalTrials.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { clinicalTrialsAPI } from '@/lib/api';

export const useClinicalTrials = (searchParams?: any) => {
  return useQuery({
    queryKey: ['clinicalTrials', searchParams],
    queryFn: async () => {
      const response = await clinicalTrialsAPI.search(searchParams || {});
      return response.data.data.trials;
    },
  });
};

export const useSaveTrial = () => {
  return useMutation({
    mutationFn: async (trialId: string) => {
      const response = await clinicalTrialsAPI.saveTrial(trialId);
      return response.data;
    },
  });
};

export const useRecommendedTrials = () => {
  return useQuery({
    queryKey: ['recommendedTrials'],
    queryFn: async () => {
      const response = await clinicalTrialsAPI.getRecommended();
      return response.data.data.trials;
    },
  });
};