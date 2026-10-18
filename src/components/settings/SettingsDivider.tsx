import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../lib/theme';

export function SettingsDivider() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.divider,
        marginHorizontal: 16,
      }}
    />
  );
}
