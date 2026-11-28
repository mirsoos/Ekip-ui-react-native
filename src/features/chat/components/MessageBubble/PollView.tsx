import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Check, Circle, Square, CheckSquare, BarChart2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { PollData } from '../../types/chat.types';
import { useChatStore } from '../../store/chatStore';
import { useTheme } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';

export interface PollViewProps {
  poll: PollData;
  messageId: string;
  isMe: boolean;
  currentUserId?: string;
  textColor?: string;
}

export const PollView = React.memo(function PollView({
  poll,
  messageId,
  isMe,
  currentUserId = 'me',
  textColor,
}: PollViewProps) {
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();

  const totalVotes = useMemo(() => {
    return poll.options.reduce((sum, opt) => sum + (opt.voterIds?.length || 0), 0);
  }, [poll.options]);

  const hasVotedAny = useMemo(() => {
    return poll.options.some((opt) => opt.voterIds?.includes(currentUserId));
  }, [poll.options, currentUserId]);

  const showResults = hasVotedAny || !!poll.isClosed;

  const handleVote = useCallback(
    (optionId: string) => {
      if (poll.isClosed) return;
      if (Platform.OS !== 'web') {
        try {
          Haptics.selectionAsync();
        } catch {}
      }
      useChatStore.getState().votePoll(messageId, optionId, currentUserId);
    },
    [messageId, currentUserId, poll.isClosed]
  );

  const handleClosePoll = useCallback(() => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    useChatStore.getState().closePoll(messageId);
  }, [messageId]);

  const isCreator = currentUserId === poll.creatorId;

  const resolvedTextColor = textColor || (isMe ? '#ffffff' : colors.textPrimary);
  const secondaryTextColor = isMe ? 'rgba(255, 255, 255, 0.75)' : colors.textSecondary;
  const tertiaryTextColor = isMe ? 'rgba(255, 255, 255, 0.55)' : colors.textTertiary;

  const subtitle = poll.isClosed
    ? isRTL
      ? 'نتایج نهایی'
      : 'Final Results'
    : poll.isAnonymous
    ? poll.allowsMultiple
      ? isRTL
        ? 'نظرسنجی ناشناس • چند گزینه‌ای'
        : 'Anonymous Poll • Multiple Answers'
      : isRTL
      ? 'نظرسنجی ناشناس'
      : 'Anonymous Poll'
    : poll.allowsMultiple
    ? isRTL
      ? 'نظرسنجی عمومی • چند گزینه‌ای'
      : 'Public Poll • Multiple Answers'
    : isRTL
    ? 'نظرسنجی عمومی'
    : 'Public Poll';

  const votesLabel =
    totalVotes === 1
      ? isRTL
        ? '۱ رای'
        : '1 vote'
      : isRTL
      ? `${totalVotes} رای`
      : `${totalVotes} votes`;

  return (
    <View style={styles.container}>
      {/* Poll Header */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <BarChart2 size={16} color="#eab308" />
        <View style={styles.headerTextWrap}>
          <Text style={[styles.questionText, { color: resolvedTextColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {poll.question}
          </Text>
          <Text style={[styles.subtitleText, { color: tertiaryTextColor, textAlign: isRTL ? 'right' : 'left' }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {poll.options.map((opt) => {
          const voteCount = opt.voterIds?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isVotedByMe = opt.voterIds?.includes(currentUserId);

          if (showResults) {
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleVote(opt.id)}
                disabled={poll.isClosed}
                activeOpacity={0.75}
                style={[
                  styles.resultOptionRow,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                {/* Progress bar background */}
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: isMe
                        ? 'rgba(255, 255, 255, 0.22)'
                        : isDark
                        ? 'rgba(2, 132, 199, 0.28)'
                        : 'rgba(2, 132, 199, 0.16)',
                    },
                  ]}
                />

                {/* Percentage label */}
                <Text style={[styles.percentageText, { color: resolvedTextColor }]}>
                  {`${percentage}%`}
                </Text>

                {/* Option text */}
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: resolvedTextColor,
                      textAlign: isRTL ? 'right' : 'left',
                      fontWeight: isVotedByMe ? '700' : '500',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {opt.text}
                </Text>

                {/* Checkmark icon if voted */}
                {isVotedByMe && (
                  <View style={styles.votedBadge}>
                    <Check size={14} color="#38bdf8" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }

          // Unvoted / Interactive state
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleVote(opt.id)}
              activeOpacity={0.7}
              style={[
                styles.interactiveOptionRow,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <View style={styles.checkboxWrap}>
                {poll.allowsMultiple ? (
                  isVotedByMe ? (
                    <CheckSquare size={18} color="#38bdf8" />
                  ) : (
                    <Square size={18} color={secondaryTextColor} />
                  )
                ) : isVotedByMe ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioInner} />
                  </View>
                ) : (
                  <Circle size={18} color={secondaryTextColor} />
                )}
              </View>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: resolvedTextColor,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                numberOfLines={2}
              >
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={[styles.footerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.footerVotesText, { color: tertiaryTextColor }]}>
          {votesLabel}
        </Text>

        {isCreator && !poll.isClosed && (
          <TouchableOpacity onPress={handleClosePoll} activeOpacity={0.7} style={styles.closePollBtn}>
            <Text style={styles.closePollText}>
              {isRTL ? 'بستن نظرسنجی' : 'Close Poll'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    minWidth: 220,
    maxWidth: 320,
  },
  headerRow: {
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  headerTextWrap: {
    flex: 1,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  subtitleText: {
    fontSize: 11,
    marginTop: 2,
  },
  optionsList: {
    gap: 6,
    marginVertical: 4,
  },
  resultOptionRow: {
    position: 'relative',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 36,
  },
  interactiveOptionRow: {
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  checkboxWrap: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  votedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerRow: {
    marginTop: 6,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerVotesText: {
    fontSize: 11,
    fontWeight: '500',
  },
  closePollBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  closePollText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
  },
});
