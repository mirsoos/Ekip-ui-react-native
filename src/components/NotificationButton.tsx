import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { FrostedGlass } from './FrostedGlass';

export interface NotificationButtonProps {
  unreadCount: number;
  onPress: () => void;
}

export function NotificationButtonComponent({ unreadCount, onPress }: NotificationButtonProps) {
  const { colors, isDark } = useTheme();
  const BellIcon = getIcon('Bell');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[
          styles.button,
          {
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        <FrostedGlass
          borderRadius={19}
          marginWidth={8}
          scale={20}
          blurDeviation={1.6}
          overlayOpacity={isDark ? 0.10 : 0.22}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.iconWrap}>
          <BellIcon size={18} color={colors.textPrimary} strokeWidth={2.4} />
        </View>
      </TouchableOpacity>

      {unreadCount > 0 && (
        <View style={styles.badge} pointerEvents="none">
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 4,
        }),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  iconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    zIndex: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});

export const NotificationButton = React.memo(NotificationButtonComponent);
