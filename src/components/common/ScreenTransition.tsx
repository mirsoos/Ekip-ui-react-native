// --- START OF FILE ScreenTransition.tsx ---

import React, { useEffect, useRef, type ReactNode } from 'react';
import { View, Platform, Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string;
  style?: StyleProp<ViewStyle>;
  disableAnimation?: boolean;
}

export const ScreenTransition = React.memo(function ScreenTransition({
  children,
  screenKey,
  style,
  disableAnimation = false,
}: ScreenTransitionProps) {
  const anim = useRef(new Animated.Value(1)).current;
  const webDivRef = useRef<HTMLDivElement>(null);
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

    if (Platform.OS === 'web') {
      if (webDivRef.current) {
        webDivRef.current.classList.remove('screen-enter-items');
        void webDivRef.current.offsetWidth;
        webDivRef.current.classList.add('screen-enter-items');
      }
    } else {
      anim.stopAnimation();
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [screenKey, anim, disableAnimation]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  if (disableAnimation) {
    return (
      <View style={[{ flex: 1, width: '100%', height: '100%' }, style]}>
        {children}
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[{ flex: 1, width: '100%', height: '100%' }, style]}>
        <div
          ref={webDivRef}
          className="screen-enter-items"
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {children}
        </div>
      </View>
    );
  }

  return (
    <Animated.View
      renderToHardwareTextureAndroid
      style={[
        {
          flex: 1,
          width: '100%',
          height: '100%',
          opacity: anim,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
});
