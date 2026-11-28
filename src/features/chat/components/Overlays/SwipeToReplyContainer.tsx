import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
  type SharedValue,
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

const SwipeReplyIcon = React.memo(function SwipeReplyIcon({
  translateX,
}: {
  translateX: SharedValue<number>;
}) {
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
    <View style={styles.iconTray} pointerEvents="none">
      <Animated.View style={[styles.replyIconCircle, animatedIconStyle]}>
        <CornerUpLeft size={16} color="#ffffff" strokeWidth={2.4} />
      </Animated.View>
    </View>
  );
});

export const SwipeToReplyContainer = React.memo(function SwipeToReplyContainer({
  message,
  onReply,
  children,
  enabled = true,
}: SwipeToReplyContainerProps) {
  const translateX = useSharedValue(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const isMountedRef = useRef(true);
  const messageRef = useRef(message);
  messageRef.current = message;
  const onReplyRef = useRef(onReply);
  onReplyRef.current = onReply;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelAnimation(translateX);
    };
  }, [translateX]);

  // Reset shared value cleanly when FlashList recycles cell for a different message
  useEffect(() => {
    cancelAnimation(translateX);
    translateX.value = 0;
    setIsSwiping(false);
  }, [message.id, translateX]);

  const triggerHaptic = useCallback(() => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleReplyRelease = useCallback(() => {
    onReplyRef.current(messageRef.current);
  }, []);

  const showIcon = useCallback(() => {
    if (isMountedRef.current) setIsSwiping(true);
  }, []);

  const hideIcon = useCallback(() => {
    if (isMountedRef.current) setIsSwiping(false);
  }, []);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enabled)
      .activeOffsetX([-15, 15])
      .failOffsetY([-8, 8])
      .onStart(() => {
        'worklet';
        runOnJS(showIcon)();
      })
      .onUpdate((event) => {
        'worklet';
        // Telegram style: swiping leftwards triggers reply
        const rawX = -event.translationX;
        const prevSwiped = -translateX.value;
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
          if (rawX >= SWIPE_THRESHOLD && prevSwiped < SWIPE_THRESHOLD) {
            runOnJS(triggerHaptic)();
          }
        } else {
          translateX.value = 0;
        }
      })
      .onEnd(() => {
        'worklet';
        const shouldReply = -translateX.value >= SWIPE_THRESHOLD;
        if (shouldReply) {
          runOnJS(handleReplyRelease)();
        }
        translateX.value = withTiming(
          0,
          {
            duration: 180,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          (finished) => {
            if (finished) {
              runOnJS(hideIcon)();
            }
          }
        );
      })
      .onFinalize((_evt, success) => {
        'worklet';
        if (!success) {
          translateX.value = withTiming(
            0,
            {
              duration: 150,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            },
            (finished) => {
              if (finished) {
                runOnJS(hideIcon)();
              }
            }
          );
        }
      });
  }, [enabled, translateX, triggerHaptic, handleReplyRelease, showIcon, hideIcon]);

  const animatedRowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Reply Action Icon revealed behind the swiped bubble only while swiping */}
      {isSwiping && <SwipeReplyIcon translateX={translateX} />}

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
