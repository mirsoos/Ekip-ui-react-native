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
            ? (isRTL ? 'پذیرش خودکار فعال است. شما بلافاصله پس از تایید عضو اکیپ خواهید شد.' : 'Automatic clearance enabled. You will be deployed immediately.')
            : (isRTL ? 'پیام معرفی یا درخواست عضویت خود را برای سازنده اکیپ ارسال کنید.' : 'Send a clearance request note to the squad commander.')}
        </Text>

        {!group.auto_accept && (
          <GlassInput
            placeholder={isRTL ? 'پیام یا معرفی کوتاه خود را بنویسید...' : 'Transmit operator credentials / introduction...'}
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
              ? (isRTL ? 'عضویت فوری' : 'Deploy Immediately')
              : (isRTL ? 'ارسال درخواست ورود' : 'Transmit Request')}
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
