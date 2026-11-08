import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Waveform } from './Waveform';
import { useChatAudioPlayback } from '../../store/chatStore';
import { useChatTheme, CHAT_THEMES } from '../../../../lib/theme';

export interface AudioPlayerProps {
  messageId: string;
  duration?: number;
  waveform?: number[];
  isMe?: boolean;
}

const formatSeconds = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const remainder = s % 60;
  return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
};

export const AudioPlayer = React.memo(function AudioPlayer({
  messageId,
  duration = 15,
  waveform,
  isMe = true,
}: AudioPlayerProps) {
  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;
  const {
    isPlaying,
    progress,
    speed,
    playAudio,
    pauseAudio,
    stopAudio,
    seekAudio,
    setPlaybackSpeed,
  } = useChatAudioPlayback(messageId);

  // Clean up if component unmounts while playing
  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopAudio();
      }
    };
  }, [isPlaying, stopAudio]);

  const togglePlay = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isPlaying) {
      pauseAudio(messageId);
    } else {
      playAudio(messageId, duration);
    }
  }, [isPlaying, pauseAudio, playAudio, messageId, duration]);

  const handleSeek = useCallback(
    (newProgress: number) => {
      seekAudio(messageId, newProgress);
    },
    [seekAudio, messageId]
  );

  const cycleSpeed = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    let nextSpeed = 1.0;
    if (speed === 1.0) nextSpeed = 1.5;
    else if (speed === 1.5) nextSpeed = 2.0;
    else nextSpeed = 1.0;
    setPlaybackSpeed(nextSpeed);
  }, [speed, setPlaybackSpeed]);

  const currentSeconds = progress * duration;
  const timeDisplay = isPlaying
    ? `${formatSeconds(currentSeconds)} / ${formatSeconds(duration)}`
    : formatSeconds(duration);

  return (
    <View style={styles.container}>
      {/* Play/Pause Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={togglePlay}
        style={[styles.playBtn, isMe ? styles.playBtnMe : [styles.playBtnOther, { backgroundColor: themeConfig.accentHex }]]}
      >
        {isPlaying ? (
          <Pause size={18} color="#ffffff" fill="#ffffff" />
        ) : (
          <Play size={18} color="#ffffff" fill="#ffffff" style={{ marginLeft: 2 }} />
        )}
      </TouchableOpacity>

      {/* Waveform Scrubber & Time */}
      <View style={styles.centerSection}>
        <Waveform
          waveform={waveform}
          progress={progress}
          isMe={isMe}
          onSeek={handleSeek}
          barCount={26}
          height={28}
          activeColor={isMe ? '#ffffff' : themeConfig.accentHex}
        />
        <View style={styles.timeRow}>
          <Text
            style={[
              styles.timeText,
              { color: isMe ? 'rgba(255, 255, 255, 0.7)' : 'rgba(148, 163, 184, 0.9)' },
            ]}
          >
            {timeDisplay}
          </Text>
        </View>
      </View>

      {/* Variable Speed Pill Button (1.0x -> 1.5x -> 2.0x with pitch preservation) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={cycleSpeed}
        style={[
          styles.speedBtn,
          isMe ? styles.speedBtnMe : [styles.speedBtnOther, { borderColor: themeConfig.accentHex + '4D' }],
        ]}
      >
        <Text style={[styles.speedText, isMe ? styles.speedTextMe : { color: themeConfig.accentHex }]}>
          {speed.toFixed(1)}x
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 10,
    minWidth: 230,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  playBtnOther: {
    backgroundColor: '#0284c7',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.2,
  },
  speedBtn: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  speedBtnOther: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  speedText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  speedTextMe: {
    color: '#ffffff',
  },
  speedTextOther: {
    color: '#38bdf8',
  },
});
