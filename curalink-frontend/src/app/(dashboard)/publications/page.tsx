// src/app/(dashboard)/publications/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Publication } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


const queryClient = new QueryClient();

function PublicationsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);

  // Mutation for generating AI summaries
const summaryMutation = useMutation({
  mutationFn: async ({ text, type }: { text: string; type: string }) => {
    const response = await axios.post('http://localhost:5000/api/ai/summarize', {
      text,
      type,
    });
    return response.data;
  },
  onError: (error) => {
    console.error('Error generating summary:', error);
  },
});


  const mockPublications: Publication[] = [
    {
      _id: '1',
      pmid: '12345678',
      title: 'Advances in Immunotherapy for Glioblastoma Multiforme',
      abstract: 'This study explores novel immunotherapy approaches for treating glioblastoma, focusing on checkpoint inhibitors and their efficacy in different patient populations. The research demonstrates promising results in phase 2 clinical trials.',
      authors: ['Sarah Chen', 'Michael Rodriguez', 'Emily Wang'],
      journal: 'Nature Medicine',
      publicationDate: '2024-01-15',
      doi: '10.1038/s41591-024-00001-1',
      keywords: ['Glioblastoma', 'Immunotherapy', 'Brain Cancer', 'Checkpoint Inhibitors'],
      url: 'https://example.com/paper1',
      aiSummary: 'Researchers developed a new immunotherapy method that shows promising results in treating aggressive brain cancer by enhancing the immune system\'s ability to target cancer cells. The study found significant improvement in survival rates.',
      isSavedBy: []
    },
    {
      _id: '2',
      pmid: '12345679',
      title: 'Targeted Therapy in Non-Small Cell Lung Cancer',
      abstract: 'Clinical trial results for targeted therapy in advanced lung cancer patients with specific genetic mutations. The study shows significant improvement in progression-free survival.',
      authors: ['James Wilson', 'Lisa Zhang'],
      journal: 'The Lancet Oncology',
      publicationDate: '2024-01-10',
      doi: '10.1016/S1470-2045(24)00002-2',
      keywords: ['Lung Cancer', 'Targeted Therapy', 'NSCLC', 'Genetic Mutations'],
      url: 'https://example.com/paper2',
      aiSummary: 'A new targeted therapy drug demonstrated significant improvement in survival rates for patients with specific genetic mutations in lung cancer. The treatment showed fewer side effects compared to traditional chemotherapy.',
      isSavedBy: []
    },
    {
      _id: '3',
      pmid: '12345680',
      title: 'CAR-T Cell Therapy for Hematological Malignancies',
      abstract: 'Long-term follow-up of CAR-T cell therapy in patients with relapsed/refractory hematological malignancies, showing durable responses and manageable toxicity profiles.',
      authors: ['Robert Kim', 'Maria Garcia', 'David Lee'],
      journal: 'New England Journal of Medicine',
      publicationDate: '2024-01-08',
      doi: '10.1056/NEJMoa2400003',
      keywords: ['CAR-T Therapy', 'Blood Cancer', 'Immunotherapy', 'Hematology'],
      url: 'https://example.com/paper3',
      aiSummary: 'CAR-T cell therapy continues to show promising long-term results for blood cancers, with many patients maintaining remission years after treatment. The study highlights improved safety protocols.',
      isSavedBy: []
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPublications(mockPublications.filter(pub => 
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        pub.abstract.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setLoading(false);
    }, 1000);
  };

  const handleSavePublication = async (publicationId: string) => {
    console.log('Saving publication:', publicationId);
    // Implement save functionality
  };
  // Add this to publication/trial components
const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

const handleGenerateSummary = async (content: string, type: 'publication' | 'trial') => {
  setIsGeneratingSummary(true);
  try {
    const result = await summaryMutation.mutateAsync({ text: content, type });
    // Update the item with the generated summary
  } catch (error) {
    console.error('Failed to generate summary:', error);
  } finally {
    setIsGeneratingSummary(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
        <p className="text-gray-600 mt-2">
          Discover the latest medical research with AI-generated summaries
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Search Publications</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g., Brain Cancer, Immunotherapy, Gene Therapy"
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
            <p className="mt-4 text-gray-600">Searching for publications...</p>
          </div>
        ) : publications.length > 0 ? (
          publications.map((publication) => (
            <Card key={publication._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Authors:</strong> {publication.authors.join(', ')}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Journal:</strong> {publication.journal}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>
                        {new Date(publication.publicationDate).toLocaleDateString()}
                      </span>
                      {publication.doi && (
                        <span>DOI: {publication.doi}</span>
                      )}
                      {publication.pmid && (
                        <span>PMID: {publication.pmid}</span>
                      )}
                    </div>
                    
                    {publication.aiSummary && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg mb-3">
                        <p className="text-sm font-medium text-green-800 mb-1">AI Summary:</p>
                        <p className="text-sm text-green-700">{publication.aiSummary}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {publication.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSavePublication(publication._id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(publication.url, '_blank')}
                    >
                      View Paper
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No publications found. Try a different search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicationsContent />
    </QueryClientProvider>
  );
}