import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function AIHeader({ onBack }: { onBack: () => void }) {
  const { colors, isDark } = useTheme();
  const Sparkles = getIcon('Sparkles');

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

        <GlassBackButton onPress={onBack} style={{ marginRight: 10, zIndex: 10 }} />

        <View style={[styles.aiAvatar, { borderColor: colors.glassBorderStrong }]}>
          <LinearGradient
            colors={['#8b5cf6', '#ec4899']}
            style={styles.aiAvatarGrad}
          >
            <Sparkles size={18} color="#ffffff" strokeWidth={2.4} />
          </LinearGradient>
        </View>

        <View style={{ flex: 1, marginLeft: 10, zIndex: 10 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            Command AI
          </Text>
          <Text style={[styles.status, { color: colors.textTertiary }]} numberOfLines={1}>
            Tactical Intelligence & Dispatch
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 10,
  },
  aiAvatarGrad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    fontSize: 11,
    marginTop: 1,
  },
});
