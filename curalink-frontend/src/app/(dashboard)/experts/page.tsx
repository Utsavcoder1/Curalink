// src/app/(dashboard)/experts/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { Expert } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function ExpertsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [proximity, setProximity] = useState(true);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = authService.getCurrentUser();

  const mockExperts: Expert[] = [
    {
      _id: '1',
      name: 'Dr. Sarah Chen',
      institution: 'Harvard Medical School',
      position: 'Oncology Researcher',
      specialties: ['Brain Cancer', 'Glioblastoma'],
      researchInterests: ['Immunotherapy', 'Targeted Therapy'],
      location: { city: 'Boston', country: 'USA' },
      publications: [],
      isOnPlatform: true,
      isAvailableForMeetings: true,
      isSavedBy: []
    },
    {
      _id: '2',
      name: 'Dr. Michael Rodriguez',
      institution: 'MD Anderson Cancer Center',
      position: 'Neurology Specialist',
      specialties: ['Neuro-oncology', 'Brain Tumors'],
      researchInterests: ['Gene Therapy', 'Clinical Trials'],
      location: { city: 'Houston', country: 'USA' },
      publications: [],
      isOnPlatform: false,
      isAvailableForMeetings: false,
      isSavedBy: []
    },
    {
      _id: '3',
      name: 'Dr. Emily Wang',
      institution: 'Stanford University',
      position: 'Cancer Immunologist',
      specialties: ['Immunotherapy', 'Lung Cancer'],
      researchInterests: ['Checkpoint Inhibitors', 'CAR-T Therapy'],
      location: { city: 'Stanford', country: 'USA' },
      publications: [],
      isOnPlatform: true,
      isAvailableForMeetings: true,
      isSavedBy: []
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setExperts(mockExperts.filter(expert => 
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        expert.researchInterests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ));
      setLoading(false);
    }, 1000);
  };

  const handleSaveExpert = async (expertId: string) => {
    console.log('Saving expert:', expertId);
    // Implement save functionality
  };

  const handleRequestMeeting = (expert: Expert) => {
    if (!expert.isOnPlatform) {
      alert('This expert is not on the platform. A meeting request has been sent to our admin team who will contact them manually.');
      return;
    }
    alert(`Meeting request sent to ${expert.name}`);
  };

  const handleNudgeExpert = (expertId: string) => {
    alert('Expert has been nudged to join the platform!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'patient' ? 'Health Experts' : 'Collaborators'}
        </h1>
        <p className="text-gray-600 mt-2">
          Find and connect with {user?.role === 'patient' ? 'health experts' : 'research collaborators'} in your field
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Search {user?.role === 'patient' ? 'Health Experts' : 'Collaborators'}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g., Brain Cancer, Immunotherapy, Dr. Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button type="submit" loading={loading}>
                Search
              </Button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="proximity"
                checked={proximity}
                onChange={(e) => setProximity(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="proximity" className="ml-2 block text-sm text-gray-700">
                Show experts near my location
              </label>
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
            <p className="mt-4 text-gray-600">Searching for experts...</p>
          </div>
        ) : experts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {experts.map((expert) => (
              <Card key={expert._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                      <p className="text-gray-600">{expert.position}</p>
                      <p className="text-gray-500 text-sm">{expert.institution}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveExpert(expert._id)}
                      >
                        Save
                      </Button>
                    </div>
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
                    
                    <div className="flex space-x-2">
                      {!expert.isOnPlatform && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNudgeExpert(expert._id)}
                        >
                          Nudge to Join
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleRequestMeeting(expert)}
                      >
                        Request Meeting
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No {user?.role === 'patient' ? 'health experts' : 'collaborators'} found. Try a different search.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ExpertsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpertsContent />
    </QueryClientProvider>
  );
}