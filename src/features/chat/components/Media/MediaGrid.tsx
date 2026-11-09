import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import type { Attachment } from '../../types/chat.types';
import { SpoilerView } from '../RichText/SpoilerView';

export interface MediaGridProps {
  attachments: Attachment[];
  onPressItem?: (attachment: Attachment, index: number) => void;
  maxWidth?: number;
}

function MediaTile({
  item,
  index,
  style,
  onPress,
  isLastWithMore,
  moreCount,
}: {
  item: Attachment;
  index: number;
  style: any;
  onPress: () => void;
  isLastWithMore?: boolean;
  moreCount?: number;
}) {
  const [revealed, setRevealed] = useState(!item.isSpoiler);

  const handlePress = () => {
    if (item.isSpoiler && !revealed) {
      setRevealed(true);
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.tile, style]}
    >
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: item.url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          placeholder={{ blurhash: item.blurhash || 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={200}
          cachePolicy="memory-disk"
        />
        {item.type === 'video' && !isLastWithMore && (
          <View style={styles.videoBadge}>
            <Play size={12} color="#ffffff" fill="#ffffff" />
          </View>
        )}
        {isLastWithMore && (
          <View style={styles.moreOverlay}>
            <Text style={styles.moreText}>+{moreCount}</Text>
          </View>
        )}
      </View>
      {item.isSpoiler && !revealed && (
        <SpoilerView
          initialRevealed={false}
          onReveal={() => setRevealed(true)}
          style={StyleSheet.absoluteFill}
        >
          <View style={StyleSheet.absoluteFill} />
        </SpoilerView>
      )}
    </TouchableOpacity>
  );
}

export const MediaGrid = React.memo(function MediaGrid({
  attachments,
  onPressItem,
  maxWidth = 260,
}: MediaGridProps) {
  const handleTilePress = useCallback(
    (index: number) => {
      const item = attachments[index];
      if (onPressItem) {
        onPressItem(item, index);
      }
    },
    [attachments, onPressItem]
  );

  if (!attachments || attachments.length === 0) return null;

  const count = attachments.length;

  // Single Item: Full size card
  if (count === 1) {
    const item = attachments[0];
    return (
      <View style={[styles.container, styles.singleItem, { width: maxWidth, height: 200 }]}>
        <MediaTile
          item={item}
          index={0}
          style={{ width: '100%', height: '100%', borderRadius: 14 }}
          onPress={() => handleTilePress(0)}
        />
      </View>
    );
  }

  // 2 Items: Side by side split
  if (count === 2) {
    const halfWidth = (maxWidth - 4) / 2;
    return (
      <View style={[styles.container, styles.rowLayout, { width: maxWidth, height: 160 }]}>
        {attachments.map((item, idx) => (
          <MediaTile
            key={item.id}
            item={item}
            index={idx}
            style={{ width: halfWidth, height: '100%' }}
            onPress={() => handleTilePress(idx)}
          />
        ))}
      </View>
    );
  }

  // 3 Items: 1 large left + 2 stacked right
  if (count === 3) {
    const leftWidth = (maxWidth - 4) * 0.58;
    const rightWidth = (maxWidth - 4) * 0.42;
    const rightHeight = (180 - 4) / 2;

    return (
      <View style={[styles.container, styles.rowLayout, { width: maxWidth, height: 180 }]}>
        {/* Left large */}
        <MediaTile
          item={attachments[0]}
          index={0}
          style={{ width: leftWidth, height: '100%' }}
          onPress={() => handleTilePress(0)}
        />

        {/* Right stacked */}
        <View style={[styles.colLayout, { width: rightWidth, height: '100%' }]}>
          {[1, 2].map((idx) => {
            const item = attachments[idx];
            return (
              <MediaTile
                key={item.id}
                item={item}
                index={idx}
                style={{ width: '100%', height: rightHeight }}
                onPress={() => handleTilePress(idx)}
              />
            );
          })}
        </View>
      </View>
    );
  }

  // 4 or More Items: 2x2 grid with +N on 4th tile if > 4
  const tileSize = (maxWidth - 4) / 2;
  const displayItems = attachments.slice(0, 4);
  const extraCount = count - 4;

  return (
    <View style={[styles.container, styles.gridWrap, { width: maxWidth }]}>
      {displayItems.map((item, idx) => {
        const isLast = idx === 3 && extraCount > 0;
        return (
          <MediaTile
            key={item.id}
            item={item}
            index={idx}
            style={{ width: tileSize, height: tileSize }}
            onPress={() => handleTilePress(idx)}
            isLastWithMore={isLast}
            moreCount={extraCount + 1}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0a0f1d',
    position: 'relative',
  },
  singleItem: {
    borderRadius: 14,
  },
  rowLayout: {
    flexDirection: 'row',
    gap: 4,
  },
  colLayout: {
    flexDirection: 'column',
    gap: 4,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tile: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  videoBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
});
