import { useCallback, useMemo } from 'react';
import {
  useChatStore,
  useConversationMessageIds,
  useChatReplyingTo,
  useChatIsLoadingHistory,
  useChatHasMoreHistory,
  useChatIsLoadingNewer,
  useChatHasMoreNewer,
  useChatCurrentUser,
} from '../store/chatStore';
import type { Attachment, Author } from '../types/chat.types';

export function useOptimisticMessages(conversationId: string, author?: Author) {
  const messageIds = useConversationMessageIds(conversationId);
  const replyingTo = useChatReplyingTo();
  const isLoadingHistory = useChatIsLoadingHistory(conversationId);
  const hasMoreHistory = useChatHasMoreHistory(conversationId);
  const isLoadingNewer = useChatIsLoadingNewer(conversationId);
  const hasMoreNewer = useChatHasMoreNewer(conversationId);
  const storeCurrentUser = useChatCurrentUser();

  const activeAuthor = author || storeCurrentUser;

  const sendMessageAction = useChatStore((state) => state.sendMessage);
  const retryMessageAction = useChatStore((state) => state.retryMessage);
  const setReplyingToAction = useChatStore((state) => state.setReplyingTo);
  const loadHistoricalAction = useChatStore((state) => state.loadHistoricalMessages);
  const loadNewerAction = useChatStore((state) => state.loadNewerMessages);
  const addReactionAction = useChatStore((state) => state.addReaction);
  const removeReactionAction = useChatStore((state) => state.removeReaction);
  const deleteMessageAction = useChatStore((state) => state.deleteMessage);

  const sendMessage = useCallback(
    async (text: string, attachments?: Attachment[]) => {
      if (!text.trim() && (!attachments || attachments.length === 0)) return;
      return sendMessageAction(conversationId, text, attachments, replyingTo, activeAuthor);
    },
    [conversationId, replyingTo, activeAuthor, sendMessageAction]
  );

  const retryMessage = useCallback(
    (messageId: string) => {
      return retryMessageAction(messageId);
    },
    [retryMessageAction]
  );

  const clearReplyingTo = useCallback(() => {
    setReplyingToAction(null);
  }, [setReplyingToAction]);

  const loadMoreHistory = useCallback(() => {
    return loadHistoricalAction(conversationId, 20);
  }, [conversationId, loadHistoricalAction]);

  const loadNewerHistory = useCallback(() => {
    return loadNewerAction(conversationId, 20);
  }, [conversationId, loadNewerAction]);

  const addReaction = useCallback(
    (messageId: string, emoji: string, userId: string = 'me') => {
      addReactionAction(messageId, emoji, userId);
    },
    [addReactionAction]
  );

  const removeReaction = useCallback(
    (messageId: string, emoji: string, userId: string = 'me') => {
      removeReactionAction(messageId, emoji, userId);
    },
    [removeReactionAction]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      deleteMessageAction(conversationId, messageId);
    },
    [conversationId, deleteMessageAction]
  );

  return useMemo(
    () => ({
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
      removeReaction,
      deleteMessage,
    }),
    [
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
      removeReaction,
      deleteMessage,
    ]
  );
}

