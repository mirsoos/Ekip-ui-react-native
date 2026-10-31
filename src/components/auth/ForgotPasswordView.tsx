import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
import { FrostedGlass } from '../FrostedGlass';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getHeaderTopInset } from '../../lib/headerLayout';

type ResetStep = 'request' | 'otp' | 'new-password' | 'success';
type ResetMethod = 'username' | 'email' | 'phone';

export function ForgotPasswordView({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  const [step, setStep] = useState<ResetStep>('request');
  const [method, setMethod] = useState<ResetMethod>('username');

  // Input fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  const canSubmitRequest = () => {
    if (method === 'username') return username.trim().length >= 3;
    if (method === 'email') return email.trim().includes('@');
    if (method === 'phone') return phone.trim().length >= 10;
    return false;
  };

  const handleSendCode = () => {
    if (canSubmitRequest()) {
      setResendTimer(60);
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setStep('new-password');
    }
  };

  const passwordsMatch = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleResetPassword = () => {
    if (passwordsMatch) {
      setStep('success');
    }
  };

  const handleBackStep = () => {
    if (step === 'otp') setStep('request');
    else if (step === 'new-password') setStep('otp');
    else onBack();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: getHeaderTopInset(insets.top) + HEADER_METRICS.buttonTopOffset,
          paddingHorizontal: HEADER_METRICS.buttonOffset,
        },
      ]}
    >
      {/* Top Header Row with Back Button and Language Switcher */}
      <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <GlassBackButton onPress={handleBackStep} />
        <LanguageSwitcherPill />
      </View>

      {/* STEP 0: Request Reset Code */}
      {step === 'request' && (
        <View key="request" className="animate-raise">
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <Icons.Lock size={32} color="#ec4899" strokeWidth={2} />
          </View>

          <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotTitle')}
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotSubtitle')}
          </Text>

          {/* Recovery Methods */}
          <View style={{ marginTop: 20 }}>
            <GlassSegmented
              options={[
                { label: t('auth.tabUsername'), value: 'username' },
                { label: t('auth.tabEmail'), value: 'email' },
                { label: t('auth.tabPhone'), value: 'phone' },
              ]}
              value={method}
              onChange={(v) => setMethod(v as ResetMethod)}
            />
          </View>

          {/* Method Input */}
          <View style={{ gap: 12, marginTop: 18 }}>
            <View key={method} className="animate-raise">
              {method === 'username' && (
                <GlassInput
                  icon="User"
                  placeholder={t('auth.usernamePlaceholder')}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              )}
              {method === 'email' && (
                <GlassInput
                  icon="Mail"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              {method === 'phone' && (
                <GlassInput
                  icon="Phone"
                  placeholder={t('auth.phonePlaceholder')}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSendCode}
              disabled={!canSubmitRequest()}
              style={[
                styles.actionButton,
                {
                  borderColor: colors.glassBorderStrong,
                  opacity: canSubmitRequest() ? 1 : 0.45,
                  marginTop: 10,
                },
              ]}
            >
              <FrostedGlass
                borderRadius={36}
                marginWidth={16}
                scale={36}
                blurDeviation={2.0}
                overlayOpacity={isDark ? 0.08 : 0.15}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.buttonContent}>
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                  {t('auth.forgotSendCode')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={{ alignSelf: 'center', marginTop: 14 }}
            >
              <Text style={[styles.backToLoginText, { color: colors.textSecondary }]}>
                {t('auth.backToLogin')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 1: Verify 6-digit Code */}
      {step === 'otp' && (
        <View key="otp" className="animate-raise">
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <Icons.ShieldCheck size={32} color="#22c55e" strokeWidth={2} />
          </View>

          <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotOtpTitle')}
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotOtpSubtitle')}
          </Text>

          {/* OTP Input & Dots */}
          <View style={styles.otpInputWrap}>
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

          <View style={{ gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleVerifyOtp}
              disabled={otp.length < 6}
              style={[
                styles.actionButton,
                {
                  borderColor: colors.glassBorderStrong,
                  opacity: otp.length < 6 ? 0.45 : 1,
                },
              ]}
            >
              <FrostedGlass
                borderRadius={36}
                marginWidth={16}
                scale={36}
                blurDeviation={2.0}
                overlayOpacity={isDark ? 0.08 : 0.15}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.buttonContent}>
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                  {t('auth.forgotVerifyCode')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={resendTimer > 0}
              onPress={() => setResendTimer(60)}
              style={{ alignSelf: 'center', marginTop: 10 }}
            >
              <Text
                style={[
                  styles.resendText,
                  { color: resendTimer > 0 ? colors.textTertiary : colors.textPrimary },
                ]}
              >
                {resendTimer > 0
                  ? `${t('auth.resendCode')} (${resendTimer}s)`
                  : t('auth.resendCode')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2: Set New Password */}
      {step === 'new-password' && (
        <View key="new-password" className="animate-raise">
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
            ]}
          >
            <Icons.Lock size={32} color="#ec4899" strokeWidth={2} />
          </View>

          <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotNewPassTitle')}
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.forgotNewPassSubtitle')}
          </Text>

          <View style={{ gap: 12, marginTop: 20 }}>
            <GlassInput
              icon="Lock"
              placeholder={t('auth.newPassword')}
              value={newPassword}
              onChangeText={setNewPassword}
              secure
            />

            <GlassInput
              icon="Lock"
              placeholder={t('auth.confirmNewPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
            />

            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('auth.passwordsDoNotMatch')}
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleResetPassword}
              disabled={!passwordsMatch}
              style={[
                styles.actionButton,
                {
                  borderColor: colors.glassBorderStrong,
                  opacity: passwordsMatch ? 1 : 0.45,
                  marginTop: 10,
                },
              ]}
            >
              <FrostedGlass
                borderRadius={36}
                marginWidth={16}
                scale={36}
                blurDeviation={2.0}
                overlayOpacity={isDark ? 0.08 : 0.15}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.buttonContent}>
                <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                  {t('auth.resetPasswordSubmit')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: Success Screen */}
      {step === 'success' && (
        <View key="success" className="animate-raise" style={{ alignItems: 'center', marginTop: 30 }}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22c55e', width: 72, height: 72 },
            ]}
          >
            <Icons.CheckCircle2 size={40} color="#22c55e" strokeWidth={2.2} />
          </View>

          <Text style={[styles.heading, { color: colors.textPrimary, textAlign: 'center', marginTop: 16 }]}>
            {t('auth.resetSuccessTitle')}
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            {t('auth.resetSuccessSub')}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onComplete}
            style={[
              styles.actionButton,
              {
                borderColor: colors.glassBorderStrong,
                width: '100%',
                marginTop: 32,
              },
            ]}
          >
            <FrostedGlass
              borderRadius={36}
              marginWidth={16}
              scale={36}
              blurDeviation={2.0}
              overlayOpacity={isDark ? 0.08 : 0.15}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.buttonContent}>
              <Text style={[styles.actionText, { color: colors.textPrimary }]}>
                {t('auth.loginSubmit')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: HEADER_METRICS.actionButtonSize,
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  actionButton: {
    position: 'relative',
    height: 52,
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
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.35,
          shadowRadius: 28,
          elevation: 14,
        }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  backToLoginText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
  },
  otpInputWrap: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 24,
  },
  otpInput: {
    width: 220,
    height: 52,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
