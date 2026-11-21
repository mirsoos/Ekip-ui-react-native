import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EkipDetail } from '../../screens/EkipDetail';
import { useEkipStore } from '../../store/ekipStore';

export default function EkipDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const groups = useEkipStore((s) => s.groups);
  const group = groups.find((g) => g.id === id);

  if (!group) return null;

  return (
    <View style={styles.container}>
      <EkipDetail
        group={group}
        onBack={() => router.back()}
        onOpenProfile={(userId) => router.push(`/profile/${userId}`)}
        onOpenChat={(convId) => router.push(`/chat/${convId}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
