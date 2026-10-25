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
  const burstAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(active ? 1.08 : 1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      burstAnim.setValue(0);
      Animated.sequence([
        Animated.timing(burstAnim, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.spring(burstAnim, {
          toValue: 0,
          tension: 95,
          friction: 6.5,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.spring(scaleAnim, {
        toValue: 1.08,
        tension: 110,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(burstAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();

      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    }
  }, [active]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.92,
      tension: 180,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 120,
      friction: 6,
      useNativeDriver: false,
    }).start();
  };

  // Dimensional ratios derived from user's updated SVG viewBoxes:
  // top: 1000 x 270 (wRatio = 1.0,  hRatio = 0.27)
  // mid: 900 x 270  (wRatio = 0.90, hRatio = 0.27)
  // bot: 1000 x 240 (wRatio = 1.0,  hRatio = 0.24)
  const pieceHeight = Math.round(size * 0.27);
  const midWidth = Math.round(size * 0.90);
  const botHeight = Math.round(size * 0.24);
  const gap = 2;
  const totalH = pieceHeight + gap + pieceHeight + gap + botHeight;

  // Separation displacement in pixels during burst
  const topTranslateY = burstAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3.5],
  });

  const midScale = burstAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1.02],
  });

  const botTranslateY = burstAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3.5],
  });

  const combinedScale = Animated.multiply(scaleAnim, pressAnim);

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
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.container}
    >
      {/* Ambient soft glow when active */}
      {active && (
        <View
          style={[
            styles.ambientGlow,
            {
              width: size + 8,
              height: totalH + 8,
              borderRadius: 14,
            },
          ]}
        />
      )}

      <Animated.View
        style={[
          styles.logoStack,
          {
            width: size,
            height: totalH,
            gap,
            transform: [{ scale: combinedScale }],
          },
        ]}
      >
        {/* TOP PIECE (Blue Arc with tail) */}
        <Animated.View
          style={{
            width: size,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
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

        {/* MID PIECE (Orange Arc with tail) */}
        <Animated.View
          style={{
            width: midWidth,
            height: pieceHeight,
            alignItems: 'flex-start',
            justifyContent: 'center',
            transform: [{ scale: midScale }],
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

        {/* BOT PIECE (Green Capsule) */}
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

      {/* Subtle indicator dot below when active */}
      {active && <View style={styles.activeDot} />}
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
  },
  ambientGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    pointerEvents: 'none',
    shadowColor: '#007fe8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          filter: 'blur(8px)',
        } as any)
      : {}),
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00a0ff',
    shadowColor: '#007fe8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
  },
});
