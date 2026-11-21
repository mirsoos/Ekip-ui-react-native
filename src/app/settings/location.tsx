import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LocationScreen } from '../../screens/LocationScreen';

export default function LocationRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <LocationScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
