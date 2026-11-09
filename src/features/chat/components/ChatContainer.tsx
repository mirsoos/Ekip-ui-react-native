import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import { LinearGradient } from 'expo-linear-gradient';
import { demoMessages } from '../../../lib/demoData';
import { useI18n } from '../../../lib/i18n';

import { useOptimisticMessages } from '../hooks/useOptimisticMessages';
import { useChatKeyboard } from '../hooks/useChatKeyboard';
import { useChatScroll } from '../hooks/useChatScroll';
import {
  useChatStore,
  useChatSearchState,
  useChatTypingStates,
  useChatCustomBackgroundUri,
  clearAudioInterval,
  clearActiveTimeouts,
} from '../store/chatStore';

import { MessageList } from './MessageList';
import { ChatInput } from './InputBar/ChatInput';
import { MessageActionSheet } from './Overlays/MessageActionSheet';
import { ScrollToBottomButton } from './Overlays/ScrollToBottomButton';
import { ChatSearchBar } from './Search/ChatSearchBar';
import { TypingIndicator } from './Typing/TypingIndicator';
import { MediaLightbox } from './Media/MediaLightbox';
import { getSinglePillContentPaddingTop } from '../../../lib/headerLayout';
import type { Message, Attachment, Author, ReplyPreview, BubbleLayout } from '../types/chat.types';

export interface ChatContainerProps {
  conversationId: string;
  isGroupChat?: boolean;
  currentUserId?: string;
  customBackgroundUri?: string;
  onBack?: () => void;
  headerComponent?: React.ReactNode;
}

function getInitialConversationMessages(
  conversationId: string,
  isGroupChat: boolean,
  currentUserId: string,
  currentUserAuthor: Author
): Message[] {
  const rawList = (demoMessages as Record<string, any[]>)[conversationId] || [];
  const baseTime = Date.now() - 1000 * 60 * 30;

  const partnerUser: Author = {
    id: isGroupChat ? 'group_partner' : 'partner_user',
    name: isGroupChat ? 'Design Core' : 'Alex Rivers',
    username: 'alex_rivers',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isOnline: true,
    isVerified: true,
  };

  const mappedDemo: Message[] = rawList.map((m, idx) => {
    const isMe = m.sender_id === 'me' || m.sender_id === currentUserId;
    const author: Author = isMe
      ? currentUserAuthor
      : {
          id: m.sender_id,
          name: m.sender ? `${m.sender.first_name || ''} ${m.sender.last_name || ''}`.trim() : partnerUser.name,
          username: m.sender?.username || m.sender_id,
          avatarUrl: m.sender?.avatar_url || partnerUser.avatarUrl,
          isOnline: !!m.sender?.is_online,
          isVerified: !!m.sender?.is_verified,
        };
    return {
      id: m.id,
      conversationId,
      senderId: author.id,
      sender: author,
      text: m.body,
      status: (m.read_at ? 'READ' : 'DELIVERED') as any,
      createdAt: m.created_at ? new Date(m.created_at).getTime() : baseTime + idx * 60000,
      updatedAt: m.created_at ? new Date(m.created_at).getTime() : baseTime + idx * 60000,
      attachments: m.media_url ? [{ id: `att_${m.id}`, type: 'image', url: m.media_url }] : undefined,
      reactions: {},
    };
  });

  const now = Date.now();
  const featureSeed: Message[] = [
    {
      id: `seed_${conversationId}_voice`,
      conversationId,
      senderId: partnerUser.id,
      sender: partnerUser,
      text: '',
      status: 'READ',
      createdAt: now - 1000 * 60 * 8,
      attachments: [
        {
          id: `att_${conversationId}_voice`,
          type: 'audio',
          url: 'voice_note_1.m4a',
          duration: 22,
          fileName: 'Voice note (0:22)',
          waveform: [
            0.2, 0.4, 0.7, 0.9, 0.6, 0.3, 0.5, 0.8, 1.0, 0.85, 0.5, 0.3,
            0.6, 0.75, 0.95, 0.65, 0.4, 0.55, 0.8, 0.7, 0.45, 0.3, 0.2,
          ],
        },
      ],
    },
    {
      id: `seed_${conversationId}_rich`,
      conversationId,
      senderId: partnerUser.id,
      sender: partnerUser,
      text: 'موتور گفتگوی فوق‌سریع با پشتیبانی از **متن برجسته**، `کد برنامه` و ||متن محرمانه پوشیده شده با افکت اسپویلر|| فعال شد!',
      status: 'READ',
      createdAt: now - 1000 * 60 * 5,
      reactions: { '❤️': [currentUserId] },
    },
    {
      id: `seed_${conversationId}_photos`,
      conversationId,
      senderId: partnerUser.id,
      sender: partnerUser,
      text: 'پیش‌نمایش گالری تصاویر چندگانه با افکت لایت‌باکس:',
      status: 'READ',
      createdAt: now - 1000 * 60 * 3,
      attachments: [
        {
          id: `att_${conversationId}_p1`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          width: 600,
          height: 400,
          fileName: 'architecture_diagram.jpg',
        },
        {
          id: `att_${conversationId}_p2`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
          width: 600,
          height: 400,
          fileName: 'preview_landscape.jpg',
        },
      ],
    },
    {
      id: `seed_${conversationId}_reply`,
      conversationId,
      senderId: currentUserId,
      sender: currentUserAuthor,
      text: 'برای پاسخ نقل‌قول (Quote-Reply) کافیست هر پیام را به سمت چپ یا راست بکشید.',
      status: 'DELIVERED',
      createdAt: now - 1000 * 60 * 1,
    },
  ];

  return mappedDemo.length > 0 ? [...mappedDemo, ...featureSeed] : featureSeed;
}

