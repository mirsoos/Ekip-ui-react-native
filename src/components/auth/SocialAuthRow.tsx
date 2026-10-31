import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';
import { FrostedGlass } from '../FrostedGlass';
import { GoogleLogo } from './GoogleLogo';

export type AuthProviderType = 'Google';

export function SocialAuthRow({
  onSelect,
  providers = ['Google'],
}: {
  onSelect: (provider: AuthProviderType) => void;
  providers?: AuthProviderType[];
}) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.row}>
      {providers.map((p) => {
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
              borderRadius={22}
              marginWidth={10}
              scale={22}
              blurDeviation={1.8}
              overlayOpacity={isDark ? 0.08 : 0.15}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.iconContent}>
              <GoogleLogo size={24} />
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
  },
  btn: {
    position: 'relative',
    width: 52,
    height: 52,
    borderRadius: 22,
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
