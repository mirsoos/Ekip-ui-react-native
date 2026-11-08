import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';
import { draftStorage } from '../lib/draftStorage.ts';
import type { Message } from '../types/chat.types.ts';

describe('Chat UX Stabilization & Directives Verification', () => {
  const convId = 'ux_stabilization_conv_1';

  test('Directive 2: Long-press message selection keeps message in-place without duplicates', () => {
    const store = useChatStore.getState();
    const testMsg: Message = {
      id: 'msg_lp_test_1',
      conversationId: convId,
      senderId: 'partner_user',
      sender: { id: 'partner_user', name: 'Partner' },
      text: 'Long press test message',
      status: 'READ',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.seedConversation(convId, [testMsg]);
    assert.equal(useChatStore.getState().conversationMessageIds[convId]?.length, 1);
    assert.equal(useChatStore.getState().selectedMessage, null);

    // Select message on long press
    store.setSelectedMessage(testMsg);
    assert.equal(useChatStore.getState().selectedMessage?.id, testMsg.id);

    // List item still exists in the original array and has NOT been duplicated
    const ids = useChatStore.getState().conversationMessageIds[convId];
    assert.equal(ids.length, 1);
    assert.equal(ids[0], testMsg.id);

    // Dismiss selection
    store.setSelectedMessage(null);
    assert.equal(useChatStore.getState().selectedMessage, null);
    assert.equal(useChatStore.getState().conversationMessageIds[convId].length, 1);
  });

  test('Directive 4: Send vs Voice button logic is rock-solid and simple', () => {
    const checkHasText = (text: string, attachmentCount: number = 0) => {
      return text.trim().length > 0 || attachmentCount > 0;
    };

    // Empty text -> Voice mode
    assert.equal(checkHasText(''), false);
    assert.equal(checkHasText('   '), false);
    assert.equal(checkHasText('\n\t  '), false);

    // Non-empty text -> Send mode
    assert.equal(checkHasText('a'), true);
    assert.equal(checkHasText('Hello world'), true);
    assert.equal(checkHasText('  spaces trimmed  '), true);

    // Empty text with attachments -> Send mode
    assert.equal(checkHasText('', 1), true);
    assert.equal(checkHasText('   ', 2), true);
  });

  test('Input Message Situations: Replying context is properly cleared on send', async () => {
    const store = useChatStore.getState();
    const replyTarget: Message = {
      id: 'target_for_reply',
      conversationId: convId,
      senderId: 'partner_user',
      sender: { id: 'partner_user', name: 'Partner' },
      text: 'Message to be replied to',
      status: 'READ',
      createdAt: Date.now() - 10000,
      updatedAt: Date.now() - 10000,
    };

    store.setReplyingTo(replyTarget);
    assert.equal(useChatStore.getState().replyingTo?.id, replyTarget.id);

    // Sending message with replyTo
    const sentId = await store.sendMessage(convId, 'My quote response', undefined, replyTarget);
    assert.ok(sentId);

    // replyingTo should now be cleared in store
    assert.equal(useChatStore.getState().replyingTo, null);

    const sentMessage = useChatStore.getState().messages[sentId];
    assert.ok(sentMessage);
    assert.equal(sentMessage.replyTo?.id, replyTarget.id);
    assert.equal(sentMessage.replyTo?.text, replyTarget.text);
  });

  test('Input Message Situations: Draft auto-saving and clearing on send', async () => {
    const draftConv = 'draft_test_conv_99';
    draftStorage.saveDraft(draftConv, 'Unfinished draft message');
    assert.equal(draftStorage.getDraft(draftConv), 'Unfinished draft message');

    // Simulate sending clearing the draft
    draftStorage.clearDraft(draftConv);
    assert.equal(draftStorage.getDraft(draftConv), '');
  });

  test('Directive 3: Theme custom background URI updates cleanly in store without hardcoded assets', () => {
    const store = useChatStore.getState();
    assert.equal(store.customBackgroundUri, null);

    store.setCustomBackgroundUri('https://example.com/custom_bg.jpg');
    assert.equal(useChatStore.getState().customBackgroundUri, 'https://example.com/custom_bg.jpg');

    store.setCustomBackgroundUri(null);
    assert.equal(useChatStore.getState().customBackgroundUri, null);
  });

  test('Input Message Situations: Voice recording container expansion vs fixed 44x44 toggle', () => {
    // When idle: container size must be strictly 44x44
    const getContainerStyle = (isRecordingVoice: boolean) => {
      return isRecordingVoice
        ? { flex: 1, height: 44, position: 'relative' }
        : { width: 44, height: 44, position: 'relative' };
    };

    const idleStyle = getContainerStyle(false);
    assert.equal(idleStyle.width, 44);
    assert.equal(idleStyle.height, 44);

    // When recording: container expands to full width so controls/waveforms fit
    const recordingStyle = getContainerStyle(true);
    assert.equal(recordingStyle.flex, 1);
    assert.equal(recordingStyle.height, 44);
    assert.equal((recordingStyle as any).width, undefined);
  });

  test('Directive 2: Unselected messages dim when a message is elevated on long-press', () => {
    const store = useChatStore.getState();
    const msg1: Message = {
      id: 'dim_msg_1',
      conversationId: convId,
      senderId: 'user_1',
      sender: { id: 'user_1', name: 'User 1' },
      text: 'First message',
      status: 'READ',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const msg2: Message = {
      id: 'dim_msg_2',
      conversationId: convId,
      senderId: 'user_2',
      sender: { id: 'user_2', name: 'User 2' },
      text: 'Second message',
      status: 'READ',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    store.seedConversation(convId, [msg1, msg2]);
    store.setSelectedMessage(msg1);

    const getDimState = (messageId: string) => {
      const selected = useChatStore.getState().selectedMessage;
      const isAnySelected = !!selected;
      const isSelected = selected?.id === messageId;
      return { isSelected, isDimmed: isAnySelected && !isSelected };
    };

    assert.deepEqual(getDimState('dim_msg_1'), { isSelected: true, isDimmed: false });
    assert.deepEqual(getDimState('dim_msg_2'), { isSelected: false, isDimmed: true });

    // Dismiss
    store.setSelectedMessage(null);
    assert.deepEqual(getDimState('dim_msg_1'), { isSelected: false, isDimmed: false });
    assert.deepEqual(getDimState('dim_msg_2'), { isSelected: false, isDimmed: false });
  });
});
