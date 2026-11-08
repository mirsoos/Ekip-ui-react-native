import React, { useMemo } from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';

export interface HighlightedTextProps {
  text: string;
  searchQuery?: string;
  style?: TextStyle | TextStyle[];
  highlightColor?: string;
  highlightTextColor?: string;
}

export const HighlightedText = React.memo(function HighlightedText({
  text,
  searchQuery = '',
  style,
  highlightColor = 'rgba(250, 204, 21, 0.4)', // Amber highlight
  highlightTextColor = '#ffffff',
}: HighlightedTextProps) {
  const parts = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || !text) {
      return [{ text, isMatch: false }];
    }

    // Escape regex special characters
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const splitParts = text.split(regex);

    return splitParts.map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === trimmed.toLowerCase(),
    }));
  }, [text, searchQuery]);

  return (
    <Text style={style}>
      {parts.map((p, idx) =>
        p.isMatch ? (
          <Text
            key={idx}
            style={[
              styles.highlight,
              { backgroundColor: highlightColor, color: highlightTextColor },
            ]}
          >
            {p.text}
          </Text>
        ) : (
          <Text key={idx}>{p.text}</Text>
        )
      )}
    </Text>
  );
});

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
    borderRadius: 3,
    paddingHorizontal: 2,
  },
});
