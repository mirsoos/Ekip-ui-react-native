import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
import { StepProgressBar } from '../common/StepProgressBar';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

const totalSteps = 4;

export function RegisterWizard({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('Sector 7 - Command HQ');
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
  const NextIcon = getIcon(isFinal ? 'Check' : 'ArrowRight');

  return (
    <View style={styles.root}>
      {/* 360° Liquid Glass Header */}
      <View style={styles.headerOuter} pointerEvents="box-none">
        <View style={[styles.headerContainer, { borderColor: colors.glassBorderStrong }]}>
          <LiquidLens
            borderRadius={36}
            marginWidth={16}
            scale={36}
            blurDeviation={2.0}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <GlassBackButton onPress={handlePrev} style={{ zIndex: 10 }} />
          <View style={{ flex: 1, marginHorizontal: 12, zIndex: 10 }}>
            <StepProgressBar currentStep={step} totalSteps={totalSteps} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

      {step === 0 && (
        <View key={0} className="animate-raise" style={{ gap: 14 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Operator Identity
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Initialize your official command credentials.
          </Text>

          <GlassInput
            icon="User"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <GlassInput
            icon="User"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <View style={{ marginTop: 6 }}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              Gender Classification
            </Text>
            <GlassSegmented
              options={[
                { label: 'Male', value: 'Male', icon: 'User' },
                { label: 'Female', value: 'Female', icon: 'UserCheck' },
                { label: 'Other', value: 'Other', icon: 'Sparkles' },
              ]}
              value={gender}
              onChange={setGender}
            />
          </View>
        </View>
      )}

      {step === 1 && (
        <View key={1} className="animate-raise" style={{ gap: 14 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Command Callsign
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your unique operator tag and operational zone.
          </Text>

          <GlassInput
            icon="User"
            placeholder="Callsign (e.g. ghost.lead)"
            value={username}
            onChangeText={setUsername}
          />
          <GlassInput
            icon="Calendar"
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <GlassInput
            icon="MapPin"
            placeholder="Operational Sector / City"
            value={city}
            onChangeText={setCity}
          />
        </View>
      )}

      {step === 2 && (
        <View key={2} className="animate-raise" style={{ gap: 14 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Security Protocols
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Configure your master encryption password.
          </Text>

          <GlassInput
            icon="Lock"
            placeholder="Master Passkey (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secure
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAcceptTerms(!acceptTerms)}
            style={styles.termsRow}
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
            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
              I accept the Command Directives and Comms Encryption Terms.
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
            Clearance Verified
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
            Welcome aboard, Operator {firstName}. Your encrypted dossier has been registered in the sector database.
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
              {isFinal ? 'Enter Command HQ' : 'Continue'}
            </Text>
            <NextIcon
              size={18}
              color={colors.textPrimary}
              strokeWidth={2.4}
              style={{ marginLeft: 8 }}
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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 84,
    paddingBottom: 110,
  },
  footerWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 900,
  },
  continueButton: {
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
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
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
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  readyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
