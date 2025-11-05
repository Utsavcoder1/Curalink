// src/app/(dashboard)/experts/page.tsx
'use client';
import React, { useState } from 'react';
import { useExperts, useSaveExpert, useRequestMeeting, useNudgeExpert } from '@/hooks/useExperts';
import { useGetCurrentUser } from '@/hooks/useAuth';
import { Expert } from '@/types';

export default function ExpertsPage() {
  const { data: user } = useGetCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialties: '',
    location: '',
    proximity: false
  });

  // Use real API hooks
  const { data: experts, isLoading, error } = useExperts({
    query: searchQuery,
    specialties: filters.specialties,
    location: filters.location,
    proximity: filters.proximity
  });

  const saveExpertMutation = useSaveExpert();
  const requestMeetingMutation = useRequestMeeting();
  const nudgeExpertMutation = useNudgeExpert();

  const handleSaveExpert = (expertId: string) => {
    saveExpertMutation.mutate(expertId);
  };

  const handleRequestMeeting = (expert: Expert) => {
    requestMeetingMutation.mutate({
      expertId: expert._id,
      meetingData: {
        message: `Meeting request from ${user?.profile?.firstName || 'user'}`,
        preferredDates: []
      }
    });
  };

  const handleNudgeExpert = (expertId: string) => {
    nudgeExpertMutation.mutate(expertId);
  };

  const isPatient = user?.role === 'patient';

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading experts: {(error as Error).message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isPatient ? 'Health Experts' : 'Collaborators'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isPatient 
            ? 'Connect with medical experts specializing in your conditions'
            : 'Discover researchers with similar interests for collaboration'
          }
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search {isPatient ? 'Experts' : 'Collaborators'}
            </label>
            <input
              type="text"
              id="search"
              placeholder={`Search by name, specialty, or institution...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Specialty Filter */}
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <input
              type="text"
              id="specialty"
              placeholder="e.g., Oncology"
              value={filters.specialties}
              onChange={(e) => setFilters(prev => ({ ...prev, specialties: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="location"
                placeholder="Country or city"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="proximity"
                checked={filters.proximity}
                onChange={(e) => setFilters(prev => ({ ...prev, proximity: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="proximity" className="ml-2 text-sm text-gray-700">
                Show nearby only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for {isPatient ? 'experts' : 'collaborators'}...</p>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {experts?.length || 0} {isPatient ? 'Experts' : 'Collaborators'} Found
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experts?.map((expert: Expert) => (
                <div key={expert._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                      <p className="text-gray-600 text-sm">{expert.institution}</p>
                      <p className="text-gray-500 text-sm">{expert.position}</p>
                    </div>
                    <button
                      onClick={() => handleSaveExpert(expert._id)}
                      disabled={saveExpertMutation.isPending}
                      className="text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
                      title="Save to favorites"
                    >
                      ⭐
                    </button>
                  </div>
                  
                  {expert.location?.country && (
                    <p className="text-gray-500 text-sm mb-3">
                      📍 {expert.location.city && `${expert.location.city}, `}{expert.location.country}
                    </p>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialties?.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                      {expert.specialties && expert.specialties.length > 3 && (
                        <span className="text-xs text-gray-500">+{expert.specialties.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Research Interests:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {expert.researchInterests?.join(', ')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {expert.isOnPlatform ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          On Platform
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          External Expert
                        </span>
                      )}
                      {expert.isAvailableForMeetings && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Available for Meetings
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {!expert.isOnPlatform && (
                        <button
                          onClick={() => handleNudgeExpert(expert._id)}
                          disabled={nudgeExpertMutation.isPending}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                        >
                          Nudge
                        </button>
                      )}
                      <button
                        onClick={() => handleRequestMeeting(expert)}
                        disabled={requestMeetingMutation.isPending}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                      >
                        {isPatient ? 'Request Meeting' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!experts || experts.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No {isPatient ? 'experts' : 'collaborators'} found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}