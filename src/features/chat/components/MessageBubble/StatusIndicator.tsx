import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Clock, Check, AlertCircle } from 'lucide-react-native';
import type { MessageStatus } from '../../types/chat.types';

interface StatusIndicatorProps {
  status: MessageStatus;
  onRetry?: () => void;
  color?: string;
  readColor?: string;
}

export const StatusIndicator = React.memo(function StatusIndicator({
  status,
  onRetry,
  color = 'rgba(255, 255, 255, 0.65)',
  readColor = '#38bdf8',
}: StatusIndicatorProps) {
  const spin = useSharedValue(0);

  useEffect(() => {
    if (status === 'SENDING') {
      spin.value = withRepeat(
        withTiming(360, { duration: 900, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(spin);
      spin.value = 0;
    }

    return () => {
      cancelAnimation(spin);
    };
  }, [status, spin]);

  const spinStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${spin.value}deg` }],
    };
  });

  if (status === 'QUEUED') {
    return (
      <View style={styles.container}>
        <Clock size={11} color={color} strokeWidth={2} />
      </View>
    );
  }

  if (status === 'SENDING') {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.spinnerDot, spinStyle]}>
          <Clock size={11} color={color} strokeWidth={2} />
        </Animated.View>
      </View>
    );
  }

  if (status === 'SENT') {
    return (
      <View style={styles.container}>
        <Check size={13} color={color} strokeWidth={2.2} />
      </View>
    );
  }

  if (status === 'DELIVERED') {
    return (
      <View style={styles.doubleCheckContainer}>
        <Check size={12} color={color} strokeWidth={2.2} style={styles.checkLead} />
        <Check size={12} color={color} strokeWidth={2.2} style={styles.checkFollow} />
      </View>
    );
  }

  if (status === 'READ') {
    return (
      <View style={styles.doubleCheckContainer}>
        <Check size={12} color={readColor} strokeWidth={2.5} style={styles.checkLead} />
        <Check size={12} color={readColor} strokeWidth={2.5} style={styles.checkFollow} />
      </View>
    );
  }

  if (status === 'FAILED') {
    return (
      <TouchableOpacity
        onPress={onRetry}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.retryButton}
      >
        <AlertCircle size={13} color="#ef4444" strokeWidth={2.5} />
      </TouchableOpacity>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3,
  },
  spinnerDot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 3,
    width: 17,
    height: 14,
    position: 'relative',
  },
  checkLead: {
    position: 'absolute',
    left: 0,
  },
  checkFollow: {
    position: 'absolute',
    left: 4.5,
  },
  retryButton: {
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
