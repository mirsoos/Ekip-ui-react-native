import React from 'react';
import { useRouter } from 'expo-router';
import { PlansScreen } from '../../src/screens/PlansScreen';
import { SettingsHeader } from '../../src/components/settings/SettingsHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useI18n } from '../../src/lib/i18n';

export default function PlansRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerPlans')} />}>
      <PlansScreen onBack={() => router.back()} />
    </ScreenLayout>
  );
}
