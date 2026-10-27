import React, { useEffect, useRef, type ReactNode } from 'react';
import { View, Platform, Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string;
  style?: StyleProp<ViewStyle>;
}

export const ScreenTransition = React.memo(function ScreenTransition({
  children,
  screenKey,
  style,
}: ScreenTransitionProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const webDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (webDivRef.current) {
        webDivRef.current.classList.remove('screen-enter-items');
        void webDivRef.current.offsetWidth; // Force CSS reflow to replay animation without unmounting children
        webDivRef.current.classList.add('screen-enter-items');
      }
    } else {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [screenKey, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

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
