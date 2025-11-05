// src/models/Forum.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IForum extends Document {
  title: string;
  description: string;
  category: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

export interface IForumPost extends Document {
  forum: mongoose.Types.ObjectId;
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  authorRole: 'patient' | 'researcher';
  isQuestion: boolean;
  tags: string[];
  isActive: boolean;
}

export interface IForumReply extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  authorRole: 'researcher';
  post: mongoose.Types.ObjectId;
  isActive: boolean;
}

const forumSchema = new Schema<IForum>({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const forumPostSchema = new Schema<IForumPost>({
  forum: {
    type: Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorRole: {
    type: String,
    enum: ['patient', 'researcher'],
    required: true
  },
  isQuestion: {
    type: Boolean,
    default: false
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const forumReplySchema = new Schema<IForumReply>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorRole: {
    type: String,
    enum: ['researcher'],
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Forum = mongoose.model<IForum>('Forum', forumSchema);
export const ForumPost = mongoose.model<IForumPost>('ForumPost', forumPostSchema);
export const ForumReply = mongoose.model<IForumReply>('ForumReply', forumReplySchema);