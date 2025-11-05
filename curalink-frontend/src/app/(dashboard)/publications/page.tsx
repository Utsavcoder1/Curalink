// src/app/(dashboard)/publications/page.tsx
'use client';
import React, { useState } from 'react';
import { usePublications, useSavePublication } from '@/hooks/usePublications';
import { Publication } from '@/types';

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    journals: '',
    yearFrom: '',
    yearTo: ''
  });

  const { data: publications, isLoading } = usePublications({
    query: searchQuery,
    journals: filters.journals,
    yearFrom: filters.yearFrom,
    yearTo: filters.yearTo
  });

  const savePublicationMutation = useSavePublication();

  const handleSavePublication = (publicationId: string) => {
    savePublicationMutation.mutate(publicationId);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Research Publications</h1>
        <p className="text-gray-600 mt-2">
          Discover the latest research and medical publications relevant to your interests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Publications
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, abstract, keywords, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Journal Filter */}
          <div>
            <label htmlFor="journal" className="block text-sm font-medium text-gray-700 mb-1">
              Journal
            </label>
            <input
              type="text"
              id="journal"
              placeholder="e.g., Nature, JAMA"
              value={filters.journals}
              onChange={(e) => setFilters(prev => ({ ...prev, journals: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Year From Filter */}
          <div>
            <label htmlFor="yearFrom" className="block text-sm font-medium text-gray-700 mb-1">
              Year From
            </label>
            <select
              id="yearFrom"
              value={filters.yearFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Year To Filter */}
          <div>
            <label htmlFor="yearTo" className="block text-sm font-medium text-gray-700 mb-1">
              Year To
            </label>
            <select
              id="yearTo"
              value={filters.yearTo}
              onChange={(e) => setFilters(prev => ({ ...prev, yearTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Year</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching publications...</p>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {publications?.length || 0} Publications Found
            </h2>
            
            <div className="space-y-6">
              {publications?.map((publication: Publication) => (
                <div key={publication._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {publication.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{publication.journal}</span>
                        {publication.publicationDate && (
                          <span>
                            {new Date(publication.publicationDate).getFullYear()}
                          </span>
                        )}
                        {publication.doi && (
                          <span className="text-blue-600">DOI: {publication.doi}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Authors</h4>
                        <p className="text-sm text-gray-600">
                          {publication.authors?.slice(0, 5).join(', ')}
                          {publication.authors && publication.authors.length > 5 && ' et al.'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleSavePublication(publication._id)}
                      disabled={savePublicationMutation.isPending}
                      className="text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50 ml-4"
                      title="Save to favorites"
                    >
                      ⭐
                    </button>
                  </div>

                  {/* AI Summary */}
                  {publication.aiSummary && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded leading-relaxed">
                        {publication.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Abstract Preview */}
                  {publication.abstract && publication.abstract !== 'No abstract available' && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Abstract</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {publication.abstract}
                      </p>
                    </div>
                  )}

                  {/* Keywords */}
                  {publication.keywords && publication.keywords.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {publication.keywords.slice(0, 8).map((keyword, index) => (
                          <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                        {publication.keywords.length > 8 && (
                          <span className="text-xs text-gray-500">+{publication.keywords.length - 8} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {publication.pmid && (
                        <span>PMID: {publication.pmid}</span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Full Paper
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!publications || publications.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No publications found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}