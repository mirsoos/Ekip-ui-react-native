import React from 'react';
import { useRouter } from 'expo-router';
import { SettingsScreen } from '../../src/screens/SettingsScreen';
import { SettingsHeader } from '../../src/components/settings/SettingsHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useI18n } from '../../src/lib/i18n';
import { useAuthStore } from '../../src/store/authStore';

export default function SettingsIndexRoute() {
  const router = useRouter();
  const { t } = useI18n();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerSettings')} />}>
      <SettingsScreen
        onBack={() => router.back()}
        onOpenPlans={() => router.push('/settings/plans')}
        onOpenPersonalInfo={() => router.push('/settings/personal-info')}
        onOpenVerification={() => router.push('/settings/verification')}
        onOpenPrivacy={() => router.push('/settings/privacy')}
        onOpenSecurity={() => router.push('/settings/security')}
        onOpenNotifications={() => router.push('/notifications')}
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
