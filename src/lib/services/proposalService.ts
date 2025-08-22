import api from '@/lib/api/axios';
import { toast } from 'sonner';
import { Currency } from '../validators/proposal-form-schema';

export interface Proposal {
  id: string;
  clientRequestId: string;
  auditorId: string;
  auditFirmId: string;
  proposalName: string;
  description: string;
  quotation: number;
  currency: Currency;
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

export type UpdateProposalPayload = Partial<
  Omit<CreateProposalPayload, 'clientRequestId' | 'auditorId' | 'auditFirmId'>
>;


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


interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export async function getProposals(): Promise<Proposal[] | null> {
  try {
    const response = await api.get<ProposalsApiResponse>('/api/v1/proposals/');

    if (response.data && response.data.success) {
      toast.success(response.data.message);
      return response.data.data;
    } else {
      console.error(
        'API call was successful but the body indicated failure.',
        response.data
      );
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch proposals:', error);
    return null;
  }
}

export async function createProposal(
  proposalData: CreateProposalPayload
): Promise<Proposal> {
  const apiEndpoint = '/api/v1/proposals';

  try {
    console.log('Creating proposal with payload:', proposalData);

    const response = await api.post<CreateProposalApiResponse>(
      apiEndpoint,
      proposalData,
      {
        activeRole: 'AUDITOR'
      }
    );

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message ||
          'API returned a success status but failed to create the proposal.'
      );
    }
  } catch (error) {
    console.error('Failed to create proposal:', error);
    throw error;
  }
}




export async function updateProposal(proposalId: string, proposalData: UpdateProposalPayload): Promise<Proposal> {
  const apiEndpoint = `/api/v1/proposals/${proposalId}`;
  
  try {
    console.log(`Updating proposal ${proposalId} with payload:`, proposalData);
    
    // PATCH is the standard HTTP method for partial updates.
    const response = await api.put<ApiResponse<Proposal>>(apiEndpoint, proposalData, {
      activeRole: 'AUDITOR'
    });
    
    if (response.data && response.data.success) {
      toast.success("Proposal updated successfully!");
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'API failed to update the proposal.');
    }
  } catch (error) {
    console.error(`Failed to update proposal ${proposalId}:`, error);
    throw error;
  }
}







export async function deleteProposal(proposalId: string): Promise<{ message: string }> {
  const apiEndpoint = `/api/v1/proposals/${proposalId}`;
  
  try {
    console.log(`Deleting proposal ${proposalId}...`);
    
    const response = await api.delete<ApiResponse<{ message: string }>>(apiEndpoint, {
      activeRole: 'AUDITOR'
    });
    
    if (response.data && response.data.success) {
      toast.success("Proposal deleted successfully!");
      return response.data.data; // Assuming backend returns a data object with a message
    } else {
      throw new Error(response.data.message || 'API failed to delete the proposal.');
    }
  } catch (error) {
    console.error(`Failed to delete proposal ${proposalId}:`, error);
    throw error;
  }
}
