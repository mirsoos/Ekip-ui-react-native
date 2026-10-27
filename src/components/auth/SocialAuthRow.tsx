import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { FrostedGlass } from '../FrostedGlass';

export function SocialAuthRow({
  onSelect,
  providers = ['Apple', 'Mail', 'Phone'],
}: {
  onSelect: (provider: string) => void;
  providers?: ('Apple' | 'Google' | 'Mail' | 'Phone')[];
}) {
  const { colors, isDark } = useTheme();

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
              {
                borderColor: colors.glassBorderStrong,
              },
            ]}
          >
            {/* 360° Frosted Glass */}
            <FrostedGlass
              borderRadius={20}
              marginWidth={10}
              scale={22}
              blurDeviation={1.8}
              overlayOpacity={isDark ? 0.08 : 0.15}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.iconContent}>
              <IconComp size={20} color={colors.textPrimary} strokeWidth={2.2} />
            </View>
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
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContent: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
