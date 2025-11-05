// src/hooks/usePublications.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { publicationsAPI } from '@/lib/api';
import { Publication } from '@/types';

export const usePublications = (searchParams?: any) => {
  return useQuery({
    queryKey: ['publications', searchParams],
    queryFn: async (): Promise<Publication[]> => {
      const response = await publicationsAPI.search(searchParams || {});
      return response.data.data.publications;
    },
  });
};

export const useSavePublication = () => {
  return useMutation({
    mutationFn: async (publicationId: string) => {
      const response = await publicationsAPI.savePublication(publicationId);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        console.log('Publication saved successfully');
      }
    },
    onError: (error: any) => {
      console.error('Error saving publication:', error);
    }
  });
};

export const useRecommendedPublications = () => {
  return useQuery({
    queryKey: ['recommendedPublications'],
    queryFn: async (): Promise<Publication[]> => {
      const response = await publicationsAPI.getRecommended();
      return response.data.data.publications;
    },
  });
};