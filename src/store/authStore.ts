import { create } from 'zustand';
import { demoProfiles } from '../lib/demoData';
import type { Profile } from '../types/database';

interface AuthState {
  me: Profile;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  updateMe: (updates: Partial<Profile>) => void;
  setAuthenticated: (status: boolean) => void;
  setOnboarded: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  me: demoProfiles[0],
  isAuthenticated: false,
  isOnboarded: false,
  updateMe: (updates) =>
    set((state) => ({
      me: { ...state.me, ...updates },
    })),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setOnboarded: (status) => set({ isOnboarded: status }),
}));
