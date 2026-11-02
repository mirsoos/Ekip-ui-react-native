import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function InfoPill({
  icon,
  label,
  style,
}: {
  icon: IconName;
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();
  const IconComp = getIcon(icon);

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.glassThinBg,
          borderColor: colors.glassBorder,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        style,
      ]}
    >
      <IconComp
        size={13}
        color={colors.textTertiary}
        strokeWidth={2.2}
        style={{ marginRight: isRTL ? 0 : 5, marginLeft: isRTL ? 5 : 0 }}
      />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});
