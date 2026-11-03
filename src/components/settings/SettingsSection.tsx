// --- START OF FILE SettingsSection.tsx ---

import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export const SettingsSection = React.memo(function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: colors.textTertiary,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 6,
  },
});