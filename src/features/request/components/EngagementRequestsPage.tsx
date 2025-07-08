'use client';

import React from 'react';
import RequestsGrid from './RequestsGrid';
import { useEngagementRequests } from '../hooks/useEngagementRequests';
import { SearchAndFilterProps } from '../types/request';
import PreviewModal from './PreviewModal';
import ProposalModal from './ProposalModal';
import SearchAndFilter from './SearchAndFilter';

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

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-foreground">Engagement Requests</h1>
            <p className="mt-2 text-muted-foreground">Search, filter, and submit proposals for live client requests</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
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
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {mockRequests.length} requests
          </p>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {submittedProposals.length} proposals submitted
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
              {bookmarkedRequests.length} bookmarked
            </span>
          </div>
        </div>

        {/* Requests Grid */}
        <RequestsGrid
          requests={filteredRequests}
          bookmarkedRequests={bookmarkedRequests}
          onToggleBookmark={toggleBookmark}
          onPreview={setPreviewRequest}
          onSubmitProposal={setSelectedRequest}
          isProposalSubmitted={isProposalSubmitted}
        />
      </div>

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
  );
};

export default EngagementRequestsPage; 