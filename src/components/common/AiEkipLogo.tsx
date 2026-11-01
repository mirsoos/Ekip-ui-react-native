import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, G } from 'react-native-svg';

export interface AiEkipLogoProps {
  size?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const AiEkipLogo = React.memo(function AiEkipLogo({
  size = 24,
  width,
  height,
  style,
}: AiEkipLogoProps) {
  const finalWidth = width ?? size;
  const finalHeight = height ?? (size * (196 / 248));

  return (
    <View style={[styles.container, { width: finalWidth, height: finalHeight }, style]}>
      <Svg
        viewBox="62 53 248 196"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id="aiBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0052D4" />
            <Stop offset="100%" stopColor="#00A8FF" />
          </LinearGradient>

          <LinearGradient id="aiOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D83F00" />
            <Stop offset="100%" stopColor="#FF9900" />
          </LinearGradient>

          <LinearGradient id="aiGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#007A18" />
            <Stop offset="100%" stopColor="#76CC1E" />
          </LinearGradient>

          <Rect id="aiPillShape" x="80" y="122" width="198" height="66" rx="33" />
        </Defs>

        {/* Orange Pill */}
        <G transform="translate(175, 150) rotate(247) scale(0.95, -0.95) translate(-180, -155)">
          <Rect x="80" y="122" width="198" height="66" rx="33" fill="url(#aiOrangeGrad)" />
        </G>

        {/* Blue Pill */}
        <G transform="translate(124, 149) rotate(-65) scale(0.95, 0.95) translate(-180, -155)">
          <Rect x="80" y="122" width="198" height="66" rx="33" fill="url(#aiBlueGrad)" />
        </G>

        {/* Green Pill */}
        <G transform="translate(275, 150) rotate(-90) scale(0.95) translate(-180, -155)">
          <Rect x="80" y="122" width="198" height="66" rx="33" fill="url(#aiGreenGrad)" />
        </G>
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
