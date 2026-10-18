import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';

export function StepProgressBar({
  currentStep,
  totalSteps,
  style,
}: {
  currentStep: number;
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const active = i <= currentStep;
        if (active) {
          return (
            <LinearGradient
              key={i}
              colors={['#f472b6', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.stepBar}
            />
          );
        }
        return (
          <View
            key={i}
            style={[styles.stepBar, { backgroundColor: colors.glassThinBg }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  stepBar: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
  },
});
