import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';

export interface ChatSearchBarProps {
  visible: boolean;
  query: string;
  onChangeQuery: (text: string) => void;
  currentIndex: number;
  totalMatches: number;
  onNavigateMatch: (direction: 'prev' | 'next') => void;
  onClose: () => void;
  topInset?: number;
}

const EASING_STANDARD = Easing.bezier(0.25, 0.1, 0.25, 1);

export const ChatSearchBar = React.memo(function ChatSearchBar({
  visible,
  query,
  onChangeQuery,
  currentIndex,
  totalMatches,
  onNavigateMatch,
  onClose,
  topInset = 0,
}: ChatSearchBarProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const inputRef = useRef<any>(null);
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.97);
  const [isRendered, setIsRendered] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      translateY.value = withTiming(0, { duration: 260, easing: EASING_STANDARD });
      opacity.value = withTiming(1, { duration: 220, easing: EASING_STANDARD });
      scale.value = withTiming(1, { duration: 260, easing: EASING_STANDARD });
    } else {
      translateY.value = withTiming(-20, { duration: 180, easing: EASING_STANDARD });
      opacity.value = withTiming(0, { duration: 160, easing: EASING_STANDARD });
      scale.value = withTiming(0.97, { duration: 180, easing: EASING_STANDARD });
      inputRef.current?.blur();
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 190);
      return () => clearTimeout(timer);
    }
  }, [visible, translateY, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleClear = useCallback(() => {
    onChangeQuery('');
    inputRef.current?.focus();
  }, [onChangeQuery]);

  const handleNavigate = useCallback(
    (dir: 'prev' | 'next') => {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      onNavigateMatch(dir);
    },
    [onNavigateMatch]
  );

  if (!isRendered && !visible) return null;

  const matchLabel =
    totalMatches > 0
      ? `${currentIndex >= 0 ? currentIndex + 1 : 0} of ${totalMatches}`
      : query.trim()
      ? '0 of 0'
      : '';

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        { top: topInset },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.capsule,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            borderColor: colors.glassBorderStrong,
          },
        ]}
      >
        <Search size={17} color={colors.textSecondary} style={styles.searchIcon} />

        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeQuery}
          placeholder={isRTL ? 'جستجو در گفتگو...' : 'Search in conversation...'}
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
          returnKeyType="search"
          autoCorrect={false}
        />

        {/* Real-time match counter badge */}
        {!!matchLabel && (
          <View style={styles.badgeWrap}>
            <Text style={styles.counterText}>{matchLabel}</Text>
          </View>
        )}

        {/* Clear query button */}
        {!!query && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn} activeOpacity={0.7}>
            <X size={13} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {/* Up / Down match navigation arrows */}
        {totalMatches > 0 && (
          <View style={[styles.navArrowsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              onPress={() => handleNavigate('prev')}
              style={styles.arrowBtn}
              activeOpacity={0.7}
            >
              <ChevronUp size={16} color="#38bdf8" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigate('next')}
              style={styles.arrowBtn}
              activeOpacity={0.7}
            >
              <ChevronDown size={16} color="#38bdf8" />
            </TouchableOpacity>
          </View>
        )}

        {/* Close Search bar */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.cancelText}>{isRTL ? 'انصراف' : 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 895,
  },
  capsule: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(16px)',
      } as any,
    }),
  },
  searchIcon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    height: 38,
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  badgeWrap: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowsRow: {
    alignItems: 'center',
    gap: 2,
  },
  arrowBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cancelText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '500',
  },
});
