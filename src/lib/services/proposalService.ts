import api from '@/lib/api/axios';
import { toast } from 'sonner';


export interface Proposal {
  id: string;
  clientRequestId: string;
  auditorId: string;
  auditFirmId: string;
  proposalName: string;
  description: string;
  quotation: number; 
  currency: 'AED' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'OTHER';
  estimatedDuration: number;
  startDate: string; 
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; 
  requestNote: string;
  terms: string[];
  deliverables: string[];
  createdAt: string;
  updatedAt: string;
}



export interface CreateProposalPayload {
  clientRequestId: string;
  auditorId: string;
  auditFirmId: string;
  proposalName: string;
  description: string;
  quotation: number; 
  currency: string;
  estimatedDuration: number;
  startDate: Date;
  endDate: Date;
  requestNote: string;
  terms: string[];
  deliverables: string[];
}


interface ProposalsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Proposal[];
}


interface CreateProposalApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Proposal; 
}



 
export async function getProposals(): Promise<Proposal[] | null> {
  try {
    const response = await api.get<ProposalsApiResponse>('/api/v1/proposals/', {
      activeRole: 'AUDITOR'
    });
    
    if (response.data && response.data.success) {
      toast.success(response.data.message)
      return response.data.data;
    } else {
      console.error("API call was successful but the body indicated failure.", response.data);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch proposals:", error);
    return null;
  }
}



export async function createProposal(proposalData: CreateProposalPayload): Promise<Proposal> {
  const apiEndpoint = '/api/v1/proposals';

  try {
    console.log("Creating proposal with payload:", proposalData);
    
    
    const response = await api.post<CreateProposalApiResponse>(apiEndpoint, proposalData, {
      activeRole: 'AUDITOR' 
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'API returned a success status but failed to create the proposal.');
    }
  } catch (error) {
    console.error("Failed to create proposal:", error);
    throw error;
  }
}