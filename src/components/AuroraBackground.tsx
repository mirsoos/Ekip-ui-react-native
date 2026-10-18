import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../lib/theme';

export function AuroraBackground() {
  const { isDark } = useTheme();

  if (Platform.OS === 'web') {
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: isDark ? '#04060c' : '#ebf0fa' },
          ]}
        />
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </View>
    );
  }

  // Native (Android/iOS) static gradient blobs without JS thread overhead
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: isDark ? '#04060c' : '#ebf0fa' },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            top: -50,
            left: -50,
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(56, 189, 248, 0.35)',
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            top: '30%',
            right: -60,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: isDark ? 'rgba(244, 114, 182, 0.16)' : 'rgba(244, 114, 182, 0.30)',
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            bottom: -60,
            left: '15%',
            width: 340,
            height: 340,
            borderRadius: 170,
            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.25)',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
