import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FileText } from 'lucide-react-native';
import type { Attachment, Message } from '../../types/chat.types';
import { StatusIndicator } from './StatusIndicator';
import { AudioPlayer } from '../VoiceNote/AudioPlayer';
import { MediaGrid } from '../Media/MediaGrid';
import { VideoPlayer } from '../Media/VideoPlayer';

import { SpoilerView } from '../RichText/SpoilerView';
import { useChatTheme, CHAT_THEMES } from '../../../../lib/theme';

export interface MediaMessageProps {
  message: Message;
  attachment: Attachment;
  isMe: boolean;
  onRetry?: () => void;
  onPressMedia?: (attachment: Attachment, index?: number, allAttachments?: Attachment[]) => void;
}

const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

export const MediaMessage = React.memo(function MediaMessage({
  message,
  attachment,
  isMe,
  onRetry,
  onPressMedia,
}: MediaMessageProps) {
  const { chatTheme } = useChatTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;
  const [spoilerRevealed, setSpoilerRevealed] = React.useState(!attachment.isSpoiler);
  const timeStr = React.useMemo(() => formatMessageTime(message.createdAt), [message.createdAt]);
  const attachments = message.attachments || [attachment];

  // 1. Audio / Voice Note Message (Elite Voice Note Engine)
  if (attachment.type === 'audio') {
    return (
      <View style={styles.audioWrapper}>
        <AudioPlayer
          messageId={message.id}
          duration={attachment.duration || 15}
          waveform={attachment.waveform}
          isMe={isMe}
        />
        <View style={styles.audioFooter}>
          <Text
            style={[
              styles.timestampText,
              { color: isMe ? 'rgba(255, 255, 255, 0.6)' : 'rgba(148, 163, 184, 0.8)' },
            ]}
          >
            {timeStr}
          </Text>
          {isMe && (
            <StatusIndicator
              status={message.status}
              onRetry={onRetry}
              color="rgba(255, 255, 255, 0.65)"
              readColor={themeConfig.accentHex}
            />
          )}
        </View>
      </View>
    );
  }

  // 2. Document Attachment
  if (attachment.type === 'document') {
    return (
      <View style={styles.docContainer}>
        <View style={[styles.docIconWrapper, isMe ? styles.docIconMe : styles.docIconPartner]}>
          <FileText size={20} color="#ffffff" />
        </View>
        <View style={styles.docInfo}>
          <Text numberOfLines={1} style={styles.docName}>
            {attachment.fileName || 'Document.pdf'}
          </Text>
          <Text style={styles.docSize}>
            {attachment.fileSize ? `${Math.round(attachment.fileSize / 1024)} KB` : '128 KB'}
          </Text>
        </View>
        <View style={styles.docFooter}>
          <Text
            style={[
              styles.timestampText,
              { color: isMe ? 'rgba(255, 255, 255, 0.6)' : 'rgba(148, 163, 184, 0.8)' },
            ]}
          >
            {timeStr}
          </Text>
          {isMe && (
            <StatusIndicator
              status={message.status}
              onRetry={onRetry}
              color="rgba(255, 255, 255, 0.65)"
              readColor={themeConfig.accentHex}
            />
          )}
        </View>
      </View>
    );
  }

  // 3. Multi-Media Grid (2 or more photos/videos)
  if (attachments.length > 1) {
    return (
      <View style={styles.gridContainer}>
        <MediaGrid
          attachments={attachments}
          onPressItem={(item, idx) => onPressMedia?.(item, idx, attachments)}
          maxWidth={260}
        />
        {!!message.text && (
          <View style={styles.captionWrapper}>
            <Text style={styles.captionText}>{message.text}</Text>
          </View>
        )}
        <View style={styles.floatingPill}>
          <Text style={styles.floatingTime}>{timeStr}</Text>
          {isMe && (
            <StatusIndicator
              status={message.status}
              onRetry={onRetry}
              color="rgba(255, 255, 255, 0.85)"
              readColor={themeConfig.accentHex}
            />
          )}
        </View>
      </View>
    );
  }

  // 4. Single Video
  if (attachment.type === 'video') {
    return (
      <View style={styles.videoWrapper}>
        <VideoPlayer
          attachment={attachment}
          onOpenFullscreen={() => onPressMedia?.(attachment, 0, [attachment])}
          width={240}
          height={180}
        />
        {attachment.isSpoiler && !spoilerRevealed && (
          <SpoilerView
            initialRevealed={false}
            onReveal={() => setSpoilerRevealed(true)}
            style={StyleSheet.absoluteFill}
          >
            <View style={StyleSheet.absoluteFill} />
          </SpoilerView>
        )}
        {!!message.text && (
          <View style={styles.captionWrapper}>
            <Text style={styles.captionText}>{message.text}</Text>
          </View>
        )}
        <View style={styles.floatingPill}>
          <Text style={styles.floatingTime}>{timeStr}</Text>
          {isMe && (
            <StatusIndicator
              status={message.status}
              onRetry={onRetry}
              color="rgba(255, 255, 255, 0.85)"
              readColor={themeConfig.accentHex}
            />
          )}
        </View>
      </View>
    );
  }

  // 5. Single Image Attachment
  const handleSingleImagePress = () => {
    if (attachment.isSpoiler && !spoilerRevealed) {
      setSpoilerRevealed(true);
      return;
    }
    onPressMedia?.(attachment, 0, [attachment]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleSingleImagePress}
      style={styles.imageWrapper}
    >
      <Image
        source={{ uri: attachment.url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: attachment.blurhash || 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        cachePolicy="memory-disk"
        recyclingKey={attachment.id}
      />
      {attachment.isSpoiler && !spoilerRevealed && (
        <SpoilerView
          initialRevealed={false}
          onReveal={() => setSpoilerRevealed(true)}
          style={StyleSheet.absoluteFill}
        >
          <View style={StyleSheet.absoluteFill} />
        </SpoilerView>
      )}

      {!!message.text && (
        <View style={styles.captionWrapper}>
          <Text style={styles.captionText}>{message.text}</Text>
        </View>
      )}

      <View style={styles.floatingPill}>
        <Text style={styles.floatingTime}>{timeStr}</Text>
        {isMe && (
          <StatusIndicator
            status={message.status}
            onRetry={onRetry}
            color="rgba(255, 255, 255, 0.85)"
            readColor={themeConfig.accentHex}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  audioWrapper: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
  },
  audioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
    paddingRight: 4,
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    minWidth: 200,
    maxWidth: 260,
  },
  docIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIconMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  docIconPartner: {
    backgroundColor: '#0284c7',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  docSize: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  docFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  gridContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  videoWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapper: {
    width: 240,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  image: {
    width: '100%',
    height: 180,
  },
  captionWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  captionText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 18,
  },
  floatingPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  floatingTime: {
    fontSize: 11,
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
  timestampText: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
});
