import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type {
  ChatState,
  Message,
  MessageStatus,
  Attachment,
  Author,
  ReplyPreview,
  OutboxQueueItem,
  TypingAction,
  UserTypingState,
} from '../types/chat.types';

// Default current user profile for optimistic message authorship
export const CURRENT_USER: Author = {
  id: 'me',
  name: 'Me',
  username: 'current_user',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  isOnline: true,
  isVerified: true,
};

let audioInterval: ReturnType<typeof setInterval> | null = null;
let isProcessingOutbox = false;
const clearAudioInterval = () => {
  if (audioInterval) {
    clearInterval(audioInterval);
    audioInterval = null;
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  currentUser: CURRENT_USER,
  messages: {},
  conversationMessageIds: {},
  activeConversationId: null,
  replyingTo: null,
  selectedMessage: null,
  isActionSheetOpen: false,
  isAttachmentPickerOpen: false,
  customBackgroundUri: null,
  setCustomBackgroundUri: (uri: string | null) => set({ customBackgroundUri: uri }),
  isLoadingHistory: {},
  hasMoreHistory: {},
  isLoadingNewer: {},
  hasMoreNewer: {},
  typingUsers: {},
  userTypingStates: {},

  // Atomized Audio Playback Engine
  activeAudioMessageId: null,
  audioPlaybackProgress: 0,
  audioPlaybackSpeed: 1.0,

  // Targeted Quote-Jumping & Flash Highlight
  highlightedMessageId: null,

  // Search Engine
  isSearchBarOpen: false,
  setSearchBarOpen: (isOpen: boolean) => {
    set({ isSearchBarOpen: isOpen });
    if (!isOpen) {
      get().clearSearch();
    }
  },
  searchState: {
    query: '',
    isActive: false,
    matchingMessageIds: [],
    currentIndex: -1,
  },

  // Offline Outbox Engine
  isOnline: true,
  outboxQueue: [],

  setCurrentUser: (user: Author) => {
    set({ currentUser: user });
  },

  playAudio: (messageId: string, duration: number = 15) => {
    clearAudioInterval();
    const currentProgress =
      get().activeAudioMessageId === messageId ? get().audioPlaybackProgress : 0;
    set({ activeAudioMessageId: messageId, audioPlaybackProgress: currentProgress });

    const speed = get().audioPlaybackSpeed || 1.0;
    const intervalMs = 100;
    const totalSteps = Math.max(10, Math.round((duration * 1000) / (intervalMs * speed)));
    let currentStep = Math.round(currentProgress * totalSteps);

    audioInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(1, currentStep / totalSteps);
      if (progress >= 1) {
        clearAudioInterval();
        set({ activeAudioMessageId: null, audioPlaybackProgress: 0 });
      } else {
        set({ audioPlaybackProgress: progress });
      }
    }, intervalMs);
  },

  pauseAudio: (messageId: string) => {
    if (get().activeAudioMessageId === messageId) {
      clearAudioInterval();
      set({ activeAudioMessageId: null });
    }
  },

  stopAudio: () => {
    clearAudioInterval();
    set({ activeAudioMessageId: null, audioPlaybackProgress: 0 });
  },

  seekAudio: (messageId: string, progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const isCurrentActive = get().activeAudioMessageId === messageId;
    if (isCurrentActive) {
      clearAudioInterval();
      set({ audioPlaybackProgress: clamped });
      const msg = get().messages[messageId];
      const duration = msg?.attachments?.[0]?.duration || 15;
      const speed = get().audioPlaybackSpeed || 1.0;
      const intervalMs = 100;
      const totalSteps = Math.max(10, Math.round((duration * 1000) / (intervalMs * speed)));
      let currentStep = Math.round(clamped * totalSteps);
      audioInterval = setInterval(() => {
        currentStep++;
        const p = Math.min(1, currentStep / totalSteps);
        if (p >= 1) {
          clearAudioInterval();
          set({ activeAudioMessageId: null, audioPlaybackProgress: 0 });
        } else {
          set({ audioPlaybackProgress: p });
        }
      }, intervalMs);
    } else {
      set({ activeAudioMessageId: messageId, audioPlaybackProgress: clamped });
    }
  },

  setAudioPlaybackSpeed: (speed: number) => {
    set({ audioPlaybackSpeed: speed });
    const activeId = get().activeAudioMessageId;
    if (activeId && audioInterval) {
      const msg = get().messages[activeId];
      const duration = msg?.attachments?.[0]?.duration || 15;
      const progress = get().audioPlaybackProgress;
      clearAudioInterval();
      const intervalMs = 100;
      const totalSteps = Math.max(10, Math.round((duration * 1000) / (intervalMs * speed)));
      let currentStep = Math.round(progress * totalSteps);
      audioInterval = setInterval(() => {
        currentStep++;
        const p = Math.min(1, currentStep / totalSteps);
        if (p >= 1) {
          clearAudioInterval();
          set({ activeAudioMessageId: null, audioPlaybackProgress: 0 });
        } else {
          set({ audioPlaybackProgress: p });
        }
      }, intervalMs);
    }
  },

  setHighlightedMessageId: (messageId: string | null) => {
    set({ highlightedMessageId: messageId });
  },

  setSearchQuery: (query: string, conversationId: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      set({
        searchState: {
          query: '',
          isActive: false,
          matchingMessageIds: [],
          currentIndex: -1,
        },
      });
      return;
    }

    const ids = get().conversationMessageIds[conversationId] || [];
    const messages = get().messages;
    const matches: string[] = [];

    ids.forEach((id) => {
      const msg = messages[id];
      if (msg && msg.text && msg.text.toLowerCase().includes(trimmed)) {
        matches.push(id);
      }
    });

    const currentIndex = matches.length > 0 ? 0 : -1;
    set({
      searchState: {
        query,
        isActive: true,
        matchingMessageIds: matches,
        currentIndex,
      },
      highlightedMessageId: matches.length > 0 ? matches[0] : null,
    });
  },

  goToSearchMatch: (direction: 'next' | 'prev') => {
    const { matchingMessageIds, currentIndex } = get().searchState;
    if (matchingMessageIds.length === 0) return;

    let newIndex = currentIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % matchingMessageIds.length;
    } else {
      newIndex = (currentIndex - 1 + matchingMessageIds.length) % matchingMessageIds.length;
    }

    const targetId = matchingMessageIds[newIndex];
    set((state) => ({
      searchState: {
        ...state.searchState,
        currentIndex: newIndex,
      },
      highlightedMessageId: targetId,
    }));
  },

  clearSearch: () => {
    set({
      isSearchBarOpen: false,
      searchState: {
        query: '',
        isActive: false,
        matchingMessageIds: [],
        currentIndex: -1,
      },
      highlightedMessageId: null,
    });
  },

  setIsOnline: (online: boolean) => {
    set({ isOnline: online });
    if (online) {
      get().processOutboxQueue();
    }
  },

  enqueueOutboxMessage: (
    conversationId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: Message | null,
    author?: Author
  ): string => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const activeAuthor = author || get().currentUser || CURRENT_USER;

    const replyPreview: ReplyPreview | null = replyTo
      ? {
          id: replyTo.id,
          senderId: replyTo.senderId,
          senderName: replyTo.sender?.name || 'User',
          text: replyTo.text,
          mediaUrl: replyTo.attachments?.[0]?.url || null,
          type: replyTo.attachments?.[0]?.type || 'text',
        }
      : null;

    const optimisticMessage: Message = {
      id: tempId,
      tempId,
      conversationId,
      senderId: activeAuthor.id,
      sender: activeAuthor,
      text: text.trim(),
      status: 'QUEUED',
      createdAt: now,
      updatedAt: now,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      replyTo: replyPreview,
      reactions: {},
      isOptimistic: true,
      error: null,
    };

    const queueItem: OutboxQueueItem = {
      id: tempId,
      conversationId,
      text: text.trim(),
      attachments,
      replyTo,
      author: activeAuthor,
      createdAt: now,
      attempts: 0,
      nextRetryAt: now,
    };

    set((state) => {
      const prevIds = state.conversationMessageIds[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [tempId]: optimisticMessage,
        },
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: [tempId, ...prevIds],
        },
        outboxQueue: [...state.outboxQueue, queueItem],
        replyingTo: null,
      };
    });

    if (get().isOnline) {
      get().processOutboxQueue();
    }

    return tempId;
  },

  processOutboxQueue: async (): Promise<void> => {
    if (!get().isOnline || isProcessingOutbox) return;
    isProcessingOutbox = true;

    try {
      while (get().isOnline && get().outboxQueue.length > 0) {
        const item = get().outboxQueue[0];
        if (!item) break;

        // Transition from QUEUED to SENDING
        set((state) => {
          const msg = state.messages[item.id];
          if (!msg) return state;
          return {
            messages: {
              ...state.messages,
              [item.id]: { ...msg, status: 'SENDING', updatedAt: Date.now() },
            },
          };
        });

        // Exponential backoff delay based on previous attempts
        const backoffDelay = Math.min(800, 100 * Math.pow(1.5, item.attempts));
        await new Promise((r) => setTimeout(r, backoffDelay));

        // Re-check network connectivity after delay
        if (!get().isOnline) {
          // If went offline during wait, revert back to QUEUED safely
          set((state) => {
            const msg = state.messages[item.id];
            if (!msg) return state;
            return {
              messages: {
                ...state.messages,
                [item.id]: { ...msg, status: 'QUEUED', updatedAt: Date.now() },
              },
            };
          });
          break;
        }

        const serverId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        set((state) => {
          const msg = state.messages[item.id];
          if (!msg) return state;

          const updatedIds = (state.conversationMessageIds[item.conversationId] || []).map((id) =>
            id === item.id ? serverId : id
          );

          const newMessages = { ...state.messages };
          delete newMessages[item.id];
          newMessages[serverId] = {
            ...msg,
            id: serverId,
            tempId: item.id,
            status: 'SENT',
            isOptimistic: false,
            updatedAt: Date.now(),
          };

          const updatedQueue = state.outboxQueue.filter((q) => q.id !== item.id);

          return {
            messages: newMessages,
            conversationMessageIds: {
              ...state.conversationMessageIds,
              [item.conversationId]: updatedIds,
            },
            outboxQueue: updatedQueue,
          };
        });

        // Schedule DELIVERED and READ transitions
        setTimeout(() => {
          set((state) => {
            const msg = state.messages[serverId];
            if (!msg || msg.status === 'FAILED') return state;
            return {
              messages: {
                ...state.messages,
                [serverId]: { ...msg, status: 'DELIVERED', updatedAt: Date.now() },
              },
            };
          });
        }, 400);

        setTimeout(() => {
          set((state) => {
            const msg = state.messages[serverId];
            if (!msg || msg.status === 'FAILED') return state;
            return {
              messages: {
                ...state.messages,
                [serverId]: { ...msg, status: 'READ', updatedAt: Date.now() },
              },
            };
          });
        }, 1000);
      }
    } finally {
      isProcessingOutbox = false;
    }
  },

  setActiveConversation: (conversationId: string | null) => {
    set({ activeConversationId: conversationId });
  },

  setReplyingTo: (message: Message | null) => {
    set({ replyingTo: message });
  },

  setSelectedMessage: (message: Message | null) => {
    set({ selectedMessage: message });
  },

  setActionSheetOpen: (isOpen: boolean) => {
    set({ isActionSheetOpen: isOpen });
    if (!isOpen) {
      set({ selectedMessage: null });
    }
  },

  setAttachmentPickerOpen: (isOpen: boolean) => {
    set({ isAttachmentPickerOpen: isOpen });
  },

  updateMessageStatus: (messageId: string, status: MessageStatus) => {
    set((state) => {
      const existing = state.messages[messageId];
      if (!existing) return state;
      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...existing,
            status,
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  sendMessage: async (
    conversationId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: Message | null,
    author?: Author
  ): Promise<string> => {
    if (!get().isOnline) {
      return get().enqueueOutboxMessage(conversationId, text, attachments, replyTo, author);
    }

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const activeAuthor = author || get().currentUser || CURRENT_USER;

    const replyPreview: ReplyPreview | null = replyTo
      ? {
          id: replyTo.id,
          senderId: replyTo.senderId,
          senderName: replyTo.sender?.name || 'User',
          text: replyTo.text,
          mediaUrl: replyTo.attachments?.[0]?.url || null,
          type: replyTo.attachments?.[0]?.type || 'text',
        }
      : null;

    const optimisticMessage: Message = {
      id: tempId,
      tempId,
      conversationId,
      senderId: activeAuthor.id,
      sender: activeAuthor,
      text: text.trim(),
      status: 'SENDING',
      createdAt: now,
      updatedAt: now,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      replyTo: replyPreview,
      reactions: {},
      isOptimistic: true,
      error: null,
    };

    // Atomic optimistic insertion at the beginning of the inverted list
    set((state) => {
      const prevIds = state.conversationMessageIds[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [tempId]: optimisticMessage,
        },
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: [tempId, ...prevIds],
        },
        replyingTo: null, // Clear reply after sending
      };
    });

    // Simulate high-performance network pipeline with realistic lifecycle transitions
    // Pipeline: SENDING -> SENT -> DELIVERED -> READ (or FAILED if test trigger)
    const isFailureSimulation = text.trim() === '/fail';

    setTimeout(() => {
      if (isFailureSimulation) {
        set((state) => {
          const current = state.messages[tempId];
          if (!current) return state;
          return {
            messages: {
              ...state.messages,
              [tempId]: {
                ...current,
                status: 'FAILED',
                error: 'Network timeout: packet lost during dispatch',
                updatedAt: Date.now(),
              },
            },
          };
        });
        return;
      }

      // Transition to SENT
      const serverId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      set((state) => {
        const current = state.messages[tempId];
        if (!current) return state;

        // Upgrade temp ID to permanent server ID while maintaining list order
        const updatedIds = (state.conversationMessageIds[conversationId] || []).map((id) =>
          id === tempId ? serverId : id
        );

        const newMessages = { ...state.messages };
        delete newMessages[tempId];
        newMessages[serverId] = {
          ...current,
          id: serverId,
          tempId,
          status: 'SENT',
          isOptimistic: false,
          updatedAt: Date.now(),
        };

        return {
          messages: newMessages,
          conversationMessageIds: {
            ...state.conversationMessageIds,
            [conversationId]: updatedIds,
          },
        };
      });

      // After 600ms transition to DELIVERED
      setTimeout(() => {
        set((state) => {
          const current = state.messages[serverId];
          if (!current || current.status === 'FAILED') return state;
          return {
            messages: {
              ...state.messages,
              [serverId]: {
                ...current,
                status: 'DELIVERED',
                updatedAt: Date.now(),
              },
            },
          };
        });
      }, 600);

      // After 1400ms transition to READ
      setTimeout(() => {
        set((state) => {
          const current = state.messages[serverId];
          if (!current || current.status === 'FAILED') return state;
          return {
            messages: {
              ...state.messages,
              [serverId]: {
                ...current,
                status: 'READ',
                updatedAt: Date.now(),
              },
            },
          };
        });
      }, 1400);
    }, 280);

    return tempId;
  },

  retryMessage: async (messageId: string): Promise<void> => {
    const message = get().messages[messageId];
    if (!message || message.status !== 'FAILED') return;

    // Set to SENDING immediately without modifying list order
    set((state) => ({
      messages: {
        ...state.messages,
        [messageId]: {
          ...message,
          status: 'SENDING',
          error: null,
          updatedAt: Date.now(),
        },
      },
    }));

    setTimeout(() => {
      const serverId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const convId = message.conversationId;

      set((state) => {
        const current = state.messages[messageId];
        if (!current) return state;

        const updatedIds = (state.conversationMessageIds[convId] || []).map((id) =>
          id === messageId ? serverId : id
        );

        const newMessages = { ...state.messages };
        delete newMessages[messageId];
        newMessages[serverId] = {
          ...current,
          id: serverId,
          status: 'SENT',
          isOptimistic: false,
          updatedAt: Date.now(),
        };

        return {
          messages: newMessages,
          conversationMessageIds: {
            ...state.conversationMessageIds,
            [convId]: updatedIds,
          },
        };
      });

      setTimeout(() => {
        set((state) => {
          const current = state.messages[serverId];
          if (!current) return state;
          return {
            messages: {
              ...state.messages,
              [serverId]: {
                ...current,
                status: 'DELIVERED',
                updatedAt: Date.now(),
              },
            },
          };
        });
      }, 500);
    }, 300);
  },

  receiveIncomingMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const prevIds = state.conversationMessageIds[conversationId] || [];

      // 1. Reconcile optimistic tempId message from socket upgrade
      if (message.tempId && state.messages[message.tempId]) {
        const oldTempId = message.tempId;
        const existingOptimistic = state.messages[oldTempId];
        const newMessages = { ...state.messages };
        delete newMessages[oldTempId];
        newMessages[message.id] = {
          ...existingOptimistic,
          ...message,
          isOptimistic: false,
          updatedAt: Date.now(),
        };

        const updatedIds = prevIds.map((id) => (id === oldTempId ? message.id : id));

        return {
          messages: newMessages,
          conversationMessageIds: {
            ...state.conversationMessageIds,
            [conversationId]: updatedIds,
          },
        };
      }

      // 2. Check if permanent ID already exists (deduplication)
      const existing = state.messages[message.id];
      if (existing) {
        return {
          messages: {
            ...state.messages,
            [message.id]: {
              ...existing,
              ...message,
              updatedAt: Date.now(),
            },
          },
        };
      }

      if (prevIds.includes(message.id)) {
        return {
          messages: {
            ...state.messages,
            [message.id]: message,
          },
        };
      }

      // 3. New message dispatch: prepend to inverted list (0 is newest)
      return {
        messages: {
          ...state.messages,
          [message.id]: message,
        },
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: [message.id, ...prevIds],
        },
      };
    });
  },

  addReaction: (messageId: string, emoji: string, userId: string) => {
    set((state) => {
      const msg = state.messages[messageId];
      if (!msg) return state;

      const currentReactions = msg.reactions || {};
      const currentUsers = currentReactions[emoji] || [];

      if (currentUsers.includes(userId)) {
        // Toggle off if already reacted with this emoji
        const filtered = currentUsers.filter((u) => u !== userId);
        const updated = { ...currentReactions };
        if (filtered.length === 0) {
          delete updated[emoji];
        } else {
          updated[emoji] = filtered;
        }
        return {
          messages: {
            ...state.messages,
            [messageId]: {
              ...msg,
              reactions: updated,
              updatedAt: Date.now(),
            },
          },
        };
      }

      // Add reaction
      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...msg,
            reactions: {
              ...currentReactions,
              [emoji]: [...currentUsers, userId],
            },
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  removeReaction: (messageId: string, emoji: string, userId: string) => {
    set((state) => {
      const msg = state.messages[messageId];
      if (!msg || !msg.reactions?.[emoji]) return state;

      const filtered = msg.reactions[emoji].filter((u) => u !== userId);
      const updated = { ...msg.reactions };
      if (filtered.length === 0) {
        delete updated[emoji];
      } else {
        updated[emoji] = filtered;
      }

      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...msg,
            reactions: updated,
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  deleteMessage: (conversationId: string, messageId: string) => {
    set((state) => {
      const newMessages = { ...state.messages };
      delete newMessages[messageId];

      const prevIds = state.conversationMessageIds[conversationId] || [];
      const filteredIds = prevIds.filter((id) => id !== messageId);

      return {
        messages: newMessages,
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: filteredIds,
        },
        selectedMessage: state.selectedMessage?.id === messageId ? null : state.selectedMessage,
      };
    });
  },

  editMessage: (messageId: string, newText: string) => {
    set((state) => {
      const msg = state.messages[messageId];
      if (!msg) return state;
      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...msg,
            text: newText.trim(),
            isEdited: true,
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  pinMessage: (conversationId: string, messageId: string) => {
    set((state) => {
      const msg = state.messages[messageId];
      if (!msg) return state;
      return {
        messages: {
          ...state.messages,
          [messageId]: {
            ...msg,
            isPinned: !msg.isPinned,
            updatedAt: Date.now(),
          },
        },
      };
    });
  },

  setTypingAction: (conversationId: string, author: Author, action: TypingAction | null) => {
    set((state) => {
      const currentList = state.userTypingStates[conversationId] || [];
      if (!action) {
        const filtered = currentList.filter((item) => item.author.id !== author.id);
        return {
          userTypingStates: {
            ...state.userTypingStates,
            [conversationId]: filtered,
          },
        };
      }

      const existingIndex = currentList.findIndex((item) => item.author.id === author.id);
      const newItem: UserTypingState = { author, action, timestamp: Date.now() };
      let updated: UserTypingState[];
      if (existingIndex >= 0) {
        updated = [...currentList];
        updated[existingIndex] = newItem;
      } else {
        updated = [...currentList, newItem];
      }

      return {
        userTypingStates: {
          ...state.userTypingStates,
          [conversationId]: updated,
        },
      };
    });
  },

  loadHistoricalMessages: async (conversationId: string, limit: number = 20): Promise<number> => {
    const state = get();
    if (state.isLoadingHistory[conversationId]) return 0;
    if (state.hasMoreHistory[conversationId] === false) return 0;

    set((s) => ({
      isLoadingHistory: { ...s.isLoadingHistory, [conversationId]: true },
    }));

    // Realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const currentIds = get().conversationMessageIds[conversationId] || [];
    const oldestMessage = currentIds.length > 0 ? get().messages[currentIds[currentIds.length - 1]] : null;
    const baseTime = oldestMessage ? oldestMessage.createdAt - 1000 * 60 * 15 : Date.now() - 1000 * 60 * 60 * 24;

    // Generate historical mock messages for testing pagination
    const historicalMessages: Message[] = [];
    const historicalIds: string[] = [];
    const totalToGenerate = Math.min(limit, 15);

    const partnerAuthor: Author = {
      id: 'partner_user',
      name: 'Alex Rivers',
      username: 'alex_rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isOnline: true,
      isVerified: true,
    };

    const mockTexts = [
      'Did you get a chance to review the design spec?',
      'Yes, the animations look silky smooth!',
      'We verified the 120 FPS frame rate on ProMotion.',
      'FlashList view recycling works without any state leaks.',
      'Check out this architecture diagram when you can.',
      'Zero layout shifts when prepending historical items.',
      'Keyboard tracking with worklets is rock solid!',
    ];

    for (let i = 0; i < totalToGenerate; i++) {
      const msgId = `hist_${conversationId}_${currentIds.length + i + 1}`;
      const isMe = i % 2 === 0;
      const msgTime = baseTime - i * 1000 * 60 * 10;
      const text = mockTexts[i % mockTexts.length];

      const historicalMsg: Message = {
        id: msgId,
        conversationId,
        senderId: isMe ? CURRENT_USER.id : partnerAuthor.id,
        sender: isMe ? CURRENT_USER : partnerAuthor,
        text,
        status: 'READ',
        createdAt: msgTime,
        updatedAt: msgTime,
        reactions: i % 3 === 0 ? { '👍': ['partner_user'] } : {},
      };

      historicalMessages.push(historicalMsg);
      historicalIds.push(msgId);
    }

    set((s) => {
      const newMessages = { ...s.messages };
      historicalMessages.forEach((msg) => {
        newMessages[msg.id] = msg;
      });

      const updatedIds = [...(s.conversationMessageIds[conversationId] || []), ...historicalIds];

      return {
        messages: newMessages,
        conversationMessageIds: {
          ...s.conversationMessageIds,
          [conversationId]: updatedIds,
        },
        isLoadingHistory: {
          ...s.isLoadingHistory,
          [conversationId]: false,
        },
        hasMoreHistory: {
          ...s.hasMoreHistory,
          // Limit total history to 60 items for realistic demo boundary
          [conversationId]: updatedIds.length < 60,
        },
      };
    });

    return historicalMessages.length;
  },


  loadNewerMessages: async (conversationId: string, limit: number = 20): Promise<number> => {
    const state = get();
    if (state.isLoadingNewer[conversationId]) return 0;
    if (state.hasMoreNewer[conversationId] === false) return 0;

    set((s) => ({
      isLoadingNewer: { ...s.isLoadingNewer, [conversationId]: true },
    }));

    await new Promise((resolve) => setTimeout(resolve, 250));

    // Optimistic boundary: mark newer history complete when reaching latest
    set((s) => ({
      isLoadingNewer: { ...s.isLoadingNewer, [conversationId]: false },
      hasMoreNewer: { ...s.hasMoreNewer, [conversationId]: false },
    }));

    return 0;
  },

  seedConversation: (conversationId: string, seedMessages: Message[]) => {
    set((state) => {
      const newMessages = { ...state.messages };
      const ids: string[] = [];

      seedMessages.forEach((msg) => {
        newMessages[msg.id] = msg;
        ids.push(msg.id);
      });

      return {
        messages: newMessages,
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: ids,
        },
        hasMoreHistory: {
          ...state.hasMoreHistory,
          [conversationId]: true,
        },
        hasMoreNewer: {
          ...state.hasMoreNewer,
          [conversationId]: false,
        },
      };
    });
  },

  markConversationAsRead: (conversationId: string) => {
    set((state) => {
      const myId = state.currentUser?.id || CURRENT_USER.id;
      const ids = state.conversationMessageIds[conversationId] || [];
      let hasChanges = false;
      const updatedMessages = { ...state.messages };

      ids.forEach((id) => {
        const msg = updatedMessages[id];
        if (msg && msg.senderId !== myId && msg.status !== 'READ') {
          updatedMessages[id] = { ...msg, status: 'READ', updatedAt: Date.now() };
          hasChanges = true;
        }
      });

      if (!hasChanges) return state;
      return { messages: updatedMessages };
    });
  },

  clearConversation: (conversationId: string) => {
    set((state) => {
      const ids = state.conversationMessageIds[conversationId] || [];
      const newMessages = { ...state.messages };
      ids.forEach((id) => {
        delete newMessages[id];
      });
      return {
        messages: newMessages,
        conversationMessageIds: {
          ...state.conversationMessageIds,
          [conversationId]: [],
        },
        replyingTo: state.replyingTo?.conversationId === conversationId ? null : state.replyingTo,
        selectedMessage: state.selectedMessage?.conversationId === conversationId ? null : state.selectedMessage,
      };
    });
  },
}));

// ============================================================================
// Fine-Grained Selectors (Zero Redundant Re-Renders)
// ============================================================================

export const useConversationMessageIds = (conversationId: string): string[] => {
  return useChatStore(
    useShallow((state) => state.conversationMessageIds[conversationId] || [])
  );
};

export const useChatMessage = (messageId: string): Message | undefined => {
  return useChatStore((state) => state.messages[messageId]);
};

export const useChatCurrentUser = (): Author => {
  return useChatStore((state) => state.currentUser);
};

export const useChatReplyingTo = (): Message | null => {
  return useChatStore((state) => state.replyingTo);
};

export const useChatSelectedMessage = (): Message | null => {
  return useChatStore((state) => state.selectedMessage);
};

export const useChatActionSheetOpen = (): boolean => {
  return useChatStore((state) => state.isActionSheetOpen);
};

export const useChatAttachmentPickerOpen = (): boolean => {
  return useChatStore((state) => state.isAttachmentPickerOpen);
};

export const useChatIsLoadingHistory = (conversationId: string): boolean => {
  return useChatStore((state) => !!state.isLoadingHistory[conversationId]);
};

export const useChatHasMoreHistory = (conversationId: string): boolean => {
  return useChatStore((state) => state.hasMoreHistory[conversationId] !== false);
};

export const useChatIsLoadingNewer = (conversationId: string): boolean => {
  return useChatStore((state) => !!state.isLoadingNewer[conversationId]);
};

export const useChatHasMoreNewer = (conversationId: string): boolean => {
  return useChatStore((state) => state.hasMoreNewer[conversationId] === true);
};

export const useChatAudioPlayback = (messageId: string) => {
  const isPlaying = useChatStore((state) => state.activeAudioMessageId === messageId);
  const progress = useChatStore((state) =>
    state.activeAudioMessageId === messageId ? state.audioPlaybackProgress : 0
  );
  const speed = useChatStore((state) => state.audioPlaybackSpeed);
  const playAudio = useChatStore((state) => state.playAudio);
  const pauseAudio = useChatStore((state) => state.pauseAudio);
  const stopAudio = useChatStore((state) => state.stopAudio);
  const seekAudio = useChatStore((state) => state.seekAudio);
  const setPlaybackSpeed = useChatStore((state) => state.setAudioPlaybackSpeed);

  return {
    isPlaying,
    progress,
    speed,
    playAudio,
    pauseAudio,
    stopAudio,
    seekAudio,
    setPlaybackSpeed,
  };
};

export const useChatHighlightedMessageId = (): string | null => {
  return useChatStore((state) => state.highlightedMessageId);
};

export const useChatSearchState = () => {
  return useChatStore(useShallow((state) => state.searchState));
};

export const useChatSearchBarOpen = (): boolean => {
  return useChatStore((state) => state.isSearchBarOpen);
};

export const useChatIsOnline = (): boolean => {
  return useChatStore((state) => state.isOnline);
};

export const useChatOutboxQueue = (): OutboxQueueItem[] => {
  return useChatStore(useShallow((state) => state.outboxQueue));
};

export const useChatTypingStates = (conversationId: string): UserTypingState[] => {
  return useChatStore(
    useShallow((state) => state.userTypingStates[conversationId] || [])
  );
};

export const useChatCustomBackgroundUri = (): string | null => {
  return useChatStore((state) => state.customBackgroundUri);
};

