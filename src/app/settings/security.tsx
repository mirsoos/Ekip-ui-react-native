import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SecurityScreen } from '../../screens/SecurityScreen';

export default function SecurityRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SecurityScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
