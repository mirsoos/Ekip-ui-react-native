// --- START OF FILE SwipeNavigationContainer.tsx ---

import React, { useRef, type ReactNode } from 'react';
import {
  PanResponder,
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  Platform,
  type GestureResponderEvent,
  type PanResponderGestureState,
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

const SWIPE_VELOCITY_THRESHOLD = 0.65;
const SWIPE_DISTANCE_THRESHOLD = 110;
const SWIPE_ACTIVATION_THRESHOLD = 45;

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
      // هرگز تاچ را در فاز شروع تسخیر نکن تا کلیک‌ها و شروع اسکرول دکمه‌ها و تب‌ها کاملاً آزاد باشند
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // در فاز Move، هیچوقت به صورت تصادفی مانع تاچ تب‌ها یا فیلدها نشو
      onMoveShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gs: PanResponderGestureState) => {
        const { dx, dy } = gs;
        const currentProps = propsRef.current;

        const hasAnyNavigationAction =
          currentProps.canGoBack ||
          currentProps.canSwipeLeftTab ||
          currentProps.canSwipeRightTab;

        if (!hasAnyNavigationAction) return false;

        // نیاز به حرکت صریح‌تر و مسافت بیشتر برای شروع جابجایی صفحه
        const isHorizontalIntent =
          Math.abs(dx) > SWIPE_ACTIVATION_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 3;

        if (!isHorizontalIntent) return false;

        if (dx > 0 && (currentProps.canGoBack || currentProps.canSwipeRightTab)) {
          return true;
        }

        if (dx < 0 && currentProps.canSwipeLeftTab) {
          return true;
        }

        return false;
      },

      onPanResponderGrant: () => {
        isSwiping.current = true;
      },

      onPanResponderMove: (_, gs: PanResponderGestureState) => {
        if (!isSwiping.current) return;
        const { dx } = gs;
        // مقاومت فیزیکی مهار شده
        panX.setValue(dx * 0.4);
      },

      onPanResponderRelease: (_, gs: PanResponderGestureState) => {
        if (!isSwiping.current) return;
        isSwiping.current = false;

        const { dx, vx } = gs;
        const currentProps = propsRef.current;

        const isQuickFlick = Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD;
        const isDeepSwipe = Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD;

        // کشیدن به سمت راست
        if (dx > 0 && (isDeepSwipe || (dx > 65 && isQuickFlick))) {
          if (currentProps.canGoBack) {
            currentProps.onGoBack();
          } else if (currentProps.canSwipeRightTab && currentProps.onSwipePrevTab) {
            currentProps.onSwipePrevTab();
          }
        }
        // کشیدن به سمت چپ
        else if (dx < 0 && (isDeepSwipe || (dx < -65 && isQuickFlick))) {
          if (currentProps.canSwipeLeftTab && currentProps.onSwipeNextTab) {
            currentProps.onSwipeNextTab();
          }
        }

        Animated.spring(panX, {
          toValue: 0,
          tension: 110,
          friction: 10,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      },

      onPanResponderTerminate: () => {
        isSwiping.current = false;
        Animated.spring(panX, {
          toValue: 0,
          tension: 110,
          friction: 10,
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
