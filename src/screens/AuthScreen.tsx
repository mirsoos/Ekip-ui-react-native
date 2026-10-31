import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeView } from '../components/auth/WelcomeView';
import { LoginForm } from '../components/auth/LoginForm';
import { TwoFactorView } from '../components/auth/TwoFactorView';
import { ForgotPasswordView } from '../components/auth/ForgotPasswordView';
import { RegisterWizard } from '../components/auth/RegisterWizard';
import { ScreenTransition } from '../components/common/ScreenTransition';
import { useI18n } from '../lib/i18n';

export function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const { language } = useI18n();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register' | 'forgot'>('welcome');
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');

  if (mode === 'welcome') {
    return (
      <View style={styles.container}>
        <ScreenTransition screenKey={`auth-welcome-${language}`}>
          <WelcomeView
            onLogin={() => setMode('login')}
            onRegister={() => setMode('register')}
            onOAuth={onComplete}
          />
        </ScreenTransition>
      </View>
    );
  }

  if (mode === 'forgot') {
    return (
      <View style={styles.container}>
        <ScreenTransition screenKey={`auth-forgot-${language}`}>
          <ForgotPasswordView
            onBack={() => setMode('login')}
            onComplete={() => setMode('login')}
          />
        </ScreenTransition>
      </View>
    );
  }

  if (mode === 'login') {
    if (show2FA) {
      return (
        <View style={styles.container}>
          <ScreenTransition screenKey={`auth-2fa-${language}`}>
            <TwoFactorView
              otp={otp}
              setOtp={setOtp}
              onBack={() => setShow2FA(false)}
              onComplete={onComplete}
            />
          </ScreenTransition>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScreenTransition screenKey={`auth-login-${language}`}>
          <LoginForm
            onBack={() => setMode('welcome')}
            onSubmit={() => setShow2FA(true)}
            onOAuth={onComplete}
            onForgotPassword={() => setMode('forgot')}
          />
        </ScreenTransition>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenTransition screenKey={`auth-register-${language}`}>
        <RegisterWizard
          onBack={() => setMode('welcome')}
          onComplete={onComplete}
        />
      </ScreenTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
