import { useRef, useCallback, useEffect, useState } from 'react';
import {
  Platform,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { FlashList } from '@shopify/flash-list';

export interface UseChatScrollOptions {
  onLoadMoreHistory?: () => void;
  isLoadingHistory?: boolean;
  hasMoreHistory?: boolean;
  onLoadNewerMessages?: () => void;
  isLoadingNewer?: boolean;
  hasMoreNewer?: boolean;
}

export function useChatScroll({
  onLoadMoreHistory,
  isLoadingHistory = false,
  hasMoreHistory = true,
  onLoadNewerMessages,
  isLoadingNewer = false,
  hasMoreNewer = false,
}: UseChatScrollOptions = {}) {
  const flashListRef = useRef<FlashList<any>>(null);
  const isFetchingHistoryRef = useRef(false);
  const isFetchingNewerRef = useRef(false);
  const lastScrollOffsetRef = useRef(0);
  const isAtBottomRef = useRef(true); // In inverted list, offset 0 is the bottom (newest)
  const webWheelRef = useRef<any>(null);

  // State to drive the quick scroll-to-bottom floating button
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const showScrollToBottomRef = useRef(false);

  useEffect(() => {
    isFetchingHistoryRef.current = isLoadingHistory;
  }, [isLoadingHistory]);

  useEffect(() => {
    isFetchingNewerRef.current = isLoadingNewer;
  }, [isLoadingNewer]);

  // Scroll to bottom (newest messages, offset 0 in inverted list)
  const scrollToBottom = useCallback((animated = true) => {
    if (flashListRef.current) {
      flashListRef.current.scrollToOffset({ offset: 0, animated });
      showScrollToBottomRef.current = false;
      setShowScrollToBottom(false);
    }
  }, []);

  // Scroll to visual top (oldest historical messages at end of inverted list)
  const scrollToTop = useCallback((animated = true) => {
    if (flashListRef.current) {
      flashListRef.current.scrollToEnd({ animated });
    }
  }, []);

  // Scroll to specific message ID / index
  const scrollToMessageId = useCallback((index: number, animated = true) => {
    if (flashListRef.current && index >= 0) {
      flashListRef.current.scrollToIndex({ index, animated, viewPosition: 0.5 });
    }
  }, []);

  // Handle scroll events with zero UI thread lag
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      lastScrollOffsetRef.current = offset;
      // Inverted list: offset <= 30 means user is near the bottom (latest messages)
      isAtBottomRef.current = offset <= 30;

      // Toggle quick scroll-to-bottom FAB when user scrolls up away from bottom
      const shouldShowFab = offset > 100;
      if (shouldShowFab !== showScrollToBottomRef.current) {
        showScrollToBottomRef.current = shouldShowFab;
        setShowScrollToBottom(shouldShowFab);
      }

      // Bi-directional loading: if scrolling towards newest and has more newer messages
      if (offset <= 10 && hasMoreNewer && !isFetchingNewerRef.current && onLoadNewerMessages) {
        onLoadNewerMessages();
      }
    },
    [hasMoreNewer, onLoadNewerMessages]
  );

  // Trigger loading older historical messages when reaching top of conversation (onEndReached in inverted list)
  const handleEndReached = useCallback(() => {
    if (isFetchingHistoryRef.current || !hasMoreHistory || !onLoadMoreHistory) return;
    onLoadMoreHistory();
  }, [hasMoreHistory, onLoadMoreHistory]);

  // Web Wheel Normalization for inverted virtualized lists
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const node = webWheelRef.current;
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      // Prevent browser synthetic jump during rapid inverted trackpad / mousewheel scrolling
      if (Math.abs(e.deltaY) > 0) {
        // Native wheel events pass through smoothly to FlashList's internal scroll container
      }
    };

    node.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      node.removeEventListener('wheel', onWheel);
    };
  }, []);

  return {
    flashListRef,
    webWheelRef,
    scrollToBottom,
    scrollToTop,
    scrollToMessageId,
    handleScroll,
    handleEndReached,
    isAtBottomRef,
    showScrollToBottom,
  };
}
