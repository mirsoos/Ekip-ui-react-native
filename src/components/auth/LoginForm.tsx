import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassInput } from '../Glass';
import { TactileSegmented } from '../common/TactileSegmented';
import { FrostedGlass } from '../FrostedGlass';
import { LanguageSwitcherPill } from '../common/LanguageSwitcherPill';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { SocialAuthRow } from './SocialAuthRow';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import { HEADER_METRICS, getSinglePillContentPaddingTop } from '../../lib/headerLayout';

export function LoginForm({
  onBack,
  onSubmit,
  onOAuth,
  onForgotPassword,
}: {
  onBack: () => void;
  onSubmit: () => void;
  onOAuth: () => void;
  onForgotPassword?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { t, isRTL } = useI18n();

  const [loginMethod, setLoginMethod] = useState<'username' | 'email' | 'phone'>('username');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.root}>
      <FloatingGlassHeader
        animated
        onBack={onBack}
        title={t('auth.loginTitle')}
        trailing={<LanguageSwitcherPill />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: getSinglePillContentPaddingTop(insets.top),
            paddingHorizontal: HEADER_METRICS.buttonOffset,
            paddingBottom: 120 + insets.bottom,
          },
        ]}
      >
        <Text style={[styles.heading, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('auth.loginTitle')}
        </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
        {t('auth.loginSubtitle')}
      </Text>

      {/* Tabs */}
      <View style={{ marginTop: 20 }}>
        <TactileSegmented
          options={[
            { label: t('auth.tabUsername'), value: 'username' },
            { label: t('auth.tabEmail'), value: 'email' },
            { label: t('auth.tabPhone'), value: 'phone' },
          ]}
          value={loginMethod}
          onChange={(v) => setLoginMethod(v as any)}
        />
      </View>

      {/* Input fields */}
      <View style={{ gap: 12, marginTop: 16 }}>
        <View key={loginMethod} className="animate-raise">
          {loginMethod === 'username' && (
            <GlassInput
              icon="User"
              placeholder={t('auth.usernamePlaceholder')}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          )}
          {loginMethod === 'email' && (
            <GlassInput
              icon="Mail"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          {loginMethod === 'phone' && (
            <GlassInput
              icon="Phone"
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}
        </View>

        <GlassInput
          icon="Lock"
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secure
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onForgotPassword}
          style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end', marginTop: 2 }}
        >
          <Text style={[styles.forgotText, { color: colors.textSecondary }]}>
            {t('auth.forgotPassword')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSubmit}
          style={[
            styles.submitButton,
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
            <Text style={[styles.submitText, { color: colors.textPrimary }]}>
              {t('auth.loginSubmit')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>{t('auth.or')}</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
      </View>

      <SocialAuthRow onSelect={onOAuth} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
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
  submitText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
