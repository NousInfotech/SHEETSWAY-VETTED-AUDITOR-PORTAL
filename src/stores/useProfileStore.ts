import { create } from 'zustand';
import { getAuditorProfile as fetchAuditorProfileService } from '@/lib/services/auditorService';

// This interface is now VERIFIED to be correct based on your API response.
export interface AuditorProfile {
  id: string;
  authId: string;
  auditFirmId: string | null;
  role: 'JUNIOR' | 'SENIOR' | 'PARTNER' | 'SUPERADMIN';
  name: string;
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
  accountStatus: 'PENDING' | 'VERIFIED' | 'BANNED';
  vettedStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  stripeAccountId: string | null;
  payoutCurrency: 'EUR' | 'USD' | 'GBP' | 'INR' | 'AED' | 'OTHER' | null;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  profile: AuditorProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
  setProfile: (profile: AuditorProfile) => void;
}

// This store implementation is correct.
export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: true,
  error: null,
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profileData = await fetchAuditorProfileService(); 
      set({ profile: profileData, isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch profile in store:", error);
      set({ profile: null, isLoading: false, error: error.message });
    }
  },
  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null });
  },

  setProfile: (profileData) => {
    set({ profile: profileData, isLoading: false, error: null });
  },
}));