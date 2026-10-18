import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function PremiumFeatureRow({ label }: { label: string }) {
  const { colors } = useTheme();
  const Check = getIcon('Check');

  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Check size={10} color="#f59e0b" strokeWidth={3} />
      </View>
      <Text style={[styles.text, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

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
