import api from '@/lib/api/axios';
import { AuditorProfile } from '@/stores/useProfileStore';

export enum AuditorRole {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  PARTNER = 'PARTNER',
  SUPERADMIN = 'SUPERADMIN'
}

export enum AccountStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  BANNED = 'BANNED'
}

export enum VettedStatus {
  NOT_APPLIED = 'NOT_APPLIED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
  AED = 'AED',
  OTHER = 'OTHER'
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface UpdateAuditorPayload {
  name?: string;
  licenseNumber?: string;
  role?: AuditorRole;
  yearsExperience?: number;

  specialties?: string[];
  languages?: string[];
  portfolioLinks?: string[];
  supportingDocs?: string[];

  accountStatus?: AccountStatus;
  vettedStatus?: VettedStatus;

  auditFirmId?: string | null;
  stripeAccountId?: string | null;
  payoutCurrency?: Currency | null;

  rating?: number | null;
  reviewsCount?: number | null;
  successCount?: number | null;
  avgResponseTime?: number | null;
  avgCompletion?: number | null;
}

export interface CreateAuditorPayload {
  auth: {
    email: string;
    password?: string;
    name: string;
  };
  auditor: {
    name: string;
    licenseNumber: string;
    role: AuditorRole;
    yearsExperience: number;
    specialties?: string[];
    languages?: string[];
    portfolioLinks?: string[];
    supportingDocs?: string[];
    accountStatus?: AccountStatus;
    vettedStatus?: VettedStatus;
    auditFirmId?: string | null;
    stripeAccountId?: string | null;
    payoutCurrency?: Currency | null;
  };
}

export async function getAllAuditors(): Promise<AuditorProfile[] | null> {
  const apiEndpoint = '/api/v1/auditors';
  try {
    const response = await api.get<ApiResponse<AuditorProfile[]>>(apiEndpoint);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      console.error(
        'API call was successful but the body indicated failure.',
        response.data
      );
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch all auditors:', error);
    return null;
  }
}

export async function getAuditorProfile(): Promise<any> {
  const apiEndpoint = '/api/v1/auditors/get-profile';
  try {
    const response = await api.get<ApiResponse<AuditorProfile>>(apiEndpoint);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'API returned success but no profile data.'
      );
    }
  } catch (error) {
    console.error('Failed to get auditor profile:', error);
    throw error;
  }
}

export async function createAuditor(
  payload: CreateAuditorPayload
): Promise<any> {
  console.log('Creating auditor with payload:', payload);
  const apiEndpoint = '/api/v1/auditors/subrole';
  try {
    const response = await api.post<ApiResponse<AuditorProfile>>(
      apiEndpoint,
      payload
    );
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create auditor.');
    }
  } catch (error) {
    console.error('Failed to create auditor:', error);
    throw error;
  }
}

export async function updateAuditor(
  auditorId: string,
  payload: UpdateAuditorPayload
): Promise<AuditorProfile> {
  const apiEndpoint = `/api/v1/auditors/profile`;
  try {
    const response = await api.put<ApiResponse<AuditorProfile>>(apiEndpoint, {
      ...payload,
      id: auditorId
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || 'Failed to update auditor profile.'
      );
    }
  } catch (error) {
    console.error(`Failed to update auditor ${auditorId}:`, error);
    throw error;
  }
}
