import React from 'react';
import { FloatingGlassHeader } from '@/src/components/common/FloatingGlassHeader';
import { useI18n } from '@/src/lib/i18n';

export const SettingsHeader = React.memo(function SettingsHeader({
  onBack,
  title,
}: {
  onBack: () => void;
  title?: string;
}) {
  const { t } = useI18n();
  const displayTitle = title ?? t('settings.title');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      title={displayTitle}
    />
  );
});
