// src/app/(dashboard)/favorites/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { ClinicalTrial, Publication, Expert } from '@/types';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'trials' | 'publications' | 'experts'>('trials');
  const user = authService.getCurrentUser();

  const mockTrials: ClinicalTrial[] = [
    {
      _id: '1',
      nctId: 'NCT06562582',
      title: 'Immunotherapy for Advanced Brain Cancer',
      conditions: ['Glioblastoma', 'Brain Cancer'],
      interventions: ['Immunotherapy'],
      phases: ['Phase 2'],
      status: 'recruiting',
      eligibility: {
        criteria: '',
        gender: 'All',
        minimumAge: '18 Years',
        maximumAge: '80 Years',
        healthyVolunteers: false
      },
      locations: [{
        name: 'Research Center',
        city: 'Boston',
        country: 'USA',
        status: 'recruiting'
      }],
      aiSummary: 'Promising immunotherapy approach for brain cancer',
      isSavedBy: []
    }
  ];

  const mockPublications: Publication[] = [
    {
      _id: '1',
      pmid: '12345678',
      title: 'Advances in Immunotherapy for Glioblastoma',
      abstract: 'Study on new immunotherapy methods...',
      authors: ['Sarah Chen', 'Michael Rodriguez'],
      journal: 'Nature Medicine',
      publicationDate: '2024-01-15',
      keywords: ['glioblastoma', 'immunotherapy'],
      url: 'https://example.com/paper1',
      aiSummary: 'New immunotherapy shows promise in treating brain cancer',
      isSavedBy: []
    }
  ];

  const mockExperts: Expert[] = [
    {
      _id: '1',
      name: 'Dr. Sarah Chen',
      institution: 'Harvard Medical School',
      position: 'Oncology Researcher',
      specialties: ['Brain Cancer', 'Glioblastoma'],
      researchInterests: ['Immunotherapy'],
      location: { city: 'Boston', country: 'USA' },
      publications: [],
      isOnPlatform: true,
      isAvailableForMeetings: true,
      isSavedBy: []
    }
  ];

  const handleRemoveFavorite = (type: string, id: string) => {
    console.log(`Removing ${type} with id: ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600 mt-2">
          Your saved clinical trials, publications, and {user?.role === 'patient' ? 'health experts' : 'collaborators'}
        </p>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {[
              { key: 'trials', label: 'Clinical Trials', count: mockTrials.length },
              { key: 'publications', label: 'Publications', count: mockPublications.length },
              { key: 'experts', label: user?.role === 'patient' ? 'Health Experts' : 'Collaborators', count: mockExperts.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorites Content */}
      <div className="space-y-4">
        {activeTab === 'trials' && (
          <>
            <h2 className="text-2xl font-semibold">Saved Clinical Trials</h2>
            {mockTrials.length > 0 ? (
              mockTrials.map((trial) => (
                <Card key={trial._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {trial.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          <strong>Conditions:</strong> {trial.conditions.join(', ')}
                        </p>
                        <p className="text-gray-600 mb-2">
                          <strong>Interventions:</strong> {trial.interventions.join(', ')}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full ${
                            trial.status === 'recruiting' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {trial.status}
                          </span>
                          <span>Phase: {trial.phases.join(', ')}</span>
                          <span>Location: {trial.locations[0]?.country}</span>
                        </div>
                        {trial.aiSummary && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>AI Summary:</strong> {trial.aiSummary}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFavorite('trial', trial._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(`mailto:contact@example.com?subject=Inquiry about ${trial.title}`, '_blank')}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No saved clinical trials yet.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === 'publications' && (
          <>
            <h2 className="text-2xl font-semibold">Saved Publications</h2>
            {mockPublications.length > 0 ? (
              mockPublications.map((publication) => (
                <Card key={publication._id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {publication.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          <strong>Authors:</strong> {publication.authors.join(', ')}
                        </p>
                        <p className="text-gray-600 mb-2">
                          <strong>Journal:</strong> {publication.journal}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {new Date(publication.publicationDate).toLocaleDateString()}
                          </span>
                          <span>PMID: {publication.pmid}</span>
                        </div>
                        {publication.aiSummary && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              <strong>AI Summary:</strong> {publication.aiSummary}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFavorite('publication', publication._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(publication.url, '_blank')}
                        >
                          View Paper
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No saved publications yet.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === 'experts' && (
          <>
            <h2 className="text-2xl font-semibold">
              Saved {user?.role === 'patient' ? 'Health Experts' : 'Collaborators'}
            </h2>
            {mockExperts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {mockExperts.map((expert) => (
                  <Card key={expert._id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                          <p className="text-gray-600">{expert.position}</p>
                          <p className="text-gray-500 text-sm">{expert.institution}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFavorite('expert', expert._id)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="font-medium text-gray-700">Specialties: </span>
                          <span className="text-gray-600">{expert.specialties.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Research Interests: </span>
                          <span className="text-gray-600">{expert.researchInterests.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location: </span>
                          <span className="text-gray-600">
                            {expert.location.city}, {expert.location.country}
                          </span>
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
                        <Button size="sm">
                          Request Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">
                    No saved {user?.role === 'patient' ? 'health experts' : 'collaborators'} yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}