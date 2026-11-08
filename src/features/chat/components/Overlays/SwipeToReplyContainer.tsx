import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CornerUpLeft } from 'lucide-react-native';
import type { Message } from '../../types/chat.types';

interface SwipeToReplyContainerProps {
  message: Message;
  onReply: (message: Message) => void;
  children: React.ReactNode;
  enabled?: boolean;
}

const SWIPE_THRESHOLD = 52;
const MAX_SWIPE = 78;

export const SwipeToReplyContainer = React.memo(function SwipeToReplyContainer({
  message,
  onReply,
  children,
  enabled = true,
}: SwipeToReplyContainerProps) {
  const translateX = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // safe fallback
    }
  };

  const handleReplyRelease = (msg: Message) => {
    onReply(msg);
  };

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-15, 15])
    .failOffsetY([-8, 8])
    .onUpdate((event) => {
      'worklet';
      // Restrict swipe: swipe rightwards for left-aligned messages, or leftwards
      // Telegram style: swiping leftwards triggers reply
      const rawX = -event.translationX;
      if (rawX > 0) {
        // Logarithmic / rubber-band resistance beyond threshold
        if (rawX <= SWIPE_THRESHOLD) {
          translateX.value = -rawX;
        } else {
          const excess = rawX - SWIPE_THRESHOLD;
          const damped = excess * 0.28;
          translateX.value = -(SWIPE_THRESHOLD + Math.min(damped, MAX_SWIPE - SWIPE_THRESHOLD));
        }

        // Trigger haptic once precisely upon crossing threshold
        if (rawX >= SWIPE_THRESHOLD && !hasTriggeredHaptic.value) {
          hasTriggeredHaptic.value = true;
          runOnJS(triggerHaptic)();
        } else if (rawX < SWIPE_THRESHOLD && hasTriggeredHaptic.value) {
          hasTriggeredHaptic.value = false;
        }
      } else {
        translateX.value = 0;
      }
    })
    .onEnd(() => {
      'worklet';
      const shouldReply = -translateX.value >= SWIPE_THRESHOLD;
      if (shouldReply) {
        runOnJS(handleReplyRelease)(message);
      }
      hasTriggeredHaptic.value = false;
      translateX.value = withTiming(0, {
        duration: 180,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    });

  const animatedRowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    'worklet';
    const swipeDistance = -translateX.value;
    const scale = interpolate(
      swipeDistance,
      [0, SWIPE_THRESHOLD * 0.4, SWIPE_THRESHOLD],
      [0.2, 0.7, 1.1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      swipeDistance,
      [0, 15, SWIPE_THRESHOLD],
      [0, 0.4, 1],
      Extrapolation.CLAMP
    );
    const rotation = interpolate(
      swipeDistance,
      [0, SWIPE_THRESHOLD],
      [30, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { rotate: `${rotation}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Reply Action Icon revealed behind the swiped bubble */}
      <View style={styles.iconTray} pointerEvents="none">
        <Animated.View style={[styles.replyIconCircle, animatedIconStyle]}>
          <CornerUpLeft size={16} color="#ffffff" strokeWidth={2.4} />
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bubbleWrapper, animatedRowStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  iconTray: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  replyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)' },
      default: {
        shadowColor: '#0284c7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  bubbleWrapper: {
    width: '100%',
    zIndex: 2,
  },
});
