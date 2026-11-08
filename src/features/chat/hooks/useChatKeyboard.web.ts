import { useEffect, useState, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

export interface ChatKeyboardState {
  keyboardHeight: SharedValue<number>;
  keyboardProgress: SharedValue<number>;
  containerAnimatedStyle: any;
  listAnimatedStyle: any;
  inputContainerAnimatedStyle: any;
  bottomInsetAnimatedStyle: any;
  dismissKeyboard: () => void;
  isKeyboardVisible: boolean;
}

export function useChatKeyboard(bottomInset: number = 0): ChatKeyboardState {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const webKeyboardHeight = useSharedValue(0);
  const webKeyboardProgress = useSharedValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const diff = Math.max(0, windowHeight - viewportHeight);

      const isVisible = diff > 80;
      setIsKeyboardVisible(isVisible);

      webKeyboardHeight.value = withTiming(-diff, {
        duration: 180,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      webKeyboardProgress.value = withTiming(isVisible ? 1 : 0, {
        duration: 180,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    };

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleViewportChange);
      viewport.addEventListener('scroll', handleViewportChange);
    }
    window.addEventListener('resize', handleViewportChange);

    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', handleViewportChange);
        viewport.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [webKeyboardHeight, webKeyboardProgress]);

  const dismissKeyboard = useCallback(() => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {};
  });

  const listAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const kbHeight = Math.max(0, -webKeyboardHeight.value);
    const effectiveLift = Math.max(0, kbHeight - bottomInset);
    return {
      paddingBottom: effectiveLift,
    };
  });

  const inputContainerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const kbHeight = Math.max(0, -webKeyboardHeight.value);
    const effectiveLift = Math.max(0, kbHeight - bottomInset);
    return {
      transform: [{ translateY: -effectiveLift }],
    };
  });

  const bottomInsetAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      height: 0,
    };
  });

  return {
    keyboardHeight: webKeyboardHeight,
    keyboardProgress: webKeyboardProgress,
    containerAnimatedStyle,
    listAnimatedStyle,
    inputContainerAnimatedStyle,
    bottomInsetAnimatedStyle,
    dismissKeyboard,
    isKeyboardVisible,
  };
}
