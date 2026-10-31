import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Animated,
  Platform,
  Image,
  Easing,
  View,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Circle,
  SvgXml,
} from 'react-native-svg';
import { useTheme } from '../lib/theme';

const TOP_SVG = Platform.OS === 'web' ? '/top-logo.svg' : require('../../assets/top-logo.svg');
const MID_SVG = Platform.OS === 'web' ? '/mid-logo.svg' : require('../../assets/mid-logo.svg');
const BOT_SVG = Platform.OS === 'web' ? '/bot-logo.svg' : require('../../assets/bot-logo.svg');

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

export interface LoadingProps {
  onFinish?: () => void;
  minDuration?: number;
}

const BRAND_TEXT_WIDTH = 130;

export function Loading({ onFinish, minDuration = 2000 }: LoadingProps) {
  const { isDark } = useTheme();

  // Screen level transitions
  const [containerOpacity] = useState(() => new Animated.Value(1));
  const [sceneScale] = useState(() => new Animated.Value(0.92));
  const [contentOpacity] = useState(() => new Animated.Value(0));
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Twinkling stars anims (Group A & Group B alternating)
  const [twinkleA] = useState(() => new Animated.Value(0.2));
  const [twinkleB] = useState(() => new Animated.Value(0.7));

  // Ekip 3-Piece SVG Logo kinetic animations (BottomNav style)
  const [logoScaleAnim] = useState(() => new Animated.Value(0.9));
  const [pieceSeparationAnim] = useState(() => new Animated.Value(0));
  const [floatAnim] = useState(() => new Animated.Value(0));

  // 3 Sequential Pulse Rings (Blue -> Orange -> Green)
  const [pulseBlueAnim] = useState(() => new Animated.Value(0));
  const [pulseOrangeAnim] = useState(() => new Animated.Value(0));
  const [pulseGreenAnim] = useState(() => new Animated.Value(0));

  // Typographic Progress fill (0 to BRAND_TEXT_WIDTH)
  const [textFillWidth] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // 1. Scene entrance
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(sceneScale, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();

    // 2. Twinkling Stars Animations
    const twinkleLoopA = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleA, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(twinkleA, {
          toValue: 0.15,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    const twinkleLoopB = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkleB, {
          toValue: 0.15,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(twinkleB, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    twinkleLoopA.start();
    twinkleLoopB.start();

    // 3. Typographic Progress Fill (Filling 'EKIP' from 0 to full width over 2s)
    Animated.timing(textFillWidth, {
      toValue: BRAND_TEXT_WIDTH,
      duration: Math.max(100, minDuration - 200),
      easing: Easing.bezier(0.2, 0.8, 0.25, 1),
      useNativeDriver: false,
    }).start();

    // 4. Logo entrance squash & burst shock
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScaleAnim, {
          toValue: 0.85,
          duration: 130,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pieceSeparationAnim, {
          toValue: -1,
          duration: 130,
          easing: Easing.in(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
      Animated.parallel([
        Animated.timing(logoScaleAnim, {
          toValue: 1.15,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pieceSeparationAnim, {
          toValue: 1.3,
          duration: 200,
          easing: Easing.out(Easing.back(1.8)),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
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
    ]).start();

    // 5. Floating wave loop on pieces
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );
    floatLoop.start();

    // 6. Continuous Tri-Color Pulse Rhythm (Blue -> Orange -> Green)
    const runPulse = (anim: Animated.Value, delay: number) => {
      const cycle = () => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }).start(() => cycle());
      };
      return setTimeout(cycle, delay);
    };

    const t1 = runPulse(pulseBlueAnim, 0);
    const t2 = runPulse(pulseOrangeAnim, 550);
    const t3 = runPulse(pulseGreenAnim, 1100);

    // 7. Smooth dissolve exit
    const exitTimer = setTimeout(() => {
      setIsFadingOut(true);
      twinkleLoopA.stop();
      twinkleLoopB.stop();
      floatLoop.stop();

      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 480,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(sceneScale, {
          toValue: 1.05,
          duration: 480,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start(() => {
        onFinish?.();
      });
    }, minDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(exitTimer);
      twinkleLoopA.stop();
      twinkleLoopB.stop();
      floatLoop.stop();
    };
  }, [
    minDuration,
    onFinish,
    contentOpacity,
    sceneScale,
    logoScaleAnim,
    pieceSeparationAnim,
    floatAnim,
    pulseBlueAnim,
    pulseOrangeAnim,
    pulseGreenAnim,
    containerOpacity,
    twinkleA,
    twinkleB,
    textFillWidth,
  ]);

  // Dynamic displacements for the 3 SVG pieces
  const topPieceTranslateY = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [4, 0, -6],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -3.2],
    })
  );

  const midPieceTranslateX = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [-2.5, 0, 4.5],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2],
    })
  );

  const botPieceTranslateY = Animated.add(
    pieceSeparationAnim.interpolate({
      inputRange: [-1, 0, 1.3],
      outputRange: [-4, 0, 6],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2.4],
    })
  );

  const getPulseStyle = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.95, 1.8],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 0.15, 0.7, 1],
      outputRange: [0.8, 0.8, 0.25, 0],
    });
    return {
      opacity,
      transform: [{ scale }],
    };
  };

  // Dimensions for Loading hero logo (size = 72)
  const logoSize = 72;
  const pieceHeight = Math.round(logoSize * 0.27); // ~19px
  const midWidth = Math.round(logoSize * 0.90);    // ~65px
  const botHeight = Math.round(logoSize * 0.24);   // ~17px
  const baseGap = 3;

  const totalLogoHeight = pieceHeight * 2 + botHeight + baseGap * 2;
  const logoBorderRadius = 22;

  const imgStyle = {
    width: logoSize,
    ...(Platform.OS === 'web'
      ? ({
          objectFit: 'contain',
          objectPosition: 'left center',
        } as any)
      : {}),
  };

  return (
    <Animated.View
      pointerEvents={isFadingOut ? 'none' : 'auto'}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#060814' : '#edf1fa',
          opacity: containerOpacity,
        },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Atmospheric Multi-Layer Glow Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="meshCyan" cx={isDark ? "18%" : "25%"} cy={isDark ? "20%" : "15%"} r={isDark ? "55%" : "65%"}>
              <Stop offset="0%" stopColor="#38bdf8" stopOpacity={isDark ? 0.24 : 0.20} />
              <Stop offset="55%" stopColor="#38bdf8" stopOpacity={isDark ? 0.08 : 0.06} />
              <Stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="meshRose" cx={isDark ? "50%" : "60%"} cy={isDark ? "48%" : "52%"} r={isDark ? "48%" : "60%"}>
              <Stop offset="0%" stopColor="#ec4899" stopOpacity={isDark ? 0.28 : 0.16} />
              <Stop offset="60%" stopColor="#ec4899" stopOpacity={isDark ? 0.07 : 0.04} />
              <Stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="meshIndigo" cx={isDark ? "80%" : "30%"} cy={isDark ? "82%" : "85%"} r={isDark ? "55%" : "65%"}>
              <Stop offset="0%" stopColor="#6366f1" stopOpacity={isDark ? 0.26 : 0.18} />
              <Stop offset="60%" stopColor="#6366f1" stopOpacity={isDark ? 0.06 : 0.05} />
              <Stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </RadialGradient>
            <SvgLinearGradient id="starGlow" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
              <Stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshCyan)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshRose)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshIndigo)" />

          {/* Static Ambient Dust (Dark mode only) */}
          {isDark && (
            <>
              <Circle cx="22%" cy="75%" r="1.1" fill="url(#starGlow)" opacity={0.35} />
              <Circle cx="78%" cy="70%" r="1.2" fill="url(#starGlow)" opacity={0.4} />
              <Circle cx="90%" cy="46%" r="1.0" fill="url(#starGlow)" opacity={0.3} />
              <Circle cx="10%" cy="54%" r="1.1" fill="url(#starGlow)" opacity={0.3} />
            </>
          )}
        </Svg>

        {/* Twinkling Stars (Dark mode only - Option B for light mode is pure clean frosted light) */}
        {isDark && (
          <>
            <Animated.View
              style={[
                styles.starDot,
                { top: '16%', left: '12%', opacity: twinkleA },
              ]}
            />
            <Animated.View
              style={[
                styles.starDot,
                { top: '22%', right: '14%', opacity: twinkleB },
              ]}
            />
            <Animated.View
              style={[
                styles.starDot,
                { top: '35%', left: '8%', width: 2.5, height: 2.5, opacity: twinkleB },
              ]}
            />
            <Animated.View
              style={[
                styles.starDot,
                { top: '65%', right: '18%', width: 3.5, height: 3.5, opacity: twinkleA },
              ]}
            />
            <Animated.View
              style={[
                styles.starDot,
                { top: '80%', left: '26%', opacity: twinkleA },
              ]}
            />
            <Animated.View
              style={[
                styles.starDot,
                { top: '84%', right: '28%', width: 2.5, height: 2.5, opacity: twinkleB },
              ]}
            />
          </>
        )}
      </View>

      {/* Main Content Area */}
      <Animated.View
        style={[
          styles.contentCenter,
          {
            opacity: contentOpacity,
            transform: [{ scale: sceneScale }],
          },
        ]}
      >
        {/* Central Logo Stage */}
        <View style={styles.holoPod}>
          {/* 3 Sequential Pulse Rings matching exact Logo colors */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRing,
                styles.pulseBlue,
                { width: logoSize, height: totalLogoHeight, borderRadius: logoBorderRadius },
                getPulseStyle(pulseBlueAnim),
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRing,
                styles.pulseOrange,
                { width: logoSize, height: totalLogoHeight, borderRadius: logoBorderRadius },
                getPulseStyle(pulseOrangeAnim),
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRing,
                styles.pulseGreen,
                { width: logoSize, height: totalLogoHeight, borderRadius: logoBorderRadius },
                getPulseStyle(pulseGreenAnim),
              ]}
            />
          </View>

          {/* 3-Piece SVG Logo Stack */}
          <Animated.View
            style={[
              styles.logoStack,
              {
                width: logoSize,
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            {/* TOP PIECE (Blue Speech Arc) */}
            <Animated.View
              style={{
                width: logoSize,
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
                <SvgXml xml={TOP_XML} width={logoSize} height={pieceHeight} />
              )}
            </Animated.View>

            {/* MID PIECE (Orange Speech Arc) */}
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

            {/* BOT PIECE (Green Capsule Foundation) */}
            <Animated.View
              style={{
                width: logoSize,
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
                <SvgXml xml={BOT_XML} width={logoSize} height={botHeight} />
              )}
            </Animated.View>
          </Animated.View>
        </View>

        {/* Brand Typography with Fill Progress */}
        <View style={styles.telemetrySection}>
          <View style={styles.progressTextContainer}>
            {/* Background Muted Track Text */}
            <Text
              style={[
                styles.brandTitle,
                { color: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(15, 23, 42, 0.12)' },
              ]}
            >
              EKIP
            </Text>

            {/* Glowing Active Progress Text Filling from Left to Right */}
            <Animated.View
              style={[
                styles.progressTextClip,
                { width: textFillWidth },
              ]}
            >
              <Text
                style={[
                  styles.brandTitle,
                  {
                    color: isDark ? '#ffffff' : '#0f172a',
                    textShadowColor: isDark ? 'rgba(56, 189, 248, 0.75)' : 'rgba(15, 23, 42, 0.25)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: isDark ? 10 : 4,
                  },
                ]}
              >
                EKIP
              </Text>
            </Animated.View>
          </View>

          <Text
            style={[
              styles.brandSubtitle,
              { color: isDark ? '#94a3b8' : '#64748b' },
            ]}
          >
            An Anti Social Media
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(StyleSheet.absoluteFill as any),
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#ffffff',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 3,
  },
  holoPod: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    marginTop: -31,
    marginLeft: -36,
  },
  pulseBlue: {
    borderColor: '#0084f0',
    backgroundColor: 'rgba(0, 132, 240, 0.20)',
  },
  pulseOrange: {
    borderColor: '#ff6b00',
    backgroundColor: 'rgba(255, 107, 0, 0.20)',
  },
  pulseGreen: {
    borderColor: '#3ea935',
    backgroundColor: 'rgba(62, 169, 53, 0.20)',
  },
  telemetrySection: {
    alignItems: 'center',
    marginTop: 32,
  },
  progressTextContainer: {
    width: BRAND_TEXT_WIDTH,
    height: 36,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressTextClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  brandTitle: {
    width: BRAND_TEXT_WIDTH,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 8,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
    textAlign: 'center',
    opacity: 0.85,
  },
});