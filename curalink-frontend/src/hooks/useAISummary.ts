// src/hooks/useAISummary.ts
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface SummaryRequest {
  text: string;
  type?: 'publication' | 'clinical_trial' | 'general';
}

interface SummaryResponse {
  success: boolean;
  data: {
    summary: string;
  };
}

export const useAISummary = () => {
  return useMutation({
    mutationFn: async ({ text, type = 'general' }: SummaryRequest): Promise<string> => {
      const response = await api.post<SummaryResponse>('/ai/summarize', {
        text,
        type
      });
      
      if (!response.data.success) {
        throw new Error('Failed to generate summary');
      }
      
      return response.data.data.summary;
    },
  });
};