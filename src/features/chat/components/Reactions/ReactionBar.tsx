import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { ParticleBurst } from './ParticleBurst';

export interface ReactionBarProps {
  visible: boolean;
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'relative';
  emojis?: string[];
}

const DEFAULT_EMOJIS = ['❤️', '👍', '🔥', '😂', '😮', '😢', '🎉', '🚀'];

export const ReactionBar = React.memo(function ReactionBar({
  visible,
  onSelectReaction,
  onClose,
  position = 'relative',
  emojis = DEFAULT_EMOJIS,
}: ReactionBarProps) {
  const [burstState, setBurstState] = useState<{
    active: boolean;
    emoji: string;
    x: number;
    y: number;
  }>({ active: false, emoji: '', x: 0, y: 0 });

  const handleEmojiPress = useCallback(
    (emoji: string, event: any) => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      const { pageX, pageY } = event.nativeEvent;
      setBurstState({
        active: true,
        emoji,
        x: pageX || 150,
        y: pageY || 200,
      });

      onSelectReaction(emoji);

      setTimeout(() => {
        onClose();
      }, 250);
    },
    [onSelectReaction, onClose]
  );

  return (
    <>
      {visible && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={[
            styles.container,
            position === 'top'
              ? styles.positionTop
              : position === 'bottom'
              ? styles.positionBottom
              : styles.positionRelative,
          ]}
        >
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={styles.capsule}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.androidGlassFallback]} />
            )}

            <View style={styles.emojisRow}>
              {emojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  activeOpacity={0.65}
                  onPress={(e) => handleEmojiPress(emoji, e)}
                  style={styles.emojiButton}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* Particle Explosion on Selection */}
      {burstState.active && (
        <ParticleBurst
          emoji={burstState.emoji}
          x={burstState.x}
          y={burstState.y}
          count={10}
          onComplete={() => setBurstState({ active: false, emoji: '', x: 0, y: 0 })}
        />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  positionTop: {
    top: -48,
  },
  positionBottom: {
    bottom: -48,
  },
  positionRelative: {
    position: 'relative',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 10,
    alignSelf: 'center',
  },
  capsule: {
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  androidGlassFallback: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
  },
  emojisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emojiButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
  },
  emojiText: {
    fontSize: 22,
  },
});
