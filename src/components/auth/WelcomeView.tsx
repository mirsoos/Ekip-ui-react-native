import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { FrostedGlass } from '../FrostedGlass';
import { getIcon } from '../../lib/icons';
import { SocialAuthRow } from './SocialAuthRow';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function WelcomeViewComponent({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const ArrowIcon = getIcon(isRTL ? 'ArrowLeft' : 'ArrowRight');

  return (
    <View style={styles.container}>
      {/* Top Language Switcher Bar */}
      <View style={styles.langBar}>
        <LanguageSwitcherPill />
      </View>

      {/* Brand logo */}
      <View style={styles.brandSection}>
        <Image
          source={require('../../../assets/Ekip-Logo-256.png')}
          style={styles.logoOrb}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('auth.welcomeTitle')}
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          {t('auth.welcomeTagline')}
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
            <Text style={[styles.registerText, { color: colors.textPrimary }]}>
              {t('auth.register')}
            </Text>
            <ArrowIcon
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
            <Text style={[styles.registerText, { color: colors.textPrimary }]}>
              {t('auth.login')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Or continue with */}
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
          {t('auth.orContinueWith')}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
      </View>

      <SocialAuthRow onSelect={onLogin} />

      <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
        {t('auth.disclaimer')}
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
    position: 'relative',
  },
  langBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 24,
    right: 20,
    zIndex: 100,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoOrb: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    maxWidth: 280,
    lineHeight: 22,
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
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    position: 'relative',
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
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 30,
    maxWidth: 300,
    lineHeight: 18,
  },
});

export const WelcomeView = React.memo(WelcomeViewComponent);
