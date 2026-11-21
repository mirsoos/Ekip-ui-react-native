import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityScreen } from '../../screens/ActivityScreen';
import { ActivityHeader } from '../../components/activity/ActivityHeader';
import { MotionView } from '../../components/common/MotionView';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import type { Group } from '../../types/database';

export default function ActivityRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  const [tab, setTab] = useState('created');

  const handleOpenGroup = (group: Group) => {
    router.push(`/ekip/${group.id}`);
  };

  const handleOpenProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <View style={styles.container}>
      <ActivityHeader
        user={me}
        unreadCount={unreadNotificationsCount}
        tab={tab}
        onChangeTab={setTab}
        onOpenNotifications={() => router.push('/notifications')}
        onOpenOwnProfile={() => router.push('/(tabs)/profile')}
      />

      <MotionView style={styles.motionContainer}>
        <ActivityScreen
          tab={tab}
          onChangeTab={setTab}
          onOpenGroup={handleOpenGroup}
          onOpenProfile={handleOpenProfile}
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
