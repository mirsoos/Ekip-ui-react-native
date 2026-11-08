import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Mic, UploadCloud } from 'lucide-react-native';
import type { TypingAction } from '../../types/chat.types';

export interface TypingIndicatorProps {
  action?: TypingAction;
  authorName?: string;
}

function BouncingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 320, easing: Easing.bezier(0.33, 1, 0.68, 1) }),
          withTiming(0, { duration: 320, easing: Easing.bezier(0.32, 0, 0.67, 0) })
        ),
        -1,
        false
      )
    );
  }, [delay, translateY]);

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
}

export const TypingIndicator = React.memo(function TypingIndicator({
  action = 'typing',
  authorName,
}: TypingIndicatorProps) {
  const getActionText = () => {
    const prefix = authorName ? `${authorName} is ` : '';
    switch (action) {
      case 'recording_voice':
        return `${prefix}recording voice...`;
      case 'uploading_media':
        return `${prefix}uploading media...`;
      case 'typing':
      default:
        return `${prefix}typing...`;
    }
  };

  return (
    <View style={styles.bubble}>
      {action === 'recording_voice' && (
        <Mic size={14} color="#ef4444" style={styles.actionIcon} />
      )}
      {action === 'uploading_media' && (
        <UploadCloud size={14} color="#38bdf8" style={styles.actionIcon} />
      )}

      {/* Jumping 3-dot animation */}
      <View style={styles.dotsContainer}>
        <BouncingDot delay={0} />
        <BouncingDot delay={160} />
        <BouncingDot delay={320} />
      </View>

      <Text style={styles.actionText}>{getActionText()}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionIcon: {
    marginRight: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 12,
    paddingHorizontal: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  actionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
