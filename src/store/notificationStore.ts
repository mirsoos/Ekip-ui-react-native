import { create } from 'zustand';
import { demoNotifications } from '../lib/demoData';
import type { Notification } from '../types/database';

interface NotificationState {
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'is_read'>) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: demoNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
    })),
  addNotification: (n) => {
    const newNotif: Notification = {
      ...n,
      id: `n-${Date.now()}`,
      user_id: 'me',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },
}));
