import { create } from 'zustand';
// 1. Import ALL necessary types and enums from your single source of truth
import {
  AuditorRole,
  Currency,
  AccountStatus,
  VettedStatus
} from '@/lib/validators/auditor-schema';
import { getAuditorProfile as fetchAuditorProfileService } from '@/lib/services/auditorService';

// 2. Define the AuditorProfile interface to perfectly match your API response data
// This is the data structure for a SINGLE auditor as it exists in your database.
export interface AuditorProfile {
  id: string;
  authId: string;
  auditFirmId: string | null;
  role: AuditorRole;
  name: string;
  email: string;
  licenseNumber: string;
  yearsExperience: number;
  specialties: string[];
  languages: string[];
  avgResponseTime: number | null;
  avgCompletion: number | null;
  successCount: number;
  rating: number;
  reviewsCount: number;
  portfolioLinks: string[];
  supportingDocs: string[];
  accountStatus: AccountStatus;
  vettedStatus: VettedStatus;
  stripeAccountId: string | null;
  payoutCurrency: Currency | null;
  createdAt: string;
  updatedAt: string;
}

// 3. Define the state and actions for your store
interface ProfileState {
  profile: AuditorProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
  setProfile: (profile: AuditorProfile) => void;
}

// 4. Create the store
export const useProfileStore = create<ProfileState>((set) => ({
  // Initial state
  profile: null,
  isLoading: false, // Start as false; loading is handled by the caller (e.g., AuthProvider)
  error: null,

  // Action to fetch the profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // The service function now handles the API call and data extraction
      const profileData = await fetchAuditorProfileService();
      set({ profile: profileData, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch profile in store:', error);
      set({ profile: null, isLoading: false, error: error.message });
      // Re-throw the error so components like AuthProvider can react to the failure
      throw error;
    }
  },

  // Action to clear the profile on logout
  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null });
  },

  // Action to set the profile directly (useful after sign-in)
  setProfile: (profileData) => {
    set({ profile: profileData, isLoading: false, error: null });
  }
}));
