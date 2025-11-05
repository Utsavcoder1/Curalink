'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// React Query client
const queryClient = new QueryClient();

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      // You can handle role if needed
      console.log('Role param:', role);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Your Account</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// Wrap with QueryClientProvider and Suspense
export default function RegisterPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading registration form...</div>}>
        <RegisterContent />
      </Suspense>
    </QueryClientProvider>
  );
}
