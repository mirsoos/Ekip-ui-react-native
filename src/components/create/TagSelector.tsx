import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassChip } from '../Glass';
import { useTheme } from '../../lib/theme';

const TagSelectorChip = React.memo(function TagSelectorChip({
  tag,
  selected,
  onToggleTag,
}: {
  tag: string;
  selected: boolean;
  onToggleTag: (tag: string) => void;
}) {
  const handlePress = React.useCallback(() => onToggleTag(tag), [onToggleTag, tag]);

  return (
    <GlassChip active={selected} onPress={handlePress}>
      {tag}
    </GlassChip>
  );
});

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
            <TagSelectorChip
              key={tag}
              tag={tag}
              selected={isSelected}
              onToggleTag={onToggleTag}
            />
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
