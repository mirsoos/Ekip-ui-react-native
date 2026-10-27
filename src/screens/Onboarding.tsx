import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FrostedGlass } from '../components/FrostedGlass';
import { OnboardingSlide, type SlideData } from '../components/onboarding/OnboardingSlide';
import { LanguageSwitcherPill } from '../components/common/LanguageSwitcherPill';
import { getIcon } from '../lib/icons';
import { useTheme } from '../../src/lib/theme';
import { useI18n } from '../../src/lib/i18n';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const [step, setStep] = useState(0);

  const slides: SlideData[] = [
    {
      icon: 'Compass',
      title: t('onboarding.slide1Title'),
      desc: t('onboarding.slide1Desc'),
      color: '#f472b6',
    },
    {
      icon: 'Plus',
      title: t('onboarding.slide2Title'),
      desc: t('onboarding.slide2Desc'),
      color: '#3b82f6',
    },
    {
      icon: 'MessageCircle',
      title: t('onboarding.slide3Title'),
      desc: t('onboarding.slide3Desc'),
      color: '#10b981',
    },
    {
      icon: 'Trophy',
      title: t('onboarding.slide4Title'),
      desc: t('onboarding.slide4Desc'),
      color: '#eab308',
    },
  ];

  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const ArrowIcon = getIcon(isRTL ? 'ArrowLeft' : 'ArrowRight');
  const Sparkles = getIcon('Sparkles');

  return (
    <View style={styles.container}>
      {/* Top Header with Language Switcher & Skip button */}
      <View
        style={[
          styles.topHeader,
          {
            top: Platform.OS === 'web' ? 24 : Math.max(20, insets.top + 8),
          },
        ]}
      >
        <LanguageSwitcherPill />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onComplete}
          style={styles.skipBtn}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            {t('onboarding.skip')}
          </Text>
        </TouchableOpacity>
      </View>

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
          {/* 360° Frosted Glass */}
          <FrostedGlass
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buttonContent}>
            <Text style={[styles.nextText, { color: colors.textPrimary }]}>
              {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
            </Text>
            {isLast ? (
              <Sparkles
                size={18}
                color={colors.textPrimary}
                strokeWidth={2.4}
                style={{
                  position: 'absolute',
                  ...(isRTL ? { left: 22 } : { right: 22 }),
                }}
              />
            ) : (
              <ArrowIcon
                size={18}
                color={colors.textPrimary}
                strokeWidth={2.4}
                style={{
                  position: 'absolute',
                  ...(isRTL ? { left: 22 } : { right: 22 }),
                }}
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
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 32,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionWrap: {
    width: '100%',
    maxWidth: 320,
  },
  nextButton: {
    position: 'relative',
    height: 54,
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'visible',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
        }
      : Platform.OS === 'android'
      ? { elevation: 0 }
      : {}),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
