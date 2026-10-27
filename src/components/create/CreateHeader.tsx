import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { StepProgressBar } from '../common/StepProgressBar';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

export const CreateHeader = React.memo(function CreateHeader({
  step,
  totalSteps,
  onBack,
  onOpenAI,
}: {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onOpenAI: () => void;
}) {
  const { colors } = useTheme();
  const Sparkles = getIcon('Sparkles');

  return (
    <FloatingGlassHeader
      onBack={onBack}
      trailing={
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOpenAI}
          style={[
            styles.aiBtn,
            { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
          ]}
        >
          <Sparkles size={16} color="#f472b6" strokeWidth={2.4} />
        </TouchableOpacity>
      }
    >
      <StepProgressBar currentStep={step} totalSteps={totalSteps} />
    </FloatingGlassHeader>
  );
});

const styles = StyleSheet.create({
  aiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
