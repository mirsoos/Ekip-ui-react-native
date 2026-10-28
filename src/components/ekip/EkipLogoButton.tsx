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
import { SvgXml } from 'react-native-svg';

const TOP_SVG = Platform.OS === 'web' ? '/top-logo.svg' : require('../../../assets/top-logo.svg');
const MID_SVG = Platform.OS === 'web' ? '/mid-logo.svg' : require('../../../assets/mid-logo.svg');
const BOT_SVG = Platform.OS === 'web' ? '/bot-logo.svg' : require('../../../assets/bot-logo.svg');

const TOP_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 270" width="100%" height="100%" preserveAspectRatio="xMinYMid meet">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#006cdb"/>
      <stop offset="35%" stop-color="#007fe8"/>
      <stop offset="70%" stop-color="#0096f5"/>
      <stop offset="100%" stop-color="#00a6ff"/>
    </linearGradient>
    <linearGradient id="blueBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
      <stop offset="100%" stop-color="rgba(0,60,150,0.5)"/>
    </linearGradient>
  </defs>
  <path d="M 165 4 H 885 A 110 110 0 0 1 885 224 H 165 C 80 224, 30 248, 2 266 L 2 110 C 2 50, 75 4, 165 4 Z" fill="url(#blueGrad)" stroke="url(#blueBorder)" stroke-width="1.5" />
</svg>`;

const MID_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 270" width="100%" height="100%" preserveAspectRatio="xMinYMid meet">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#e64600"/>
      <stop offset="35%" stop-color="#f55a00"/>
      <stop offset="70%" stop-color="#ff7b00"/>
      <stop offset="100%" stop-color="#ffa600"/>
    </linearGradient>
    <linearGradient id="orangeBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
      <stop offset="100%" stop-color="rgba(150,35,0,0.5)"/>
    </linearGradient>
  </defs>
  <path d="M 165 4 H 785 A 110 110 0 0 1 785 224 H 165 C 80 224, 30 248, 2 266 L 2 110 C 2 50, 75 4, 165 4 Z" fill="url(#orangeGrad)" stroke="url(#orangeBorder)" stroke-width="1.5" />
</svg>`;

const BOT_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="100%" height="100%" preserveAspectRatio="xMinYMid meet">
  <defs>
    <linearGradient id="greenGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#1b9338"/>
      <stop offset="40%" stop-color="#3ea935"/>
      <stop offset="85%" stop-color="#80c33a"/>
      <stop offset="100%" stop-color="#91cc3b"/>
    </linearGradient>
    <linearGradient id="greenBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
      <stop offset="100%" stop-color="rgba(15,90,30,0.45)"/>
    </linearGradient>
  </defs>
  <rect x="2" y="6" width="996" height="228" rx="114" fill="url(#greenGrad)" stroke="url(#greenBorder)" stroke-width="1.5" />
