import axios from 'axios';
import { auth } from '@/lib/firebase';
import { useProfileStore } from '@/stores/useProfileStore';
import { useAuth } from '@/components/layout/providers';

// This allows us to pass a custom `activeRole` in our axios config
declare module 'axios' {
  export interface AxiosRequestConfig {
    activeRole?: 'USER' | 'AUDITOR' | 'ADMIN';
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    // const {user} = useAuth();
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Prioritize the role passed in the config
    if (config.activeRole) {
      config.headers['active-role'] = config.activeRole;
    } else {
      // Fallback to the store's state
      const profile = useProfileStore.getState().profile;
      if (profile?.role) {
        config.headers['active-role'] = profile.role;
      }
    }

    // Clean up our custom property
    delete config.activeRole;

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
