import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ScrollToBottomButtonProps {
  visible: boolean;
  onPress: () => void;
  unreadCount?: number;
}

export const ScrollToBottomButton = React.memo(function ScrollToBottomButton({
  visible,
  onPress,
  unreadCount = 0,
}: ScrollToBottomButtonProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) });
      opacity.value = withTiming(1, { duration: 150 });
    } else {
      scale.value = withTiming(0, { duration: 140, easing: Easing.out(Easing.quad) });
      opacity.value = withTiming(0, { duration: 140 });
    }
  }, [visible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // fallback
      }
    }
    onPress();
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.floatingContainer, animatedStyle]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Scroll to bottom"
      >
        <ChevronDown size={22} color="#f8fafc" strokeWidth={2.4} />

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    right: 16,
    bottom: 74,
    zIndex: 99,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -4,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0f172a',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
