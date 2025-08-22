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

// Response interceptor: Return only data if success === true
axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (data?.success === true) {
      return data; // ✅ return actual payload
    } else {
      const error = data?.message || 'Unknown API response error';
      return Promise.reject(new Error(error));
    }
  },
  (error) => {
    return Promise.reject(error); // Network/server error
  }
);

export default axiosInstance;
