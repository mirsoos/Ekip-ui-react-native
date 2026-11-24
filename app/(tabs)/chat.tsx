import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChatListScreen } from '../../src/screens/ChatScreens';
import { ChatListHeader } from '../../src/components/chat/ChatListHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useAppData } from '../../src/lib/appData';
import { useNotificationStore } from '../../src/store/notificationStore';

export default function ChatRoute() {
  const router = useRouter();
  const { conversations } = useAppData();
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadTotal = conversations.reduce((s, c) => s + c.unread_count, 0);
  const unreadNotifications = notifications.filter((n) => !n.is_read).length;
  const [search, setSearch] = useState('');

  return (
    <ScreenLayout
      header={
        <ChatListHeader
          unreadTotal={unreadTotal}
          notificationsCount={unreadNotifications}
          search={search}
          onChangeSearch={setSearch}
          onOpenNotifications={() => router.push('/notifications')}
        />
      }
    >
      <ChatListScreen
        search={search}
        onOpenConversation={(cid) => router.push({ pathname: '/chat/[id]', params: { id: cid } })}
        onOpenNotifications={() => router.push('/notifications')}
      />
    </ScreenLayout>
  );
}
