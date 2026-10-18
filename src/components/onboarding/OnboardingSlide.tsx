import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export interface SlideData {
  icon: IconName;
  title: string;
  desc: string;
  color: string;
}

export function OnboardingSlide({ slide }: { slide: SlideData }) {
  const { colors } = useTheme();
  const IconComp = getIcon(slide.icon);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${slide.color}50`, `${slide.color}15`]}
        style={styles.iconBox}
      >
        <IconComp size={54} color={colors.textPrimary} strokeWidth={1.8} />
      </LinearGradient>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {slide.title}
      </Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>
        {slide.desc}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 280,
    lineHeight: 20,
  },
});
