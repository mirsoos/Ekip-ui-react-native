import React from 'react';
import { useRouter } from 'expo-router';
import { LocationScreen, SettingsHeader } from '@/src/features/settings';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useI18n } from '@/src/lib/i18n';

export default function LocationRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerLocation')} />}>
      <LocationScreen onBack={() => router.back()} />
    </ScreenLayout>
  );
}
