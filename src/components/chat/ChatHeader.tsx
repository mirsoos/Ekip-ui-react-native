import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { GlassAvatar, GlassBackButton } from '../Glass';
import { LiquidLens } from '../LiquidLens';
import { getIcon } from '../../lib/icons';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Conversation } from '../../types/database';

export function ChatHeader({
  conversation,
  onBack,
  onOpenMenu,
}: {
  conversation: Conversation;
  onBack: () => void;
  onOpenMenu?: () => void;
}) {
  const { colors, isDark } = useTheme();
  const { t } = useI18n();
  const isGroup = conversation.type === 'group';
  const MoreIcon = getIcon('MoreVertical');

  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterAnim.setValue(0);
    Animated.spring(enterAnim, {
      toValue: 1,
      bounciness: 4,
      speed: 14,
      useNativeDriver: false,
    }).start();
  }, []);

  const enterTranslateY = enterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: colors.glassBorderStrong,
            transform: [{ translateY: enterTranslateY }],
          },
        ]}
      >
        {/* 360° Liquid Glass Lens */}
        <LiquidLens
          borderRadius={36}
          marginWidth={16}
          scale={36}
          blurDeviation={2.0}
          overlayOpacity={isDark ? 0.08 : 0.15}
          style={StyleSheet.absoluteFill}
        />

        <GlassBackButton onPress={onBack} style={{ marginRight: 10, zIndex: 10 }} />

        <View style={{ zIndex: 10 }}>
          <GlassAvatar
            src={conversation.avatar_url}
            name={conversation.title}
            size={38}
            online={!isGroup}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10, zIndex: 10 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {conversation.title}
          </Text>
          <Text style={[styles.status, { color: colors.textTertiary }]}>
            {isGroup ? t('chat.channel') : t('chat.encryptedLink')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onOpenMenu}
          style={[
            styles.moreBtn,
            { backgroundColor: colors.glassThinBg, borderColor: colors.glassBorder },
          ]}
        >
          <MoreIcon size={18} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    zIndex: 900,
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 36,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'visible',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    marginTop: 2,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
  },
});
