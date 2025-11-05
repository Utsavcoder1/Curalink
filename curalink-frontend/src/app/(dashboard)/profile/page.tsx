// src/app/(dashboard)/profile/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { User, PatientProfile, ResearcherProfile } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface ProfileFormData {
  email: string;
  profile: PatientProfile | ResearcherProfile;
}

// Create proper initial states for each profile type
const createInitialPatientProfile = (): PatientProfile => ({
  firstName: '',
  lastName: '',
  dateOfBirth: undefined,
  location: { city: '', country: '' },
  conditions: [],
  interests: [],
  avatar: undefined
});

const createInitialResearcherProfile = (): ResearcherProfile => ({
  firstName: '',
  lastName: '',
  specialties: [],
  researchInterests: [],
  institution: '',
  position: '',
  orcid: undefined,
  researchGate: undefined,
  publications: [],
  isAvailableForMeetings: false,
  avatar: undefined
});

function ProfileContent() {
  const user = authService.getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    profile: user?.role === 'patient' 
      ? createInitialPatientProfile()
      : createInitialResearcherProfile()
  });

  // Initialize form data only once when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        profile: user.profile
      });
    }
  }, []); // Empty dependency array - runs only once on mount

  if (!user) return null;

  const handleSave = async () => {
    try {
      // Implement profile update API call
      console.log('Saving profile:', formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      email: user.email,
      profile: user.profile
    });
    setIsEditing(false);
  };

  const isPatient = user.role === 'patient';
  const currentProfile = user.profile;
  const editingProfile = formData.profile;

  const updateProfileField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const updateLocationField = (field: 'city' | 'country', value: string) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        location: {
          ...(prev.profile as any).location,
          [field]: value
        }
      }
    }));
  };

  // Helper functions to safely access profile properties
  const getLocation = (profile: PatientProfile | ResearcherProfile) => {
    return 'location' in profile ? profile.location : { city: '', country: '' };
  };

  const getConditions = (profile: PatientProfile | ResearcherProfile) => {
    return 'conditions' in profile ? profile.conditions : [];
  };

  const getInterests = (profile: PatientProfile | ResearcherProfile) => {
    if ('interests' in profile) return profile.interests;
    if ('researchInterests' in profile) return profile.researchInterests;
    return [];
  };

  const getDateOfBirth = (profile: PatientProfile | ResearcherProfile) => {
    return 'dateOfBirth' in profile ? profile.dateOfBirth : undefined;
  };

  const getInstitution = (profile: PatientProfile | ResearcherProfile) => {
    return 'institution' in profile ? profile.institution : '';
  };

  const getPosition = (profile: PatientProfile | ResearcherProfile) => {
    return 'position' in profile ? profile.position : '';
  };

  const getSpecialties = (profile: PatientProfile | ResearcherProfile) => {
    return 'specialties' in profile ? profile.specialties : [];
  };

  const getIsAvailableForMeetings = (profile: PatientProfile | ResearcherProfile) => {
    return 'isAvailableForMeetings' in profile ? profile.isAvailableForMeetings : false;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.firstName}
                    onChange={(e) => updateProfileField('firstName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentProfile.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingProfile.lastName}
                    onChange={(e) => updateProfileField('lastName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentProfile.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={getLocation(editingProfile).city}
                    onChange={(e) => updateLocationField('city', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {getLocation(currentProfile).city || 'N/A'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={getLocation(editingProfile).country}
                    onChange={(e) => updateLocationField('country', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {getLocation(currentProfile).country || 'N/A'}
                  </p>
                )}
              </div>
            </div>

            {/* Patient-specific editable fields */}
            {isPatient && isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={getDateOfBirth(editingProfile) || ''}
                    onChange={(e) => updateProfileField('dateOfBirth', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Conditions</label>
                  <input
                    type="text"
                    placeholder="Add conditions separated by commas"
                    value={getConditions(editingProfile).join(', ')}
                    onChange={(e) => updateProfileField('conditions', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  <input
                    type="text"
                    placeholder="Add interests separated by commas"
                    value={getInterests(editingProfile).join(', ')}
                    onChange={(e) => updateProfileField('interests', e.target.value.split(',').map(i => i.trim()).filter(i => i))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {/* Researcher-specific editable fields */}
            {!isPatient && isEditing && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    value={getInstitution(editingProfile)}
                    onChange={(e) => updateProfileField('institution', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={getPosition(editingProfile)}
                    onChange={(e) => updateProfileField('position', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Research Interests</label>
                  <input
                    type="text"
                    placeholder="Add research interests separated by commas"
                    value={getInterests(editingProfile).join(', ')}
                    onChange={(e) => updateProfileField('researchInterests', e.target.value.split(',').map(i => i.trim()).filter(i => i))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialties</label>
                  <input
                    type="text"
                    placeholder="Add specialties separated by commas"
                    value={getSpecialties(editingProfile).join(', ')}
                    onChange={(e) => updateProfileField('specialties', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="availableForMeetings"
                    checked={getIsAvailableForMeetings(editingProfile)}
                    onChange={(e) => updateProfileField('isAvailableForMeetings', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="availableForMeetings" className="ml-2 block text-sm text-gray-700">
                    Available for meetings with patients
                  </label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Role-specific Information (Read-only view) */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                {isPatient ? 'Medical Information' : 'Professional Information'}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPatient ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-gray-900">
                      {getDateOfBirth(currentProfile) 
                        ? new Date(getDateOfBirth(currentProfile)!).toLocaleDateString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conditions</label>
                    <div className="mt-1">
                      {getConditions(currentProfile).map((condition, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-2"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <div className="mt-1">
                      {getInterests(currentProfile).map((interest, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded mr-2 mb-2"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Institution</label>
                    <p className="mt-1 text-gray-900">
                      {getInstitution(currentProfile) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="mt-1 text-gray-900">
                      {getPosition(currentProfile) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Research Interests</label>
                    <div className="mt-1">
                      {getInterests(currentProfile).map((interest, index) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded mr-2 mb-2"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialties</label>
                    <div className="mt-1">
                      {getSpecialties(currentProfile).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded mr-2 mb-2"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <p className="mt-1">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        getIsAvailableForMeetings(currentProfile)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getIsAvailableForMeetings(currentProfile)
                          ? 'Available for meetings'
                          : 'Not available for meetings'
                        }
                      </span>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileContent />
    </QueryClientProvider>
  );
}