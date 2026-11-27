import React, { useRef } from 'react';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { EkipDetail, EkipDetailHeader, type EkipDetailHandle } from '@/src/features/ekip';
import { ScreenLayout } from '@/src/components/common/ScreenLayout';
import { useEkipStore } from '@/src/store/ekipStore';

export default function GroupDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = typeof id === 'string' ? id : id?.[0];
  const group = useEkipStore((s) => s.groups.find((g) => g.id === groupId));
  const detailRef = useRef<EkipDetailHandle>(null);

  if (!group) return <Redirect href="/(tabs)/discover" />;

  return (
    <ScreenLayout
      header={<EkipDetailHeader group={group} onBack={() => router.back()} onShare={() => detailRef.current?.openShare()} />}
    >
      <EkipDetail
        ref={detailRef}
        group={group}
        onBack={() => router.back()}
        onOpenProfile={(uid) => router.push({ pathname: '/profile/[id]', params: { id: uid } })}
        onOpenChat={(cid) => router.push({ pathname: '/chat/[id]', params: { id: cid } })}
      />
    </ScreenLayout>
  );
}
