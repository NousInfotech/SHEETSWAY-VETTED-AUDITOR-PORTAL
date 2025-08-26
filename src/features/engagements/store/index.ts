import { create } from 'zustand';
import { ClientEngagement } from '../types/engagement-types';
import { listClientEngagements } from '@/api/engagement';

interface ClientEngagementStore {
  // State -- type/interface definition
  clientEngagements: ClientEngagement[];
  selectedClientEngagement: ClientEngagement | null;
  loading: boolean;
  error: string | null;

  // Actions -- type/interface definition
  setSelectedClientEngagement: (
    clientEngagement: ClientEngagement | null
  ) => void;
  loadClientEngagements: (userId?: string) => Promise<void>;
}

export const useClientEngagementStore = create<ClientEngagementStore>(
  (set) => ({
    // Initial State
    clientEngagements: [],
    selectedClientEngagement: null,
    loading: false,
    error: null,

    // Action to set the selected engagement
    setSelectedClientEngagement: (clientEngagement) =>
      set({ selectedClientEngagement: clientEngagement }),

    // Action to load engagements from the API
    loadClientEngagements: async (auditorId?: string) => {
      set({ loading: true, error: null });
      try {
        const params = auditorId ? { auditorId } : {};
        const data = await listClientEngagements(params);

        if (Array.isArray(data)) {
          set({ clientEngagements: data, loading: false });
        } else {
          // This part might be hit if the backend is fixed
          set({ clientEngagements: data.data, loading: false });
        }
      } catch (error: any) {
        set({
          error: error.message || 'Failed to load engagements',
          loading: false
        });
      }
    }
  })
);
