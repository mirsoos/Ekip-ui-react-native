import React, { useRef, useState, type ReactNode } from 'react';
import {
  View,
  PanResponder,
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  Platform,
} from 'react-native';

interface SwipeNavigationContainerProps {
  children: ReactNode;
  canGoBack: boolean;
  onGoBack: () => void;
  canSwipeLeftTab?: boolean;
  canSwipeRightTab?: boolean;
  onSwipeNextTab?: () => void;
  onSwipePrevTab?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SwipeNavigationContainer({
  children,
  canGoBack,
  onGoBack,
  canSwipeLeftTab = false,
  canSwipeRightTab = false,
  onSwipeNextTab,
  onSwipePrevTab,
  style,
}: SwipeNavigationContainerProps) {
  const panX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        // Require horizontal movement to dominate vertical by 2x and exceed 12px
        if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.8) {
          if (canGoBack && dx > 0) return true;
          if (canSwipeLeftTab && dx < 0) return true;
          if (canSwipeRightTab && dx > 0) return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        isSwiping.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        // Damped rubber-band resistance
        const dampened = dx * 0.45;
        panX.setValue(dampened);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        isSwiping.current = false;

        const threshold = 70;
        const speedThreshold = 0.35;

        // Swiping right: back or prev tab
        if (dx > threshold || (dx > 30 && vx > speedThreshold)) {
          if (canGoBack) {
            onGoBack();
          } else if (canSwipeRightTab && onSwipePrevTab) {
            onSwipePrevTab();
          }
        }
        // Swiping left: next tab
        else if (dx < -threshold || (dx < -30 && vx < -speedThreshold)) {
          if (canSwipeLeftTab && onSwipeNextTab) {
            onSwipeNextTab();
          }
        }

        // Snap back to 0
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: Platform.OS !== 'web',
          tension: 65,
          friction: 9,
        }).start();
      },
      onPanResponderTerminate: () => {
        isSwiping.current = false;
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        style,
        {
          transform: [{ translateX: panX }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
