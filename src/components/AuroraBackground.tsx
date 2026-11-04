import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export const AuroraBackground = React.memo(function AuroraBackground({
  isDark,
}: {
  isDark: boolean;
}) {
  if (Platform.OS === 'web') {
    const bg = isDark ? '#060814' : '#edf1fa';
    const gradient = isDark
      ? [
          'radial-gradient(55% 55% at 18% 20%, rgba(56, 189, 248, 0.26) 0%, rgba(56, 189, 248, 0.08) 55%, transparent 100%)',
          'radial-gradient(50% 50% at 50% 48%, rgba(236, 72, 153, 0.30) 0%, rgba(236, 72, 153, 0.08) 60%, transparent 100%)',
          'radial-gradient(55% 55% at 80% 82%, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0.06) 60%, transparent 100%)',
        ].join(', ')
      : [
          'radial-gradient(65% 65% at 25% 15%, rgba(56, 189, 248, 0.22) 0%, rgba(56, 189, 248, 0.06) 55%, transparent 100%)',
          'radial-gradient(60% 60% at 60% 52%, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0.05) 60%, transparent 100%)',
          'radial-gradient(65% 65% at 30% 85%, rgba(99, 102, 241, 0.20) 0%, rgba(99, 102, 241, 0.06) 60%, transparent 100%)',
        ].join(', ');

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: bg,
            backgroundImage: gradient,
          } as any,
        ]}
        pointerEvents="none"
      />
    );
  }

  // Native (iOS & Android)
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      renderToHardwareTextureAndroid={true}
      shouldRasterizeIOS={true}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isDark ? '#060814' : '#edf1fa' },
        ]}
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient
            id="auroraMeshCyan"
            cx={isDark ? '18%' : '25%'}
            cy={isDark ? '20%' : '15%'}
            r={isDark ? '55%' : '65%'}
          >
            <Stop offset="0%" stopColor="#38bdf8" stopOpacity={isDark ? 0.26 : 0.22} />
            <Stop offset="55%" stopColor="#38bdf8" stopOpacity={isDark ? 0.08 : 0.06} />
            <Stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="auroraMeshRose"
            cx={isDark ? '50%' : '60%'}
            cy={isDark ? '48%' : '52%'}
            r={isDark ? '48%' : '60%'}
          >
            <Stop offset="0%" stopColor="#ec4899" stopOpacity={isDark ? 0.30 : 0.18} />
            <Stop offset="60%" stopColor="#ec4899" stopOpacity={isDark ? 0.08 : 0.05} />
            <Stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="auroraMeshIndigo"
            cx={isDark ? '80%' : '30%'}
            cy={isDark ? '82%' : '85%'}
            r={isDark ? '55%' : '65%'}
          >
            <Stop offset="0%" stopColor="#6366f1" stopOpacity={isDark ? 0.28 : 0.20} />
            <Stop offset="60%" stopColor="#6366f1" stopOpacity={isDark ? 0.06 : 0.06} />
            <Stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraMeshCyan)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraMeshRose)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#auroraMeshIndigo)" />
      </Svg>
    </View>
  );
});
