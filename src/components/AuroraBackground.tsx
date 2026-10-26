import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../lib/theme';

export const AuroraBackground = React.memo(function AuroraBackground() {
  const { isDark } = useTheme();

  if (Platform.OS === 'web') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isDark ? '#04060c' : '#ebf0fa' },
          ]}
        />
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </View>
    );
  }

  // Native (Android/iOS) rich multi-layer SVG radial mesh glow
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isDark ? '#04060c' : '#ebf0fa' },
        ]}
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          {/* Top-Left Cyan/Sky Glow */}
          <RadialGradient id="auroraCyan" cx="15%" cy="15%" r="55%" fx="15%" fy="15%">
            <Stop
              offset="0%"
              stopColor="#38bdf8"
              stopOpacity={isDark ? 0.28 : 0.40}
            />
            <Stop
              offset="50%"
              stopColor="#38bdf8"
              stopOpacity={isDark ? 0.10 : 0.16}
            />
            <Stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
          </RadialGradient>

          {/* Center-Right Pink/Rose Glow */}
          <RadialGradient id="auroraPink" cx="85%" cy="38%" r="50%" fx="85%" fy="38%">
            <Stop
              offset="0%"
              stopColor="#f472b6"
              stopOpacity={isDark ? 0.24 : 0.35}
            />
            <Stop
              offset="55%"
              stopColor="#f472b6"
              stopOpacity={isDark ? 0.08 : 0.14}
            />
            <Stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
          </RadialGradient>

          {/* Bottom Indigo/Purple Glow */}
          <RadialGradient id="auroraIndigo" cx="30%" cy="85%" r="55%" fx="30%" fy="85%">
            <Stop
              offset="0%"
              stopColor="#6366f1"
              stopOpacity={isDark ? 0.22 : 0.32}
            />
            <Stop
              offset="60%"
              stopColor="#6366f1"
              stopOpacity={isDark ? 0.06 : 0.12}
            />
            <Stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraCyan)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraPink)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraIndigo)" />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({});
