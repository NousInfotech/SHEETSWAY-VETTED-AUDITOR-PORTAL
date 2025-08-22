import api from '@/lib/api/axios';

export enum RequestType {
  AUDIT = 'AUDIT',
  TAX = 'TAX'
}

export enum UrgencyLevel {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT'
}

export enum AuditFramework {
  IFRS = 'IFRS',
  GAPSME = 'GAPSME',
  GAAP = 'GAAP',
  OTHER = 'OTHER'
}

export interface ClientRequest {
  id: string;

  userId: string;

  businessId: string;

  title: string;

  type: RequestType;

  framework: AuditFramework;

  financialYear: string;

  auditStart: string | null;

  auditEnd: string | null;

  deadline: string;

  notes: string;

  urgency: UrgencyLevel;

  budget: number | null;

  isAnonymous: boolean;

  isActive: boolean;

  preferredLanguages: string[];

  timeZone: string | null;

  workingHours: string | null;

  specialFlags: string[];

  createdAt: string;
}

interface ClientRequestsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ClientRequest[];
}

export async function getClientRequests(): Promise<ClientRequest[] | null> {
  const apiEndpoint = '/api/v1/client-requests';
  try {
    const response = await api.get<ClientRequestsApiResponse>(apiEndpoint);

    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch client requests:', error);
    throw error;
  }
}
