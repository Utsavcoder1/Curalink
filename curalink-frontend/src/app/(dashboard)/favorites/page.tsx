// src/app/(dashboard)/favorites/page.tsx
'use client';
import React, { useState } from 'react';
import { useFavorites } from '@/hooks/useDashboard';
import { ClinicalTrial, Publication, Expert } from '@/types';

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites();
  const [activeTab, setActiveTab] = useState<'trials' | 'publications' | 'experts'>('trials');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { clinicalTrials = [], publications = [], experts = [] } = favorites?.data || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600 mt-2">
          Your saved clinical trials, publications, and experts in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('trials')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clinical Trials
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {clinicalTrials.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'publications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Publications
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {publications.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('experts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'experts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experts
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {experts.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Clinical Trials Tab */}
          {activeTab === 'trials' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Saved Clinical Trials</h2>
              {clinicalTrials.length > 0 ? (
                <div className="space-y-4">
                  {clinicalTrials.map((trial: ClinicalTrial) => (
                    <div key={trial._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{trial.title}</h3>
                        <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                          ⭐
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions</h4>
                          <div className="flex flex-wrap gap-1">
                            {trial.conditions?.slice(0, 3).map((condition, index) => (
                              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Status & Phase</h4>
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

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Locations</h4>
                          <p className="text-sm text-gray-600">
                            {trial.locations?.slice(0, 2).map(loc => loc.country).join(', ')}
                            {trial.locations && trial.locations.length > 2 && '...'}
                          </p>
                        </div>
                      </div>

                      {trial.aiSummary && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Summary</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {trial.aiSummary}
                          </p>
                        </div>
                      )}

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
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved clinical trials</h3>
                  <p className="text-gray-500">Save clinical trials that interest you to find them here later.</p>
                  <a
                    href="/clinical-trials"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Clinical Trials
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Saved Publications</h2>
              {publications.length > 0 ? (
                <div className="space-y-4">
                  {publications.map((publication: Publication) => (
                    <div key={publication._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {publication.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="font-medium">{publication.journal}</span>
                            {publication.publicationDate && (
                              <span>
                                {new Date(publication.publicationDate).getFullYear()}
                              </span>
                            )}
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Authors</h4>
                            <p className="text-sm text-gray-600">
                              {publication.authors?.slice(0, 3).join(', ')}
                              {publication.authors && publication.authors.length > 3 && ' et al.'}
                            </p>
                          </div>
                        </div>
                        
                        <button className="text-yellow-500 hover:text-yellow-600 transition-colors ml-4">
                          ⭐
                        </button>
                      </div>

                      {publication.aiSummary && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded leading-relaxed">
                            {publication.aiSummary}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          {publication.pmid && (
                            <span>PMID: {publication.pmid}</span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <a
                            href={publication.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Full Paper
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved publications</h3>
                  <p className="text-gray-500">Save research papers that interest you to read them later.</p>
                  <a
                    href="/publications"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Publications
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Experts Tab */}
          {activeTab === 'experts' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Saved Experts</h2>
              {experts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experts.map((expert: Expert) => (
                    <div key={expert._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                          <p className="text-gray-600 text-sm">{expert.institution}</p>
                          <p className="text-gray-500 text-sm">{expert.position}</p>
                        </div>
                        <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                          ⭐
                        </button>
                      </div>
                      
                      {expert.location?.country && (
                        <p className="text-gray-500 text-sm mb-3">
                          📍 {expert.location.city && `${expert.location.city}, `}{expert.location.country}
                        </p>
                      )}

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialties?.slice(0, 3).map((specialty, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
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
                        
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved experts</h3>
                  <p className="text-gray-500">Save experts or collaborators that you want to connect with later.</p>
                  <a
                    href="/experts"
                    className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Experts
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}