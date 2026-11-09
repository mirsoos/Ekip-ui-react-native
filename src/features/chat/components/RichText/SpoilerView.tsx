import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export interface SpoilerViewProps {
  children: React.ReactNode;
  initialRevealed?: boolean;
  onReveal?: () => void;
  isMe?: boolean;
  isInline?: boolean;
  style?: any;
}

const STATIC_PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  top: `${((i * 17) % 80) + 10}%`,
  left: `${((i * 23) % 85) + 5}%`,
  opacity: 0.3 + (i % 5) * 0.15,
}));

export const SpoilerView = React.memo(function SpoilerView({
  children,
  initialRevealed = false,
  onReveal,
  isMe = false,
  isInline = false,
  style,
}: SpoilerViewProps) {
  const [isRevealed, setIsRevealed] = useState(initialRevealed);

  // Animated shimmer and dissolve
  const maskOpacity = useSharedValue(initialRevealed ? 0 : 1);
  const shimmerTranslate = useSharedValue(0);

  useEffect(() => {
    if (!isRevealed) {
      shimmerTranslate.value = withRepeat(
        withSequence(withTiming(1, { duration: 1400 }), withTiming(0, { duration: 1400 })),
        -1,
        true
      );
    } else {
      cancelAnimation(shimmerTranslate);
      cancelAnimation(maskOpacity);
    }

    return () => {
      cancelAnimation(shimmerTranslate);
      cancelAnimation(maskOpacity);
    };
  }, [isRevealed, shimmerTranslate, maskOpacity]);

  const handlePress = useCallback(() => {
    if (isRevealed) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    maskOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        cancelAnimation(shimmerTranslate);
        runOnJS(setIsRevealed)(true);
        if (onReveal) {
          runOnJS(onReveal)();
        }
      }
    });
  }, [isRevealed, maskOpacity, shimmerTranslate, onReveal]);

  const maskAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: maskOpacity.value,
    };
  });

  const shimmerAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: 0.4 + shimmerTranslate.value * 0.4,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.container,
          isInline ? styles.inlineContainer : null,
          style,
        ]}
      >
        {/* Actual Content */}
        <View style={[styles.contentWrapper, !isRevealed && styles.contentHidden]}>
          {children}
        </View>

        {/* Telegram-style Particle-dust / Shimmer Overlay */}
        {!isRevealed && (
          <Animated.View
            style={[
              styles.maskOverlay,
              { backgroundColor: isMe ? 'rgba(3, 105, 161, 0.92)' : 'rgba(30, 41, 59, 0.95)' },
              maskAnimStyle,
            ]}
          >
            {/* Procedural Particle Dust Dots */}
            <View style={styles.dustContainer}>
              {STATIC_PARTICLES.map((p) => (
                <View
                  key={p.id}
                  style={[
                    styles.dustParticle,
                    {
                      top: p.top as any,
                      left: p.left as any,
                      opacity: p.opacity,
                    },
                  ]}
                />
              ))}
            </View>

            <Animated.View
              style={[
                styles.shimmerEffect,
                { backgroundColor: isMe ? 'rgba(255, 255, 255, 0.15)' : 'rgba(56, 189, 248, 0.18)' },
                shimmerAnimStyle,
              ]}
            />
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  inlineContainer: {
    alignSelf: undefined,
  },
  contentWrapper: {
    opacity: 1,
  },
  contentHidden: {
    // When concealed, prevent text selection while keeping intrinsic layout sizing
    opacity: 0.05,
  },
  maskOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dustContainer: {
    ...StyleSheet.absoluteFill,
  },
  dustParticle: {
    position: 'absolute',
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#ffffff',
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFill,
  },
});
