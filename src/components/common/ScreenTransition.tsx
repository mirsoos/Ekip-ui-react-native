import React, { useEffect, useRef, type ReactNode } from 'react';
import { View, Platform, Animated, type StyleProp, type ViewStyle } from 'react-native';

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

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [screenKey]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  if (Platform.OS === 'web') {
    return (
      <View style={[{ flex: 1, width: '100%', height: '100%' }, style]}>
        <div
          key={screenKey}
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
      key={screenKey}
      renderToHardwareTextureAndroid={true}
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
