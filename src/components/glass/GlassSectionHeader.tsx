import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import {
  GLASS_THEME_STYLES,
  LIST_ROW_STYLES,
  TEXT_DIRECTION_STYLES,
} from './theme';

export function GlassSectionHeaderComponent({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const { isDark } = useTheme();
  const themeStyles = GLASS_THEME_STYLES[isDark ? 'dark' : 'light'];
  const { isRTL } = useI18n();

  return (
    <View style={[styles.sectionHeader, LIST_ROW_STYLES[isRTL ? 'rtl' : 'ltr']]}>
      <Text
        style={[
          styles.sectionTitle,
          themeStyles.sectionTitle,
          TEXT_DIRECTION_STYLES[isRTL ? 'rtl' : 'ltr'],
        ]}
      >
        {title}
      </Text>
      {action}
    </View>
  );
}

export const GlassSectionHeader = React.memo(GlassSectionHeaderComponent);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
});
