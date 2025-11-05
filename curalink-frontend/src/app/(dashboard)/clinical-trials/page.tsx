// src/app/(dashboard)/clinical-trials/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClinicalTrial } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function ClinicalTrialsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    phase: '',
    location: ''
  });
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [loading, setLoading] = useState(false);

  const mockTrials: ClinicalTrial[] = [
    {
      _id: '1',
      nctId: 'NCT06562582',
      title: 'Immunotherapy for Advanced Brain Cancer',
      briefTitle: 'Brain Cancer Immunotherapy Trial',
      description: 'A phase 2 clinical trial investigating novel immunotherapy approaches for glioblastoma patients.',
      conditions: ['Glioblastoma', 'Brain Cancer'],
      status: 'recruiting',
      phases: ['Phase 2'],
      locations: [{
        name: 'Massachusetts General Hospital',
        city: 'Boston',
        country: 'USA',
        status: 'recruiting'
      }],
      interventions: ['Immunotherapy', 'Drug Therapy'],
      eligibility: {
        criteria: 'Patients aged 18-80 with confirmed glioblastoma',
        gender: 'All',
        minimumAge: '18 Years',
        maximumAge: '80 Years',
        healthyVolunteers: false
      },
      sponsors: ['National Cancer Institute', 'Harvard Medical School'],
      contacts: [{
        name: 'Dr. Sarah Chen',
        email: 'research@example.com',
        phone: '(555) 123-4567'
      }],
      startDate: '2024-01-01',
      completionDate: '2026-12-31',
      aiSummary: 'This trial investigates a novel immunotherapy approach for treating advanced brain cancer with promising early results.',
      isSavedBy: []
    },
    {
      _id: '2',
      nctId: 'NCT06562583',
      title: 'Targeted Therapy for Lung Cancer',
      briefTitle: 'Lung Cancer Targeted Therapy',
      description: 'Phase 3 trial for targeted therapy in NSCLC patients with specific genetic mutations.',
      conditions: ['Lung Cancer', 'NSCLC'],
      status: 'recruiting',
      phases: ['Phase 3'],
      locations: [{
        name: 'Memorial Sloan Kettering',
        city: 'New York',
        country: 'USA',
        status: 'recruiting'
      }],
      interventions: ['Targeted Therapy'],
      eligibility: {
        criteria: 'Patients with EGFR mutation positive NSCLC',
        gender: 'All',
        minimumAge: '18 Years',
        maximumAge: '75 Years',
        healthyVolunteers: false
      },
      sponsors: ['Pharmaceutical Company Inc.'],
      contacts: [{
        name: 'Dr. Michael Rodriguez',
        email: 'trials@example.com',
        phone: '(555) 987-6543'
      }],
      startDate: '2023-06-01',
      completionDate: '2025-12-31',
      aiSummary: 'Phase 3 trial testing targeted therapy for specific genetic mutations in lung cancer patients.',
      isSavedBy: []
    },
    {
      _id: '3',
      nctId: 'NCT06562584',
      title: 'Gene Therapy for Rare Genetic Disorders',
      briefTitle: 'Genetic Disorder Gene Therapy',
      description: 'Early phase trial exploring gene therapy approaches for rare genetic conditions.',
      conditions: ['Genetic Disorders', 'Rare Diseases'],
      status: 'active',
      phases: ['Phase 1'],
      locations: [{
        name: 'UCLA Medical Center',
        city: 'Los Angeles',
        country: 'USA',
        status: 'active'
      }],
      interventions: ['Gene Therapy'],
      eligibility: {
        criteria: 'Patients with confirmed genetic mutation',
        gender: 'All',
        minimumAge: '6 Years',
        maximumAge: '65 Years',
        healthyVolunteers: false
      },
      sponsors: ['Gene Therapy Foundation'],
      contacts: [{
        name: 'Dr. Emily Wang',
        email: 'genetherapy@example.com',
        phone: '(555) 456-7890'
      }],
      startDate: '2024-02-01',
      completionDate: '2027-06-30',
      aiSummary: 'Innovative gene therapy approach showing promise in early clinical trials for rare genetic conditions.',
      isSavedBy: []
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrials(mockTrials.filter(trial => 
        trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trial.conditions.some(condition => 
          condition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
      setLoading(false);
    }, 1000);
  };

  const handleSaveTrial = async (trialId: string) => {
    console.log('Saving trial:', trialId);
    // Implement save functionality
  };

  const handleContactTrial = (trial: ClinicalTrial) => {
    const contactEmail = trial.contacts[0]?.email || 'clinicaltrials@curalink.com';
    const subject = `Inquiry about: ${trial.title}`;
    const body = `Hello,\n\nI am interested in learning more about the clinical trial "${trial.title}" (NCT ID: ${trial.nctId}).\n\nPlease provide me with more information.\n\nThank you.`;
    
    window.open(`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Trials</h1>
        <p className="text-gray-600 mt-2">
          Search for clinical trials based on your medical conditions and location
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Search Clinical Trials</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g., Brain Cancer, Glioblastoma, Immunotherapy"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" loading={loading}>
                Search
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="recruiting">Recruiting</option>
                  <option value="completed">Completed</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                <select
                  value={filters.phase}
                  onChange={(e) => setFilters(prev => ({ ...prev, phase: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Phases</option>
                  <option value="Phase 1">Phase 1</option>
                  <option value="Phase 2">Phase 2</option>
                  <option value="Phase 3">Phase 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Country or City"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Search Results</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for clinical trials...</p>
          </div>
        ) : trials.length > 0 ? (
          trials.map((trial) => (
            <Card key={trial._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {trial.title}
                    </h3>
                    {trial.briefTitle && (
                      <p className="text-gray-600 mb-2 italic">{trial.briefTitle}</p>
                    )}
                    <p className="text-gray-600 mb-2">
                      <strong>Conditions:</strong> {trial.conditions.join(', ')}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Interventions:</strong> {trial.interventions.join(', ')}
                    </p>
                    {trial.sponsors && trial.sponsors.length > 0 && (
                      <p className="text-gray-600 mb-2">
                        <strong>Sponsors:</strong> {trial.sponsors.join(', ')}
                      </p>
                    )}
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
                      onClick={() => handleSaveTrial(trial._id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleContactTrial(trial)}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
                {trial.nctId && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>NCT ID:</strong> {trial.nctId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No clinical trials found. Try a different search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ClinicalTrialsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClinicalTrialsContent />
    </QueryClientProvider>
  );
}