/**
 * Production-Grade Universal Chat Types
 * Solid 60/120 FPS Frame Budget, Normalized Architecture
 */

export type MessageStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED';

export type AttachmentType = 'image' | 'video' | 'audio' | 'document';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number; // seconds (audio/video)
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  blurhash?: string;
  waveform?: number[];
  isSpoiler?: boolean;
}

export interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface Author {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string | null;
  isOnline?: boolean;
  isVerified?: boolean;
}

export interface BubbleLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReplyPreview {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  mediaUrl?: string | null;
  type?: AttachmentType | 'text';
}

export interface Message {
  id: string;
  tempId?: string;
  conversationId: string;
  senderId: string;
  sender: Author;
  text: string;
  status: MessageStatus;
  createdAt: number; // Unix timestamp (ms)
  updatedAt?: number;
  attachments?: Attachment[];
  replyTo?: ReplyPreview | null;
  reactions?: Record<string, string[]>; // emoji key -> array of userIds
  isOptimistic?: boolean;
  error?: string | null;
  metadata?: Record<string, unknown>;
  linkPreview?: LinkPreviewData | null;
  isPinned?: boolean;
  isEdited?: boolean;
}

export interface OutboxQueueItem {
  id: string;
  conversationId: string;
  text: string;
  attachments?: Attachment[];
  replyTo?: Message | null;
  author: Author;
  createdAt: number;
  attempts: number;
  nextRetryAt: number;
}

export interface SearchState {
  query: string;
  isActive: boolean;
  matchingMessageIds: string[];
  currentIndex: number;
}

export type TypingAction = 'typing' | 'recording_voice' | 'uploading_media';

export interface UserTypingState {
  author: Author;
  action: TypingAction;
  timestamp: number;
}

export interface ChatState {
  // Current logged in user for message authorship
  currentUser: Author;
  // Normalized Message Storage: id -> Message
  messages: Record<string, Message>;
  // Ordered message IDs per conversation: newest first (inverted 0 = latest)
  conversationMessageIds: Record<string, string[]>;
  activeConversationId: string | null;
  replyingTo: Message | null;
  selectedMessage: Message | null;
  isActionSheetOpen: boolean;
  isAttachmentPickerOpen: boolean;
  // Bi-directional pagination state
  isLoadingHistory: Record<string, boolean>;
  hasMoreHistory: Record<string, boolean>;
  isLoadingNewer: Record<string, boolean>;
  hasMoreNewer: Record<string, boolean>;
  typingUsers: Record<string, Author[]>;
  userTypingStates: Record<string, UserTypingState[]>;

  // Atomized Audio Playback Engine (prevents FlashList recycling leaks)
  activeAudioMessageId: string | null;
  audioPlaybackProgress: number;
  audioPlaybackSpeed: number; // 1.0 | 1.5 | 2.0
  playAudio: (messageId: string, duration?: number) => void;
  pauseAudio: (messageId: string) => void;
  stopAudio: () => void;
  seekAudio: (messageId: string, progress: number) => void;
  setAudioPlaybackSpeed: (speed: number) => void;

  // Targeted Quote-Jumping & Flash Highlight
  highlightedMessageId: string | null;
  setHighlightedMessageId: (messageId: string | null) => void;

  // Search Engine
  isSearchBarOpen: boolean;
  setSearchBarOpen: (isOpen: boolean) => void;
  searchState: SearchState;
  setSearchQuery: (query: string, conversationId: string) => void;
  goToSearchMatch: (direction: 'next' | 'prev') => void;
  clearSearch: () => void;

  // Offline Outbox Engine
  isOnline: boolean;
  outboxQueue: OutboxQueueItem[];
  setIsOnline: (online: boolean) => void;
  enqueueOutboxMessage: (
    conversationId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: Message | null,
    author?: Author
  ) => string;
  processOutboxQueue: () => Promise<void>;

  // Actions
  setCurrentUser: (user: Author) => void;
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (
    conversationId: string,
    text: string,
    attachments?: Attachment[],
    replyTo?: Message | null,
    author?: Author
  ) => Promise<string>;
  retryMessage: (messageId: string) => Promise<void>;
  receiveIncomingMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (messageId: string, status: MessageStatus) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  pinMessage: (conversationId: string, messageId: string) => void;
  setReplyingTo: (message: Message | null) => void;
  setSelectedMessage: (message: Message | null) => void;
  setActionSheetOpen: (isOpen: boolean) => void;
  setAttachmentPickerOpen: (isOpen: boolean) => void;
  setTypingAction: (conversationId: string, author: Author, action: TypingAction | null) => void;
  loadHistoricalMessages: (conversationId: string, limit?: number) => Promise<number>;
  loadNewerMessages: (conversationId: string, limit?: number) => Promise<number>;
  seedConversation: (conversationId: string, messages: Message[]) => void;
  markConversationAsRead: (conversationId: string) => void;
  clearConversation: (conversationId: string) => void;
  customBackgroundUri: string | null;
  setCustomBackgroundUri: (uri: string | null) => void;
}

