import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityScreen } from '../../src/screens/ActivityScreen';
import { ActivityHeader } from '../../src/components/activity/ActivityHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useAuthStore } from '../../src/store/authStore';
import { useNotificationStore } from '../../src/store/notificationStore';

export default function ActivityRoute() {
  const router = useRouter();
  const me = useAuthStore((s) => s.me);
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.is_read).length);
  const openNotifications = useNotificationStore((s) => s.openSheet);
  const [tab, setTab] = useState('created');

  return (
    <ScreenLayout
      header={
        <ActivityHeader
          user={me}
          unreadCount={unreadCount}
          tab={tab}
          onChangeTab={setTab}
          onOpenNotifications={openNotifications}
          onOpenOwnProfile={() => router.navigate('/(tabs)/profile')}
        />
      }
    >
      <ActivityScreen
        tab={tab}
        onChangeTab={setTab}
        onOpenGroup={(g) => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
        onOpenProfile={(uid) => router.push({ pathname: '/profile/[id]', params: { id: uid } })}
        onOpenNotifications={openNotifications}
      />
    </ScreenLayout>
  );
}
