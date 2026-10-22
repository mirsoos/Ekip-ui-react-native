import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LiquidLens } from '../components/LiquidLens';
import { OnboardingSlide, type SlideData } from '../components/onboarding/OnboardingSlide';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';

const slides: SlideData[] = [
  {
    icon: 'Compass',
    title: 'Deploy Across Sectors',
    desc: 'Locate tactical squads and high-readiness teams across your operational sectors.',
    color: '#f472b6',
  },
  {
    icon: 'Plus',
    title: 'Initiate Operations',
    desc: 'Assemble an Ekip unit in seconds. Establish clearance thresholds, rules of engagement, and muster points.',
    color: '#3b82f6',
  },
  {
    icon: 'MessageCircle',
    title: 'Encrypted Radio Comms',
    desc: 'Secure end-to-end tactical comms and channel dispatching keep your operators synchronized.',
    color: '#10b981',
  },
  {
    icon: 'Trophy',
    title: 'Rank Up & Earn Medals',
    desc: 'Earn Command XP, execute special directives, earn honors, and upgrade clearance to Commander.',
    color: '#eab308',
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const ArrowRight = getIcon('ArrowRight');
  const Sparkles = getIcon('Sparkles');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onComplete}
        style={styles.skipBtn}
      >
        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <OnboardingSlide slide={slide} />

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === step ? 28 : 8,
                backgroundColor:
                  i === step ? '#f472b6' : 'rgba(255, 255, 255, 0.2)',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.actionWrap}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => (isLast ? onComplete() : setStep(step + 1))}
          style={[
            styles.nextButton,
            {
              borderColor: colors.glassBorderStrong,
            },
          ]}
        >
          {/* 360° Liquid Glass Lens */}
          <LiquidLens
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buttonContent}>
            <Text style={[styles.nextText, { color: colors.textPrimary }]}>
              {isLast ? 'Enter Command Post' : 'Next'}
            </Text>
            {isLast ? (
              <Sparkles
                size={18}
                color={colors.textPrimary}
                strokeWidth={2.4}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <ArrowRight
                size={18}
                color={colors.textPrimary}
                strokeWidth={2.4}
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skipBtn: {
    position: 'absolute',
    top: 40,
    right: 24,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 32,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  actionWrap: {
    width: '100%',
    maxWidth: 320,
    marginTop: 32,
  },
  nextButton: {
    position: 'relative',
    height: 52,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
