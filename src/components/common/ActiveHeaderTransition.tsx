import React, { useEffect, useRef } from 'react';
import { StyleSheet, Platform, Animated, Easing } from 'react-native';
import { animationDurations } from '../../lib/theme';

export const ActiveHeaderTransition = React.memo(function ActiveHeaderTransition({
  screenKey,
  children,
}: {
  screenKey?: string;
  children: React.ReactNode;
}) {
  const isConversation = screenKey?.startsWith('conversation');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isConversation) {
      anim.setValue(1);
      return;
    }
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: animationDurations.headerEntrance,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [screenKey, anim, isConversation]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-36, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      renderToHardwareTextureAndroid
      style={[
        styles.headerOverlayWrapper,
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
  headerOverlayWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});
