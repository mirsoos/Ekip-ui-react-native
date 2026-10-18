import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassButton, GlassInput } from '../Glass';
import { GlassSheet } from '../Overlays';
import { useTheme } from '../../lib/theme';
import type { Group } from '../../types/database';

export function EkipJoinModal({
  open,
  group,
  eligible,
  message,
  onChangeMessage,
  onSubmit,
  onClose,
}: {
  open: boolean;
  group: Group;
  eligible: boolean;
  message: string;
  onChangeMessage: (msg: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();

  return (
    <GlassSheet open={open} onClose={onClose} title={`Join ${group.title}`}>
      <View style={{ gap: 14 }}>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {group.auto_accept
            ? 'Automatic clearance enabled. You will be deployed immediately.'
            : 'Send a clearance request note to the squad commander.'}
        </Text>

        {!group.auto_accept && (
          <GlassInput
            placeholder="Transmit operator credentials / introduction..."
            value={message}
            onChangeText={onChangeMessage}
            multiline
            numberOfLines={3}
          />
        )}

        <View style={{ marginTop: 8 }}>
          <GlassButton
            fullWidth
            size="lg"
            onPress={onSubmit}
            disabled={!eligible}
          >
            {group.auto_accept ? 'Deploy Immediately' : 'Transmit Request'}
          </GlassButton>
        </View>
      </View>
    </GlassSheet>
  );
}

const styles = StyleSheet.create({
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
