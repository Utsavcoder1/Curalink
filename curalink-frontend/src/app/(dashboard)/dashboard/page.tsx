// src/app/(dashboard)/dashboard/page.tsx
'use client';
import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useGetCurrentUser } from '@/hooks/useAuth';
import Link from 'next/link';
import { ClinicalTrial, Publication, Expert } from '@/types';

export default function DashboardPage() {
  const { data: user } = useGetCurrentUser();
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg">Error loading dashboard</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Fix: Access data directly from dashboardData (not dashboardData.data)
  const { user: dashboardUser, recommended } = dashboardData || {};
  const isPatient = user?.role === 'patient';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.profile?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here are your personalized recommendations based on your{' '}
              {isPatient ? 'health conditions' : 'research interests'}.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
              {user?.profile?.firstName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🔬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clinical Trials</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommended?.clinicalTrials?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publications</p>
              <p className="text-2xl font-bold text-gray-900">
                {recommended?.publications?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">{isPatient ? '👨‍⚕️' : '🤝'}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {isPatient ? 'Health Experts' : 'Collaborators'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(recommended?.experts || recommended?.collaborators)?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Trials Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended Clinical Trials
            </h2>
            <Link 
              href="/clinical-trials" 
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recommended?.clinicalTrials?.slice(0, 3).map((trial: ClinicalTrial) => (
              <div key={trial._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{trial.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      trial.status === 'recruiting' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trial.status}
                    </span>
                    {trial.phases?.[0] && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {trial.phases[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {trial.conditions?.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            ))}
            {(!recommended?.clinicalTrials || recommended.clinicalTrials.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No clinical trials recommendations yet.</p>
                <Link 
                  href="/clinical-trials" 
                  className="inline-block mt-2 text-blue-600 hover:text-blue-500 text-sm"
                >
                  Browse clinical trials
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Publications Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended Publications
            </h2>
            <Link 
              href="/publications" 
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recommended?.publications?.slice(0, 3).map((publication: Publication) => (
              <div key={publication._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{publication.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">
                      {publication.journal}
                    </span>
                    {publication.publicationDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(publication.publicationDate).getFullYear()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {publication.authors?.slice(0, 2).join(', ')}
                  </span>
                </div>
                {publication.aiSummary && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {publication.aiSummary}
                  </p>
                )}
              </div>
            ))}
            {(!recommended?.publications || recommended.publications.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No publication recommendations yet.</p>
                <Link 
                  href="/publications" 
                  className="inline-block mt-2 text-blue-600 hover:text-blue-500 text-sm"
                >
                  Browse publications
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Experts/Collaborators Section */}
        {(recommended?.experts || recommended?.collaborators) && (
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isPatient ? 'Recommended Health Experts' : 'Potential Collaborators'}
              </h2>
              <Link 
                href="/experts" 
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(recommended.experts || recommended.collaborators)?.slice(0, 3).map((expert: Expert) => (
                <div key={expert._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{expert.institution}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {expert.specialties?.slice(0, 2).join(', ')}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    {expert.isAvailableForMeetings && (
                      <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Available
                      </span>
                    )}
                    <Link 
                      href="/experts" 
                      className="text-xs text-blue-600 hover:text-blue-500"
                    >
                      View profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link 
            href="/clinical-trials" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl mb-2">🔬</span>
            <span className="font-medium text-gray-900">Find Trials</span>
            <span className="text-sm text-gray-600 mt-1">Browse clinical trials</span>
          </Link>
          
          <Link 
            href="/publications" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl mb-2">📚</span>
            <span className="font-medium text-gray-900">Read Research</span>
            <span className="text-sm text-gray-600 mt-1">Latest publications</span>
          </Link>
          
          <Link 
            href="/experts" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl mb-2">{isPatient ? '👨‍⚕️' : '🤝'}</span>
            <span className="font-medium text-gray-900">
              {isPatient ? 'Find Experts' : 'Find Collaborators'}
            </span>
            <span className="text-sm text-gray-600 mt-1">
              {isPatient ? 'Medical professionals' : 'Research partners'}
            </span>
          </Link>
          
          <Link 
            href="/forums" 
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-2xl mb-2">💬</span>
            <span className="font-medium text-gray-900">Join Discussion</span>
            <span className="text-sm text-gray-600 mt-1">Community forums</span>
          </Link>
        </div>
      </div>
    </div>
  );
};