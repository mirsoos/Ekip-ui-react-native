import { create } from 'zustand';
import { demoProfiles, demoBadges, demoMissions, demoFriends } from '../lib/demoData';
import type { Profile, Badge, Mission, Friendship } from '../types/database';

interface UserState {
  profiles: Profile[];
  badges: Badge[];
  missions: Mission[];
  friends: Friendship[];
  addFriend: (friendId: string) => void;
  updateFriend: (id: string, status: Friendship['status']) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profiles: demoProfiles,
  badges: demoBadges,
  missions: demoMissions,
  friends: demoFriends,
  addFriend: (friendId) => {
    const friend = demoProfiles.find((p) => p.id === friendId);
    if (!friend) return;
    const newFriend: Friendship = {
      id: `f-${Date.now()}`,
      user_id: 'me',
      friend_id: friendId,
      status: 'accepted',
      created_at: new Date().toISOString(),
      profile: friend,
    };
    set((state) => ({
      friends: [newFriend, ...state.friends],
    }));
  },
  updateFriend: (id, status) =>
    set((state) => ({
      friends: state.friends.map((f) => (f.id === id ? { ...f, status } : f)),
    })),
}));
