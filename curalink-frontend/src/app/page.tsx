// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CuraLink</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting Patients and Researchers
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            CuraLink is an AI-powered platform that simplifies the discovery of clinical trials, 
            medical publications, and health experts.
          </p>
          
          <div className="flex justify-center space-x-6">
            <Link
              href="/register?role=patient"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              I am a Patient or Caregiver
            </Link>
            <Link
              href="/register?role=researcher"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              I am a Researcher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}