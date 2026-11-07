// --- START OF FILE SwipeNavigationContainer.tsx ---

import React, { useRef, useState, useMemo, type ReactNode } from 'react';
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

export interface SwipeNavigationContainerProps {
  children: ReactNode;
  canGoBack: boolean;
  onGoBack: () => void;
  canSwipeLeftTab?: boolean;
  canSwipeRightTab?: boolean;
  onSwipeNextTab?: () => void;
  onSwipePrevTab?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// استانداردهای دقیق تعامل لمسی موبایل
const EDGE_SWIPE_MARGIN = 40; // سوایپ به عقب فقط از ۴۰ پیکسل لبه چپ شروع می‌شود
const EDGE_ACTIVATION_THRESHOLD = 20; // مسافت لازم برای قفل شدن حرکت لبه
const TAB_ACTIVATION_THRESHOLD = 32; // مسافت لازم برای شروع سوایپ بین تب‌ها
const SWIPE_COMPLETE_DISTANCE = 110; // مسافت لازم برای ثبت تغییر تب یا بازگشت
const FLICK_VELOCITY_THRESHOLD = 0.8; // سرعت لازم برای ژست سریع (Flick)

type ActiveGesture = 'none' | 'back' | 'tab';

export const SwipeNavigationContainer = React.memo(function SwipeNavigationContainer({
  children,
  canGoBack,
  onGoBack,
  canSwipeLeftTab = false,
  canSwipeRightTab = false,
  onSwipeNextTab,
  onSwipePrevTab,
  disabled = false,
  style,
}: SwipeNavigationContainerProps) {
  const [panX] = useState(() => new Animated.Value(0));
  const activeGesture = useRef<ActiveGesture>('none');
  const pendingGesture = useRef<ActiveGesture>('none');

  const propsRef = useRef({
    canGoBack,
    onGoBack,
    canSwipeLeftTab,
    canSwipeRightTab,
    onSwipeNextTab,
    onSwipePrevTab,
    disabled,
  });

  propsRef.current = {
    canGoBack,
    onGoBack,
    canSwipeLeftTab,
    canSwipeRightTab,
    onSwipeNextTab,
    onSwipePrevTab,
    disabled,
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // هرگز تاچ را در ابتدا تسخیر نکن تا کلیک روی دکمه‌ها و اسکرول عمودی بدون تاخیر عمل کنند
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: () => false,

        onMoveShouldSetPanResponder: (e: GestureResponderEvent, gs: PanResponderGestureState) => {
          const currentProps = propsRef.current;
          if (currentProps.disabled) return false;

          // روی وب با ماوس درگ انجام نشود تا مانع انتخاب متن نشود
          if (Platform.OS === 'web') {
            const nativeEv = e.nativeEvent as any;
            if (
              nativeEv?.pointerType === 'mouse' ||
              (nativeEv?.touches === undefined && nativeEv?.type?.startsWith('mouse'))
            ) {
              return false;
            }
          }

          const { dx, dy, x0 } = gs;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          // ۱. سوایپ به عقب (تنها زمانی که canGoBack فعال است و لمس از لبه چپ شروع شده باشد)
          if (currentProps.canGoBack) {
            // اگر لمس از وسط یا راست صفحه شروع شده باشد، هرگز ژست بک فعال نمی‌شود
            if (x0 > EDGE_SWIPE_MARGIN) {
              return false;
            }

            // حرکت باید به سمت راست و افقی باشد
            if (dx > EDGE_ACTIVATION_THRESHOLD && dx > absDy * 2) {
              pendingGesture.current = 'back';
              return true;
            }

            return false;
          }

          // ۲. سوایپ بین تب‌ها (تنها در صفحات اصلی و زمانی که canGoBack خاموش است)
          const hasTabNavigation =
            currentProps.canSwipeLeftTab || currentProps.canSwipeRightTab;

          if (!hasTabNavigation) return false;

          // اگر اسکرول عمودی در جریان باشد دست نزن
          if (absDy > 14 && absDy > absDx) {
            return false;
          }

          // نیاز به حرکت افقی مشخص
          if (absDx < TAB_ACTIVATION_THRESHOLD || absDx <= absDy * 2.5) {
            return false;
          }

          // حرکت به چپ برای رفتن به تب بعدی
          if (dx < 0 && currentProps.canSwipeLeftTab) {
            pendingGesture.current = 'tab';
            return true;
          }

          // حرکت به راست برای رفتن به تب قبلی
          if (dx > 0 && currentProps.canSwipeRightTab) {
            pendingGesture.current = 'tab';
            return true;
          }

          return false;
        },

        onPanResponderGrant: () => {
          activeGesture.current = pendingGesture.current;
          panX.setValue(0);
        },

        onPanResponderMove: (_, gs: PanResponderGestureState) => {
          const gesture = activeGesture.current;
          if (gesture === 'none') return;

          const { dx } = gs;

          if (gesture === 'back') {
            // حرکت به سمت راست با لمس انگشت هماهنگ است
            panX.setValue(Math.max(0, dx));
          } else if (gesture === 'tab') {
            // مقاومت فیزیکی مهار شده برای جابجایی تب
            panX.setValue(dx * 0.35);
          }
        },

        onPanResponderRelease: (_, gs: PanResponderGestureState) => {
          const gesture = activeGesture.current;
          activeGesture.current = 'none';
          pendingGesture.current = 'none';

          const { dx, vx } = gs;
          const currentProps = propsRef.current;
          const absDx = Math.abs(dx);
          const absVx = Math.abs(vx);

          const isFlick = absVx > FLICK_VELOCITY_THRESHOLD && absDx > 55;
          const isDeepSwipe = absDx > SWIPE_COMPLETE_DISTANCE;

          if (gesture === 'back') {
            if (dx > 0 && (isDeepSwipe || isFlick)) {
              currentProps.onGoBack();
            }
          } else if (gesture === 'tab') {
            if (dx < 0 && (isDeepSwipe || isFlick) && currentProps.canSwipeLeftTab) {
              currentProps.onSwipeNextTab?.();
            } else if (dx > 0 && (isDeepSwipe || isFlick) && currentProps.canSwipeRightTab) {
              currentProps.onSwipePrevTab?.();
            }
          }

          Animated.spring(panX, {
            toValue: 0,
            tension: 120,
            friction: 10,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        },

        onPanResponderTerminate: () => {
          activeGesture.current = 'none';
          pendingGesture.current = 'none';
          Animated.spring(panX, {
            toValue: 0,
            tension: 120,
            friction: 10,
            useNativeDriver: Platform.OS !== 'web',
          }).start();
        },
      }),
    [panX]
  );

  return (
    <Animated.View
      {...(disabled ? {} : panResponder.panHandlers)}
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
  },
});
