import React from 'react';
import { useRouter } from 'expo-router';
import { PersonalInfoScreen } from '../../src/screens/PersonalInfoScreen';
import { SettingsHeader } from '../../src/components/settings/SettingsHeader';
import { ScreenLayout } from '../../src/components/common/ScreenLayout';
import { useI18n } from '../../src/lib/i18n';

export default function PersonalInfoRoute() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <ScreenLayout header={<SettingsHeader onBack={() => router.back()} title={t('settings.headerPersonalInfo')} />}>
      <PersonalInfoScreen
        onBack={() => router.back()}
        onOpenVerification={() => router.push('/settings/verification')}
      />
    </ScreenLayout>
  );
}
