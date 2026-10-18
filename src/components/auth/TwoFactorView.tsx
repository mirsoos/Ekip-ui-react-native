import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { GlassButton, GlassBackButton } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function TwoFactorView({
  otp,
  setOtp,
  onBack,
  onComplete,
}: {
  otp: string;
  setOtp: (val: string) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const { colors } = useTheme();
  const Shield = getIcon('ShieldCheck');

  return (
    <View style={styles.container}>
      <View style={styles.backWrap}>
        <GlassBackButton onPress={onBack} />
      </View>

      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
        ]}
      >
        <Shield size={38} color="#22c55e" strokeWidth={1.8} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Biometric / 2FA Clearance
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter the 6-digit cryptographic security code from your command authenticator.
      </Text>

      <View style={styles.inputWrap}>
        <TextInput
          value={otp}
          onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          maxLength={6}
          style={[styles.otpInput, { color: colors.textPrimary }]}
          autoFocus
        />

        <View style={styles.dotsRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    otp.length > i ? '#f472b6' : 'rgba(255, 255, 255, 0.2)',
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.btnWrap}>
        <GlassButton size="lg" fullWidth onPress={onComplete} disabled={otp.length < 6}>
          Verify Clearance
        </GlassButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  backWrap: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 280,
  },
  inputWrap: {
    alignItems: 'center',
    marginTop: 28,
  },
  otpInput: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    width: 220,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  btnWrap: {
    width: '100%',
    maxWidth: 300,
    marginTop: 32,
  },
});
