// --- START OF FILE Onboarding.tsx ---

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FrostedGlass } from '../components/FrostedGlass';
import { OnboardingSlide, type SlideData } from '../components/onboarding/OnboardingSlide';
import { LanguageSwitcherPill } from '../components/common/LanguageSwitcherPill';
import { getIcon } from '../lib/icons';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../lib/headerLayout';

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
    ],
    [t]
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
  const ArrowIcon = getIcon(isRTL ? 'ArrowLeft' : 'ArrowRight');
  const Sparkles = getIcon('Sparkles');

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setStep((prev) => prev + 1);
    }
  }, [isLast, onComplete]);

  const topHeaderOffset = getHeaderTopInset(insets.top) + HEADER_METRICS.buttonTopOffset;
  const bottomSafeOffset = Platform.OS === 'web' ? 36 : Math.max(32, insets.bottom + 20);

  return (
    <View style={styles.container}>
      {/* ۱. هدر بالا (ثابت در سقف صفحه) */}
      <View
        style={[
          styles.topHeader,
          {
            top: topHeaderOffset,
            left: HEADER_METRICS.buttonOffset,
            right: HEADER_METRICS.buttonOffset,
            flexDirection: isRTL ? 'row-reverse' : 'row',
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

      {/* ۲. صحنه وسط مخصوص اسلاید (مستقل از دکمه پایین؛ هر چقدر متن کم/زیاد شود به فوتر فشار نمی‌آورد) */}
      <View style={[styles.slideStage, { paddingTop: topHeaderOffset + 48 }]}>
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
                      ? '#f472b6'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(15, 23, 42, 0.18)',
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topHeader: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HEADER_METRICS.actionButtonSize,
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
    paddingTop: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
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