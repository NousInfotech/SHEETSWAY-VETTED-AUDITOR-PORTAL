import axios from 'axios';
import { auth } from '@/lib/firebase';

// This allows us to pass a custom `activeRole` in our axios config
declare module 'axios' {
  export interface AxiosRequestConfig {
    activeRole?: 'AUDITOR';
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
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['active-role'] = 'AUDITOR';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
