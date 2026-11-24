import React, { useEffect, useRef, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useIsFocused } from 'expo-router';
import { animationDurations, useTheme } from '../../lib/theme';
import { AuroraBackground } from '../AuroraBackground';
import { BOTTOM_NAV_CLEARANCE } from '../../constants/layout';

export interface ScreenLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  includeBottomClearance?: boolean;
  bottomClearance?: number;
  style?: StyleProp<ViewStyle>;
  screenKey?: string;
  disableAnimation?: boolean;
}

export const ScreenLayout = React.memo(function ScreenLayout({
  header,
  children,
  footer,
  includeBottomClearance = false,
  bottomClearance = BOTTOM_NAV_CLEARANCE,
  style,
  screenKey,
  disableAnimation = false,
}: ScreenLayoutProps) {
  const { isDark } = useTheme();
  const isFocused = useIsFocused();
  const contentAnim = useRef(new Animated.Value(disableAnimation ? 1 : 0)).current;
  const headerAnim = useRef(new Animated.Value(disableAnimation ? 1 : 0)).current;

  useEffect(() => {
    if (disableAnimation) {
      contentAnim.setValue(1);
      headerAnim.setValue(1);
      return;
    }

    if (!isFocused) {
      return;
    }

    contentAnim.stopAnimation();
    headerAnim.stopAnimation();

    contentAnim.setValue(0);
    headerAnim.setValue(0);

    const useNative = Platform.OS !== 'web';
    const contentTiming = Animated.timing(contentAnim, {
      toValue: 1,
      duration: animationDurations.sceneEntrance,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: useNative,
    });
    const headerTiming = Animated.timing(headerAnim, {
      toValue: 1,
      duration: animationDurations.headerEntrance,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: useNative,
    });

    contentTiming.start();
    headerTiming.start();

    return () => {
      contentTiming.stop();
      headerTiming.stop();
    };
  }, [isFocused, screenKey, disableAnimation, contentAnim, headerAnim]);

  const contentTranslateY = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 0],
  });

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-36, 0],
  });

  return (
    <View style={[styles.container, style]}>
      <AuroraBackground isDark={isDark} />
      <Animated.View
        style={[
          styles.contentContainer,
          includeBottomClearance && { paddingBottom: bottomClearance },
          {
            opacity: contentAnim,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
      {header && (
        <Animated.View
          pointerEvents="box-none"
          renderToHardwareTextureAndroid
          style={[
            styles.headerOverlayWrapper,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          {header}
        </Animated.View>
      )}
      {footer}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerOverlayWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});
