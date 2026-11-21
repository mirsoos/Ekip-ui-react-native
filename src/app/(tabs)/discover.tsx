import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DiscoverScreen, type DiscoverScreenHandle } from '../../screens/DiscoverScreen';
import { DiscoverHeader } from '../../components/discover/DiscoverHeader';
import { MotionView } from '../../components/common/MotionView';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import type { Group } from '../../types/database';

export default function DiscoverRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  const [search, setSearch] = useState('');
  const discoverRef = useRef<DiscoverScreenHandle>(null);

  const handleOpenGroup = (group: Group) => {
    router.push(`/ekip/${group.id}`);
  };

  const handleOpenProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleOpenOwnProfile = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <DiscoverHeader
        user={me}
        unreadCount={unreadNotificationsCount}
        search={search}
        onChangeSearch={setSearch}
        hasActiveFilters={false}
        onOpenFilters={() => discoverRef.current?.openFilters()}
        onOpenNotifications={() => router.push('/notifications')}
        onOpenOwnProfile={handleOpenOwnProfile}
      />

      <MotionView style={styles.motionContainer}>
        <DiscoverScreen
          ref={discoverRef}
          search={search}
          onChangeSearch={setSearch}
          onOpenGroup={handleOpenGroup}
          onOpenProfile={handleOpenProfile}
          onOpenOwnProfile={handleOpenOwnProfile}
          onOpenAI={() => router.push('/ai')}
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
