import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassChip } from '../Glass';
import { useTheme } from '../../lib/theme';

export function TagSelector({
  availableTags,
  selectedTags,
  onToggleTag,
}: {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Tags & Objectives
        </Text>
        <Text style={[styles.count, { color: colors.textTertiary }]}>
          {selectedTags.length} selected
        </Text>
      </View>

      <View style={styles.wrap}>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <GlassChip
              key={tag}
              active={isSelected}
              onPress={() => onToggleTag(tag)}
            >
              {tag}
            </GlassChip>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  count: {
    fontSize: 11,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
