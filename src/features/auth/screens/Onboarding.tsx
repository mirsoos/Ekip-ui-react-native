// --- START OF FILE Onboarding.tsx ---

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FrostedGlass } from '@/src/components/glass';
import { OnboardingSlide, type SlideData } from '../components/OnboardingSlide';
import { LanguageSwitcherPill } from '@/src/components/common/LanguageSwitcherPill';
import { FloatingGlassHeader } from '@/src/components/common/FloatingGlassHeader';
import { Icons } from '@/src/lib/icons';
import { useTheme, colors as themeColors, spacing, radii, sharedStyles } from '@/src/lib/theme';
import { useI18n } from '@/src/lib/i18n';
import { getSinglePillContentPaddingTop } from '@/src/lib/headerLayout';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const [step, setStep] = useState(0);

  const slides = useMemo<SlideData[]>(
    () => [
      {
        icon: 'Compass',
        title: t('onboarding.slide1Title'),
        desc: t('onboarding.slide1Desc'),
        color: colors.brandPink,
      },
      {
        icon: 'Plus',
        title: t('onboarding.slide2Title'),
        desc: t('onboarding.slide2Desc'),
        color: colors.brandBlue,
      },
      {
        icon: 'MessageCircle',
        title: t('onboarding.slide3Title'),
        desc: t('onboarding.slide3Desc'),
        color: colors.brandGreen,
      },
      {
        icon: 'Trophy',
        title: t('onboarding.slide4Title'),
        desc: t('onboarding.slide4Desc'),
        color: colors.brandAmber,
      },
    ],
    [t, colors]
  );

  // پشتیبانی از دکمه Back فیزیکی اندروید برای برگشت به اسلاید قبلی
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        setStep((prev) => prev - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const slide = slides[step];
  const isLast = step === slides.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  }, [isLast, onComplete]);

  const bottomSafeOffset = Platform.OS === 'web' ? 36 : Math.max(32, insets.bottom + 20);

  return (
    <View style={styles.container}>
      {/* 360° Liquid Glass Header with Drop Entrance Animation */}
      <FloatingGlassHeader
        animated
        onBack={step > 0 ? () => setStep((prev) => prev - 1) : undefined}
        trailing={
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing.sm, zIndex: 10 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onComplete}
              style={styles.skipBtn}
            >
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                {t('onboarding.skip')}
              </Text>
            </TouchableOpacity>
            <LanguageSwitcherPill style={{ zIndex: 10 }} />
          </View>
        }
      />

      {/* ۲. صحنه وسط مخصوص اسلاید (مستقل از دکمه پایین؛ هر چقدر متن کم/زیاد شود به فوتر فشار نمی‌آورد) */}
      <View style={[styles.slideStage, { paddingTop: getSinglePillContentPaddingTop(insets.top) }]}>
        <OnboardingSlide slide={slide} step={step} />
      </View>

      {/* ۳. فوتر کاملاً قفل‌شده در پایین صفحه (نقطه‌ها و دکمه هرگز بالا و پایین نمی‌پرند) */}
      <View style={[styles.footerDock, { paddingBottom: bottomSafeOffset }]}>
        <View style={[styles.dotsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === step ? 28 : 8,
                  backgroundColor:
                    i === step
                      ? colors.brandPink
                      : colors.glassBorderStrong,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.actionWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
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
                <Icons.Sparkles
                  size={18}
                  color={colors.textPrimary}
                  strokeWidth={2.4}
                  style={{
                    position: 'absolute',
                    ...(isRTL ? { left: 22 } : { right: 22 }),
                  }}
                />
              ) : isRTL ? (
                <Icons.ArrowLeft
                  size={18}
                  color={colors.textPrimary}
                  strokeWidth={2.4}
                  style={{
                    position: 'absolute',
                    left: 22,
                  }}
                />
              ) : (
                <Icons.ArrowRight
                  size={18}
                  color={colors.textPrimary}
                  strokeWidth={2.4}
                  style={{
                    position: 'absolute',
                    right: 22,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...sharedStyles.screenContainer,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'space-between',
  },
  skipBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slideStage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerDock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: spacing.md,
  },
  dotsRow: {
    ...sharedStyles.row,
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  dot: {
    height: spacing.sm,
    borderRadius: radii.xxs,
  },
  actionWrap: {
    width: '100%',
    maxWidth: 320,
  },
  nextButton: {
    position: 'relative',
    height: 54,
    borderRadius: radii.pill,
    borderWidth: 1,
    overflow: 'visible',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: themeColors.palette.black,
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
    ...sharedStyles.rowCenter,
    zIndex: 10,
    position: 'relative',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
