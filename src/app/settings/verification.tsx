import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { VerificationScreen } from '../../screens/VerificationScreen';

export default function VerificationRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <VerificationScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
