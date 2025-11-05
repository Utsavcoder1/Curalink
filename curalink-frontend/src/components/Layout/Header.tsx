// src/components/layout/Header.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    return '/dashboard';
  };

  // If user is null, don't render the header
  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CuraLink</span>
            </Link>
            <nav className="ml-8 flex space-x-8">
              <Link href={getDashboardLink()} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              {user.role === 'patient' && (
                <>
                  <Link href="/experts" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Health Experts
                  </Link>
                  <Link href="/clinical-trials" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Clinical Trials
                  </Link>
                </>
              )}
              {user.role === 'researcher' && (
                <>
                  <Link href="/experts" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Collaborators
                  </Link>
                </>
              )}
              <Link href="/publications" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Publications
              </Link>
              <Link href="/forums" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Forums
              </Link>
              <Link href="/favorites" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Favorites
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Welcome, {user.profile.firstName}
            </div>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};