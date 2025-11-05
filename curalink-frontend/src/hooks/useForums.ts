// src/hooks/useForums.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { forumsAPI } from '@/lib/api';
import { Forum, ForumPost, ForumReply } from '@/types';

export const useForums = () => {
  return useQuery({
    queryKey: ['forums'],
    queryFn: async (): Promise<Forum[]> => {
      const response = await forumsAPI.getForums();
      return response.data.data.forums;
    },
  });
};

export const useForumPosts = (forumId: string, category?: string) => {
  return useQuery({
    queryKey: ['forumPosts', forumId, category],
    queryFn: async (): Promise<ForumPost[]> => {
      const response = await forumsAPI.getForumPosts(forumId, { category });
      return response.data.data.posts;
    },
    enabled: !!forumId,
  });
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (postData: any) => {
      const response = await forumsAPI.createPost(postData);
      return response.data;
    },
  });
};

export const useCreateReply = () => {
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const response = await forumsAPI.createReply(postId, { content });
      return response.data;
    },
  });
};

export const usePostReplies = (postId: string) => {
  return useQuery({
    queryKey: ['postReplies', postId],
    queryFn: async (): Promise<ForumReply[]> => {
      const response = await forumsAPI.getPostReplies(postId);
      return response.data.data.replies;
    },
    enabled: !!postId,
  });
};