import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GlassButton, GlassInput, GlassBackButton, GlassSegmented } from '../Glass';
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
  const { colors } = useTheme();
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

        <View style={{ marginTop: 10 }}>
          <GlassButton size="lg" fullWidth onPress={onSubmit}>
            Authorize Login
          </GlassButton>
        </View>
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
            { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
          ]}
        >
          <Sparkles size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.oauthText, { color: colors.textPrimary }]}>Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOAuth}
          style={[
            styles.oauthBtn,
            { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
          ]}
        >
          <Globe size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.oauthText, { color: colors.textPrimary }]}>Google</Text>
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
    flex: 1,
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
