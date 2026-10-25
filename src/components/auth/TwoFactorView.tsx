import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

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
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const Shield = getIcon('ShieldCheck');

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <GlassBackButton onPress={onBack} />
        <LanguageSwitcherPill />
      </View>

      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
        ]}
      >
        <Shield size={38} color="#22c55e" strokeWidth={1.8} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary, textAlign: 'center' }]}>
        {t('auth.2faTitle')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
        {t('auth.2faSubtitle')}
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
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onComplete}
          disabled={otp.length < 6}
          style={[
            styles.verifyButton,
            {
              borderColor: colors.glassBorderStrong,
              opacity: otp.length < 6 ? 0.45 : 1,
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
            <Text style={[styles.verifyText, { color: colors.textPrimary }]}>
              {t('auth.verify')}
            </Text>
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
    paddingHorizontal: 28,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 18,
  },
  inputWrap: {
    alignItems: 'center',
    marginTop: 32,
    width: '100%',
  },
  otpInput: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 14,
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  btnWrap: {
    width: '100%',
    maxWidth: 340,
    marginTop: 40,
  },
  verifyButton: {
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
  verifyText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
