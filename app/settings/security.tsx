import React from 'react';
import { useRouter } from 'expo-router';
import { SecurityScreen } from '../../src/screens/SecurityScreen';
import { SettingsHeader } from '../../src/components/settings/SettingsHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useI18n } from '../../src/lib/i18n';

export default function SecurityRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerSecurity')} />}>
      <SecurityScreen onBack={() => router.back()} />
    </ScreenLayout>
  );
}
