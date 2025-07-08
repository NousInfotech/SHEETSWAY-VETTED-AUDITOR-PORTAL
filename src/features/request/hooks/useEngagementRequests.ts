'use client';
import { useState, useEffect } from 'react';
import { EngagementRequest, Proposal, FilterState, ProposalData } from '../types/request';
import { mockRequests, filterRequests } from '../utils';

export function useEngagementRequests() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    size: '',
    framework: '',
    urgency: '',
    budgetRange: '',
    deadlineRange: ''
  });
  const [bookmarkedRequests, setBookmarkedRequests] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EngagementRequest | null>(null);
  const [previewRequest, setPreviewRequest] = useState<EngagementRequest | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData>({ quote: '', timeline: '', message: '', questions: '' });
  const [submittedProposals, setSubmittedProposals] = useState<Proposal[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedRequests') || '[]');
    const savedProposals = JSON.parse(localStorage.getItem('submittedProposals') || '[]');
    setBookmarkedRequests(savedBookmarks);
    setSubmittedProposals(savedProposals);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarkedRequests', JSON.stringify(bookmarkedRequests));
  }, [bookmarkedRequests]);

  useEffect(() => {
    localStorage.setItem('submittedProposals', JSON.stringify(submittedProposals));
  }, [submittedProposals]);

  const filteredRequests = filterRequests(mockRequests, searchTerm, filters);

  const toggleBookmark = (requestId: number) => {
    setBookmarkedRequests((prev: number[]) =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const submitProposal = (requestId: number) => {
    if (!proposalData.quote || !proposalData.timeline || !proposalData.message) {
      alert('Please fill in all required fields');
      return;
    }
    const proposal: Proposal = {
      requestId,
      ...proposalData,
      submittedDate: new Date().toISOString(),
      status: 'Submitted'
    };
    setSubmittedProposals((prev: Proposal[]) => [...prev, proposal]);
    setProposalData({ quote: '', timeline: '', message: '', questions: '' });
    setSelectedRequest(null);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      size: '',
      framework: '',
      urgency: '',
      budgetRange: '',
      deadlineRange: ''
    });
  };

  const isProposalSubmitted = (requestId: number) => {
    return submittedProposals.some((p: Proposal) => p.requestId === requestId);
  };

  return {
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
  };
} 