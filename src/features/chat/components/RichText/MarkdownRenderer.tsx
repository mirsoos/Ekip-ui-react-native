import React, { useMemo, useCallback } from 'react';
import { Text, View, StyleSheet, Linking, Platform } from 'react-native';
import { SpoilerView } from './SpoilerView';
import { LinkPreviewCard } from './LinkPreviewCard';
import { extractFirstUrl } from '../../lib/openGraphService';
import { tokenizeMarkdown } from '../../lib/markdownTokenizer';
import type { LinkPreviewData } from '../../types/chat.types';

export interface MarkdownRendererProps {
  content: string;
  isMe?: boolean;
  baseColor?: string;
  onMentionPress?: (username: string) => void;
  onUrlPress?: (url: string) => void;
  showLinkPreview?: boolean;
  linkPreviewData?: LinkPreviewData | null;
}

export { tokenizeMarkdown };

export const MarkdownRenderer = React.memo(function MarkdownRenderer({
  content,
  isMe = false,
  baseColor,
  onMentionPress,
  onUrlPress,
  showLinkPreview = true,
  linkPreviewData,
}: MarkdownRendererProps) {
  const defaultTextColor = isMe ? '#ffffff' : '#f1f5f9';
  const textColor = baseColor || defaultTextColor;

  const tokens = useMemo(() => tokenizeMarkdown(content), [content]);

  // First URL for auto OpenGraph preview
  const firstUrl = useMemo(() => {
    if (!showLinkPreview) return null;
    return extractFirstUrl(content);
  }, [content, showLinkPreview]);

  const handleUrlPress = useCallback(
    (url: string) => {
      if (onUrlPress) {
        onUrlPress(url);
      } else {
        Linking.openURL(url).catch(() => {});
      }
    },
    [onUrlPress]
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.baseText, { color: textColor }]}>
        {tokens.map((token, index) => {
          switch (token.type) {
            case 'bold':
              return (
                <Text key={index} style={styles.bold}>
                  {token.content}
                </Text>
              );
            case 'italic':
              return (
                <Text key={index} style={styles.italic}>
                  {token.content}
                </Text>
              );
            case 'strike':
              return (
                <Text key={index} style={styles.strike}>
                  {token.content}
                </Text>
              );
            case 'inline_code':
              return (
                <Text
                  key={index}
                  style={[
                    styles.inlineCode,
                    {
                      backgroundColor: isMe
                        ? 'rgba(0, 0, 0, 0.25)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: isMe ? '#e0f2fe' : '#38bdf8',
                    },
                  ]}
                >
                  {` ${token.content} `}
                </Text>
              );
            case 'code_block':
              return (
                <Text
                  key={index}
                  style={[
                    styles.codeBlock,
                    {
                      backgroundColor: isMe
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(15, 23, 42, 0.6)',
                      color: isMe ? '#e0f2fe' : '#38bdf8',
                    },
                  ]}
                >
                  {`\n${token.content}\n`}
                </Text>
              );
            case 'spoiler':
              return (
                <SpoilerView key={index} isMe={isMe} isInline>
                  <Text style={[styles.baseText, { color: textColor }]}>
                    {token.content}
                  </Text>
                </SpoilerView>
              );
            case 'mention':
              return (
                <Text
                  key={index}
                  onPress={() => onMentionPress?.(token.content)}
                  style={[styles.mention, { color: isMe ? '#bae6fd' : '#38bdf8' }]}
                >
                  {token.content}
                </Text>
              );
            case 'url':
              return (
                <Text
                  key={index}
                  onPress={() => handleUrlPress(token.content)}
                  style={[
                    styles.url,
                    { color: isMe ? '#a5f3fc' : '#38bdf8' },
                  ]}
                >
                  {token.content}
                </Text>
              );
            case 'text':
            default:
              return <Text key={index}>{token.content}</Text>;
          }
        })}
      </Text>

      {/* Auto-generated interactive OpenGraph link preview card */}
      {!!firstUrl && showLinkPreview && (
        <LinkPreviewCard
          url={firstUrl}
          initialData={linkPreviewData}
          onPress={handleUrlPress}
          isMe={isMe}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  baseText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  strike: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  inlineCode: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    borderRadius: 4,
  },
  codeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  mention: {
    fontWeight: '600',
  },
  url: {
    textDecorationLine: 'underline',
  },
});
