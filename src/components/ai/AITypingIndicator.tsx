import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';

export function AITypingIndicator() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: colors.glassThickBg, borderColor: colors.glassBorder },
        ]}
      >
        <View style={styles.dot} />
        <View style={[styles.dot, { opacity: 0.6 }]} />
        <View style={[styles.dot, { opacity: 0.3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f472b6',
  },
});
