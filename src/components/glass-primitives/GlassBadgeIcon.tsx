import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { getIcon, type IconName } from '../../lib/icons';
import { useI18n } from '../../lib/i18n';

export function GlassBadgeIconComponent({
  icon,
  label,
  color = 'pink',
  solid = false,
  style,
}: {
  icon: IconName;
  label: string;
  color?: string;
  solid?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { isRTL } = useI18n();
  const IconComp = getIcon(icon);
  const colorMap: Record<string, string> = {
    pink: '#f472b6',
    blue: '#3b82f6',
    green: '#22c55e',
    amber: '#f59e0b',
    purple: '#a855f7',
    slate: '#94a3b8',
    indigo: '#6366f1',
  };
  const c = colorMap[color] ?? color;

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: solid ? c : `${c}20`,
          borderColor: solid ? c : `${c}40`,
          alignSelf: isRTL ? 'flex-end' : 'flex-start',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        style,
      ]}
    >
      <IconComp
        size={11}
        color={solid ? '#ffffff' : c}
        strokeWidth={2.5}
        style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
      />
      <Text style={[styles.badgeText, { color: solid ? '#ffffff' : c }]}>{label}</Text>
    </View>
  );
}

export const GlassBadgeIcon = React.memo(GlassBadgeIconComponent);

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
