import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { SocialAuthRow } from './SocialAuthRow';
import { useTheme } from '../../lib/theme';

export function WelcomeView({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  const { colors, isDark } = useTheme();
  const Shield = getIcon('Shield');
  const ArrowRight = getIcon('ArrowRight');

  return (
    <View style={styles.container}>
      {/* Brand logo */}
      <View style={styles.brandSection}>
        <LinearGradient
          colors={['rgba(244, 114, 182, 0.4)', 'rgba(59, 130, 246, 0.3)']}
          style={styles.logoOrb}
        >
          <Shield size={44} color="#ffffff" strokeWidth={1.8} />
        </LinearGradient>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          EKIP
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Tactical Operations & Squad Deployment Comms
        </Text>
      </View>

      {/* Primary Actions */}
      <View style={styles.actionsBox}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRegister}
          style={[
            styles.registerButton,
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
            <Text style={[styles.registerText, { color: colors.textPrimary }]}>
              Register
            </Text>
            <ArrowRight
              size={18}
              color={colors.textPrimary}
              strokeWidth={2.4}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onLogin}
          style={[
            styles.registerButton,
            {
              borderColor: colors.glassBorderStrong,
              marginTop: 10,
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
            <Text style={[styles.registerText, { color: colors.textPrimary }]}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Or continue with */}
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
          or continue with
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
      </View>

      <SocialAuthRow onSelect={onLogin} />

      <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
        By proceeding you confirm adherence to Sector Operational Guidelines and Encrypted Comms Protocols.
      </Text>
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
  brandSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoOrb: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 260,
    lineHeight: 20,
  },
  actionsBox: {
    width: '100%',
    maxWidth: 340,
  },
  registerButton: {
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
  registerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    marginHorizontal: 10,
    textTransform: 'uppercase',
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 30,
    maxWidth: 280,
    lineHeight: 16,
  },
});
