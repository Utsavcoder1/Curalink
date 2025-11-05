// src/hooks/useExperts.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { expertsAPI } from '@/lib/api';
import { Expert } from '@/types';

export const useExperts = (searchParams?: any) => {
  return useQuery({
    queryKey: ['experts', searchParams],
    queryFn: async (): Promise<Expert[]> => {
      const response = await expertsAPI.search(searchParams || {});
      return response.data.data.experts;
    },
  });
};

export const useSaveExpert = () => {
  return useMutation({
    mutationFn: async (expertId: string) => {
      const response = await expertsAPI.saveExpert(expertId);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Optional: Show success message or update cache
        console.log('Expert saved successfully');
      }
    },
    onError: (error: any) => {
      console.error('Error saving expert:', error);
    }
  });
};

export const useRequestMeeting = () => {
  return useMutation({
    mutationFn: async ({ expertId, meetingData }: { expertId: string; meetingData: any }) => {
      const response = await expertsAPI.requestMeeting(expertId, meetingData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.requiresManualContact) {
          alert('Meeting request submitted to admin. The expert will be contacted manually.');
        } else {
          alert('Meeting request sent to expert successfully!');
        }
      }
    },
    onError: (error: any) => {
      console.error('Error requesting meeting:', error);
      alert('Failed to send meeting request. Please try again.');
    }
  });
};

export const useNudgeExpert = () => {
  return useMutation({
    mutationFn: async (expertId: string) => {
      const response = await expertsAPI.nudgeExpert(expertId);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        alert('Expert has been nudged to join the platform!');
      }
    },
    onError: (error: any) => {
      console.error('Error nudging expert:', error);
      alert('Failed to nudge expert. Please try again.');
    }
  });
};

export const useRecommendedExperts = () => {
  return useQuery({
    queryKey: ['recommendedExperts'],
    queryFn: async (): Promise<Expert[]> => {
      const response = await expertsAPI.getRecommended();
      return response.data.data.experts;
    },
  });
};