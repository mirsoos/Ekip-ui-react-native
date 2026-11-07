// --- START OF FILE AuthScreen.tsx ---

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, BackHandler, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [forgotStep, setForgotStep] = useState<'request' | 'otp' | 'new-password' | 'success'>('request');

  // بستن کیبورد قبل از شروع ترنزیشن صفحه برای جلوگیری از پرش ارتفاع در موبایل
  const switchToWelcome = useCallback(() => {
    Keyboard.dismiss();
    setShow2FA(false);
    setMode('welcome');
  }, []);

  const switchToLogin = useCallback(() => {
    Keyboard.dismiss();
    setShow2FA(false);
    setMode('login');
  }, []);

  const switchToRegister = useCallback(() => {
    Keyboard.dismiss();
    setMode('register');
  }, []);

  const switchToForgot = useCallback(() => {
    Keyboard.dismiss();
    setForgotStep('request');
    setMode('forgot');
  }, []);

  const handleLoginSubmit = useCallback(() => {
    Keyboard.dismiss();
    setOtp('');
    setShow2FA(true);
  }, []);

  const handleBackFrom2FA = useCallback(() => {
    Keyboard.dismiss();
    setShow2FA(false);
  }, []);

  // مدیریت دکمه Back فیزیکی و ژست برگشت در اندروید
  useEffect(() => {
    const onHardwareBack = () => {
      if (mode === 'login' && show2FA) {
        handleBackFrom2FA();
        return true;
      }
      if (mode === 'forgot') {
        switchToLogin();
        return true;
      }
      if (mode === 'login' || mode === 'register') {
        switchToWelcome();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [mode, show2FA, handleBackFrom2FA, switchToLogin, switchToWelcome]);

  // کلید یکتا برای کامپوننت واحد ScreenTransition
  const activeScreenKey =
    mode === 'welcome'
      ? `auth-welcome-${language}`
      : mode === 'forgot'
      ? `auth-forgot-${forgotStep}-${language}`
      : mode === 'login'
      ? show2FA
        ? `auth-2fa-${language}`
        : `auth-login-${language}`
      : `auth-register-${language}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScreenTransition screenKey={activeScreenKey}>
        {mode === 'welcome' ? (
          <WelcomeView
            onLogin={switchToLogin}
            onRegister={switchToRegister}
            onOAuth={onComplete}
          />
        ) : mode === 'forgot' ? (
          <ForgotPasswordView
            onBack={switchToLogin}
            onComplete={switchToLogin}
            onStepChange={setForgotStep}
          />
        ) : mode === 'login' ? (
          show2FA ? (
            <TwoFactorView
              otp={otp}
              setOtp={setOtp}
              onBack={handleBackFrom2FA}
              onComplete={onComplete}
            />
          ) : (
            <LoginForm
              onBack={switchToWelcome}
              onSubmit={handleLoginSubmit}
              onOAuth={onComplete}
              onForgotPassword={switchToForgot}
            />
          )
        ) : (
          <RegisterWizard
            onBack={switchToWelcome}
            onComplete={onComplete}
          />
        )}
      </ScreenTransition>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});