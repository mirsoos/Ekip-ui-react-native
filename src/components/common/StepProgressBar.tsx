import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';

export function StepProgressBarComponent({
  currentStep,
  totalSteps,
  style,
}: {
  currentStep: number;
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
        style,
      ]}
    >
      {Array.from({ length: totalSteps }).map((_, i) => {
        const active = i <= currentStep;
        if (active) {
          return (
            <LinearGradient
              key={i}
              colors={['#f472b6', '#3b82f6']}
              start={{ x: isRTL ? 1 : 0, y: 0 }}
              end={{ x: isRTL ? 0 : 1, y: 0 }}
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

export const StepProgressBar = React.memo(StepProgressBarComponent);

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
