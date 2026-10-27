import React, { useRef, type ReactNode } from 'react';
import {
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

export const SwipeNavigationContainer = React.memo(function SwipeNavigationContainer({
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

  // Keep a ref of latest props so PanResponder always has fresh state without recreation
  const propsRef = useRef({
    canGoBack,
    onGoBack,
    canSwipeLeftTab,
    canSwipeRightTab,
    onSwipeNextTab,
    onSwipePrevTab,
  });

  propsRef.current = {
    canGoBack,
    onGoBack,
    canSwipeLeftTab,
    canSwipeRightTab,
    onSwipeNextTab,
    onSwipePrevTab,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => false,
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const currentProps = propsRef.current;
        // Require horizontal swipe to clearly dominate vertical (2.5x) and exceed 28px threshold
        // Never steal taps or vertical scroll gestures from children
        if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy) * 2.5) {
          if (currentProps.canGoBack && dx > 0) return true;
          if (currentProps.canSwipeLeftTab && dx < 0) return true;
          if (currentProps.canSwipeRightTab && dx > 0) return true;
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
        const currentProps = propsRef.current;

        const threshold = 50;
        const speedThreshold = 0.25;

        // Swiping right (dx > 0): back or prev tab
        if (dx > threshold || (dx > 25 && vx > speedThreshold)) {
          if (currentProps.canGoBack) {
            currentProps.onGoBack();
          } else if (currentProps.canSwipeRightTab && currentProps.onSwipePrevTab) {
            currentProps.onSwipePrevTab();
          }
        }
        // Swiping left (dx < 0): next tab
        else if (dx < -threshold || (dx < -25 && vx < -speedThreshold)) {
          if (currentProps.canSwipeLeftTab && currentProps.onSwipeNextTab) {
            currentProps.onSwipeNextTab();
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...(Platform.OS === 'web'
      ? ({
          userSelect: 'none',
          WebkitUserSelect: 'none',
        } as any)
      : {}),
  },
});
