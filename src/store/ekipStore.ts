import { create } from 'zustand';
import { demoGroups, demoMembers, demoRequests } from '../lib/demoData';
import type { Group, GroupMember, GroupRequest } from '../types/database';

interface EkipState {
  groups: Group[];
  members: GroupMember[];
  requests: GroupRequest[];
  addGroup: (g: Group) => void;
  addRequest: (r: GroupRequest) => void;
  updateRequest: (id: string, status: GroupRequest['status']) => void;
}

export const useEkipStore = create<EkipState>((set) => ({
  groups: demoGroups,
  members: demoMembers,
  requests: demoRequests,
  addGroup: (g) =>
    set((state) => ({
      groups: [g, ...state.groups],
    })),
  addRequest: (r) =>
    set((state) => ({
      requests: [r, ...state.requests],
    })),
  updateRequest: (id, status) =>
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
