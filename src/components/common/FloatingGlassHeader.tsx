// --- START OF FILE FloatingGlassHeader.tsx ---

import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassBackButton, FrostedGlass } from '../glass';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';
import { animationDurations } from '../../lib/theme/animations';

export interface FloatingGlassHeaderProps {
  /** Optional title */
  title?: string;
  /** Optional subtitle or status description */
  subtitle?: string;
  /** If provided, renders authentic GlassBackButton */
  onBack?: () => void;
  /** Leading element (e.g. Avatar, gradient icon badge) */
  leading?: ReactNode;
  /** Custom middle content (replaces title/subtitle, e.g. StepProgressBar) */
  children?: ReactNode;
  /** Trailing actions (e.g. More menu, AI button, etc.) */
  trailing?: ReactNode;
  /** Outer container style override */
  style?: StyleProp<ViewStyle>;
  /** Floating pill bar style override */
  pillStyle?: StyleProp<ViewStyle>;
  /** Enables smooth drop-in entrance animation (default: false when wrapped by ActiveHeaderTransition, or true standalone) */
  animated?: boolean;
}

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const ENTRANCE_DURATION = animationDurations.headerEntrance;

export function FloatingGlassHeaderComponent({
  title,
  subtitle,
  onBack,
  leading,
  children,
  trailing,
  style,
  pillStyle,
  animated = false,
}: FloatingGlassHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const [anim] = useState(() => new Animated.Value(animated ? 0 : 1));

  useEffect(() => {
    if (!animated) return;
    anim.setValue(0);
    const timing = Animated.timing(anim, {
      toValue: 1,
      duration: ENTRANCE_DURATION,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    timing.start();

    return () => {
      timing.stop();
      anim.stopAnimation();
    };
  }, [animated, anim]);

  const translateY = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 0],
      }),
    [anim]
  );

  const headerContent = (
    <View
      renderToHardwareTextureAndroid={true}
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          borderColor: colors.glassBorderStrong,
        },
        pillStyle,
      ]}
    >
      {/* 360° Frosted Glass (Layered RGBA Standard) */}
      <FrostedGlass
        borderRadius={28}
        marginWidth={14}
        scale={28}
        blurDeviation={2.0}
        overlayOpacity={isDark ? 0.08 : 0.15}
        style={StyleSheet.absoluteFill}
      />

      {onBack && (
        <GlassBackButton onPress={onBack} />
      )}

      {leading && (
        <View style={{ zIndex: 10 }}>
          {leading}
        </View>
      )}

      {children ? (
        <View style={{ flex: 1, zIndex: 10 }}>
          {children}
        </View>
      ) : title ? (
        <View style={{ flex: 1, zIndex: 10, justifyContent: 'center' }}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[
                styles.status,
                {
                  color: colors.textTertiary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {trailing && (
        <View style={{ zIndex: 10 }}>
          {trailing}
        </View>
      )}
    </View>
  );

  if (animated) {
    return (
      <Animated.View
        pointerEvents="box-none"
        renderToHardwareTextureAndroid
        style={[
          styles.outerContainer,
          {
            paddingTop: getHeaderTopInset(insets.top),
            opacity: anim,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        {headerContent}
      </Animated.View>
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.outerContainer,
        {
          paddingTop: getHeaderTopInset(insets.top),
        },
        style,
      ]}
    >
      {headerContent}
    </View>
  );
}

export const FloatingGlassHeader = React.memo(FloatingGlassHeaderComponent);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: HEADER_METRICS.marginHorizontal,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: HEADER_METRICS.pillHeight,
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: HEADER_METRICS.paddingVertical,
    paddingHorizontal: HEADER_METRICS.paddingHorizontal,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    overflow: 'visible',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    marginTop: 2,
  },
});
