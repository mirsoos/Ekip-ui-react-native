import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  demoProfiles, demoGroups, demoMembers, demoRequests,
  demoConversations, demoMessages, demoNotifications,
  demoBadges, demoMissions, demoFriends,
} from './demoData';
import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '../types/database';

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
  const [me, setMe] = useState<Profile>(demoProfiles[0]);
  const [groups, setGroups] = useState<Group[]>(demoGroups);
  const [requests, setRequests] = useState<GroupRequest[]>(demoRequests);
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(demoMessages);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [friends, setFriends] = useState<Friendship[]>(demoFriends);

  const profiles = [me, ...demoProfiles.slice(1)];
  const members = demoMembers;
  const badges = demoBadges;
  const missions = demoMissions;

  const addGroup = useCallback((g: Group) => setGroups((prev) => [g, ...prev]), []);

  const addRequest = useCallback((r: GroupRequest) => setRequests((prev) => [r, ...prev]), []);

  const updateRequest = useCallback((id: string, status: GroupRequest['status']) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

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

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  const addFriend = useCallback((friendId: string) => {
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
    setFriends((prev) => [newFriend, ...prev]);
  }, []);

  const updateFriend = useCallback((id: string, status: Friendship['status']) => {
    setFriends((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'is_read'>) => {
      const newNotif: Notification = {
        ...n,
        id: `n-${Date.now()}`,
        user_id: 'me',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const updateMe = useCallback((updates: Partial<Profile>) => {
    setMe((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        me, profiles, groups, members, requests, conversations, messages,
        notifications, badges, missions, friends,
        addGroup, addRequest, updateRequest, addMessage, markConversationRead,
        markNotificationRead, markAllNotificationsRead, addFriend, updateFriend, addNotification,
        updateMe,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
