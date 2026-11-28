import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';
import type { Message, Author } from '../types/chat.types.ts';

describe('Telegram-Grade Feature Suite & State Transitions', () => {
  const convId = 'telegram_test_conv_1';
  const testAuthor: Author = {
    id: 'user_tg_1',
    name: 'Telegram User',
    username: 'tg_user',
  };

  test('Pin, cycle, and unpin all messages', () => {
    const store = useChatStore.getState();
    const msg1: Message = {
      id: 'tg_pin_1',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'First pinned announcement',
      status: 'READ',
      createdAt: 1000,
    };
    const msg2: Message = {
      id: 'tg_pin_2',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Second pinned announcement',
      status: 'READ',
      createdAt: 2000,
    };

    store.seedConversation(convId, [msg1, msg2]);

    // Pin first message
    store.pinMessage(convId, 'tg_pin_1');
    let state = useChatStore.getState();
    assert.equal(state.messages['tg_pin_1'].isPinned, true);
    assert.deepEqual(state.pinnedMessageIds[convId], ['tg_pin_1']);

    // Pin second message
    store.pinMessage(convId, 'tg_pin_2');
    state = useChatStore.getState();
    assert.equal(state.messages['tg_pin_2'].isPinned, true);
    assert.deepEqual(state.pinnedMessageIds[convId], ['tg_pin_2', 'tg_pin_1']);

    // Cycle pinned messages
    const cycled1 = store.cyclePinnedMessage(convId);
    state = useChatStore.getState();
    assert.equal(state.activePinnedIndex[convId], 1);
    assert.equal(cycled1, 'tg_pin_1');

    const cycled2 = store.cyclePinnedMessage(convId);
    state = useChatStore.getState();
    assert.equal(state.activePinnedIndex[convId], 0);
    assert.equal(cycled2, 'tg_pin_2');

    // Unpin all messages
    store.unpinAllMessages(convId);
    state = useChatStore.getState();
    assert.equal(state.pinnedMessageIds[convId].length, 0);
    assert.equal(state.messages['tg_pin_1'].isPinned, false);
    assert.equal(state.messages['tg_pin_2'].isPinned, false);
  });

  test('Multi-select mode and batch message deletion', () => {
    const store = useChatStore.getState();
    const msgA: Message = {
      id: 'multi_msg_a',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Batch msg A',
      status: 'READ',
      createdAt: 3000,
    };
    const msgB: Message = {
      id: 'multi_msg_b',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Batch msg B',
      status: 'READ',
      createdAt: 4000,
    };
    const msgC: Message = {
      id: 'multi_msg_c',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Batch msg C',
      status: 'READ',
      createdAt: 5000,
    };

    store.seedConversation(convId, [msgA, msgB, msgC]);

    // Enter selection mode
    store.enterSelectionMode('multi_msg_a');
    let state = useChatStore.getState();
    assert.equal(state.isSelectionMode, true);
    assert.deepEqual(state.selectedMessageIds, ['multi_msg_a']);

    // Toggle another message
    store.toggleMessageSelection('multi_msg_b');
    state = useChatStore.getState();
    assert.deepEqual(state.selectedMessageIds, ['multi_msg_a', 'multi_msg_b']);

    // Batch delete selected messages
    store.deleteMessagesBatch(convId, state.selectedMessageIds);
    state = useChatStore.getState();
    assert.equal(state.messages['multi_msg_a'], undefined);
    assert.equal(state.messages['multi_msg_b'], undefined);
    assert.ok(state.messages['multi_msg_c']);
    assert.equal(state.isSelectionMode, false);
    assert.deepEqual(state.selectedMessageIds, []);

    // Verify conversation message IDs array was cleaned
    assert.deepEqual(state.conversationMessageIds[convId], ['multi_msg_c']);
  });

  test('Message edit lifecycle updates text, sets isEdited, and clears editing state', () => {
    const store = useChatStore.getState();
    const msg: Message = {
      id: 'edit_lifecycle_1',
      conversationId: convId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Original unedited text',
      status: 'SENT',
      createdAt: 6000,
    };

    store.seedConversation(convId, [msg]);

    // Set editing message
    store.setEditingMessage(msg);
    let state = useChatStore.getState();
    assert.equal(state.editingMessage?.id, 'edit_lifecycle_1');

    // Perform edit
    store.editMessage('edit_lifecycle_1', 'Brand new updated text');
    state = useChatStore.getState();
    assert.equal(state.messages['edit_lifecycle_1'].text, 'Brand new updated text');
    assert.equal(state.messages['edit_lifecycle_1'].isEdited, true);
    assert.equal(state.editingMessage, null);
  });

  test('Conversation metadata toggles: mute, pin chat, block, mark unread', () => {
    const store = useChatStore.getState();
    const testConv = 'meta_test_conv';

    // Toggle mute
    store.toggleMuteConversation(testConv);
    let meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isMuted, true);

    store.toggleMuteConversation(testConv);
    meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isMuted, false);

    // Toggle pin conversation
    store.togglePinConversation(testConv);
    meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isPinned, true);

    // Toggle block
    store.toggleBlockConversation(testConv);
    meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isBlocked, true);

    // Mark unread
    store.markConversationUnread(testConv, true);
    meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isMarkedUnread, true);

    store.markConversationUnread(testConv, false);
    meta = useChatStore.getState().conversationMeta[testConv];
    assert.equal(meta?.isMarkedUnread, false);
  });

  test('Jump to message request sets signal with nonce and clears cleanly', () => {
    const store = useChatStore.getState();
    store.requestJumpToMessage(convId, 'target_jump_msg_99');

    let state = useChatStore.getState();
    assert.ok(state.jumpToMessageRequest);
    assert.equal(state.jumpToMessageRequest?.messageId, 'target_jump_msg_99');
    assert.equal(state.jumpToMessageRequest?.conversationId, convId);
    assert.equal(state.highlightedMessageId, 'target_jump_msg_99');

    store.clearJumpRequest();
    state = useChatStore.getState();
    assert.equal(state.jumpToMessageRequest, null);
  });

  test('Interactive polls: create poll, vote, multiple voting, and close poll', async () => {
    const store = useChatStore.getState();
    const pollConv = 'poll_conv_test';

    const tempId = await store.sendPollMessage(
      pollConv,
      'Which framework is best?',
      ['React Native', 'Flutter', 'Swift'],
      false,
      true, // allowsMultiple
      testAuthor
    );

    let state = useChatStore.getState();
    const msg = state.messages[tempId];
    assert.ok(msg);
    assert.ok(msg.poll);
    assert.equal(msg.poll.question, 'Which framework is best?');
    assert.equal(msg.poll.options.length, 3);
    assert.equal(msg.poll.options[0].text, 'React Native');

    const optId1 = msg.poll.options[0].id;
    const optId2 = msg.poll.options[1].id;

    // Vote for option 1
    store.votePoll(tempId, optId1, 'user_voter_1');
    state = useChatStore.getState();
    assert.deepEqual(state.messages[tempId].poll?.options[0].voterIds, ['user_voter_1']);

    // Vote for option 2 (multiple allowed)
    store.votePoll(tempId, optId2, 'user_voter_1');
    state = useChatStore.getState();
    assert.deepEqual(state.messages[tempId].poll?.options[0].voterIds, ['user_voter_1']);
    assert.deepEqual(state.messages[tempId].poll?.options[1].voterIds, ['user_voter_1']);

    // Close poll
    store.closePoll(tempId);
    state = useChatStore.getState();
    assert.equal(state.messages[tempId].poll?.isClosed, true);

    // Votes after close are ignored
    store.votePoll(tempId, optId1, 'user_voter_2');
    state = useChatStore.getState();
    assert.equal(state.messages[tempId].poll?.options[0].voterIds.includes('user_voter_2'), false);
  });

  test('Forwarding messages preserves original sender origin metadata', async () => {
    const store = useChatStore.getState();
    const sourceConv = 'fwd_source_conv';
    const destConv = 'fwd_dest_conv';

    const originalMsg: Message = {
      id: 'orig_msg_to_fwd',
      conversationId: sourceConv,
      senderId: 'famous_author',
      sender: { id: 'famous_author', name: 'Famous Designer' },
      text: 'Liquid glass design is supreme',
      status: 'READ',
      createdAt: 8000,
    };

    store.seedConversation(sourceConv, [originalMsg]);

    await store.forwardMessages([destConv], [originalMsg], testAuthor);

    const state = useChatStore.getState();
    const destIds = state.conversationMessageIds[destConv];
    assert.ok(destIds && destIds.length > 0);

    const forwardedMsg = state.messages[destIds[0]];
    assert.ok(forwardedMsg);
    assert.equal(forwardedMsg.text, 'Liquid glass design is supreme');
    assert.ok(forwardedMsg.forwardedFrom);
    assert.equal(forwardedMsg.forwardedFrom?.fromName, 'Famous Designer');
    assert.equal(forwardedMsg.forwardedFrom?.originalMessageId, 'orig_msg_to_fwd');
  });

  test('Clear conversation aborts pending timeouts and marks conversation as cleared', () => {
    const store = useChatStore.getState();
    const clearConv = 'clear_timeout_conv';

    store.sendMessage(clearConv, 'Message with pending delivery timer');
    let state = useChatStore.getState();
    assert.ok(state.conversationMessageIds[clearConv]?.length > 0);

    // Clear conversation
    store.clearConversation(clearConv);
    state = useChatStore.getState();
    assert.equal(state.conversationMessageIds[clearConv]?.length, 0);
    assert.equal(state.clearedConversations[clearConv], true);
  });

  test('stopAudio does not wipe message delivery pipeline timeouts', async () => {
    const store = useChatStore.getState();
    const audioConv = 'audio_timeout_conv';

    store.playAudio('test_audio_track', 30);
    assert.equal(useChatStore.getState().activeAudioMessageId, 'test_audio_track');

    // Send a message that registers pipeline timeouts
    const msgId = store.sendMessage(audioConv, 'Audio concurrency message');
    assert.ok(msgId);

    // Stop audio while message pipeline is active
    store.stopAudio();
    assert.equal(useChatStore.getState().activeAudioMessageId, null);

    // Verify message pipeline is still alive and successfully transitions to SENT
    await new Promise((resolve) => setTimeout(resolve, 400));
    const state = useChatStore.getState();
    const ids = state.conversationMessageIds[audioConv] || [];
    const serverId = ids[0];
    assert.ok(serverId && serverId.startsWith('srv_'));
    const msg = state.messages[serverId];
    assert.ok(msg);
    assert.equal(msg.status, 'SENT');
  });

  test('Unread count calculation only counts incoming unread messages', () => {
    const store = useChatStore.getState();
    const unreadConv = 'unread_calc_conv';

    const msgIncomingUnread: Message = {
      id: 'msg_incoming_unread',
      conversationId: unreadConv,
      senderId: 'partner_user',
      sender: { id: 'partner_user', name: 'Partner' },
      text: 'Incoming unread',
      status: 'DELIVERED',
      createdAt: 1000,
    };
    const msgIncomingRead: Message = {
      id: 'msg_incoming_read',
      conversationId: unreadConv,
      senderId: 'partner_user',
      sender: { id: 'partner_user', name: 'Partner' },
      text: 'Incoming read',
      status: 'READ',
      createdAt: 2000,
    };
    const msgMyUnread: Message = {
      id: 'msg_my_unread',
      conversationId: unreadConv,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'My sent message not yet read by partner',
      status: 'SENT',
      createdAt: 3000,
    };

    store.seedConversation(unreadConv, [msgIncomingUnread, msgIncomingRead, msgMyUnread]);

    const ids = useChatStore.getState().conversationMessageIds[unreadConv] || [];
    const messages = useChatStore.getState().messages;
    const unreadCount = ids.filter((id) => {
      const m = messages[id];
      return m && m.senderId !== 'me' && m.status !== 'READ';
    }).length;

    assert.equal(unreadCount, 1);
  });
});
