import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Onboarding } from '../src/screens/Onboarding';
import { AuroraBackground } from '../src/components/AuroraBackground';
import { useAuthStore } from '../src/store/authStore';
import { useTheme } from '../src/lib/theme';

export default function OnboardingRoute() {
  const router = useRouter();
  const { isDark } = useTheme();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleComplete = useCallback(() => {
    setOnboarded(true);
    router.replace('/(tabs)/discover');
  }, [setOnboarded, router]);

  return (
    <View style={styles.container}>
      <AuroraBackground isDark={isDark} />
      <Onboarding onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
