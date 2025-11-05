// src/controllers/forumController.ts
import { Response } from 'express';
import { Forum, ForumPost, ForumReply } from '../models/Forum';
import { AuthRequest } from '../middleware/auth';

export const getForums = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const forums = await Forum.find({ isActive: true });

    res.json({
      success: true,
      data: { forums }
    });
  } catch (error) {
    console.error('Get forums error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forums'
    });
  }
};

export const getForumPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { forumId } = req.params;
    const { category } = req.query;

    let query: any = { forum: forumId, isActive: true };

    if (category) {
      query.category = category;
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'profile role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum posts'
    });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { forumId, title, content, isQuestion, tags } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    // Check if user is authenticated
    if (!userId || !userRole) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const post = new ForumPost({
      forum: forumId,
      title,
      content,
      author: userId,
      authorRole: userRole, // Now this is guaranteed to be defined
      isQuestion: isQuestion || false,
      tags: tags || []
    });

    await post.save();
    await post.populate('author', 'profile role');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post'
    });
  }
};

export const createReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    // Check if user is authenticated
    if (!userId || !userRole) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Only researchers can reply to posts
    if (userRole !== 'researcher') {
      res.status(403).json({
        success: false,
        message: 'Only researchers can reply to forum posts'
      });
      return;
    }

    const reply = new ForumReply({
      content,
      author: userId,
      authorRole: 'researcher', // Fixed value for replies
      post: postId
    });

    await reply.save();
    await reply.populate('author', 'profile role');

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      data: { reply }
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reply'
    });
  }
};

export const getPostReplies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const replies = await ForumReply.find({ post: postId, isActive: true })
      .populate('author', 'profile role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { replies }
    });
  } catch (error) {
    console.error('Get post replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post replies'
    });
  }
};