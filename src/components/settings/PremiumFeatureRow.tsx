// --- START OF FILE PremiumFeatureRow.tsx ---

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export const PremiumFeatureRow = React.memo(function PremiumFeatureRow({
  label,
}: {
  label: string;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const Check = getIcon('Check');

  return (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={styles.iconCircle}>
        <Check size={10} color="#f59e0b" strokeWidth={3} />
      </View>
      <Text
        style={[
          styles.text,
          {
            color: colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 3,
  },
  iconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
  },
});