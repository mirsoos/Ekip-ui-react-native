import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { DiscoverScreen, type DiscoverScreenHandle } from '../../src/screens/DiscoverScreen';
import { DiscoverHeader } from '../../src/components/discover/DiscoverHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';

export default function DiscoverRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.is_read).length);
  const [search, setSearch] = useState('');
  const discoverRef = useRef<DiscoverScreenHandle>(null);

  return (
    <ScreenLayout
      header={
        <DiscoverHeader
          user={me}
          unreadCount={unreadCount}
          search={search}
          onChangeSearch={setSearch}
          hasActiveFilters={false}
          onOpenFilters={() => discoverRef.current?.openFilters()}
          onOpenNotifications={() => router.push('/notifications')}
          onOpenOwnProfile={() => router.navigate('/(tabs)/profile')}
        />
      }
    >
      <DiscoverScreen
        ref={discoverRef}
        search={search}
        onChangeSearch={setSearch}
        onOpenGroup={(g) => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
        onOpenProfile={(uid) => uid === 'me' ? router.navigate('/(tabs)/profile') : router.push({ pathname: '/profile/[id]', params: { id: uid } })}
        onOpenOwnProfile={() => router.navigate('/(tabs)/profile')}
        onOpenAI={() => router.push('/ai')}
        onOpenNotifications={() => router.push('/notifications')}
      />
    </ScreenLayout>
  );
}
