import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Image as ImageIcon, Camera, Mic, FileText } from 'lucide-react-native';

import { GlassSheet } from '../../../../components/Overlays';
import { useTheme } from '../../../../lib/theme';
import { useI18n } from '../../../../lib/i18n';
import type { Attachment } from '../../types/chat.types';

interface AttachmentPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectAttachment: (attachment: Attachment) => void;
}

export const AttachmentPicker = React.memo(function AttachmentPicker({
  visible,
  onClose,
  onSelectAttachment,
}: AttachmentPickerProps) {
  const { colors } = useTheme();
  const { isRTL } = useI18n();

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  const handlePickImage = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `att_${Date.now()}`,
          type: 'image',
          url: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || 'photo.jpg',
          fileSize: asset.fileSize,
        };
        onSelectAttachment(newAttachment);
        onClose();
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  }, [onSelectAttachment, onClose]);

  const handleTakePhoto = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.85,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `att_${Date.now()}`,
          type: 'image',
          url: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || 'camera_photo.jpg',
        };
        onSelectAttachment(newAttachment);
        onClose();
      }
    } catch (err) {
      console.warn('Camera error:', err);
    }
  }, [onSelectAttachment, onClose]);

  const handleVoiceNote = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const voiceAttachment: Attachment = {
      id: `audio_${Date.now()}`,
      type: 'audio',
      url: 'mock_audio.m4a',
      duration: 18,
      fileName: isRTL ? 'پیام صوتی (0:18)' : 'Voice note (0:18)',
    };
    onSelectAttachment(voiceAttachment);
    onClose();
  }, [onSelectAttachment, onClose, isRTL]);

  const handleDocument = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const docAttachment: Attachment = {
      id: `doc_${Date.now()}`,
      type: 'document',
      url: 'mock_spec.pdf',
      fileName: 'Architecture_Design_Spec.pdf',
      fileSize: 420 * 1024,
    };
    onSelectAttachment(docAttachment);
    onClose();
  }, [onSelectAttachment, onClose]);

  return (
    <GlassSheet
      open={visible}
      onClose={onClose}
      title={isRTL ? 'ارسال رسانه' : 'Share Media'}
    >
      <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={handlePickImage}
          style={styles.item}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Choose Photo"
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: 'rgba(2, 132, 199, 0.22)',
                borderColor: 'rgba(2, 132, 199, 0.45)',
              },
            ]}
          >
            <ImageIcon size={24} color="#38bdf8" />
          </View>
          <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
            {isRTL ? 'تصویر' : 'Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTakePhoto}
          style={styles.item}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open Camera"
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: 'rgba(5, 150, 105, 0.22)',
                borderColor: 'rgba(5, 150, 105, 0.45)',
              },
            ]}
          >
            <Camera size={24} color="#34d399" />
          </View>
          <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
            {isRTL ? 'دوربین' : 'Camera'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleVoiceNote}
          style={styles.item}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Record Voice"
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: 'rgba(139, 92, 246, 0.22)',
                borderColor: 'rgba(139, 92, 246, 0.45)',
              },
            ]}
          >
            <Mic size={24} color="#a78bfa" />
          </View>
          <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
            {isRTL ? 'صدا' : 'Voice'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDocument}
          style={styles.item}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Send Document"
        >
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: 'rgba(217, 119, 6, 0.22)',
                borderColor: 'rgba(217, 119, 6, 0.45)',
              },
            ]}
          >
            <FileText size={24} color="#fbbf24" />
          </View>
          <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>
            {isRTL ? 'سند' : 'Document'}
          </Text>
        </TouchableOpacity>
      </View>
    </GlassSheet>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
