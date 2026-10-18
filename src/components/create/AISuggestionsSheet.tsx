import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassCard, GlassButton } from '../Glass';
import { GlassSheet } from '../Overlays';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';

const suggestions = [
  'Add an operational title like "Sector 4 Night Patrol"',
  'Include 3-5 tags to improve tactical matching',
  'Set clearance rank requirements for senior operators',
  'Define exact rendezvous coordinates for smooth muster',
  'Enable auto-accept for rapid squad deployment',
];

export function AISuggestionsSheet({
  open,
  onClose,
  onApplyTitle,
}: {
  open: boolean;
  onClose: () => void;
  onApplyTitle?: (title: string) => void;
}) {
  const { colors } = useTheme();
  const Sparkles = getIcon('Sparkles');

  return (
    <GlassSheet open={open} onClose={onClose} title="AI Tactical Recommendations">
      <View style={{ gap: 10 }}>
        {suggestions.map((s, i) => (
          <GlassCard key={i} variant="thin" style={styles.card}>
            <View style={styles.iconBox}>
              <Sparkles size={16} color="#f472b6" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.text, { color: colors.textSecondary }]}>
                {s}
              </Text>
              {s.includes('"') && onApplyTitle && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const match = s.match(/"([^"]+)"/);
                    if (match) onApplyTitle(match[1]);
                    onClose();
                  }}
                  style={{ marginTop: 4 }}
                >
                  <Text style={styles.applyBtn}>Use this suggestion</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        ))}

        <View style={{ marginTop: 6 }}>
          <GlassButton fullWidth variant="secondary" onPress={onClose}>
            Dismiss
          </GlassButton>
        </View>
      </View>
    </GlassSheet>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 18,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(244, 114, 182, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
  },
  applyBtn: {
    color: '#f472b6',
    fontSize: 11,
    fontWeight: '700',
  },
});
