import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../src/screens/AuthScreen';
import { useAuthStore } from '../src/store/authStore';

export default function AuthRoute() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleComplete = useCallback(() => {
    setAuthenticated(true);
    setOnboarded(false);
    router.replace('/onboarding');
  }, [setAuthenticated, setOnboarded, router]);

  return <AuthScreen onComplete={handleComplete} />;
}
