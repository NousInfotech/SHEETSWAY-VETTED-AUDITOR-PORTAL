import axios from 'axios';
import { User as FirebaseUser } from 'firebase/auth';
import { AuditorProfile } from '@/stores/useProfileStore';


export async function createBackendUser(firebaseUser: FirebaseUser) {
  const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const apiEndpoint = `${SERVER_URL}/api/v1/users/`;

  try {
    
    const requestBody = {
      firebaseId: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || 'New User', 
    };

    console.log("Creating backend user with payload:", requestBody);
    const response = await axios.post(apiEndpoint, requestBody);
    
    console.log("Backend user created successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error("Failed to create backend user:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Could not create user profile in our database.');
    }
    throw new Error('An unexpected error occurred while setting up your profile.');
  }
}





export async function getProfileOnSignIn(token: string, role: 'USER' | 'AUDITOR'): Promise<AuditorProfile | null> {
  const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  
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
      console.log("Verification successful. Profile data received:", response.data.data);
      return response.data.data;
    }
    
    return null;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log("Backend verification failed: User profile not found for this role.");
    } else {
      console.error("An error occurred during profile fetch/verification:", error);
    }
    return null;
  }
}