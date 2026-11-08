import { useEffect, useState, useCallback } from 'react';
import { Platform, Keyboard } from 'react-native';
import {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import {
  useReanimatedKeyboardAnimation,
  KeyboardController,
} from 'react-native-keyboard-controller';

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
  const { height, progress } = useReanimatedKeyboardAnimation();

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const dismissKeyboard = useCallback(() => {
    try {
      KeyboardController.dismiss();
    } catch {
      Keyboard.dismiss();
    }
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {};
  });

  const listAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const kbHeight = Math.max(0, -height.value);
    const effectiveLift = Math.max(0, kbHeight - bottomInset);
    return {
      paddingBottom: effectiveLift,
    };
  });

  const inputContainerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const kbHeight = Math.max(0, -height.value);
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
    keyboardHeight: height,
    keyboardProgress: progress,
    containerAnimatedStyle,
    listAnimatedStyle,
    inputContainerAnimatedStyle,
    bottomInsetAnimatedStyle,
    dismissKeyboard,
    isKeyboardVisible,
  };
}
