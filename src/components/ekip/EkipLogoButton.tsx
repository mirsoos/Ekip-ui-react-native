import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Animated,
  Easing,
} from 'react-native';

const TOP_SVG = Platform.OS === 'web' ? '/top-logo.svg' : require('../../../assets/top-logo.svg');
const MID_SVG = Platform.OS === 'web' ? '/mid-logo.svg' : require('../../../assets/mid-logo.svg');
const BOT_SVG = Platform.OS === 'web' ? '/bot-logo.svg' : require('../../../assets/bot-logo.svg');

export interface EkipLogoButtonProps {
  active: boolean;
  onPress: () => void;
  size?: number;
}

export function EkipLogoButton({
  active,
  onPress,
  size = 44,
}: EkipLogoButtonProps) {
  const activeAnim = useRef(new Animated.Value(active ? 1 : 0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const heartbeatLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const floatLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (active) {
      // Transition to active state
      Animated.spring(activeAnim, {
        toValue: 1,
        tension: 130,
        friction: 8,
        useNativeDriver: false,
      }).start();

      // Continuous rhythmic heartbeat pulse behind the logo (Lub-dub rhythm)
      pulseAnim.setValue(0);
      const heartbeatAnimation = Animated.loop(
        Animated.sequence([
          // Beat 1: first thump
          Animated.timing(pulseAnim, {
            toValue: 0.65,
            duration: 160,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.2,
            duration: 120,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          // Beat 2: second stronger thump
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 360,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          // Resting interval between heartbeats
          Animated.delay(650),
        ])
      );
      heartbeatLoopRef.current = heartbeatAnimation;
      heartbeatAnimation.start();

      // Continuous subtle breathing/floating micro-animation on the 3 pieces
      floatAnim.setValue(0);
      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      floatLoopRef.current = floatAnimation;
      floatAnimation.start();
    } else {
      // Stop continuous loops when inactive
      if (heartbeatLoopRef.current) {
        heartbeatLoopRef.current.stop();
        heartbeatLoopRef.current = null;
      }
      if (floatLoopRef.current) {
        floatLoopRef.current.stop();
        floatLoopRef.current = null;
      }

      Animated.parallel([
        Animated.spring(activeAnim, {
          toValue: 0,
          tension: 140,
          friction: 9,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: false,
        }),
        Animated.spring(floatAnim, {
          toValue: 0,
          tension: 140,
          friction: 9,
          useNativeDriver: false,
        }),
      ]).start();
    }

    return () => {
      if (heartbeatLoopRef.current) heartbeatLoopRef.current.stop();
      if (floatLoopRef.current) floatLoopRef.current.stop();
    };
  }, [active]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.90,
      tension: 200,
      friction: 10,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 140,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  // Dimensional ratios derived from updated SVGs:
  // top: 1000 x 270 (hRatio = 0.27)
  // mid: 900 x 270  (wRatio = 0.90, hRatio = 0.27)
  // bot: 1000 x 240 (hRatio = 0.24)
  const pieceHeight = Math.round(size * 0.27);
  const midWidth = Math.round(size * 0.90);
  const botHeight = Math.round(size * 0.24);
  const baseGap = 2;

  // Active vs Inactive base transforms
  const baseScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.05],
  });

  const opacityAnim = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 1],
  });

  // Heartbeat micro-pulse on the logo itself
  const logoHeartbeat = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const combinedScale = Animated.multiply(
    Animated.multiply(baseScale, pressAnim),
    logoHeartbeat
  );

  // Subtle continuous micro-animation on each piece (while active)
  const topTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1.2],
  });

  const midTranslateX = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.4],
  });

  const botTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1.0],
  });

  // Heartbeat pulse behind the logo
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0.88, 1.15, 1.28],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.2, 0.65, 1],
    outputRange: [0, 0.40, 0.25, 0.55],
  });

  const imgStyle = {
    width: size,
    ...(Platform.OS === 'web'
      ? ({
          objectFit: 'contain',
          objectPosition: 'left center',
        } as any)
      : {}),
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.container}
    >
      {/* Heartbeat pulse element behind the logo */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.heartbeatPulse,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* 3-piece SVG logo stack */}
      <Animated.View
        style={[
          styles.logoStack,
          {
            width: size,
            opacity: opacityAnim,
            transform: [{ scale: combinedScale }],
          },
        ]}
      >
        {/* TOP PIECE (Blue Speech Arc) */}
        <Animated.View
          style={{
            width: size,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: baseGap,
            transform: [{ translateY: topTranslateY }],
            zIndex: 3,
          }}
        >
          <Image
            source={typeof TOP_SVG === 'string' ? { uri: TOP_SVG } : TOP_SVG}
            style={[imgStyle, { height: pieceHeight }]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* MID PIECE (Orange Speech Arc - 90% width) */}
        <Animated.View
          style={{
            width: midWidth,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: baseGap,
            transform: [{ translateX: midTranslateX }],
            zIndex: 2,
          }}
        >
          <Image
            source={typeof MID_SVG === 'string' ? { uri: MID_SVG } : MID_SVG}
            style={[
              {
                width: midWidth,
                height: pieceHeight,
                ...(Platform.OS === 'web'
                  ? ({
                      objectFit: 'contain',
                      objectPosition: 'left center',
                    } as any)
                  : {}),
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* BOT PIECE (Green Capsule Foundation) */}
        <Animated.View
          style={{
            width: size,
            height: botHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            transform: [{ translateY: botTranslateY }],
            zIndex: 1,
          }}
        >
          <Image
            source={typeof BOT_SVG === 'string' ? { uri: BOT_SVG } : BOT_SVG}
            style={[imgStyle, { height: botHeight }]}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // @ts-ignore
    outlineStyle: 'none',
  },
  logoStack: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
  },
  heartbeatPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 110, 30, 0.16)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 130, 40, 0.32)',
    zIndex: 1,
    pointerEvents: 'none',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 0 14px rgba(255, 110, 30, 0.22)',
        } as any)
      : {}),
  },
});
