// --- START OF FILE ScreenTransition.tsx ---

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { View, Platform, Animated, type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { animationDurations, animationEasings } from '../../lib/theme/animations';

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string;
  style?: StyleProp<ViewStyle>;
  disableAnimation?: boolean;
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const TRANSITION_DURATION = animationDurations.sceneEntrance;

export const ScreenTransition = React.memo(function ScreenTransition({
  children,
  screenKey,
  style,
  disableAnimation = false,
}: ScreenTransitionProps) {
  const [anim] = useState(() => new Animated.Value(1));
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (disableAnimation) {
      anim.setValue(1);
      return;
    }

    anim.stopAnimation();
    anim.setValue(0);
    const timing = Animated.timing(anim, {
      toValue: 1,
      duration: TRANSITION_DURATION,
      easing: animationEasings.smoothDecelerate,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    timing.start();

    return () => {
      timing.stop();
    };
  }, [screenKey, anim, disableAnimation]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 0],
  });

  if (disableAnimation) {
    return (
      <View style={[styles.container, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
