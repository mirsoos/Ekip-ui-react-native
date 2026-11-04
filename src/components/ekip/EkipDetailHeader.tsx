import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassBackButton } from '../Glass';
import { FrostedGlass } from '../FrostedGlass';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';

export interface EkipDetailHeaderProps {
  coverUrl: string;
  onBack: () => void;
  onShare: () => void;
  onBookmark?: () => void;
}

export function EkipDetailHeader({
  coverUrl,
  onBack,
  onShare,
  onBookmark,
}: EkipDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const buttonTop = getHeaderTopInset(insets.top) + HEADER_METRICS.buttonTopOffset;

  return (
    <View style={[styles.container, Platform.OS !== 'web' && { height: 220 + insets.top }]}>
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: colors.glassThinBg }]} />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.65)']}
        style={styles.gradient}
      />

      {/* Back button with authentic Liquid Glass */}
      <GlassBackButton
        onPress={onBack}
        style={[
          styles.backBtn,
          {
            top: buttonTop,
            left: isRTL ? 'auto' : HEADER_METRICS.buttonOffset,
            right: isRTL ? HEADER_METRICS.buttonOffset : 'auto',
          },
        ]}
      />

      {/* Top right actions with authentic Liquid Glass */}
      <View
        style={[
          styles.rightActions,
          {
            top: buttonTop,
            left: isRTL ? HEADER_METRICS.buttonOffset : 'auto',
            right: isRTL ? 'auto' : HEADER_METRICS.buttonOffset,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onShare}
          style={[
            styles.actionBtn,
            { borderColor: colors.glassBorderStrong },
          ]}
        >
          <FrostedGlass
            borderRadius={21}
            marginWidth={9}
            scale={21}
            blurDeviation={1.6}
            overlayOpacity={isDark ? 0.10 : 0.22}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.iconWrap}>
            <Icons.Share size={20} color={colors.textPrimary} strokeWidth={2.2} />
          </View>
        </TouchableOpacity>

        {onBookmark && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onBookmark}
            style={[
              styles.actionBtn,
              { borderColor: colors.glassBorderStrong },
            ]}
          >
            <FrostedGlass
              borderRadius={21}
              marginWidth={9}
              scale={21}
              blurDeviation={1.6}
              overlayOpacity={isDark ? 0.10 : 0.22}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.iconWrap}>
              <Icons.Bookmark size={20} color={colors.textPrimary} strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 220,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: Platform.OS === 'android' ? 0 : 4,
    overflow: 'hidden',
    position: 'relative',
  },
  iconWrap: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    zIndex: 20,
  },
  rightActions: {
    position: 'absolute',
    top: 16,
    gap: 8,
    zIndex: 20,
  },
});
