import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChatListScreen } from '../../screens/ChatScreens';
import { ChatListHeader } from '../../components/chat/ChatListHeader';
import { MotionView } from '../../components/common/MotionView';
import { useNotificationStore } from '../../store/notificationStore';
import { useAppData } from '../../lib/appData';

export default function ChatListRoute() {
  const router = useRouter();
  const { conversations } = useAppData();
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;
  const unreadTotal = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <ChatListHeader
        unreadTotal={unreadTotal}
        notificationsCount={unreadNotificationsCount}
        search={search}
        onChangeSearch={setSearch}
        onOpenNotifications={() => router.push('/notifications')}
      />

      <MotionView style={styles.motionContainer}>
        <ChatListScreen
          search={search}
          onOpenConversation={(id) => router.push(`/chat/${id}`)}
          onOpenNotifications={() => router.push('/notifications')}
        />
      </MotionView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  motionContainer: {
    flex: 1,
  },
});
