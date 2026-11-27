import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  CreateScreen,
  CreateHeader,
  CreateContinueButton,
  type CreateScreenHandle,
} from '@/src/features/create';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';

export default function CreateRoute() {
  const router = useRouter();
  const createRef = useRef<CreateScreenHandle>(null);
  const [createState, setCreateState] = useState({ step: 0, canProceed: false });

  return (
    <ScreenLayout
      header={
        <CreateHeader
          step={createState.step}
          totalSteps={4}
          onBack={() => createRef.current?.handlePrev()}
          onOpenAI={() => createRef.current?.openAI()}
        />
      }
      footer={
        <CreateContinueButton
          step={createState.step}
          totalSteps={4}
          disabled={!createState.canProceed}
          onPress={() => createRef.current?.handleNext()}
        />
      }
    >
      <CreateScreen
        ref={createRef}
        onStateChange={setCreateState}
        onBack={() => router.back()}
        onCreated={(g) => router.push({ pathname: '/group/[id]', params: { id: g.id } })}
      />
    </ScreenLayout>
  );
}
