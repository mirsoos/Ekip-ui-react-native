import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard, GlassButton } from '../Glass';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import type { GroupRequest } from '../../types/database';

export interface EkipActionBarProps {
  isOwner: boolean;
  isMember: boolean;
  myRequest?: GroupRequest;
  eligible: boolean;
  full: boolean;
  autoAccept: boolean;
  onStartChat: () => void;
  onOpenJoinSheet: () => void;
  onCancelRequest: () => void;
}

export function EkipActionBar({
  isOwner,
  isMember,
  myRequest,
  eligible,
  full,
  autoAccept,
  onStartChat,
  onOpenJoinSheet,
  onCancelRequest,
}: EkipActionBarProps) {
  const { colors } = useTheme();
  const ClockIcon = getIcon('Clock');

  return (
    <View style={styles.container}>
      <GlassCard variant="thick" style={styles.card}>
        {isOwner ? (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <GlassButton variant="secondary" icon="Edit" fullWidth>
                Edit
              </GlassButton>
            </View>
            <View style={{ flex: 1 }}>
              <GlassButton variant="secondary" icon="Users" fullWidth>
                Manage
              </GlassButton>
            </View>
          </View>
        ) : isMember || myRequest?.status === 'accepted' ? (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <GlassButton
                variant="secondary"
                icon="MessageCircle"
                fullWidth
                onPress={onStartChat}
              >
                Chat
              </GlassButton>
            </View>
            <View style={{ flex: 1 }}>
              <GlassButton variant="secondary" icon="CheckCircle2" fullWidth>
                Deployed
              </GlassButton>
            </View>
          </View>
        ) : myRequest?.status === 'pending' ? (
          <View style={styles.row}>
            <View style={styles.pendingIndicator}>
              <ClockIcon size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
                Pending Clearance
              </Text>
            </View>
            <GlassButton variant="secondary" icon="X" onPress={onCancelRequest}>
              Cancel
            </GlassButton>
          </View>
        ) : (
          <GlassButton
            fullWidth
            size="lg"
            icon="UserPlus"
            onPress={onOpenJoinSheet}
            disabled={!eligible || full}
          >
            {!eligible
              ? 'Clearance Not Met'
              : full
              ? 'Squad Full'
              : autoAccept
              ? 'Deploy Now'
              : 'Request Clearance'}
          </GlassButton>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  card: {
    padding: 10,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
