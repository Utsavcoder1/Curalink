import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api'; // Change from default import to named import
import { authService } from '@/lib/auth';
import { AuthResponse, User } from '@/types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // Use the named export from api.ts
      const response = await authAPI.login(credentials.email, credentials.password);
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
      // Use the named export from api.ts
      const response = await authAPI.register(userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        authService.setAuth(data.data.token, data.data.user);
      }
    },
  });
};

// In your useAuth.ts - make sure the query only runs when authenticated
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authAPI.getMe();
      return response.data.data.user;
    },
    enabled: typeof window !== 'undefined' && authService.isAuthenticated(), // Only run on client side when authenticated
    retry: false,
  });
};