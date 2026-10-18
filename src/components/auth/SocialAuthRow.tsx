import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function SocialAuthRow({
  onSelect,
  providers = ['Apple', 'Mail', 'Phone'],
}: {
  onSelect: (provider: string) => void;
  providers?: ('Apple' | 'Google' | 'Mail' | 'Phone')[];
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {providers.map((p) => {
        const IconComp = getIcon(
          p === 'Apple' ? 'Sparkles' : p === 'Mail' ? 'Mail' : p === 'Phone' ? 'Phone' : 'Globe'
        );

        return (
          <TouchableOpacity
            key={p}
            activeOpacity={0.75}
            onPress={() => onSelect(p)}
            style={[
              styles.btn,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <IconComp size={20} color={colors.textPrimary} strokeWidth={2.2} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
