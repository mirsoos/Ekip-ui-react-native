import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
import { StepProgressBar } from '../common/StepProgressBar';
import { LiquidLens } from '../LiquidLens';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

const totalSteps = 4;

export function RegisterWizard({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState(isRTL ? 'تهران - انقلاب' : 'Tehran - Enghelab');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const Check = getIcon('Check');

  const canProceed = () => {
    if (step === 0) return firstName.trim().length > 0 && lastName.trim().length > 0;
    if (step === 1) return age.trim().length > 0 && username.trim().length > 0;
    if (step === 2) return password.length >= 6 && acceptTerms;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onComplete();
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const isFinal = step === totalSteps - 1;
  const NextIcon = getIcon(isFinal ? 'Check' : isRTL ? 'ArrowLeft' : 'ArrowRight');

  return (
    <View style={styles.root}>
      {/* 360° Liquid Glass Header with Language Switcher */}
      <View style={styles.headerOuter} pointerEvents="box-none">
        <View style={[styles.headerContainer, { flexDirection: isRTL ? 'row-reverse' : 'row', borderColor: colors.glassBorderStrong }]}>
          <LiquidLens
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <GlassBackButton onPress={handlePrev} style={{ zIndex: 10 }} />
          <View style={{ flex: 1, marginHorizontal: 8, zIndex: 10 }}>
            <StepProgressBar currentStep={step} totalSteps={totalSteps} />
          </View>
          <LanguageSwitcherPill style={{ zIndex: 10 }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {step === 0 && (
          <View key={0} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep0Title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep0Sub')}
            </Text>

            <GlassInput
              icon="User"
              placeholder={t('auth.firstName')}
              value={firstName}
              onChangeText={setFirstName}
            />
            <GlassInput
              icon="User"
              placeholder={t('auth.lastName')}
              value={lastName}
              onChangeText={setLastName}
            />

            <View style={{ marginTop: 6 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('auth.genderLabel')}
              </Text>
              <GlassSegmented
                options={[
                  { label: t('auth.genderMale'), value: 'Male', icon: 'User' },
                  { label: t('auth.genderFemale'), value: 'Female', icon: 'UserCheck' },
                  { label: t('auth.genderOther'), value: 'Other', icon: 'Sparkles' },
                ]}
                value={gender}
                onChange={setGender}
              />
            </View>
          </View>
        )}

        {step === 1 && (
          <View key={1} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep1Title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep1Sub')}
            </Text>

            <GlassInput
              icon="User"
              placeholder={t('auth.username')}
              value={username}
              onChangeText={setUsername}
            />
            <GlassInput
              icon="Calendar"
              placeholder={t('auth.age')}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <GlassInput
              icon="MapPin"
              placeholder={t('auth.city')}
              value={city}
              onChangeText={setCity}
            />
          </View>
        )}

        {step === 2 && (
          <View key={2} className="animate-raise" style={{ gap: 14 }}>
            <Text style={[styles.title, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep2Title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('auth.regStep2Sub')}
            </Text>

            <GlassInput
              icon="Lock"
              placeholder={t('auth.passwordMin')}
              value={password}
              onChangeText={setPassword}
              secure
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={[styles.termsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: acceptTerms ? '#f472b6' : 'transparent',
                    borderColor: acceptTerms ? '#f472b6' : colors.glassBorder,
                  },
                ]}
              >
                {acceptTerms && <Check size={12} color="#ffffff" strokeWidth={3} />}
              </View>
              <Text style={[styles.termsText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('auth.acceptTerms')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View key={3} className="animate-raise" style={{ gap: 14, alignItems: 'center', paddingVertical: 20 }}>
            <View
              style={[
                styles.readyCircle,
                { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e' },
              ]}
            >
              <Check size={40} color="#22c55e" strokeWidth={2.4} />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary, textAlign: 'center' }]}>
              {t('auth.regStep3Title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t('auth.regStep3Sub', { name: firstName || (isRTL ? 'کاربر عزیز' : 'Friend') })}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 360° Liquid Glass Continue Button */}
      <View style={styles.footerWrap} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={!canProceed()}
          style={[
            styles.continueButton,
            {
              borderColor: colors.glassBorderStrong,
              opacity: canProceed() ? 1 : 0.45,
            },
          ]}
        >
          <LiquidLens
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buttonContent}>
            <Text style={[styles.continueText, { color: colors.textPrimary }]}>
              {isFinal ? t('auth.enterApp') : t('create.continue')}
            </Text>
            <NextIcon
              size={18}
              color={colors.textPrimary}
              strokeWidth={2.4}
              style={{
                position: 'absolute',
                ...(isRTL ? { left: 22 } : { right: 22 }),
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  headerContainer: {
    position: 'relative',
    height: 60,
    borderRadius: 36,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 88,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 6,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  readyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    zIndex: 900,
  },
  continueButton: {
    position: 'relative',
    height: 64,
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
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
