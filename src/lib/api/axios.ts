// import axios from 'axios';
// import { auth } from '@/lib/firebase';
// import { useProfileStore } from '@/stores/useProfileStore';

// // Add this to your type definitions or at the top of the file
// // This extends the default axios config to include our custom property
// declare module 'axios' {
//   export interface AxiosRequestConfig {
//     activeRole?: 'USER' | 'AUDITOR' | 'ADMIN';
//   }
// }

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     // --- AUTHORIZATION TOKEN (NO CHANGE) ---
//     const user = auth.currentUser;
//     if (user) {
//       const token = await user.getIdToken();
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // --- ACTIVE ROLE LOGIC (UPDATED) ---
//     // 1. Check if an 'activeRole' was explicitly passed in the request config.
//     if (config.activeRole) {
//       config.headers['active-role'] = config.activeRole;
//     } else {
//       // 2. If not, fall back to the profile in the Zustand store.
//       const profile = useProfileStore.getState().profile;
//       if (profile?.role) {
//         config.headers['active-role'] = profile.role;
//       }
//     }
    
//     // Remove our custom property before sending the request
//     delete config.activeRole;

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;







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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
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