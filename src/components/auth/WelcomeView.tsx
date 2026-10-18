import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassButton } from '../Glass';
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
  const { colors } = useTheme();
  const Shield = getIcon('Shield');

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
        <GlassButton size="lg" fullWidth onPress={onRegister} iconRight="ArrowRight">
          Deploy Operator (Register)
        </GlassButton>

        <View style={{ marginTop: 10 }}>
          <GlassButton variant="secondary" size="lg" fullWidth onPress={onLogin}>
            Sign In with Clearance
          </GlassButton>
        </View>
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
