import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Onboarding } from '../screens/Onboarding';
import { useAuthStore } from '../store/authStore';

export default function OnboardingRoute() {
  const router = useRouter();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleOnboardingComplete = () => {
    setOnboarded(true);
    router.replace('/(tabs)/discover');
  };

  return (
    <View style={styles.container}>
      <Onboarding onComplete={handleOnboardingComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
