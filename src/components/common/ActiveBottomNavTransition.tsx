import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export const ActiveBottomNavTransition = React.memo(function ActiveBottomNavTransition({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(show ? 1 : 0)).current;
  const wasShown = useRef(show);

  useEffect(() => {
    if (show !== wasShown.current) {
      anim.stopAnimation();
      Animated.timing(anim, {
        toValue: show ? 1 : 0,
        duration: 280,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
    wasShown.current = show;
  }, [show, anim]);

  useEffect(() => {
    return () => {
      anim.stopAnimation();
    };
  }, [anim]);

  const translateY = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [60, 0],
      }),
    [anim]
  );

  return (
    <Animated.View
      pointerEvents={show ? 'box-none' : 'none'}
      renderToHardwareTextureAndroid
      style={{
        opacity: anim,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
});
