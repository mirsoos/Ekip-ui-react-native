import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Mic, Trash2, Lock, Send, ChevronUp, Play, Pause } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useChatStore } from '../../store/chatStore';
import { Waveform } from './Waveform';
import { useTheme } from '../../../../lib/theme';
import type { Attachment } from '../../types/chat.types';

export interface AudioRecorderProps {
  onSendVoiceNote: (attachment: Attachment) => void;
  onCancelRecording?: () => void;
  onStartRecording?: () => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onTapSwitchToSend?: () => void;
  accentColor?: string;
}

type RecordingState = 'idle' | 'recording' | 'locked' | 'preview';

export const AudioRecorder = React.memo(function AudioRecorder({
  onSendVoiceNote,
  onCancelRecording,
  onStartRecording,
  onRecordingStateChange,
  onTapSwitchToSend,
  accentColor = '#0284c7',
}: AudioRecorderProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [liveAmplitudes, setLiveAmplitudes] = useState<number[]>([]);

  const stopGlobalAudio = useChatStore((s) => s.stopAudio);

  // Reanimated shared values for gestures and micro-interactions
  const micScale = useSharedValue(1);
  const lockY = useSharedValue(0);
  const trashScale = useSharedValue(1);
  const trashShake = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);

  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const amplitudeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedAmplitudesRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (amplitudeTimerRef.current) {
      clearInterval(amplitudeTimerRef.current);
      amplitudeTimerRef.current = null;
    }
    if (previewTimerRef.current) {
      clearInterval(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      onRecordingStateChange?.(false);
      cancelAnimation(pulseOpacity);
      cancelAnimation(trashShake);
    };
  }, [clearAllTimers, onRecordingStateChange, pulseOpacity, trashShake]);

  // Start live recording
  const startRecording = useCallback(() => {
    // Concurrency requirement: Auto-pause any active audio playback
    stopGlobalAudio();

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setState('recording');
    onRecordingStateChange?.(true);
    setDuration(0);
    recordedAmplitudesRef.current = [];
    setLiveAmplitudes([]);
    onStartRecording?.();

    micScale.value = withTiming(1.1, { duration: 150, easing: Easing.out(Easing.quad) });
    pulseOpacity.value = withRepeat(withTiming(0.3, { duration: 600 }), -1, true);

    // Live timer
    durationTimerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Live dynamic bouncing amplitude generator
    amplitudeTimerRef.current = setInterval(() => {
      const amp = Math.max(0.15, Math.min(1, Math.random() * 0.85 + 0.15));
      recordedAmplitudesRef.current.push(amp);
      setLiveAmplitudes((prev) => {
        const slice = prev.length >= 24 ? prev.slice(1) : prev;
        return [...slice, amp];
      });
    }, 100);
  }, [stopGlobalAudio, onRecordingStateChange, onStartRecording, micScale, pulseOpacity]);

  // Cancel recording with dustbin animation
  const cancelRecording = useCallback(() => {
    clearAllTimers();
    onRecordingStateChange?.(false);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    trashScale.value = withTiming(1.2, { duration: 150, easing: Easing.out(Easing.quad) }, () => {
      trashScale.value = withTiming(1, { duration: 150 });
    });

    setState('idle');
    micScale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) });
    onCancelRecording?.();
  }, [clearAllTimers, onRecordingStateChange, onCancelRecording, micScale, trashScale]);

  // Lock hands-free recording
  const lockRecording = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setState('locked');
    micScale.value = withTiming(1, { duration: 150 });
    lockY.value = withTiming(0, { duration: 150 });
  }, [micScale, lockY]);

  // Switch to preview mode
  const pauseAndPreview = useCallback(() => {
    clearAllTimers();
    setState('preview');
    setIsPreviewPlaying(false);
    setPreviewProgress(0);
  }, [clearAllTimers]);

  // Preview playback simulation
  const togglePreviewPlay = useCallback(() => {
    stopGlobalAudio();
    if (isPreviewPlaying) {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
      setIsPreviewPlaying(false);
    } else {
      setIsPreviewPlaying(true);
      const totalSteps = Math.max(10, Math.round(duration * 10));
      let step = Math.round(previewProgress * totalSteps);

      previewTimerRef.current = setInterval(() => {
        step++;
        const p = Math.min(1, step / totalSteps);
        if (p >= 1) {
          if (previewTimerRef.current) clearInterval(previewTimerRef.current);
          setIsPreviewPlaying(false);
          setPreviewProgress(0);
        } else {
          setPreviewProgress(p);
        }
      }, 100);
    }
  }, [isPreviewPlaying, duration, previewProgress, stopGlobalAudio]);

  // Dispatch final voice note
  const sendRecording = useCallback(() => {
    clearAllTimers();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const finalDuration = Math.max(1, duration);
    const waveform =
      recordedAmplitudesRef.current.length > 0
        ? recordedAmplitudesRef.current
        : Array.from({ length: 28 }, () => Math.random() * 0.7 + 0.2);

    const attachment: Attachment = {
      id: `voice_${Date.now()}`,
      type: 'audio',
      url: `voice_note_${Date.now()}.m4a`,
      duration: finalDuration,
      fileName: `Voice note (${Math.floor(finalDuration / 60)}:${finalDuration % 60 < 10 ? '0' : ''}${finalDuration % 60})`,
      waveform,
    };

    onSendVoiceNote(attachment);
    onRecordingStateChange?.(false);
    setState('idle');
    setDuration(0);
    setLiveAmplitudes([]);
    recordedAmplitudesRef.current = [];
    micScale.value = 1;
  }, [clearAllTimers, duration, onSendVoiceNote, onRecordingStateChange, micScale]);

  const pressStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Gesture responder on Mic button
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pressStartRef.current = Date.now();
          hasMovedRef.current = false;
          if (state === 'idle') {
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
            holdTimerRef.current = setTimeout(() => {
              holdTimerRef.current = null;
              startRecording();
            }, 220);
          }
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (Math.abs(gesture.dx) > 6 || Math.abs(gesture.dy) > 6) {
            hasMovedRef.current = true;
          }
          if (state !== 'recording') return;

          // Slide Left to Cancel threshold (-65px)
          if (gesture.dx < -65) {
            cancelRecording();
            return;
          }

          // Slide Up to Lock threshold (-65px)
          if (gesture.dy < -65) {
            lockRecording();
            return;
          }

          // Dynamic tracking
          if (gesture.dx < 0) {
            trashShake.value = Math.sin(gesture.dx * 0.2) * 5;
          }
          if (gesture.dy < 0) {
            lockY.value = Math.max(-40, gesture.dy);
          }
        },
        onPanResponderRelease: () => {
          if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          if (state === 'idle') {
            if (Platform.OS !== 'web') {
              Haptics.selectionAsync();
            }
            if (onTapSwitchToSend) {
              onTapSwitchToSend();
            } else {
              startRecording();
              lockRecording();
            }
            return;
          }
          if (state === 'recording') {
            // Released while recording normally: instant send!
            sendRecording();
          }
        },
        onPanResponderTerminate: () => {
          if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          if (state === 'recording') {
            cancelRecording();
          }
        },
      }),
    [state, startRecording, cancelRecording, lockRecording, sendRecording, trashShake, lockY, onTapSwitchToSend]
  );

  const micAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const pulseDotAnimStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const trashAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trashScale.value }, { translateX: trashShake.value }],
  }));

  const lockAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lockY.value }],
  }));

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Hands-free Locked state
  if (state === 'locked') {
    return (
      <View style={[styles.fullOverlayContainer, { backgroundColor: colors.glassThickBg }]}>
        <View style={styles.lockedContainer}>
          {/* Discard / Trash button */}
          <TouchableOpacity onPress={cancelRecording} style={styles.iconBtn} activeOpacity={0.7}>
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>

          {/* Live Pulsing Timer */}
          <View style={styles.timerWrapper}>
            <Animated.View style={[styles.redDot, pulseDotAnimStyle]} />
            <Text style={styles.timerText}>{formatTimer(duration)}</Text>
          </View>

          {/* Live bouncing waveform */}
          <View style={styles.liveWaveformRow}>
            {liveAmplitudes.map((amp, idx) => (
              <View
                key={idx}
                style={[
                  styles.liveWaveformBar,
                  { height: Math.max(4, Math.round(amp * 24)) },
                ]}
              />
            ))}
          </View>

          {/* Pause & Preview button */}
          <TouchableOpacity onPress={pauseAndPreview} style={styles.previewBtn} activeOpacity={0.7}>
            <Text style={styles.previewBtnText}>Preview</Text>
          </TouchableOpacity>

          {/* Send button */}
          <TouchableOpacity onPress={sendRecording} style={styles.sendVoiceBtn} activeOpacity={0.8}>
            <Send size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Instant Voice Preview state
  if (state === 'preview') {
    return (
      <View style={[styles.fullOverlayContainer, { backgroundColor: colors.glassThickBg }]}>
        <View style={styles.previewContainer}>
          <TouchableOpacity onPress={cancelRecording} style={styles.iconBtn} activeOpacity={0.7}>
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePreviewPlay}
            style={styles.previewPlayBtn}
            activeOpacity={0.8}
          >
            {isPreviewPlaying ? (
              <Pause size={16} color="#ffffff" fill="#ffffff" />
            ) : (
              <Play size={16} color="#ffffff" fill="#ffffff" style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>

          <View style={styles.previewWaveSection}>
            <Waveform
              waveform={recordedAmplitudesRef.current}
              progress={previewProgress}
              isMe={true}
              onSeek={(p) => setPreviewProgress(p)}
              barCount={24}
              height={24}
            />
            <Text style={styles.previewDurationText}>{formatTimer(duration)}</Text>
          </View>

          <TouchableOpacity onPress={sendRecording} style={styles.sendVoiceBtn} activeOpacity={0.8}>
            <Send size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Idle and Active Recording share the persistent touch responder so gestures never drop
  return (
    <View
      style={
        state === 'recording'
          ? [styles.fullOverlayContainer, { backgroundColor: colors.glassThickBg }]
          : styles.micBtnContainer
      }
    >
      {state === 'recording' && (
        <>
          {/* Slide Up to Lock Floating Badge */}
          <Animated.View style={[styles.lockIndicator, lockAnimStyle]}>
            <ChevronUp size={14} color="#38bdf8" />
            <Lock size={14} color="#38bdf8" />
          </Animated.View>

          {/* Live red recording dot & Timer */}
          <View style={styles.timerWrapper}>
            <Animated.View style={[styles.redDot, pulseDotAnimStyle]} />
            <Text style={styles.timerText}>{formatTimer(duration)}</Text>
          </View>

          {/* Slide to Cancel Bar */}
          <View style={styles.slideBar}>
            <Animated.View style={trashAnimStyle}>
              <Trash2 size={18} color="#ef4444" />
            </Animated.View>
            <Text style={styles.slideText}>‹ Slide to cancel</Text>
          </View>
        </>
      )}

      {/* Mic button with persistent touch responder */}
      <View {...panResponder.panHandlers} style={styles.micBtnTouchTarget}>
        <Animated.View
          style={[
            styles.micBtn,
            { backgroundColor: accentColor },
            state === 'recording' && styles.micBtnRecording,
            micAnimStyle,
          ]}
        >
          <Mic size={state === 'recording' ? 22 : 20} color="#ffffff" />
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  micBtnContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnTouchTarget: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullOverlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnRecording: {
    backgroundColor: '#ef4444',
  },
  activeOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 8,
    position: 'relative',
  },
  lockIndicator: {
    position: 'absolute',
    right: 12,
    top: -55,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  slideBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slideText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    gap: 8,
  },
  liveWaveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    height: 28,
    justifyContent: 'center',
  },
  liveWaveformBar: {
    width: 3,
    backgroundColor: '#38bdf8',
    borderRadius: 1.5,
  },
  iconBtn: {
    padding: 8,
  },
  previewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewBtnText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  sendVoiceBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    paddingHorizontal: 4,
  },
  previewPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewWaveSection: {
    flex: 1,
    gap: 2,
  },
  previewDurationText: {
    fontSize: 10,
    color: '#94a3b8',
    fontVariant: ['tabular-nums'],
  },
});
