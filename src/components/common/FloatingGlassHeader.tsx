// --- START OF FILE FloatingGlassHeader.tsx ---

import React, { useRef, useEffect, useState, type ReactNode } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassBackButton } from '../Glass';
import { FrostedGlass } from '../FrostedGlass';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';

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

  const [anim] = useState(() => new Animated.Value(0));
  const webDivRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!animated) return;
    if (Platform.OS === 'web') {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      if (webDivRef.current) {
        webDivRef.current.classList.remove('header-enter-items');
        void webDivRef.current.offsetWidth;
        webDivRef.current.classList.add('header-enter-items');
      }
    } else {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [animated, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const headerContent = (
    <View
      renderToHardwareTextureAndroid={true}
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          borderColor: colors.glassBorderStrong,
          ...(Platform.OS === 'web' ? ({ pointerEvents: 'auto' } as any) : {}),
        },
        pillStyle,
      ]}
    >
      {/* 360° Frosted Glass */}
      <FrostedGlass
        borderRadius={36}
        marginWidth={16}
        scale={36}
        blurDeviation={2.0}
        overlayOpacity={isDark ? 0.08 : 0.15}
        style={StyleSheet.absoluteFill}
      />

      {onBack && (
        <GlassBackButton onPress={onBack} style={{ zIndex: 10 }} />
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
      ) : (title !== undefined || subtitle !== undefined) ? (
        <View style={{ flex: 1, zIndex: 10 }}>
          {title ? (
            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text
              style={[
                styles.status,
                {
                  color: colors.textTertiary,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
              numberOfLines={1}
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

  if (Platform.OS === 'web' && animated) {
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
        <div
          ref={webDivRef}
          className="header-enter-items"
          style={{
            width: '100%',
            pointerEvents: 'none',
          }}
        >
          {headerContent}
        </div>
      </View>
    );
  }

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
    borderRadius: 36,
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