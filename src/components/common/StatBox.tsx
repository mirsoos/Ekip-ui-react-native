import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export interface StatBoxProps {
  icon: IconName;
  value: number | string;
  label: string;
  highlight?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatBox = React.memo(function StatBox({
  icon,
  value,
  label,
  highlight = false,
  onPress,
  style,
}: StatBoxProps) {
  const { colors } = useTheme();
  const IconComp = getIcon(icon);

  const content = (
    <View
      style={[
        styles.box,
        {
          backgroundColor: highlight ? 'rgba(244, 114, 182, 0.12)' : colors.glassThinBg,
          borderColor: highlight ? colors.accentPink : colors.glassBorder,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <IconComp
          size={14}
          color={highlight ? colors.accentPink : colors.textTertiary}
          strokeWidth={2.2}
          style={{ marginRight: 4 }}
        />
        <Text
          style={[
            styles.valueText,
            { color: highlight ? colors.accentPink : colors.textPrimary },
          ]}
        >
          {value}
        </Text>
      </View>
      <Text style={[styles.labelText, { color: colors.textTertiary }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={{ flex: 1 }}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={{ flex: 1 }}>{content}</View>;
});

const styles = StyleSheet.create({
  box: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
  },
  labelText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
