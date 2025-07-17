import api from '@/lib/api/axios';
import { AuditorProfile } from '@/stores/useProfileStore';

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuditorProfile;
}

export async function getAuditorProfile(): Promise<AuditorProfile> {
  const apiEndpoint = '/api/v1/auditors/get-profile';

  try {
    
    const response = await api.get<ApiResponse>(apiEndpoint, {
      activeRole: 'AUDITOR' 
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'API returned success status but no profile data.');
    }
  } catch (error) {
    throw error;
  }
}