import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export function LoginForm({
  onBack,
  onSubmit,
  onOAuth,
}: {
  onBack: () => void;
  onSubmit: () => void;
  onOAuth: () => void;
}) {
  const { colors, isDark } = useTheme();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  const Sparkles = getIcon('Sparkles');
  const Globe = getIcon('Globe');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <GlassBackButton onPress={onBack} style={{ marginBottom: 20 }} />

      <Text style={[styles.heading, { color: colors.textPrimary }]}>
        Welcome Back
      </Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        Authenticate with tactical clearance
      </Text>

      {/* Tabs */}
      <View style={{ marginTop: 20 }}>
        <GlassSegmented
          options={[
            { label: 'Email', value: 'email' },
            { label: 'Radio/Phone', value: 'phone' },
            { label: 'Callsign', value: 'username' },
          ]}
          value={loginMethod}
          onChange={(v) => setLoginMethod(v as any)}
        />
      </View>

      {/* Input fields */}
      <View style={{ gap: 12, marginTop: 16 }}>
        <View key={loginMethod} className="animate-raise">
          {loginMethod === 'email' && (
            <GlassInput
              icon="Mail"
              placeholder="Tactical Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          )}
          {loginMethod === 'phone' && (
            <GlassInput
              icon="Phone"
              placeholder="Radio / Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}
          {loginMethod === 'username' && (
            <GlassInput
              icon="User"
              placeholder="Operator Callsign (username)"
              value={username}
              onChangeText={setUsername}
            />
          )}
        </View>

        <GlassInput
          icon="Lock"
          placeholder="Security Key / Password"
          value={password}
          onChangeText={setPassword}
          secure
        />

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 2 }}>
          <Text style={[styles.forgotText, { color: colors.textSecondary }]}>
            Forgot credentials?
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
            <Text style={[styles.submitText, { color: colors.textPrimary }]}>
              Authorize Login
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
      </View>

      <View style={styles.oauthRow}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOAuth}
          style={[
            styles.oauthBtn,
            {
              borderColor: colors.glassBorderStrong,
            },
          ]}
        >
          {/* 360° Liquid Glass Lens */}
          <LiquidLens
            borderRadius={20}
            marginWidth={12}
            scale={24}
            blurDeviation={1.8}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.oauthContent}>
            <Sparkles size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.oauthText, { color: colors.textPrimary }]}>Apple</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOAuth}
          style={[
            styles.oauthBtn,
            {
              borderColor: colors.glassBorderStrong,
            },
          ]}
        >
          {/* 360° Liquid Glass Lens */}
          <LiquidLens
            borderRadius={20}
            marginWidth={12}
            scale={24}
            blurDeviation={1.8}
            overlayOpacity={isDark ? 0.08 : 0.15}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.oauthContent}>
            <Globe size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.oauthText, { color: colors.textPrimary }]}>Google</Text>
          </View>
        </TouchableOpacity>
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
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 12,
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
    fontSize: 12,
    marginHorizontal: 12,
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 12,
  },
  oauthBtn: {
    position: 'relative',
    flex: 1,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  oauthText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
