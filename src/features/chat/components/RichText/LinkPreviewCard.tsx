import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { ExternalLink, Globe } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import type { LinkPreviewData } from '../../types/chat.types';
import { fetchLinkPreview } from '../../lib/openGraphService';

export interface LinkPreviewCardProps {
  url: string;
  initialData?: LinkPreviewData | null;
  onPress?: (url: string) => void;
  isMe?: boolean;
}

export const LinkPreviewCard = React.memo(function LinkPreviewCard({
  url,
  initialData,
  onPress,
  isMe = false,
}: LinkPreviewCardProps) {
  const [data, setData] = useState<LinkPreviewData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);

  // Shimmer placeholder animation
  const shimmerOpacity = useSharedValue(0.3);
  useEffect(() => {
    if (isLoading) {
      shimmerOpacity.value = withRepeat(
        withSequence(withTiming(0.8, { duration: 700 }), withTiming(0.3, { duration: 700 })),
        -1,
        true
      );
    }
  }, [isLoading, shimmerOpacity]);

  const shimmerAnimStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  // Fetch OpenGraph metadata asynchronously
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    fetchLinkPreview(url)
      .then((og) => {
        if (isMounted) {
          setData(og);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url, initialData]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(url);
    } else {
      Linking.openURL(url).catch(() => {});
    }
  }, [url, onPress]);

  // Loading state placeholder with shimmer
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          isMe ? styles.containerMe : styles.containerOther,
          styles.loadingCard,
        ]}
      >
        <Animated.View style={[styles.shimmerBox, shimmerAnimStyle]} />
        <View style={styles.loadingTextRow}>
          <Animated.View style={[styles.shimmerLine, { width: '60%' }, shimmerAnimStyle]} />
          <Animated.View style={[styles.shimmerLine, { width: '85%' }, shimmerAnimStyle]} />
        </View>
      </View>
    );
  }

  if (!data) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
    >
      {/* High-Res Cover Image */}
      {!!data.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.image }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
      )}

      {/* Card Content */}
      <View style={styles.body}>
        {/* Site Header: Favicon + Site Name */}
        <View style={styles.siteHeader}>
          {data.favicon ? (
            <Image source={{ uri: data.favicon }} style={styles.favicon} contentFit="contain" />
          ) : (
            <Globe size={13} color="#94a3b8" />
          )}
          <Text style={styles.siteName} numberOfLines={1}>
            {data.siteName || 'Web Preview'}
          </Text>
          <ExternalLink size={12} color="#94a3b8" style={{ marginLeft: 'auto' }} />
        </View>

        {/* Title */}
        {!!data.title && (
          <Text
            style={[styles.title, isMe ? styles.titleMe : styles.titleOther]}
            numberOfLines={2}
          >
            {data.title}
          </Text>
        )}

        {/* Description */}
        {!!data.description && (
          <Text
            style={[styles.description, isMe ? styles.descMe : styles.descOther]}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    width: '100%',
    maxWidth: 290,
  },
  containerMe: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  containerOther: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: 10,
    gap: 4,
  },
  siteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  favicon: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  siteName: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  titleMe: {
    color: '#ffffff',
  },
  titleOther: {
    color: '#f8fafc',
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
  },
  descMe: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  descOther: {
    color: '#94a3b8',
  },
  loadingCard: {
    height: 80,
    padding: 10,
    justifyContent: 'center',
    gap: 8,
  },
  shimmerBox: {
    height: 14,
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
  },
  loadingTextRow: {
    gap: 6,
  },
  shimmerLine: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
  },
});
