import { ClientRequest } from "@/lib/services/clientRequestService";

// types/index.ts
export interface EngagementRequest {
    id: number;
    type: string;
    industry: string;
    size: string;
    framework: string;
    urgency: string;
    budget: string;
    deadline: string;
    notes: string;
    attachments: string[];
    anonymous: boolean;
    submittedDate: string;
    tags: string[];
    clientName?: string;
  }
  
  export interface Proposal {
    requestId: number;
    quote: string;
    timeline: string;
    message: string;
    questions: string;
    submittedDate: string;
    status: string;
  }
  
  export interface FilterState {
    type: string;
    size: string;
    framework: string;
    urgency: string;
    budgetRange: string;
    deadlineRange: string;
  }
  
  export interface ProposalData {
    quote: string;
    timeline: string;
    message: string;
    questions: string;
  }
  
  export interface SearchAndFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    onClearFilters: () => void;
  }
  
  export interface RequestCardProps {
    request: EngagementRequest;
    isBookmarked: boolean;
    isProposalSubmitted: boolean;
    onToggleBookmark: (id: number) => void;
    onPreview: (request: EngagementRequest) => void;
    onSubmitProposal: (request: EngagementRequest) => void;
  }
  
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export interface PreviewModalProps extends ModalProps {
    request: EngagementRequest | null;
  }
  
  export interface ProposalModalProps extends ModalProps {
    request: EngagementRequest | null;
    proposalData: ProposalData;
    setProposalData: (data: ProposalData) => void;
    onSubmit: (requestId: number) => void;
  }