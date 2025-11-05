// src/app/(dashboard)/forums/page.tsx
'use client';
import React, { useState } from 'react';
import { useGetCurrentUser } from '@/hooks/useAuth';
import { Forum, ForumPost } from '@/types';

// Mock data - you'll replace this with real API calls
const mockForums: Forum[] = [
  {
    _id: '1',
    title: 'Cancer Research',
    description: 'Discussions about latest cancer research and treatments',
    category: 'Research',
    createdBy: 'admin',
    isActive: true
  },
  {
    _id: '2',
    title: 'Clinical Trials Insights',
    description: 'Share experiences and insights about clinical trials',
    category: 'Clinical Trials',
    createdBy: 'admin',
    isActive: true
  },
  {
    _id: '3',
    title: 'Patient Support',
    description: 'Support and advice for patients and caregivers',
    category: 'Support',
    createdBy: 'admin',
    isActive: true
  },
  {
    _id: '4',
    title: 'Research Collaboration',
    description: 'Connect with other researchers for collaboration opportunities',
    category: 'Collaboration',
    createdBy: 'admin',
    isActive: true
  }
];

const mockPosts: ForumPost[] = [
  {
    _id: '1',
    forum: '1',
    title: 'Latest advancements in immunotherapy for brain cancer',
    content: 'I\'ve been researching recent developments in immunotherapy approaches for glioblastoma. Has anyone come across promising clinical trials or research papers in this area?',
    author: 'patient123',
    authorRole: 'patient',
    isQuestion: true,
    tags: ['immunotherapy', 'brain-cancer', 'clinical-trials'],
    isActive: true
  },
  {
    _id: '2',
    forum: '1',
    title: 'CAR-T therapy results in pediatric patients',
    content: 'Our research team has observed remarkable results with CAR-T therapy in pediatric oncology cases. The response rates have been encouraging, though we\'re monitoring long-term effects.',
    author: 'dr_smith',
    authorRole: 'researcher',
    isQuestion: false,
    tags: ['car-t', 'pediatric', 'oncology'],
    isActive: true
  }
];

export default function ForumsPage() {
  const { data: user } = useGetCurrentUser();
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    isQuestion: true,
    tags: [] as string[]
  });

  const handleForumSelect = (forum: Forum) => {
    setSelectedForum(forum);
    // In real implementation, you would fetch posts for this forum
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForum) return;

    const post: ForumPost = {
      _id: Date.now().toString(),
      forum: selectedForum._id,
      title: newPost.title,
      content: newPost.content,
      author: user?._id || 'user',
      authorRole: user?.role === 'researcher' ? 'researcher' : 'patient',
      isQuestion: newPost.isQuestion,
      tags: newPost.tags,
      isActive: true
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', isQuestion: true, tags: [] });
    setShowCreatePost(false);
  };

  const isPatient = user?.role === 'patient';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Forums</h1>
        <p className="text-gray-600 mt-2">
          Connect with {isPatient ? 'researchers and other patients' : 'patients and fellow researchers'} to share knowledge and experiences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Forums List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Forums</h2>
            <div className="space-y-2">
              {mockForums.map((forum) => (
                <button
                  key={forum._id}
                  onClick={() => handleForumSelect(forum)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedForum?._id === forum._id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{forum.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{forum.description}</p>
                  <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {forum.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Area */}
        <div className="lg:col-span-3">
          {selectedForum ? (
            <div className="space-y-6">
              {/* Forum Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedForum.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedForum.description}</p>
                  </div>
                  {!isPatient && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      New Post
                    </button>
                  )}
                </div>
              </div>

              {/* Create Post Form */}
              {showCreatePost && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter post title..."
                      />
                    </div>

                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        id="content"
                        required
                        rows={4}
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your post content..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isQuestion"
                        checked={newPost.isQuestion}
                        onChange={(e) => setNewPost(prev => ({ ...prev, isQuestion: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isQuestion" className="ml-2 block text-sm text-gray-700">
                        This is a question
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Posts List */}
              <div className="space-y-4">
                {posts.filter(post => post.forum === selectedForum._id).map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            post.authorRole === 'researcher' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {post.authorRole}
                          </span>
                          {post.isQuestion && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Question
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{post.content}</p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Only researchers can reply */}
                    {user?.role === 'researcher' && (
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Reply to Post
                        </button>
                        <span className="text-sm text-gray-500">0 replies</span>
                      </div>
                    )}

                    {/* Patients can only view */}
                    {isPatient && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          {post.authorRole === 'researcher' 
                            ? 'Researcher post - awaiting patient questions'
                            : 'Your question - awaiting researcher responses'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {posts.filter(post => post.forum === selectedForum._id).length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">No posts in this forum yet.</p>
                    {!isPatient && (
                      <button
                        onClick={() => setShowCreatePost(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Forum</h3>
                <p className="text-gray-600">
                  Choose a forum from the left to view discussions and {isPatient ? 'ask questions' : 'participate in conversations'}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}