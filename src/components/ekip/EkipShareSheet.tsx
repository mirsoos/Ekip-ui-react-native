import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard } from '../Glass';
import { GlassSheet } from '../Overlays';
import { getIcon, type IconName } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

const shareOptions: { label: string; icon: IconName }[] = [
  { label: 'Copy Link', icon: 'Link' },
  { label: 'Comms', icon: 'MessageCircle' },
  { label: 'Radio', icon: 'Radio' },
  { label: 'More', icon: 'Share' },
];

export function EkipShareSheetComponent({
  open,
  groupId,
  onClose,
  onCopy,
}: {
  open: boolean;
  groupId: string;
  onClose: () => void;
  onCopy?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <GlassSheet open={open} onClose={onClose} title="Transmit Squad Coordinates">
      <View style={styles.grid}>
        {shareOptions.map((s) => {
          const IconComp = getIcon(s.icon);
          return (
            <TouchableOpacity
              key={s.label}
              activeOpacity={0.75}
              onPress={s.label === 'Copy Link' ? onCopy : undefined}
              style={styles.optionItem}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
                ]}
              >
                <IconComp size={22} color={colors.textPrimary} strokeWidth={2} />
              </View>
              <Text style={[styles.optionLabel, { color: colors.textSecondary }]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 20 }}>
        <GlassCard variant="thin" style={styles.copyBox}>
          <Text style={[styles.copyUrl, { color: colors.textSecondary }]} numberOfLines={1}>
            ekip.app/op/{groupId}
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onCopy}>
            <Text style={styles.copyBtn}>Copy</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </GlassSheet>
  );
}

export const EkipShareSheet = React.memo(EkipShareSheetComponent);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  optionItem: {
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  copyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
  },
  copyUrl: {
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  copyBtn: {
    color: '#f472b6',
    fontSize: 13,
    fontWeight: '700',
  },
});
