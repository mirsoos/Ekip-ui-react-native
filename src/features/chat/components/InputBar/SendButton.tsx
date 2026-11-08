import React from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Send } from 'lucide-react-native';

interface SendButtonProps {
  onPress: () => void;
  disabled?: boolean;
  accentColor?: string;
}

export const SendButton = React.memo(function SendButton({
  onPress,
  disabled = false,
}: SendButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.94, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // safe fallback
      }
    }
    onPress();
  };

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.45 : 1,
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.touchArea}
      disabled={disabled}
    >
      <Animated.View style={[styles.button, animStyle]}>
        <LinearGradient
          colors={['#f472b6', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sendGrad}
        >
          <Send
            size={18}
            color="#ffffff"
            strokeWidth={2.4}
            style={styles.icon}
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  touchArea: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendGrad: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: 2,
  },
});
