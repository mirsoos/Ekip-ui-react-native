import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChatThemeScreen } from '../../screens/ChatThemeScreen';

export default function ThemeRoute() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ChatThemeScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
