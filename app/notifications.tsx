import React from 'react';
import { useRouter } from 'expo-router';
import { NotificationsScreen } from '@/src/features/notifications';
import { SettingsHeader } from '@/src/features/settings';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useI18n } from '@/src/lib/i18n';

export default function NotificationsRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerNotifications')} />}>
      <NotificationsScreen
        onBack={() => router.back()}
        onOpenConversation={(cid) => router.push({ pathname: '/chat/[id]', params: { id: cid } })}
      />
    </ScreenLayout>
  );
}
