import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { StepProgressBar } from '../common/StepProgressBar';
import { FloatingGlassHeader } from '../common/FloatingGlassHeader';
import { AiEkipLogo } from '../common/AiEkipLogo';
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
          <AiEkipLogo size={26} />
        </TouchableOpacity>
      }
    >
      <StepProgressBar currentStep={step} totalSteps={totalSteps} />
    </FloatingGlassHeader>
  );
});

const styles = StyleSheet.create({
  aiBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
