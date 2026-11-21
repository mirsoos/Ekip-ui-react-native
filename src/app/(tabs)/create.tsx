import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CreateScreen, type CreateScreenHandle } from '../../screens/CreateScreen';
import { CreateHeader } from '../../components/create/CreateHeader';
import { CreateContinueButton } from '../../components/create/CreateContinueButton';
import { MotionView } from '../../components/common/MotionView';
import { useEkipStore } from '../../store/ekipStore';
import type { Group } from '../../types/database';

export default function CreateRoute() {
  const router = useRouter();
  const addGroup = useEkipStore((s) => s.addGroup);
  const createRef = useRef<CreateScreenHandle>(null);
  const [createState, setCreateState] = useState({ step: 0, canProceed: false });

  const handleGroupCreated = (group: Group) => {
    addGroup(group);
    router.push(`/(tabs)/discover`);
  };

  const handleBack = () => {
    if (createState.step > 0) {
      createRef.current?.handlePrev();
    } else {
      router.push('/(tabs)/discover');
    }
  };

  return (
    <View style={styles.container}>
      <CreateHeader
        step={createState.step}
        totalSteps={4}
        onBack={handleBack}
        onOpenAI={() => router.push('/ai')}
      />

      <MotionView style={styles.motionContainer}>
        <CreateScreen
          ref={createRef}
          onStateChange={setCreateState}
          onBack={handleBack}
          onCreated={handleGroupCreated}
        />
      </MotionView>

      <CreateContinueButton
        step={createState.step}
        totalSteps={4}
        disabled={!createState.canProceed}
        onPress={() => createRef.current?.handleNext()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  motionContainer: {
    flex: 1,
  },
});
