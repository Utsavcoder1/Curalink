// src/app/(dashboard)/forums/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth';

interface Forum {
  _id: string;
  title: string;
  description: string;
  category: string;
  postCount: number;
  latestPost: {
    title: string;
    author: string;
    date: string;
  };
}

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  isQuestion: boolean;
  tags: string[];
  replies: number;
  createdAt: string;
}

export default function ForumsPage() {
  const [activeForum, setActiveForum] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    isQuestion: false,
    tags: [] as string[]
  });
  const user = authService.getCurrentUser();

  const mockForums: Forum[] = [
    {
      _id: '1',
      title: 'Cancer Research',
      description: 'Discussions about latest cancer research and treatments',
      category: 'Research',
      postCount: 142,
      latestPost: {
        title: 'New immunotherapy approach',
        author: 'Dr. Sarah Chen',
        date: '2024-01-15'
      }
    },
    {
      _id: '2',
      title: 'Clinical Trials Insights',
      description: 'Share experiences and insights about clinical trials',
      category: 'Clinical Trials',
      postCount: 89,
      latestPost: {
        title: 'Phase 3 trial results',
        author: 'Patient123',
        date: '2024-01-14'
      }
    },
    {
      _id: '3',
      title: 'Treatment Questions',
      description: 'Ask questions about treatments and get answers from researchers',
      category: 'Q&A',
      postCount: 256,
      latestPost: {
        title: 'Side effects management',
        author: 'Caregiver456',
        date: '2024-01-16'
      }
    }
  ];

  const mockPosts: ForumPost[] = [
    {
      _id: '1',
      title: 'New immunotherapy approach for brain cancer',
      content: 'I recently read about this new immunotherapy method that shows promising results in treating glioblastoma. Has anyone here participated in similar trials or have experience with this treatment approach?',
      author: 'Patient123',
      authorRole: 'patient',
      isQuestion: true,
      tags: ['brain-cancer', 'immunotherapy', 'glioblastoma'],
      replies: 5,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'Phase 3 trial results published for lung cancer treatment',
      content: 'The latest phase 3 trial results show promising outcomes for the new targeted therapy drug. Significant improvement in survival rates was observed in patients with specific genetic mutations.',
      author: 'Dr. Sarah Chen',
      authorRole: 'researcher',
      isQuestion: false,
      tags: ['clinical-trial', 'results', 'lung-cancer', 'targeted-therapy'],
      replies: 12,
      createdAt: '2024-01-14'
    }
  ];

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating post:', newPost);
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', isQuestion: false, tags: [] });
  };

  const handleViewDiscussion = (postId: string) => {
    console.log('Viewing discussion for post:', postId);
  };

  const selectedForum = mockForums.find(f => f._id === activeForum);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forums</h1>
            <p className="text-gray-600 mt-2">
              Connect with {user?.role === 'patient' ? 'researchers and other patients' : 'patients and colleagues'}
            </p>
          </div>
          {user && (
            <Button onClick={() => setShowNewPostForm(true)}>
              {user.role === 'patient' ? 'New Question' : 'New Post'}
            </Button>
          )}
        </div>
      </div>

      {showNewPostForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Create New Post</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question or discussion topic"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  required
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your question or topic in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add tags separated by commas (e.g., cancer, treatment, research)"
                />
              </div>
              {user?.role === 'patient' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isQuestion"
                    checked={newPost.isQuestion}
                    onChange={(e) => setNewPost(prev => ({ ...prev, isQuestion: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isQuestion" className="ml-2 block text-sm text-gray-700">
                    This is a question (only researchers can reply)
                  </label>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewPostForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!activeForum ? (
        // Forum List View
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockForums.map((forum) => (
            <Card 
              key={forum._id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveForum(forum._id)}
            >
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">{forum.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{forum.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {forum.category}
                  </span>
                  <span>{forum.postCount} posts</span>
                </div>
                {forum.latestPost && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {forum.latestPost.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {forum.latestPost.author} • {forum.latestPost.date}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Posts List View
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setActiveForum(null)}
              className="flex items-center"
            >
              ← Back to Forums
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedForum?.title}
              </h2>
              <p className="text-gray-600 mt-1">{selectedForum?.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockPosts.map((post) => (
              <Card key={post._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                          post.authorRole === 'researcher' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.replies} replies</span>
                        {post.isQuestion && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                            Question
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewDiscussion(post._id)}
                      className="ml-4"
                    >
                      View Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockPosts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to start a discussion in this forum</p>
                <Button onClick={() => setShowNewPostForm(true)}>
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}