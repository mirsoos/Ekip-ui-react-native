import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlassButton, GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
import { StepProgressBar } from '../common/StepProgressBar';
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
  const { colors } = useTheme();
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <GlassBackButton onPress={handlePrev} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <StepProgressBar currentStep={step} totalSteps={totalSteps} />
        </View>
      </View>

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

      <View style={{ marginTop: 28 }}>
        <GlassButton
          size="lg"
          fullWidth
          onPress={handleNext}
          disabled={!canProceed()}
        >
          {step === totalSteps - 1 ? 'Enter Command HQ' : 'Continue'}
        </GlassButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
