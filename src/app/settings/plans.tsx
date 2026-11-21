import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PlansScreen } from '../../screens/PlansScreen';

export default function PlansRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <PlansScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
