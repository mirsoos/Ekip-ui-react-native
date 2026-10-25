import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { GlassBackButton } from '../Glass';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  style,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: colors.glassThickBg,
          borderBottomColor: colors.glassBorder,
        },
        style,
      ]}
    >
      <View style={[styles.leftRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {onBack && <GlassBackButton onPress={onBack} style={{ marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightAction && <View style={{ marginLeft: 8 }}>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 50,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