</svg>`;

export interface EkipLogoButtonProps {
  active: boolean;
  onPress: () => void;
  size?: number;
}

export const EkipLogoButton = React.memo(function EkipLogoButton({
  active,
  onPress,
  size = 44,
}: EkipLogoButtonProps) {
  // Main logo transforms (Always full 1.0 opacity - never dimmed when inactive)
  const logoScaleAnim = useRef(new Animated.Value(1.0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  // Mechanical separation of the 3 SVG pieces
  const pieceSeparationAnim = useRef(new Animated.Value(0)).current;

  // Continuous subtle up/down breathing wave on the SVG pieces (while active)
  const floatAnim = useRef(new Animated.Value(0)).current;
  const floatLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // 3 Sequential Pulse Rings matching exact Logo colors: 1. Blue -> 2. Orange -> 3. Green
  const pulseBlueAnim = useRef(new Animated.Value(0)).current;
  const pulseOrangeAnim = useRef(new Animated.Value(0)).current;
  const pulseGreenAnim = useRef(new Animated.Value(0)).current;

  // Master fade for pulse waves (smooth 280ms dissolution on exit, never abrupt disappearance)
  const pulseContainerFade = useRef(new Animated.Value(active ? 1 : 0)).current;

  const timeoutsRef = useRef<any[]>([]);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (active) {
      isRunningRef.current = true;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];

      // Fade in pulse container immediately
      pulseContainerFade.setValue(1);

      // 1. Entrance Squash & Bounce Shock: 1.0 -> 0.85 -> 1.18 -> 1.0
      logoScaleAnim.setValue(0.96);
      pieceSeparationAnim.setValue(0);

      Animated.sequence([
        // Squash phase
        Animated.parallel([
          Animated.timing(logoScaleAnim, {
            toValue: 0.85,
            duration: 120,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pieceSeparationAnim, {
            toValue: -1,
            duration: 120,
            easing: Easing.in(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),

        // Burst phase
        Animated.parallel([
          Animated.timing(logoScaleAnim, {
            toValue: 1.18,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pieceSeparationAnim, {
            toValue: 1.3,
            duration: 180,
            easing: Easing.out(Easing.back(1.8)),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),

        // Settle phase with elastic bounce
        Animated.parallel([
          Animated.spring(logoScaleAnim, {
            toValue: 1.0,
            tension: 120,
            friction: 6.5,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.spring(pieceSeparationAnim, {
            toValue: 0,
            tension: 130,
            friction: 7,
            useNativeDriver: Platform.OS !== 'web',
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
            easing: Easing.out(Easing.quad),
            useNativeDriver: Platform.OS !== 'web',
            isInteraction: false,
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

      runSinglePulseLoop(pulseBlueAnim, 0);
      runSinglePulseLoop(pulseOrangeAnim, STAGGER_INTERVAL);
      runSinglePulseLoop(pulseGreenAnim, STAGGER_INTERVAL * 2);

    } else {
      isRunningRef.current = false;

      // 1. Smoothly dissolve any active pulse rings over 280ms (no sudden pop or jarring cut)
      Animated.timing(pulseContainerFade, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        timeoutsRef.current.forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
        pulseBlueAnim.setValue(0);
        pulseOrangeAnim.setValue(0);
        pulseGreenAnim.setValue(0);
      });

      // 2. Stop floating loop
      if (floatLoopRef.current) {
        floatLoopRef.current.stop();
        floatLoopRef.current = null;
      }

      // 3. Dignified, smooth magnetic lock & settle on exit:
      // The pieces smoothly lock back into unified alignment,
      // and the logo performs a soft cushion settle to 1.0 (natural size, full vibrant color)
      Animated.parallel([
        Animated.spring(pieceSeparationAnim, {
          toValue: 0,
          tension: 130,
          friction: 11,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.spring(floatAnim, {
          toValue: 0,
          tension: 130,
          friction: 11,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.sequence([
          // Subtle cushioned latch as the tab disengages
          Animated.timing(logoScaleAnim, {
            toValue: 0.96,
            duration: 90,
            easing: Easing.bezier(0.25, 1, 0.5, 1),
            useNativeDriver: Platform.OS !== 'web',
          }),
          // Gentle spring settlement to normal size 1.0
          Animated.spring(logoScaleAnim, {
            toValue: 1.0,
            tension: 140,
            friction: 9,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
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
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1350,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
          isInteraction: false,
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
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 140,
      friction: 7,
      useNativeDriver: Platform.OS !== 'web',
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
      {/* 3 Sequential Brand-Colored Pulse Rings (Capsule shape, smoothly fades out on exit) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pulseContainer,
          { opacity: pulseContainerFade },
        ]}
      >
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
      </Animated.View>

      {/* 3-Piece SVG Logo Stack with kinetic up/down animations (Full vibrancy at all times) */}
      <Animated.View
        style={[
          styles.logoStack,
          {
            width: size,
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
          {Platform.OS === 'web' ? (
            <Image
              source={typeof TOP_SVG === 'string' ? { uri: TOP_SVG } : TOP_SVG}
              style={[imgStyle, { height: pieceHeight }]}
              resizeMode="contain"
            />
          ) : (
            <SvgXml xml={TOP_XML} width={size} height={pieceHeight} />
          )}
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
          {Platform.OS === 'web' ? (
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
          ) : (
            <SvgXml xml={MID_XML} width={midWidth} height={pieceHeight} />
          )}
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
          {Platform.OS === 'web' ? (
            <Image
              source={typeof BOT_SVG === 'string' ? { uri: BOT_SVG } : BOT_SVG}
              style={[imgStyle, { height: botHeight }]}
              resizeMode="contain"
            />
          ) : (
            <SvgXml xml={BOT_XML} width={size} height={botHeight} />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
});

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
  pulseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
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
    ...(Platform.OS === 'web'
      ? ({
          boxSizing: 'border-box',
        } as any)
      : {}),
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
