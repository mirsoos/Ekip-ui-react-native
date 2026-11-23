import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { GLASS_THEME_STYLES } from './theme';

export function GlassEmptyComponent({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { colors, isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconCircle,
          themeStyles.emptyIcon,
        ]}
      >
        <Icon name={icon} size={30} color={colors.textTertiary} strokeWidth={1.8} />
      </View>
      <Text style={[styles.emptyTitle, themeStyles.emptyTitle]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.emptySubtitle, themeStyles.emptySubtitle]}>
          {subtitle}
        </Text>
      )}
      {action && <View style={{ marginTop: 14 }}>{action}</View>}
    </View>
  );
}

export const GlassEmpty = React.memo(GlassEmptyComponent);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});
