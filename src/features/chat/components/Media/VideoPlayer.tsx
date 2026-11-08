import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { Attachment } from '../../types/chat.types';

export interface VideoPlayerProps {
  attachment: Attachment;
  isVisibleInViewport?: boolean;
  onOpenFullscreen?: () => void;
  width?: number;
  height?: number;
}

const formatSeconds = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const remainder = s % 60;
  return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
};

export const VideoPlayer = React.memo(function VideoPlayer({
  attachment,
  isVisibleInViewport = true,
  onOpenFullscreen,
  width = 240,
  height = 180,
}: VideoPlayerProps) {
  const duration = attachment.duration || 30;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Viewport visibility tracking: Auto-pause when scrolled off-screen
  useEffect(() => {
    if (!isVisibleInViewport && isPlaying) {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      setIsPlaying(false);
    }
  }, [isVisibleInViewport, isPlaying]);

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (isPlaying) {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const totalSteps = Math.max(10, Math.round(duration * 10));
      let step = Math.round(progress * totalSteps);

      playbackTimerRef.current = setInterval(() => {
        step++;
        const p = Math.min(1, step / totalSteps);
        if (p >= 1) {
          if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
          setIsPlaying(false);
          setProgress(0);
        } else {
          setProgress(p);
        }
      }, 100);
    }
  }, [isPlaying, duration, progress]);

  const toggleMute = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setIsMuted((prev) => !prev);
  }, []);

  const handleSeekPress = useCallback(
    (e: any) => {
      const { locationX } = e.nativeEvent;
      const targetWidth = width - 24;
      const newProgress = Math.max(0, Math.min(1, locationX / targetWidth));
      setProgress(newProgress);
    },
    [width]
  );

  const posterUrl = attachment.thumbnailUrl || attachment.url;
  const currentSec = progress * duration;

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Video / Poster Frame */}
      <Image
        source={{ uri: posterUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        placeholder={{ blurhash: attachment.blurhash || 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={200}
      />

      {/* Dark overlay gradient */}
      <View style={styles.darkOverlay} />

      {/* Center Big Play/Pause Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={togglePlay}
        style={styles.centerPlayBtn}
      >
        {isPlaying ? (
          <Pause size={24} color="#ffffff" fill="#ffffff" />
        ) : (
          <Play size={24} color="#ffffff" fill="#ffffff" style={{ marginLeft: 3 }} />
        )}
      </TouchableOpacity>

      {/* Top Controls: Mute Toggle */}
      <View style={styles.topControls}>
        <TouchableOpacity onPress={toggleMute} style={styles.glassBtn} activeOpacity={0.7}>
          {isMuted ? <VolumeX size={15} color="#ffffff" /> : <Volume2 size={15} color="#ffffff" />}
        </TouchableOpacity>

        {onOpenFullscreen && (
          <TouchableOpacity onPress={onOpenFullscreen} style={styles.glassBtn} activeOpacity={0.7}>
            <Maximize2 size={14} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Controls: Custom Seek Bar & Timer */}
      <View style={styles.bottomControls}>
        {/* Seek track */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSeekPress}
          style={styles.seekTrackContainer}
        >
          <View style={styles.seekTrackBg}>
            <View style={[styles.seekProgress, { width: `${progress * 100}%` }]} />
          </View>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.timeText}>
            {formatSeconds(currentSec)} / {formatSeconds(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0a0f1d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  centerPlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 10,
  },
  topControls: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  glassBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 6,
    paddingTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  seekTrackContainer: {
    paddingVertical: 4,
  },
  seekTrackBg: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  seekProgress: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
});
