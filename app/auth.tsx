import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../src/screens/AuthScreen';
import { AuroraBackground } from '../src/components/AuroraBackground';
import { useAuthStore } from '../src/store/authStore';
import { useTheme } from '../src/lib/theme';

export default function AuthRoute() {
  const router = useRouter();
  const { isDark } = useTheme();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleComplete = useCallback(() => {
    setAuthenticated(true);
    setOnboarded(false);
    router.replace('/onboarding');
  }, [setAuthenticated, setOnboarded, router]);

  return (
    <View style={styles.container}>
      <AuroraBackground isDark={isDark} />
      <AuthScreen onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
