import React from 'react';
import { useRouter } from 'expo-router';
import { VerificationScreen, SettingsHeader } from '@/src/features/settings';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useI18n } from '@/src/lib/i18n';

export default function VerificationRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerVerification')} />}>
      <VerificationScreen onBack={() => router.back()} />
    </ScreenLayout>
  );
}
