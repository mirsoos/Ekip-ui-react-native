import React from 'react';
import { useRouter } from 'expo-router';
import { SettingsScreen, SettingsHeader } from '@/src/features/settings';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useI18n } from '@/src/lib/i18n';
import { useAuthStore } from '@/src/store/authStore';
import { useNotificationStore } from '@/src/store/notificationStore';

export default function SettingsIndexRoute() {
  const router = useRouter();
  const { t } = useI18n();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const openNotifications = useNotificationStore((s) => s.openSheet);

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerSettings')} />}>
      <SettingsScreen
        onBack={() => router.back()}
        onOpenPlans={() => router.push('/settings/plans')}
        onOpenPersonalInfo={() => router.push('/settings/personal-info')}
        onOpenVerification={() => router.push('/settings/verification')}
        onOpenPrivacy={() => router.push('/settings/privacy')}
        onOpenSecurity={() => router.push('/settings/security')}
        onOpenNotifications={openNotifications}
        onOpenLocation={() => router.push('/settings/location')}
        onOpenChatTheme={() => router.push('/settings/chat-theme')}
        onOpenOnboarding={() => router.push('/onboarding')}
        onSignOut={() => {
          setAuthenticated(false);
          setOnboarded(false);
          router.replace('/auth');
        }}
      />
    </ScreenLayout>
  );
}
