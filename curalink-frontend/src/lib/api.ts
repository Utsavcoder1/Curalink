// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getFavorites: () => api.get('/dashboard/favorites'),
};

export const clinicalTrialsAPI = {
  search: (params: any) => api.get('/clinical-trials/search', { params }),
  getRecommended: () => api.get('/clinical-trials/recommended'),
  saveTrial: (trialId: string) => api.post(`/clinical-trials/${trialId}/save`),
  getSaved: () => api.get('/clinical-trials/saved'),
};

export const publicationsAPI = {
  search: (params: any) => api.get('/publications/search', { params }),
  getRecommended: () => api.get('/publications/recommended'),
  savePublication: (publicationId: string) => api.post(`/publications/${publicationId}/save`),
  getSaved: () => api.get('/publications/saved'),
};

// In your src/lib/api.ts - add this to the exports
export const expertsAPI = {
  search: (params: any) => api.get('/experts/search', { params }),
  getRecommended: () => api.get('/experts/recommended'),
  saveExpert: (expertId: string) => api.post(`/experts/${expertId}/save`),
  requestMeeting: (expertId: string, data: any) => 
    api.post(`/experts/${expertId}/request-meeting`, data),
  nudgeExpert: (expertId: string) => api.post(`/experts/${expertId}/nudge`),
};

export const forumsAPI = {
  getForums: () => api.get('/forums'),
  getForumPosts: (forumId: string, params?: any) => 
    api.get(`/forums/${forumId}/posts`, { params }),
  createPost: (data: any) => api.post('/forums/posts', data),
  createReply: (postId: string, data: any) => 
    api.post(`/forums/posts/${postId}/replies`, data),
  getPostReplies: (postId: string) => 
    api.get(`/forums/posts/${postId}/replies`),
};