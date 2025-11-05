import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import { AuthResponse, User } from '@/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        authService.setAuth(data.data.token, data.data.user);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        authService.setAuth(data.data.token, data.data.user);
      }
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
      return response.data.data.user;
    },
    enabled: authService.isAuthenticated(),
  });
};