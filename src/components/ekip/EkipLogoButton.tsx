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
  // Main logo transforms
  const logoScaleAnim = useRef(new Animated.Value(active ? 1.0 : 0.92)).current;
  const opacityAnim = useRef(new Animated.Value(active ? 1.0 : 0.45)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  // Deconstructed SVG pieces mechanical up/down separation & spring shock
  const pieceSeparationAnim = useRef(new Animated.Value(0)).current;

  // Continuous subtle up/down breathing wave on the SVG pieces (while active)
  const floatAnim = useRef(new Animated.Value(0)).current;
  const floatLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // 3 Sequential Pulse Rings matching exact Logo colors: 1. Blue -> 2. Orange -> 3. Green
  const pulseBlueAnim = useRef(new Animated.Value(0)).current;
  const pulseOrangeAnim = useRef(new Animated.Value(0)).current;
  const pulseGreenAnim = useRef(new Animated.Value(0)).current;

  const timeoutsRef = useRef<any[]>([]);
  const isRunningRef = useRef(false);

  useEffect(() => {
    // Clear any pending timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    if (active) {
      isRunningRef.current = true;

      // 1. Entrance Squash & Bounce Shock: 1.0 -> 0.85 -> 1.18 -> 1.0
      opacityAnim.setValue(1.0);
      logoScaleAnim.setValue(0.95);
      pieceSeparationAnim.setValue(0);

      Animated.sequence([
        // Squash phase
        Animated.parallel([
          Animated.timing(logoScaleAnim, {
            toValue: 0.85,
            duration: 120,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
          }),
          Animated.timing(pieceSeparationAnim, {
            toValue: -1,
            duration: 120,
            easing: Easing.in(Easing.quad),
            useNativeDriver: false,
          }),
        ]),

        // Burst phase
        Animated.parallel([
          Animated.timing(logoScaleAnim, {
            toValue: 1.18,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(pieceSeparationAnim, {
            toValue: 1.3,
            duration: 180,
            easing: Easing.out(Easing.back(1.8)),
            useNativeDriver: false,
          }),
        ]),

        // Settle phase with elastic bounce
        Animated.parallel([
          Animated.spring(logoScaleAnim, {
            toValue: 1.0,
            tension: 120,
            friction: 6.5,
            useNativeDriver: false,
          }),
          Animated.spring(pieceSeparationAnim, {
            toValue: 0,
            tension: 130,
            friction: 7,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        if (isRunningRef.current) {
          startFloatingWave();
        }
      });

      // 2. Continuous Tri-Color Pulse Rhythm: Blue -> Orange -> Green (700ms cadence, 2100ms duration)
      const PULSE_DURATION = 2100;
      const STAGGER_INTERVAL = 700;

      const runSinglePulseLoop = (anim: Animated.Value, initialDelay: number) => {
        anim.setValue(0);

        const executeCycle = () => {
          if (!isRunningRef.current) return;
          anim.setValue(0);
          Animated.timing(anim, {
            toValue: 1,
            duration: PULSE_DURATION,
            easing: Easing.out(Easing.quad), // Power1.easeOut
            useNativeDriver: false,
          }).start(({ finished }) => {
            if (finished && isRunningRef.current) {
              executeCycle();
            }
          });
        };

        if (initialDelay > 0) {
          const timeout = setTimeout(executeCycle, initialDelay);
          timeoutsRef.current.push(timeout);
        } else {
          executeCycle();
        }
      };

      // Exact color sequence: 1. Blue (0ms) -> 2. Orange (700ms) -> 3. Green (1400ms)
      runSinglePulseLoop(pulseBlueAnim, 0);
      runSinglePulseLoop(pulseOrangeAnim, STAGGER_INTERVAL);
      runSinglePulseLoop(pulseGreenAnim, STAGGER_INTERVAL * 2);

    } else {
      isRunningRef.current = false;

      // Inactive: Stop floating loop and reset pulse values
      if (floatLoopRef.current) {
        floatLoopRef.current.stop();
        floatLoopRef.current = null;
      }

      pulseBlueAnim.setValue(0);
      pulseOrangeAnim.setValue(0);
      pulseGreenAnim.setValue(0);

      // Return SVG pieces to baseline resting position
      Animated.parallel([
        Animated.spring(pieceSeparationAnim, {
          toValue: 0,
          tension: 100,
          friction: 9,
          useNativeDriver: false,
        }),
        Animated.spring(floatAnim, {
          toValue: 0,
          tension: 100,
          friction: 9,
          useNativeDriver: false,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 0.92,
          tension: 85,
          friction: 9,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.45,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    }

    return () => {
      isRunningRef.current = false;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      if (floatLoopRef.current) floatLoopRef.current.stop();
    };
  }, [active]);

  // Continuous floating wave on the SVG pieces while active
  const startFloatingWave = () => {
    floatAnim.setValue(0);
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );
    floatLoopRef.current = floatAnimation;
    floatAnimation.start();
  };

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.88,
      tension: 220,
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

  // Dimensional ratios for the 3 SVG pieces matching exact logo bounds:
  // top: 1000 x 270 (hRatio = 0.27)
  // mid: 900 x 270  (wRatio = 0.90, hRatio = 0.27)
  // bot: 1000 x 240 (hRatio = 0.24)
  const pieceHeight = Math.round(size * 0.27); // ~12px
  const midWidth = Math.round(size * 0.90);    // ~40px
  const botHeight = Math.round(size * 0.24);   // ~11px
  const baseGap = 2;

  // Exact bounding shape of the logo (capsule shape matching the logo outline)
  const logoWidth = size; // 44px
  const totalLogoHeight = pieceHeight * 2 + botHeight + baseGap * 2; // ~39px
  const logoBorderRadius = 14;

  const combinedScale = Animated.multiply(logoScaleAnim, pressAnim);

  // Dynamic vertical displacement for TOP piece (Blue speech arc)
  const topPieceTranslateY = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [2.5, 0, -3.8],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1.8],
    })
  );

  // Dynamic horizontal displacement for MID piece (Orange speech arc)
  const midPieceTranslateX = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [-1.2, 0, 2.5],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1.0],
    })
  );

  // Dynamic vertical displacement for BOT piece (Green capsule foundation)
  const botPieceTranslateY = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [-2.5, 0, 3.8],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1.2],
    })
  );

  // Pulse Ring Interpolator (scales outward along the logo's capsule shape)
  const getPulseStyle = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1.0, 1.55],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 0.1, 0.75, 1],
      outputRange: [0.8, 0.8, 0.25, 0.0],
    });

    return {
      opacity,
      transform: [{ scale }],
    };
  };

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
      {/* 3 Sequential Brand-Colored Pulse Rings - ACTIVE ONLY (1. Blue -> 2. Orange -> 3. Green) */}
      {active && (
        <>
          {/* 1. آبی لوگو (Blue Pulse) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              styles.pulseBlue,
              { width: logoWidth, height: totalLogoHeight, borderRadius: logoBorderRadius },
              getPulseStyle(pulseBlueAnim),
            ]}
          />

          {/* 2. نارنجی لوگو (Orange Pulse) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              styles.pulseOrange,
              { width: logoWidth, height: totalLogoHeight, borderRadius: logoBorderRadius },
              getPulseStyle(pulseOrangeAnim),
            ]}
          />

          {/* 3. سبز لوگو (Green Pulse) */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              styles.pulseGreen,
              { width: logoWidth, height: totalLogoHeight, borderRadius: logoBorderRadius },
              getPulseStyle(pulseGreenAnim),
            ]}
          />
        </>
      )}

      {/* 3-Piece SVG Logo Stack with kinetic up/down animations */}
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
        {/* TOP PIECE (Blue Speech Arc - animates up and down) */}
        <Animated.View
          style={{
            width: size,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: baseGap,
            transform: [{ translateY: topPieceTranslateY }],
            zIndex: 3,
          }}
        >
          <Image
            source={typeof TOP_SVG === 'string' ? { uri: TOP_SVG } : TOP_SVG}
            style={[imgStyle, { height: pieceHeight }]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* MID PIECE (Orange Speech Arc - subtle sway) */}
        <Animated.View
          style={{
            width: midWidth,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: baseGap,
            transform: [{ translateX: midPieceTranslateX }],
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

        {/* BOT PIECE (Green Capsule Foundation - animates up and down) */}
        <Animated.View
          style={{
            width: size,
            height: botHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            transform: [{ translateY: botPieceTranslateY }],
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
    overflow: 'visible',
    // @ts-ignore
    outlineStyle: 'none',
  },
  logoStack: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    zIndex: 1,
    pointerEvents: 'none',
    boxSizing: 'border-box',
  },
  pulseBlue: {
    borderColor: '#0084f0',
    backgroundColor: 'rgba(0, 132, 240, 0.20)',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 0 10px rgba(0, 132, 240, 0.40)',
        } as any)
      : {}),
  },
  pulseOrange: {
    borderColor: '#ff6b00',
    backgroundColor: 'rgba(255, 107, 0, 0.20)',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 0 10px rgba(255, 107, 0, 0.40)',
        } as any)
      : {}),
  },
  pulseGreen: {
    borderColor: '#3ea935',
    backgroundColor: 'rgba(62, 169, 53, 0.20)',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 0 10px rgba(62, 169, 53, 0.40)',
        } as any)
      : {}),
  },
});
