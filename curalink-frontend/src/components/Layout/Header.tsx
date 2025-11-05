// src/components/layout/Header.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  // If user is null, don't render the header
  if (!user) {
    return null;
  }

  const isPatient = user.role === 'patient';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { 
      name: isPatient ? 'Health Experts' : 'Collaborators', 
      href: '/experts', 
      icon: isPatient ? '👨‍⚕️' : '🤝' 
    },
    { name: 'Clinical Trials', href: '/clinical-trials', icon: '🔬' },
    { name: 'Publications', href: '/publications', icon: '📚' },
    { name: 'Forums', href: '/forums', icon: '💬' },
    { name: 'Favorites', href: '/favorites', icon: '⭐' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CuraLink</span>
            </Link>
            <nav className="ml-8 hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user.profile?.firstName}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {user.role}
              </span>
            </div>
            
            <Link 
              href="/profile" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
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

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};