import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function SettingsHeader({
  onBack,
  title,
}: {
  onBack: () => void;
  title?: string;
}) {
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const displayTitle = title ?? t('settings.title');

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: false,
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <GlassBackButton onPress={onBack} style={{ marginRight: 12, zIndex: 10 }} />

        <View style={{ flex: 1, zIndex: 10 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {displayTitle}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
});