function ChatContent({
  conversationId,
  isGroupChat = false,
  currentUserId = 'me',
  customBackgroundUri,
  headerComponent,
}: ChatContainerProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(0, insets.bottom - 4);
  const { t } = useI18n();

  const storeBackgroundUri = useChatCustomBackgroundUri();
  const effectiveBackgroundUri = (customBackgroundUri || storeBackgroundUri || '').trim();
  const hasCustomBackground = effectiveBackgroundUri.length > 0;

  const currentUserAuthor: Author = useMemo(
    () => ({
      id: currentUserId,
      name: currentUserId === 'me' ? 'Me' : 'You',
      username: currentUserId,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isOnline: true,
      isVerified: true,
    }),
    [currentUserId]
  );

  const setCurrentUser = useChatStore((state) => state.setCurrentUser);
  useEffect(() => {
    setCurrentUser(currentUserAuthor);
  }, [currentUserAuthor, setCurrentUser]);

  // Seed conversation messages in useEffect so it doesn't trigger synchronous store updates and double re-renders during Frame 1 on iOS
  useEffect(() => {
    const existingIds = useChatStore.getState().conversationMessageIds[conversationId];
    if (!existingIds || existingIds.length === 0) {
      const initialSeed = getInitialConversationMessages(
        conversationId,
        isGroupChat,
        currentUserId,
        currentUserAuthor
      );
      useChatStore.getState().seedConversation(conversationId, initialSeed);
    }
  }, [conversationId, isGroupChat, currentUserId, currentUserAuthor]);

  const {
    messageIds,
    replyingTo,
    isLoadingHistory,
    hasMoreHistory,
    isLoadingNewer,
    hasMoreNewer,
    sendMessage,
    retryMessage,
    clearReplyingTo,
    loadMoreHistory,
    loadNewerHistory,
    addReaction,
    deleteMessage,
  } = useOptimisticMessages(conversationId, currentUserAuthor);

  const {
    containerAnimatedStyle,
    listAnimatedStyle,
    inputContainerAnimatedStyle,
    bottomInsetAnimatedStyle,
    dismissKeyboard,
    isKeyboardVisible,
  } = useChatKeyboard(bottomInset);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: any) => {
    touchStartRef.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: any) => {
      if (!touchStartRef.current) return;
      const dx = Math.abs(e.nativeEvent.pageX - touchStartRef.current.x);
      const dy = Math.abs(e.nativeEvent.pageY - touchStartRef.current.y);
      const dt = Date.now() - touchStartRef.current.time;
      touchStartRef.current = null;

      // Only dismiss if it was a quick static tap (moved < 8px and took < 300ms)
      // Never dismisses on scroll/drag!
      if (dx < 8 && dy < 8 && dt < 300) {
        if (isKeyboardVisible) {
          dismissKeyboard();
        }
      }
    },
    [isKeyboardVisible, dismissKeyboard]
  );

  const statusBarScrollRef = useRef<any>(null);

  const {
    flashListRef,
    webWheelRef,
    handleScroll,
    scrollToBottom,
    scrollToTop,
    showScrollToBottom,
  } = useChatScroll({
    onLoadMoreHistory: loadMoreHistory,
    isLoadingHistory,
    hasMoreHistory,
    onLoadNewerMessages: loadNewerHistory,
    isLoadingNewer,
    hasMoreNewer,
  });

  const setReplyingToStore = useChatStore((state) => state.setReplyingTo);
  const markAsRead = useChatStore((state) => state.markConversationAsRead);
  const editMessageStore = useChatStore((state) => state.editMessage);
  const pinMessageStore = useChatStore((state) => state.pinMessage);
  const setTypingActionStore = useChatStore((state) => state.setTypingAction);

  // Search state & actions
  const searchState = useChatSearchState();
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const goToSearchMatch = useChatStore((state) => state.goToSearchMatch);
  const clearSearch = useChatStore((state) => state.clearSearch);
  const isSearchBarOpen = useChatStore((state) => state.isSearchBarOpen);
  const setSearchBarOpen = useChatStore((state) => state.setSearchBarOpen);

  // Typing state for partner
  const typingStates = useChatTypingStates(conversationId);
  const activePartnerTyping = typingStates.find(
    (t) => t.author.id !== currentUserId
  );

  // Action Sheet state
  const [actionSheetMessage, setActionSheetMessage] = useState<Message | null>(null);
  const [bubbleLayout, setBubbleLayout] = useState<BubbleLayout | null>(null);
  const selectedMessage = useChatStore((state) => state.selectedMessage);
  const isContextActive = Boolean(selectedMessage);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    backdropOpacity.value = withTiming(isContextActive ? 1 : 0, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isContextActive, backdropOpacity]);

  const animatedBackdropStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: backdropOpacity.value,
    };
  });

  // Lightbox Media Preview state
  const [lightboxMedia, setLightboxMedia] = useState<Attachment[] | null>(null);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Highlight timer ref for quote jumping
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure keyboard is dismissed and search closed on mount/unmount; mark conversation as read
  useEffect(() => {
    Keyboard.dismiss();
    setSearchBarOpen(false);
    markAsRead(conversationId);
    clearReplyingTo();

    return () => {
      Keyboard.dismiss();
      setSearchBarOpen(false);
      clearReplyingTo();
      clearAudioInterval();
      clearActiveTimeouts();
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
    };
  }, [conversationId, markAsRead, setSearchBarOpen, clearReplyingTo]);

  // Handlers
  const handleReply = useCallback(
    (message: Message) => {
      setReplyingToStore(message);
    },
    [setReplyingToStore]
  );

  const handleLongPress = useCallback(
    (message: Message, layout?: BubbleLayout) => {
      dismissKeyboard();
      setBubbleLayout(layout || null);
      setActionSheetMessage(message);
      useChatStore.getState().setSelectedMessage(message);
    },
    [dismissKeyboard]
  );

  const handleCloseActionSheet = useCallback(() => {
    setActionSheetMessage(null);
    setBubbleLayout(null);
    useChatStore.getState().setSelectedMessage(null);
  }, []);

  const handleSend = useCallback(
    async (text: string, attachments?: Attachment[]) => {
      await sendMessage(text, attachments);
      scrollToBottom(true);
    },
    [sendMessage, scrollToBottom]
  );

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      addReaction(messageId, emoji, currentUserId);
    },
    [addReaction, currentUserId]
  );

  const handlePressMedia = useCallback(
    (attachment: Attachment, index: number = 0, allAttachments?: Attachment[]) => {
      setLightboxMedia(allAttachments && allAttachments.length > 0 ? allAttachments : [attachment]);
      setLightboxInitialIndex(Math.max(0, index));
    },
    []
  );

  const handleCopyText = useCallback((text: string) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(text);
    }
  }, []);

  // Targeted Quote-Jumping
  const handlePressReply = useCallback(
    (replyTo: ReplyPreview) => {
      const targetId = replyTo.id;
      let index = messageIds.indexOf(targetId);
      if (index < 0) {
        const allIds = useChatStore.getState().conversationMessageIds[conversationId] || [];
        index = allIds.indexOf(targetId);
      }
      if (index >= 0 && flashListRef.current) {
        flashListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
        useChatStore.getState().setHighlightedMessageId(targetId);
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
        highlightTimeoutRef.current = setTimeout(() => {
          useChatStore.getState().setHighlightedMessageId(null);
          highlightTimeoutRef.current = null;
        }, 1800);
      }
    },
    [messageIds, flashListRef, conversationId]
  );

  // In-Chat Search match navigation
  const handleNavigateSearchMatch = useCallback(
    (direction: 'prev' | 'next') => {
      goToSearchMatch(direction);
      const state = useChatStore.getState().searchState;
      const targetId = state.matchingMessageIds[state.currentIndex];
      if (targetId) {
        const index = messageIds.indexOf(targetId);
        if (index >= 0 && flashListRef.current) {
          flashListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }
    },
    [goToSearchMatch, messageIds, flashListRef]
  );

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query, conversationId);
      const state = useChatStore.getState().searchState;
      if (state.matchingMessageIds.length > 0) {
        const firstMatchId = state.matchingMessageIds[0];
        const index = messageIds.indexOf(firstMatchId);
        if (index >= 0 && flashListRef.current) {
          flashListRef.current.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }
    },
    [setSearchQuery, conversationId, messageIds, flashListRef]
  );

  const handleCloseSearch = useCallback(() => {
    clearSearch();
    setSearchBarOpen(false);
  }, [clearSearch, setSearchBarOpen]);

  const handleTypingEvent = useCallback(
    (action: 'typing' | null) => {
      setTypingActionStore(conversationId, currentUserAuthor, action as any);
    },
    [conversationId, currentUserAuthor, setTypingActionStore]
  );

  const handleEditMessage = useCallback(
    (msg: Message) => {
      editMessageStore(msg.id, `${msg.text} (edited)`);
    },
    [editMessageStore]
  );

  const handlePinMessage = useCallback(
    (msg: Message) => {
      pinMessageStore(conversationId, msg.id);
    },
    [conversationId, pinMessageStore]
  );

  const handleDeleteForEveryone = useCallback(
    (messageId: string) => {
      deleteMessage(messageId);
    },
    [deleteMessage]
  );

  // Header Top Gradient Overlay covering safe area/status bar down to the chat header
  const headerOverlayHeight = getSinglePillContentPaddingTop(insets.top) + 24;

  const BackgroundComponent = hasCustomBackground ? ImageBackground : View;
  const backgroundProps = hasCustomBackground
    ? { source: { uri: effectiveBackgroundUri }, resizeMode: 'cover' as const, style: styles.backgroundImage }
    : { style: [styles.backgroundImage, { backgroundColor: 'transparent' }] };

  return (
    <KeyboardGestureArea style={styles.container} interpolator="ios">
      <BackgroundComponent {...(backgroundProps as any)}>
        {/* Animated backdrop darkens wallpaper during message long-press context selection */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: 1 },
            animatedBackdropStyle,
          ]}
        />

        {/* Animated container dynamically lifting both list and input synchronously */}
        <Animated.View style={[styles.contentFlex, containerAnimatedStyle, { zIndex: 2 }]}>
          {/* Optional Custom Chat Header */}
          {headerComponent}

          {/* Header Top Gradient Overlay: high-opacity black at top fading to transparent at header base */}
          <View
            pointerEvents="none"
            style={[styles.headerTopScrim, { height: headerOverlayHeight }]}
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.85)', 'rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0)']}
              locations={[0, 0.45, 0.78, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Expandable Top In-Chat Search Bar */}
          <ChatSearchBar
            visible={isSearchBarOpen}
            query={searchState.query}
            onChangeQuery={handleSearchQueryChange}
            currentIndex={searchState.currentIndex}
            totalMatches={searchState.matchingMessageIds.length}
            onNavigateMatch={handleNavigateSearchMatch}
            onClose={handleCloseSearch}
            topInset={getSinglePillContentPaddingTop(insets.top) - 6}
          />

          {/* iOS Native Status Bar Tap Receiver */}
          {Platform.OS === 'ios' && (
            <ScrollView
              ref={statusBarScrollRef}
              scrollsToTop={true}
              showsVerticalScrollIndicator={false}
              style={styles.statusBarScrollReceiver}
              contentContainerStyle={styles.statusBarScrollContent}
              contentOffset={{ x: 0, y: 150 }}
              onScrollToTop={() => {
                statusBarScrollRef.current?.scrollTo({ y: 150, animated: false });
                scrollToTop(true);
              }}
            />
          )}

          {/* Main Virtualized Message List */}
          <Animated.View
            style={[styles.listWrapper, listAnimatedStyle]}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <MessageList
              containerRef={webWheelRef}
              flashListRef={flashListRef}
              messageIds={messageIds}
              conversationId={conversationId}
              isGroupChat={isGroupChat}
              currentUserId={currentUserId}
              isLoadingHistory={isLoadingHistory}
              hasMoreHistory={hasMoreHistory}
              isLoadingNewer={isLoadingNewer}
              hasMoreNewer={hasMoreNewer}
              onLoadMoreHistory={loadMoreHistory}
              onLoadNewerMessages={loadNewerHistory}
              onReply={handleReply}
              onLongPress={handleLongPress}
              onRetry={retryMessage}
              onPressMedia={handlePressMedia}
              onPressReply={handlePressReply}
              onToggleReaction={handleToggleReaction}
              onScroll={handleScroll}
              contentPaddingTop={
                getSinglePillContentPaddingTop(insets.top) + (isSearchBarOpen ? 60 : 8)
              }
              contentPaddingBottom={68}
            />

            {/* Quick Return to Bottom (newest messages) FAB */}
            <ScrollToBottomButton
              visible={showScrollToBottom}
              onPress={() => scrollToBottom(true)}
            />
          </Animated.View>

          {/* Real-time Partner Typing Indicator Bubble */}
          {activePartnerTyping && (
            <TypingIndicator
              action={activePartnerTyping.action}
              authorName={activePartnerTyping.author.name}
            />
          )}

          {/* Input Bar Shell */}
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.inputWrapper,
              inputContainerAnimatedStyle,
              isContextActive && { opacity: 0, pointerEvents: 'none' },
            ]}
          >
            <ChatInput
              conversationId={conversationId}
              onSendMessage={handleSend}
              replyingTo={replyingTo}
              onClearReply={clearReplyingTo}
              onTyping={handleTypingEvent}
              placeholder={t('chat.transmitDispatch') || undefined}
              bottomInsetAnimatedStyle={bottomInsetAnimatedStyle}
            />
          </Animated.View>
        </Animated.View>

        {/* Action Sheet & Reaction Overlay */}
        <MessageActionSheet
          visible={!!actionSheetMessage}
          message={actionSheetMessage}
          bubbleLayout={bubbleLayout}
          currentUserId={currentUserId}
          onClose={handleCloseActionSheet}
          onSelectReaction={handleToggleReaction}
          onReply={handleReply}
          onCopyText={handleCopyText}
          onRetry={retryMessage}
          onDelete={deleteMessage}
          onEditMessage={handleEditMessage}
          onPinMessage={handlePinMessage}
          onDeleteForEveryone={handleDeleteForEveryone}
        />

        {/* Shared Lightbox Media Viewer Modal with Pinch, Double-Tap & Dismiss Gestures */}
        {lightboxMedia && (
          <MediaLightbox
            visible={true}
            media={lightboxMedia}
            initialIndex={lightboxInitialIndex}
            onClose={() => setLightboxMedia(null)}
          />
        )}
      </BackgroundComponent>
    </KeyboardGestureArea>
  );
}

export const ChatContainer = React.memo(ChatContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentFlex: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  headerTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 80,
    pointerEvents: 'none',
  },
  listWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  backdropOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  statusBarScrollReceiver: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: 'none',
  },
  statusBarScrollContent: {
    height: 300,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
  },
});
