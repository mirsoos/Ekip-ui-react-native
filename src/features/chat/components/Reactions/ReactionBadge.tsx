import React, { useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface ReactionBadgeProps {
  emoji: string;
  count: number;
  hasReacted: boolean;
  onPress: (emoji: string) => void;
  isMe?: boolean;
}

export const ReactionBadge = React.memo(function ReactionBadge({
  emoji,
  count,
  hasReacted,
  onPress,
  isMe = false,
}: ReactionBadgeProps) {
  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress(emoji);
  }, [emoji, onPress]);

  return (
    <Animated.View entering={ZoomIn.duration(150)}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[
          styles.badge,
          hasReacted ? styles.badgeActive : styles.badgeInactive,
          isMe && hasReacted && styles.badgeActiveMe,
        ]}
      >
        <Text style={styles.emojiText}>{emoji}</Text>
        {count > 1 && (
          <Text
            style={[
              styles.countText,
              hasReacted && styles.countTextActive,
              isMe && hasReacted && styles.countTextActiveMe,
            ]}
          >
            {count}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
  },
  badgeInactive: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.22)',
    borderColor: '#38bdf8',
  },
  badgeActiveMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: '#ffffff',
  },
  emojiText: {
    fontSize: 13,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    fontVariant: ['tabular-nums'],
  },
  countTextActive: {
    color: '#38bdf8',
  },
  countTextActiveMe: {
    color: '#ffffff',
  },
});
