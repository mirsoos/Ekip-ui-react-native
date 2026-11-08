import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export interface ParticleBurstProps {
  emoji: string;
  x?: number;
  y?: number;
  count?: number;
  onComplete?: () => void;
}

interface ParticleConfig {
  angle: number;
  distance: number;
  scale: number;
  delay: number;
  duration: number;
}

function SingleParticle({
  emoji,
  config,
  onFinish,
  isLast,
}: {
  emoji: string;
  config: ParticleConfig;
  onFinish?: () => void;
  isLast: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withTiming(
        1,
        {
          duration: config.duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (finished) => {
          if (finished && isLast && onFinish) {
            runOnJS(onFinish)();
          }
        }
      )
    );
  }, [config, isLast, onFinish, progress]);

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    const p = progress.value;
    const distance = config.distance * p;
    // Calculate radial explosion path + gravity drop
    const tx = Math.cos(config.angle) * distance;
    const ty = Math.sin(config.angle) * distance + p * p * 25; // gravity arc
    const scale = config.scale * (1 - p * 0.4);
    const opacity = 1 - p;

    return {
      opacity,
      transform: [
        { translateX: tx },
        { translateY: ty },
        { scale },
        { rotate: `${p * 180}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.particle, animStyle]}>
      <Text style={styles.particleEmoji}>{emoji}</Text>
    </Animated.View>
  );
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ParticleBurst = React.memo(function ParticleBurst({
  emoji,
  x = 0,
  y = 0,
  count = 10,
  onComplete,
}: ParticleBurstProps) {
  const particles = useMemo<ParticleConfig[]>(() => {
    const list: ParticleConfig[] = [];
    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 4 + 1);
      const r2 = pseudoRandom(i * 4 + 2);
      const r3 = pseudoRandom(i * 4 + 3);
      const r4 = pseudoRandom(i * 4 + 4);

      const angle = (i / count) * 2 * Math.PI + (r1 - 0.5) * 0.5;
      const distance = 40 + r2 * 55;
      const scale = 0.8 + r3 * 0.5;
      const delay = r4 * 60;
      const duration = 500 + r1 * 250;
      list.push({ angle, distance, scale, delay, duration });
    }
    return list;
  }, [count]);

  return (
    <View
      style={[
        styles.burstContainer,
        { left: x, top: y },
      ]}
      pointerEvents="none"
    >
      {particles.map((config, index) => (
        <SingleParticle
          key={index}
          emoji={emoji}
          config={config}
          isLast={index === particles.length - 1}
          onFinish={onComplete}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  burstContainer: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
    left: -12,
    top: -12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleEmoji: {
    fontSize: 18,
  },
});
