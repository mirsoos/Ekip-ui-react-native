import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PersonalInfoScreen } from '../../screens/PersonalInfoScreen';

export default function PersonalInfoRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <PersonalInfoScreen
        onBack={() => router.back()}
        onOpenVerification={() => router.push('/settings/verification')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
