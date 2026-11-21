import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  demoProfiles, demoMembers, demoConversations, demoMessages,
} from './demoData';
import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '../types/database';
import { useAuthStore } from '../store/authStore';
import { useEkipStore } from '../store/ekipStore';
import { useNotificationStore } from '../store/notificationStore';
import { useUserStore } from '../store/userStore';

interface AppData {
  me: Profile;
  profiles: Profile[];
  groups: Group[];
  members: GroupMember[];
  requests: GroupRequest[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notifications: Notification[];
  badges: Badge[];
  missions: Mission[];
  friends: Friendship[];

  addGroup: (g: Group) => void;
  addRequest: (r: GroupRequest) => void;
  updateRequest: (id: string, status: GroupRequest['status']) => void;
  addMessage: (convId: string, body: string) => void;
  markConversationRead: (convId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addFriend: (friendId: string) => void;
  updateFriend: (id: string, status: Friendship['status']) => void;
  addNotification: (n: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'is_read'>) => void;
  updateMe: (updates: Partial<Profile>) => void;
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  // Zustand Store integrations
  const me = useAuthStore((s) => s.me);
  const updateMe = useAuthStore((s) => s.updateMe);

  const groups = useEkipStore((s) => s.groups);
  const requests = useEkipStore((s) => s.requests);
  const addGroup = useEkipStore((s) => s.addGroup);
  const addRequest = useEkipStore((s) => s.addRequest);
  const updateRequest = useEkipStore((s) => s.updateRequest);

  const notifications = useNotificationStore((s) => s.notifications);
  const markNotificationRead = useNotificationStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useNotificationStore((s) => s.markAllNotificationsRead);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const profiles = useUserStore((s) => s.profiles);
  const badges = useUserStore((s) => s.badges);
  const missions = useUserStore((s) => s.missions);
  const friends = useUserStore((s) => s.friends);
  const addFriend = useUserStore((s) => s.addFriend);
  const updateFriend = useUserStore((s) => s.updateFriend);

  // Conversation & Message state
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(demoMessages);
  const members = demoMembers;

  const addMessage = useCallback((convId: string, body: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: convId,
      sender_id: 'me',
      body,
      media_url: null,
      read_at: null,
      created_at: new Date().toISOString(),
      sender: demoProfiles[0],
    };
    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), newMsg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, last_message: body, last_message_at: newMsg.created_at }
          : c
      )
    );
  }, []);

  const markConversationRead = useCallback((convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c))
    );
  }, []);

  const value = useMemo(
    () => ({
      me,
      profiles,
      groups,
      members,
      requests,
      conversations,
      messages,
      notifications,
      badges,
      missions,
      friends,
      addGroup,
      addRequest,
      updateRequest,
      addMessage,
      markConversationRead,
      markNotificationRead,
      markAllNotificationsRead,
      addFriend,
      updateFriend,
      addNotification,
      updateMe,
    }),
    [
      me,
      profiles,
      groups,
      members,
      requests,
      conversations,
      messages,
      notifications,
      badges,
      missions,
      friends,
      addGroup,
      addRequest,
      updateRequest,
      addMessage,
      markConversationRead,
      markNotificationRead,
      markAllNotificationsRead,
      addFriend,
      updateFriend,
      addNotification,
      updateMe,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
