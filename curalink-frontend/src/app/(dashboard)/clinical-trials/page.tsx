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
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Mock data
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

  // Search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setTrials(
        mockTrials.filter(trial =>
          trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trial.conditions.some(condition =>
            condition.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
      setLoading(false);
    }, 1000);
  };

  const handleSaveTrial = async (trialId: string) => {
    console.log('Saving trial:', trialId);
  };

  const handleContactTrial = (trial: ClinicalTrial) => {
    const contactEmail = trial.contacts[0]?.email || 'clinicaltrials@curalink.com';
    const subject = `Inquiry about: ${trial.title}`;
    const body = `Hello,\n\nI am interested in learning more about the clinical trial "${trial.title}" (NCT ID: ${trial.nctId}).\n\nPlease provide me with more information.\n\nThank you.`;
    window.open(
      `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank'
    );
  };

  const handleGenerateSummary = async (content: string) => {
    setIsGeneratingSummary(true);
    try {
      // Simulate AI summary API
      setTimeout(() => {
        console.log('Generated summary for:', content);
        setIsGeneratingSummary(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setIsGeneratingSummary(false);
    }
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{trial.title}</h3>
                    <p className="text-gray-600 mb-2 italic">{trial.briefTitle}</p>
                    <p className="text-gray-600 mb-2">
                      <strong>Conditions:</strong> {trial.conditions.join(', ')}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Interventions:</strong> {trial.interventions.join(', ')}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Status:</strong> {trial.status} — <strong>Phase:</strong> {trial.phases.join(', ')}
                    </p>

                    {trial.aiSummary && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>AI Summary:</strong> {trial.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleSaveTrial(trial._id)}>
                      Save
                    </Button>
                    <Button size="sm" onClick={() => handleContactTrial(trial)}>
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateSummary(trial.description || '')}
                      disabled={isGeneratingSummary}
                    >
                      {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
                    </Button>

                  </div>
                </div>
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
