'use client';

import React, { useEffect, useState } from 'react';
import RequestsGrid from './RequestsGrid';
import { useEngagementRequests } from '../hooks/useEngagementRequests';
import PreviewModal from './PreviewModal';
import ProposalModal from './ProposalModal';
import SearchAndFilter from './SearchAndFilter';
import {
  ClientRequest,
  getClientRequests
} from '@/lib/services/clientRequestService';
import { useAuth } from '@/components/layout/providers';
import { toast } from 'sonner';

const EngagementRequestsPage: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    bookmarkedRequests,
    toggleBookmark,
    selectedRequest,
    setSelectedRequest,
    previewRequest,
    setPreviewRequest,
    proposalData,
    setProposalData,
    submittedProposals,
    submitProposal,
    showFilters,
    setShowFilters,
    clearFilters,
    filteredRequests,
    isProposalSubmitted,
    mockRequests
  } = useEngagementRequests();

  const { user, loading: authLoading } = useAuth();
  const my_profile = JSON.parse(localStorage.getItem('userProfile')!);

  const [clientRequests, setClientRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getClientRequests();
        if (data) {
          const sortedRequests = data.sort((a, b) => {
            // THE FIX: Use .getTime() to convert dates to numbers before subtracting.
            // This sorts in descending order (newest first).
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setClientRequests(sortedRequests);
        } else {
          setError('Failed to fetch proposals.');
          toast.error('Could not load proposals.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
        toast.error('Failed to load proposals.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && my_profile) {
      fetchClientRequests();
    } else if (!authLoading && !my_profile) {
      setIsLoading(false);
      setError('You must be logged in to view proposals.');
    }
  }, [user, authLoading, my_profile]);

  return (
    <div className='flex w-full flex-col'>
      <div className='mx-auto w-full max-w-7xl'>
        <div className='py-6'>
          <h1 className='text-foreground text-3xl font-bold'>
            Engagement Requests
          </h1>
          <p className='text-muted-foreground mt-2'>
            Search, filter, and submit proposals for live client requests
          </p>
        </div>
      </div>

      <div className='mx-auto w-full max-w-7xl'>
        {/* Search and Filter Section */}
        <div className='mb-8 space-y-4'>
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Results Summary */}
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0'>
          <p className='text-muted-foreground text-sm'>
            Showing {filteredRequests.length} of {mockRequests.length} requests
          </p>
          <div className='flex items-center gap-3'>
            <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-sm whitespace-nowrap'>
              {submittedProposals.length} proposals submitted
            </span>
            <span className='rounded-full bg-green-100 px-3 py-1 text-sm whitespace-nowrap text-green-800 dark:bg-green-900 dark:text-green-300'>
              {bookmarkedRequests.length} bookmarked
            </span>
          </div>
        </div>

        {/* Requests Grid */}
        <RequestsGrid
          clientRequests={clientRequests}
          requests={filteredRequests}
          bookmarkedRequests={bookmarkedRequests}
          onToggleBookmark={toggleBookmark}
          onPreview={setPreviewRequest}
          onSubmitProposal={setSelectedRequest}
          isProposalSubmitted={isProposalSubmitted}
        />

        {/* Preview Modal */}
        <PreviewModal
          isOpen={!!previewRequest}
          onClose={() => setPreviewRequest(null)}
          request={previewRequest}
        />

        {/* Proposal Modal */}
        <ProposalModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          proposalData={proposalData}
          setProposalData={setProposalData}
          onSubmit={submitProposal}
        />
      </div>
    </div>
  );
};

export default EngagementRequestsPage;
