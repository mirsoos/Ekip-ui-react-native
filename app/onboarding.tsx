import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Onboarding } from '../src/screens/Onboarding';
import { useAuthStore } from '../src/store/authStore';

export default function OnboardingRoute() {
  const router = useRouter();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleComplete = useCallback(() => {
    setOnboarded(true);
    router.replace('/(tabs)/discover');
  }, [setOnboarded, router]);

  return <Onboarding onComplete={handleComplete} />;
}
