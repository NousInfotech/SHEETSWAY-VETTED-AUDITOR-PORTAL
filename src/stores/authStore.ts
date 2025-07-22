import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FirebaseUser {
  firebaseId: string;
  email: string | null;
  name: string | null;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  setFirebaseUser: (user: FirebaseUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      setFirebaseUser: (user) => set({ firebaseUser: user }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);