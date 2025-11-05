// src/app/(dashboard)/clinical-trials/page.tsx
'use client';
import React, { useState } from 'react';
import { useClinicalTrials } from '@/hooks/useClinicalTrials';
import { useSaveTrial } from '@/hooks/useClinicalTrials';
import { ClinicalTrial } from '@/types';

export default function ClinicalTrialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    phase: '',
    location: ''
  });

  const { data: trials, isLoading } = useClinicalTrials({
    query: searchQuery,
    status: filters.status,
    phase: filters.phase,
    location: filters.location
  });

  const saveTrialMutation = useSaveTrial();

  const handleSaveTrial = (trialId: string) => {
    saveTrialMutation.mutate(trialId);
  };

  const statusOptions = [
    { value: 'recruiting', label: 'Recruiting' },
    { value: 'completed', label: 'Completed' },
    { value: 'active', label: 'Active' },
    { value: 'not yet recruiting', label: 'Not Yet Recruiting' }
  ];

  const phaseOptions = [
    { value: 'Phase 1', label: 'Phase 1' },
    { value: 'Phase 2', label: 'Phase 2' },
    { value: 'Phase 3', label: 'Phase 3' },
    { value: 'Phase 4', label: 'Phase 4' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinical Trials</h1>
        <p className="text-gray-600 mt-2">
          Discover clinical trials relevant to your interests and conditions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Trials
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by condition, intervention, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase Filter */}
          <div>
            <label htmlFor="phase" className="block text-sm font-medium text-gray-700 mb-1">
              Phase
            </label>
            <select
              id="phase"
              value={filters.phase}
              onChange={(e) => setFilters(prev => ({ ...prev, phase: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Phases</option>
              {phaseOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Country or city"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-lg">Loading clinical trials...</div>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {trials?.length || 0} Clinical Trials Found
            </h2>
            
            <div className="space-y-6">
              {trials?.map((trial: ClinicalTrial) => (
                <div key={trial._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{trial.title}</h3>
                    <button
                      onClick={() => handleSaveTrial(trial._id)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                      title="Save to favorites"
                    >
                      ⭐
                    </button>
                  </div>

                  {/* Trial Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions</h4>
                      <div className="flex flex-wrap gap-1">
                        {trial.conditions?.slice(0, 3).map((condition, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {condition}
                          </span>
                        ))}
                        {trial.conditions && trial.conditions.length > 3 && (
                          <span className="text-xs text-gray-500">+{trial.conditions.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Interventions</h4>
                      <p className="text-sm text-gray-600">
                        {trial.interventions?.slice(0, 2).join(', ')}
                        {trial.interventions && trial.interventions.length > 2 && '...'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Details</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          trial.status === 'recruiting' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trial.status}
                        </span>
                        {trial.phases?.map((phase, index) => (
                          <span key={index} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Locations */}
                  {trial.locations && trial.locations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {trial.locations.slice(0, 3).map((location, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            📍 {location.city && `${location.city}, `}{location.country}
                          </span>
                        ))}
                        {trial.locations.length > 3 && (
                          <span className="text-xs text-gray-500">+{trial.locations.length - 3} more locations</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Summary */}
                  {trial.aiSummary && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">AI Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {trial.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {trial.sponsors && trial.sponsors.length > 0 && (
                        <span>Sponsored by: {trial.sponsors[0]}</span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                      {trial.contacts && trial.contacts.length > 0 && trial.contacts[0].email && (
                        <a
                          href={`mailto:${trial.contacts[0].email}?subject=Inquiry about ${trial.title}`}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Contact Team
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!trials || trials.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No clinical trials found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}