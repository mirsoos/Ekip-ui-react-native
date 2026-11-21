import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuthStore } from '../store/authStore';

export default function AuthRoute() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const handleAuthComplete = () => {
    setAuthenticated(true);
    router.replace('/(tabs)/discover');
  };

  return (
    <View style={styles.container}>
      <AuthScreen onComplete={handleAuthComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
