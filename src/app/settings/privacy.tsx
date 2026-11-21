import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PrivacyScreen } from '../../screens/PrivacyScreen';

export default function PrivacyRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <PrivacyScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
