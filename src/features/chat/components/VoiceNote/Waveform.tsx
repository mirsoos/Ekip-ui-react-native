import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface WaveformProps {
  waveform?: number[];
  progress: number; // 0 to 1
  isMe?: boolean;
  onSeek?: (progress: number) => void;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  height?: number;
  activeColor?: string;
}

export const Waveform = React.memo(function Waveform({
  waveform,
  progress,
  isMe = true,
  onSeek,
  barCount = 28,
  barWidth = 3,
  barGap = 2,
  height = 30,
  activeColor,
}: WaveformProps) {
  const containerWidthRef = useRef<number>(180);
  const containerWidth = useSharedValue<number>(180);
  const isDraggingRef = useRef<boolean>(false);
  const dragProgress = useSharedValue<number>(progress);
  const isScrubbing = useSharedValue<boolean>(false);

  // Sync dragProgress with props when not actively scrubbing
  React.useEffect(() => {
    if (!isDraggingRef.current) {
      dragProgress.value = progress;
    }
  }, [progress, dragProgress]);

  // Compute sampled amplitude bars (fallback to pleasant procedural audio sample if not provided)
  const bars = useMemo(() => {
    if (waveform && waveform.length > 0) {
      if (waveform.length === barCount) return waveform;
      // Resample to barCount
      const resampled: number[] = [];
      const step = waveform.length / barCount;
      for (let i = 0; i < barCount; i++) {
        const idx = Math.min(waveform.length - 1, Math.floor(i * step));
        resampled.push(waveform[idx]);
      }
      return resampled;
    }
    // Procedural voice note amplitude profile
    return Array.from({ length: barCount }, (_, i) => {
      const x = i / barCount;
      const envelope = Math.sin(Math.PI * x);
      const ripple = 0.3 * Math.sin(x * 14) + 0.2 * Math.cos(x * 22);
      const val = Math.max(0.15, Math.min(1, envelope * 0.7 + ripple * 0.3 + 0.1));
      return val;
    });
  }, [waveform, barCount]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w > 0) {
        containerWidthRef.current = w;
        containerWidth.value = w;
      }
    },
    [containerWidth]
  );

  const updateSeekFromPosition = useCallback(
    (locationX: number) => {
      const width = containerWidthRef.current || 180;
      const clampedX = Math.max(0, Math.min(width, locationX));
      const newProgress = clampedX / width;
      dragProgress.value = newProgress;
      onSeek?.(newProgress);
    },
    [dragProgress, onSeek]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          isDraggingRef.current = true;
          isScrubbing.value = true;
          updateSeekFromPosition(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (
          evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          updateSeekFromPosition(evt.nativeEvent.locationX);
        },
        onPanResponderRelease: (
          evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          updateSeekFromPosition(evt.nativeEvent.locationX);
          isDraggingRef.current = false;
          isScrubbing.value = false;
        },
        onPanResponderTerminate: () => {
          isDraggingRef.current = false;
          isScrubbing.value = false;
        },
      }),
    [updateSeekFromPosition, isScrubbing]
  );

  const thumbAnimStyle = useAnimatedStyle(() => {
    'worklet';
    const width = containerWidth.value || 180;
    const x = dragProgress.value * width;
    return {
      transform: [
        { translateX: x - 4 },
        { scale: withTiming(isScrubbing.value ? 1.2 : 1, { duration: 150, easing: Easing.out(Easing.quad) }) },
      ],
      opacity: isScrubbing.value ? 1 : 0.85,
    };
  });

  const resolvedActiveColor = activeColor || (isMe ? '#ffffff' : '#38bdf8');
  const inactiveColor = isMe ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)';

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.barsContainer}>
        {bars.map((amplitude, i) => {
          const barProgress = (i + 0.5) / barCount;
          const isActive = barProgress <= progress;
          const barH = Math.max(4, Math.round(amplitude * height));

          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: barH,
                  marginRight: i === barCount - 1 ? 0 : barGap,
                  backgroundColor: isActive ? resolvedActiveColor : inactiveColor,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Scrubbing Thumb Indicator */}
      <Animated.View
        style={[
          styles.scrubThumb,
          { backgroundColor: isMe ? '#ffffff' : '#38bdf8' },
          thumbAnimStyle,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    minWidth: 140,
    flex: 1,
    position: 'relative',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  bar: {
    borderRadius: 2,
  },
  scrubThumb: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: 8,
    height: 22,
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
    pointerEvents: 'none',
  },
});
