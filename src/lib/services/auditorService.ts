import api from '@/lib/api/axios';
import { AuditorProfile } from '@/stores/useProfileStore';
import { AccountStatus, AuditorRole, Currency } from '@/lib/validators/auditor-schema';


export type { AuditorProfile }; 

// A single, generic type for all successful API responses from your backend
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


export interface CreateAuditorPayload {
    auth: {
        name: string;
        email: string;
        password: string;
    };
    auditor: {
      name: string;
      licenseNumber: string;
      role: AuditorRole;
      yearsExperience: number;
      accountStatus: AccountStatus;
      payoutCurrency?: Currency | null;
      specialties?: string[];
      languages?: string[];
      portfolioLinks?: string[];
      stripeAccountId?: string | null;
    };
}


export type UpdateAuditorPayload = Partial<{
    name: string;
    licenseNumber: string;
    yearsExperience: number;
    role: AuditorRole;
    accountStatus: AccountStatus;
    specialties: string[] | undefined;
    languages: string[] | undefined;
    payoutCurrency: Currency | null | undefined;
    portfolioLinks: string[] | undefined;
    stripeAccountId?: string | null; 
}>;



export async function getAuditorProfile(): Promise<AuditorProfile> {
  const apiEndpoint = '/api/v1/auditors/get-profile';
  try {
    const response = await api.get<ApiResponse<AuditorProfile>>(apiEndpoint, {
      activeRole: 'AUDITOR'
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'API returned success but no profile data.');
    }
  } catch (error) {
    console.error("Failed to get auditor profile:", error);
    throw error;
  }
}


export async function getAllAuditors(): Promise<AuditorProfile[] | null> {
  const apiEndpoint = '/api/v1/auditors'; 
  try {
    const response = await api.get<ApiResponse<AuditorProfile[]>>(apiEndpoint,{
        activeRole: 'AUDITOR'
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error("API call was successful but the body indicated failure.", response.data);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch all auditors:", error);
    return null;
  }
}


export async function createAuditor(payload: CreateAuditorPayload): Promise<AuditorProfile> {
  const apiEndpoint = '/api/v1/auditors/subrole'; 
  try {
    const response = await api.post<ApiResponse<AuditorProfile>>(apiEndpoint, payload, {
        activeRole: 'AUDITOR' 
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create auditor.');
    }
  } catch (error) {
    console.error("Failed to create auditor:", error);
    throw error;
  }
}


export async function updateAuditor(auditorId: string, payload: UpdateAuditorPayload): Promise<AuditorProfile> {
  
  const apiEndpoint = `/api/v1/auditors/profile`; 
  try {
    
    const response = await api.put<ApiResponse<AuditorProfile>>(apiEndpoint, { ...payload, id: auditorId }, {
        activeRole: 'AUDITOR' 
    });
     if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update auditor profile.');
    }
  } catch (error) {
    console.error(`Failed to update auditor ${auditorId}:`, error);
    throw error;
  }
}

