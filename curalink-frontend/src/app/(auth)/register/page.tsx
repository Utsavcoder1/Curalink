'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegister } from '@/hooks/useAuth';

const queryClient = new QueryClient();

function RegisterContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'researcher',
    profile: {
      firstName: '',
      lastName: '',
      location: { city: '', country: '' },
    },
  });

  const [patientData, setPatientData] = useState({
    conditions: [''],
    interests: [''],
    dateOfBirth: '',
  });

  const [researcherData, setResearcherData] = useState({
    specialties: [''],
    researchInterests: [''],
    institution: '',
    position: '',
    orcid: '',
    researchGate: '',
    isAvailableForMeetings: false,
  });

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData =
      formData.role === 'patient'
        ? {
            ...formData.profile,
            conditions: patientData.conditions.filter(c => c.trim()),
            interests: patientData.interests.filter(i => i.trim()),
            dateOfBirth: patientData.dateOfBirth,
          }
        : {
            ...formData.profile,
            specialties: researcherData.specialties.filter(s => s.trim()),
            researchInterests: researcherData.researchInterests.filter(r => r.trim()),
            institution: researcherData.institution,
            position: researcherData.position,
            orcid: researcherData.orcid,
            researchGate: researcherData.researchGate,
            isAvailableForMeetings: researcherData.isAvailableForMeetings,
          };

    try {
      const result = await registerMutation.mutateAsync({
        ...formData,
        profile: profileData,
      });
      if (result.success) {
        alert('Registration successful!');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const addField = (setter: any, key: string) =>
    setter((prev: any) => ({ ...prev, [key]: [...prev[key], ''] }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">CuraLink</Link>
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
              Patient/Caregiver
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
              Researcher
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.profile.firstName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, firstName: e.target.value }
                }))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.profile.lastName}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, lastName: e.target.value }
                }))}
                className="border p-2 rounded w-full"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="border p-2 rounded w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                required
                value={formData.profile.location.city}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, location: { ...prev.profile.location, city: e.target.value } }
                }))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Country"
                required
                value={formData.profile.location.country}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, location: { ...prev.profile.location, country: e.target.value } }
                }))}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Role-specific */}
          {formData.role === 'patient' ? (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Medical Information</h3>
              <input
                type="date"
                value={patientData.dateOfBirth}
                onChange={e => setPatientData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="border p-2 rounded w-full"
              />
              {patientData.conditions.map((c, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder="Medical Condition"
                  value={c}
                  onChange={e => {
                    const arr = [...patientData.conditions];
                    arr[i] = e.target.value;
                    setPatientData(prev => ({ ...prev, conditions: arr }));
                  }}
                  className="border p-2 rounded w-full"
                />
              ))}
              <button type="button" onClick={() => addField(setPatientData, 'conditions')} className="text-blue-600">
                + Add Condition
              </button>
              {patientData.interests.map((i, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder="Interest"
                  value={i}
                  onChange={e => {
                    const arr = [...patientData.interests];
                    arr[idx] = e.target.value;
                    setPatientData(prev => ({ ...prev, interests: arr }));
                  }}
                  className="border p-2 rounded w-full"
                />
              ))}
              <button type="button" onClick={() => addField(setPatientData, 'interests')} className="text-blue-600">
                + Add Interest
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Professional Info</h3>
              {researcherData.specialties.map((s, i) => (
                <input
                  key={i}
                  placeholder="Specialty"
                  value={s}
                  onChange={e => {
                    const arr = [...researcherData.specialties];
                    arr[i] = e.target.value;
                    setResearcherData(prev => ({ ...prev, specialties: arr }));
                  }}
                  className="border p-2 rounded w-full"
                />
              ))}
              <button type="button" onClick={() => addField(setResearcherData, 'specialties')} className="text-blue-600">
                + Add Specialty
              </button>
              <input
                type="text"
                placeholder="Institution"
                value={researcherData.institution}
                onChange={e => setResearcherData(prev => ({ ...prev, institution: e.target.value }))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Position"
                value={researcherData.position}
                onChange={e => setResearcherData(prev => ({ ...prev, position: e.target.value }))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="ORCID"
                value={researcherData.orcid}
                onChange={e => setResearcherData(prev => ({ ...prev, orcid: e.target.value }))}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="ResearchGate"
                value={researcherData.researchGate}
                onChange={e => setResearcherData(prev => ({ ...prev, researchGate: e.target.value }))}
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={researcherData.isAvailableForMeetings}
                  onChange={e => setResearcherData(prev => ({ ...prev, isAvailableForMeetings: e.target.checked }))}
                />
                <span>Available for meetings</span>
              </label>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
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
