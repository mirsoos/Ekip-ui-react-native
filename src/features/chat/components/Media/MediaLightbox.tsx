import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  type GestureResponderEvent,
  type PanResponderGestureState,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { Attachment } from '../../types/chat.types';
import { VideoPlayer } from './VideoPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface MediaLightboxProps {
  visible: boolean;
  media: Attachment[];
  initialIndex?: number;
  onClose: () => void;
}

export const MediaLightbox = React.memo(function MediaLightbox({
  visible,
  media,
  initialIndex = 0,
  onClose,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(Math.max(0, Math.min(media.length - 1, initialIndex)));
    }
  }, [visible, initialIndex, media.length]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(1);

  const initialDistanceRef = React.useRef<number>(0);
  const initialScaleRef = React.useRef<number>(1);
  const lastPanXRef = React.useRef<number>(0);
  const lastPanYRef = React.useRef<number>(0);

  const resetTransforms = useCallback(() => {
    translateX.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) });
    bgOpacity.value = withTiming(1, { duration: 150 });
    lastPanXRef.current = 0;
    lastPanYRef.current = 0;
  }, [translateX, translateY, scale, bgOpacity]);

  const handleDismiss = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose]);

  // Double-tap to zoom in/out
  const lastTapRef = React.useRef<number>(0);
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (scale.value > 1.2) {
        resetTransforms();
      } else {
        scale.value = withTiming(2.5, { duration: 180, easing: Easing.out(Easing.quad) });
      }
    }
    lastTapRef.current = now;
  }, [scale, resetTransforms]);

  // Swipe-down-to-dismiss & Pinch-to-Zoom PanResponder
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          return (
            Math.abs(gesture.dx) > 5 ||
            Math.abs(gesture.dy) > 5 ||
            (_evt.nativeEvent.touches && _evt.nativeEvent.touches.length > 1)
          );
        },
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const touches = evt.nativeEvent.touches;
          if (touches && touches.length >= 2) {
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            initialDistanceRef.current = Math.hypot(dx, dy);
            initialScaleRef.current = scale.value;
          }
        },
        onPanResponderMove: (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          const touches = evt.nativeEvent.touches;
          // 1. Pinch-to-zoom (2 touches)
          if (touches && touches.length >= 2) {
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            const distance = Math.hypot(dx, dy);
            if (initialDistanceRef.current > 0) {
              const newScale = Math.max(
                1,
                Math.min(4, initialScaleRef.current * (distance / initialDistanceRef.current))
              );
              scale.value = newScale;
            }
            return;
          }

          // 2. Pan while zoomed (scale > 1.05)
          if (scale.value > 1.05) {
            translateX.value = lastPanXRef.current + gesture.dx;
            translateY.value = lastPanYRef.current + gesture.dy;
            return;
          }

          // 3. Swipe down/up to dismiss (scale <= 1.05)
          translateY.value = gesture.dy;
          const progress = Math.min(1, Math.abs(gesture.dy) / 250);
          bgOpacity.value = 1 - progress * 0.7;
          scale.value = 1 - progress * 0.2;
        },
        onPanResponderRelease: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (scale.value > 1.05) {
            lastPanXRef.current = translateX.value;
            lastPanYRef.current = translateY.value;
            return;
          }

          if (gesture.dy > 120 || gesture.vy > 0.8) {
            // Dismiss down
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, (fin) => {
              if (fin) {
                runOnJS(handleDismiss)();
              }
            });
            bgOpacity.value = withTiming(0, { duration: 180 });
          } else if (gesture.dy < -120 || gesture.vy < -0.8) {
            // Dismiss up
            translateY.value = withTiming(-SCREEN_HEIGHT, { duration: 200 }, (fin) => {
              if (fin) {
                runOnJS(handleDismiss)();
              }
            });
            bgOpacity.value = withTiming(0, { duration: 180 });
          } else {
            resetTransforms();
          }
        },
        onPanResponderTerminate: () => {
          resetTransforms();
        },
      }),
    [scale, translateX, translateY, bgOpacity, resetTransforms, handleDismiss]
  );

  const containerAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: bgOpacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const bgAnimStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: bgOpacity.value,
    };
  });

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      if (Platform.OS !== 'web') Haptics.selectionAsync();
      setCurrentIndex((p) => p - 1);
      resetTransforms();
    }
  }, [currentIndex, resetTransforms]);

  const goToNext = useCallback(() => {
    if (currentIndex < media.length - 1) {
      if (Platform.OS !== 'web') Haptics.selectionAsync();
      setCurrentIndex((p) => p + 1);
      resetTransforms();
    }
  }, [currentIndex, media.length, resetTransforms]);

  if (!visible || media.length === 0) return null;

  const currentItem = media[currentIndex] || media[0];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        {/* Animated Dark Backdrop */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, bgAnimStyle]} />

        {/* Top Header Bar */}
        <View style={styles.header}>
          <Text style={styles.counterText}>
            {currentIndex + 1} of {media.length}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.8}
          >
            <X size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Interactive Media Display Area with Pan & Double-tap */}
        <View
          style={styles.contentArea}
          {...panResponder.panHandlers}
          onTouchEnd={handleDoubleTap}
        >
          <Animated.View style={[styles.animatedMediaWrapper, containerAnimStyle]}>
            {currentItem.type === 'video' ? (
              <VideoPlayer
                attachment={currentItem}
                width={SCREEN_WIDTH * 0.92}
                height={SCREEN_HEIGHT * 0.65}
              />
            ) : (
              <Image
                source={{ uri: currentItem.url }}
                style={styles.lightboxImage}
                contentFit="contain"
                placeholder={{ blurhash: currentItem.blurhash || 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                transition={200}
                cachePolicy="memory-disk"
              />
            )}
          </Animated.View>
        </View>

        {/* Navigation Arrows for multi-media gallery */}
        {media.length > 1 && (
          <>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={goToPrev}
                style={[styles.navArrow, styles.navArrowLeft]}
                activeOpacity={0.8}
              >
                <ChevronLeft size={28} color="#ffffff" />
              </TouchableOpacity>
            )}
            {currentIndex < media.length - 1 && (
              <TouchableOpacity
                onPress={goToNext}
                style={[styles.navArrow, styles.navArrowRight]}
                activeOpacity={0.8}
              >
                <ChevronRight size={28} color="#ffffff" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  counterText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentArea: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedMediaWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '100%',
    height: '100%',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },
});
