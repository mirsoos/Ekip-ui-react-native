import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';

export interface NotificationButtonProps {
  unreadCount: number;
  onPress: () => void;
}

export function NotificationButton({ unreadCount, onPress }: NotificationButtonProps) {
  const { colors } = useTheme();
  const BellIcon = getIcon('Bell');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: colors.glassThickBg,
            borderColor: colors.glassBorder,
          },
        ]}
      >
        <BellIcon size={18} color={colors.textPrimary} strokeWidth={2.4} />
      </TouchableOpacity>

      {unreadCount > 0 && (
        <View style={styles.badge}>
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
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
