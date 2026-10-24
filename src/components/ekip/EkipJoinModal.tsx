import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassButton, GlassInput } from '../Glass';
import { GlassSheet } from '../Overlays';
import { useTheme } from '../../lib/theme';
import { useI18n } from '../../lib/i18n';
import type { Group } from '../../types/database';

export function EkipJoinModal({
  open,
  group,
  eligible,
  message,
  onChangeMessage,
  onSubmit,
  onClose,
}: {
  open: boolean;
  group: Group;
  eligible: boolean;
  message: string;
  onChangeMessage: (msg: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const { isRTL, t } = useI18n();

  return (
    <GlassSheet open={open} onClose={onClose} title={isRTL ? `پیوستن به ${group.title}` : `Join ${group.title}`}>
      <View style={{ gap: 14 }}>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {group.auto_accept
            ? (isRTL ? 'پذیرش خودکار فعال است. شما بلافاصله پس از تایید عضو اکیپ خواهید شد.' : 'Instant join is enabled. You will join the Ekip right away.')
            : (isRTL ? 'پیام معرفی یا درخواست عضویت خود را برای میزبان اکیپ ارسال کنید.' : 'Send a friendly intro message to the host.')}
        </Text>

        {!group.auto_accept && (
          <GlassInput
            placeholder={isRTL ? 'سلام! معرفی کوتاه یا پیامی برای میزبان بنویسید...' : 'Say hi and write a short message to the host...'}
            value={message}
            onChangeText={onChangeMessage}
            multiline
            numberOfLines={3}
          />
        )}

        <View style={{ marginTop: 8 }}>
          <GlassButton
            fullWidth
            size="lg"
            onPress={onSubmit}
            disabled={!eligible}
          >
            {group.auto_accept
              ? (isRTL ? 'پیوستن به اکیپ' : 'Join Ekip')
              : (isRTL ? 'ارسال درخواست عضویت' : 'Send Request')}
          </GlassButton>
        </View>
      </View>
    </GlassSheet>
  );
}

const styles = StyleSheet.create({
  desc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
