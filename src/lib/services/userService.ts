import axios from 'axios';
import { AuditorProfile } from '@/stores/useProfileStore';

export async function getProfileOnSignIn(
  token: string,
  role: 'AUDITOR'
): Promise<AuditorProfile | null> {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const apiEndpoint = `${SERVER_URL}/api/v1/auditors/get-profile`;

  try {
    console.log(`Verifying user and fetching profile as '${role}'...`);

    const response = await axios.get(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        'active-role': role
      }
    });

    if (response.data && response.data.success) {
      console.log(
        'Verification successful. Profile data received:',
        response.data.data
      );
      return response.data.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(
        'Backend verification failed: User profile not found for this role.'
      );
    } else {
      console.error('An error occurred during profile verification:', error);
    }
    return null;
  }
}
