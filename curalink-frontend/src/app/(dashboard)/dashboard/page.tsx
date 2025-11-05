// src/app/(dashboard)/dashboard/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { authService } from '@/lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function DashboardContent() {
  const { data: dashboardData, isLoading, error } = useDashboard();
  const user = authService.getCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center text-red-600">
          <p>Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.profile.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your personalized content based on your {user?.role === 'patient' ? 'conditions' : 'research interests'}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recommended Clinical Trials</h2>
              <Link href="/clinical-trials" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData?.recommended.clinicalTrials?.length ? (
              <div className="space-y-4">
                {dashboardData.recommended.clinicalTrials.slice(0, 3).map((trial) => (
                  <div key={trial._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900">{trial.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{trial.conditions.join(', ')}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trial.status === 'recruiting' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trial.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {trial.locations[0]?.country || 'Multiple locations'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No clinical trials found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Publications</h2>
              <Link href="/publications" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData?.recommended.publications?.length ? (
              <div className="space-y-4">
                {dashboardData.recommended.publications.slice(0, 3).map((publication) => (
                  <div key={publication._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {publication.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {publication.authors.slice(0, 2).join(', ')}
                      {publication.authors.length > 2 && ' et al.'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">{publication.journal}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(publication.publicationDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No publications found</p>
            )}
          </CardContent>
        </Card>

        {(dashboardData?.recommended.experts || dashboardData?.recommended.collaborators) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {user?.role === 'patient' ? 'Recommended Health Experts' : 'Potential Collaborators'}
                </h2>
                <Link 
                  href={user?.role === 'patient' ? '/experts' : '/collaborators'} 
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(user?.role === 'patient' 
                  ? dashboardData?.recommended.experts 
                  : dashboardData?.recommended.collaborators
                )?.slice(0, 3).map((expert) => (
                  <div key={expert._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{expert.institution}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {expert.specialties.slice(0, 2).join(', ')}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">{expert.location.country}</span>
                      {expert.isAvailableForMeetings && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}