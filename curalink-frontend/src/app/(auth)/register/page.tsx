// src/app/(auth)/register/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function RegisterContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'researcher',
    profile: {
      firstName: '',
      lastName: '',
      location: {
        city: '',
        country: ''
      }
    }
  });
  
  const [patientData, setPatientData] = useState({
    conditions: [''],
    interests: [''],
    dateOfBirth: ''
  });
  
  const [researcherData, setResearcherData] = useState({
    specialties: [''],
    researchInterests: [''],
    institution: '',
    position: '',
    orcid: '',
    researchGate: '',
    isAvailableForMeetings: false
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegister();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'patient' || role === 'researcher') {
      setFormData(prev => ({ ...prev, role }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = formData.role === 'patient' 
      ? {
          ...formData.profile,
          conditions: patientData.conditions.filter(c => c.trim()),
          interests: patientData.interests.filter(i => i.trim()),
          dateOfBirth: patientData.dateOfBirth
        }
      : {
          ...formData.profile,
          specialties: researcherData.specialties.filter(s => s.trim()),
          researchInterests: researcherData.researchInterests.filter(r => r.trim()),
          institution: researcherData.institution,
          position: researcherData.position,
          orcid: researcherData.orcid,
          researchGate: researcherData.researchGate,
          isAvailableForMeetings: researcherData.isAvailableForMeetings
        };

    try {
      const result = await registerMutation.mutateAsync({
        ...formData,
        profile: profileData
      });
      
      if (result.success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const addCondition = () => {
    setPatientData(prev => ({
      ...prev,
      conditions: [...prev.conditions, '']
    }));
  };

  const addResearchInterest = () => {
    setResearcherData(prev => ({
      ...prev,
      researchInterests: [...prev.researchInterests, '']
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-blue-600">CuraLink</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join as {formData.role === 'patient' ? 'Patient/Caregiver' : 'Researcher'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center ${
                formData.role === 'patient'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">Patient/Caregiver</div>
              <div className="text-sm mt-1">Find clinical trials and experts</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'researcher' }))}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center ${
                formData.role === 'researcher'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">Researcher</div>
              <div className="text-sm mt-1">Collaborate and manage trials</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.profile.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, firstName: e.target.value }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.profile.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, lastName: e.target.value }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  required
                  value={formData.profile.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { 
                      ...prev.profile, 
                      location: { ...prev.profile.location, city: e.target.value }
                    }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  value={formData.profile.location.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profile: { 
                      ...prev.profile, 
                      location: { ...prev.profile.location, country: e.target.value }
                    }
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {formData.role === 'patient' ? (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={patientData.dateOfBirth}
                  onChange={(e) => setPatientData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Medical Conditions
                  </label>
                  <button
                    type="button"
                    onClick={addCondition}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Condition
                  </button>
                </div>
                {patientData.conditions.map((condition, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="e.g., Brain Cancer, Glioblastoma"
                    value={condition}
                    onChange={(e) => {
                      const newConditions = [...patientData.conditions];
                      newConditions[index] = e.target.value;
                      setPatientData(prev => ({ ...prev, conditions: newConditions }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Research Interests</label>
                <input
                  type="text"
                  placeholder="e.g., Immunotherapy, Clinical Trials"
                  value={patientData.interests[0]}
                  onChange={(e) => setPatientData(prev => ({ 
                    ...prev, 
                    interests: [e.target.value] 
                  }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  required
                  value={researcherData.institution}
                  onChange={(e) => setResearcherData(prev => ({ ...prev, institution: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={researcherData.position}
                  onChange={(e) => setResearcherData(prev => ({ ...prev, position: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Research Interests
                  </label>
                  <button
                    type="button"
                    onClick={addResearchInterest}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Interest
                  </button>
                </div>
                {researcherData.researchInterests.map((interest, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="e.g., Immunotherapy, Gene Therapy"
                    value={interest}
                    onChange={(e) => {
                      const newInterests = [...researcherData.researchInterests];
                      newInterests[index] = e.target.value;
                      setResearcherData(prev => ({ ...prev, researchInterests: newInterests }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ORCID</label>
                  <input
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    value={researcherData.orcid}
                    onChange={(e) => setResearcherData(prev => ({ ...prev, orcid: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ResearchGate</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={researcherData.researchGate}
                    onChange={(e) => setResearcherData(prev => ({ ...prev, researchGate: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="availableForMeetings"
                  checked={researcherData.isAvailableForMeetings}
                  onChange={(e) => setResearcherData(prev => ({ 
                    ...prev, 
                    isAvailableForMeetings: e.target.checked 
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="availableForMeetings" className="ml-2 block text-sm text-gray-700">
                  Available for meetings with patients
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-700 text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegisterContent />
    </QueryClientProvider>
  );
}