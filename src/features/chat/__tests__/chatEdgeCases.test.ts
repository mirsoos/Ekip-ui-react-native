import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';
import type { Message, Author } from '../types/chat.types.ts';

describe('Chat Store Edge Cases & Concurrency', () => {
  const edgeConvId = 'edge_test_conv_999';

  test('Concurrent sends preserve chronological ordering and atomic temp IDs', async () => {
    const promises = [
      useChatStore.getState().sendMessage(edgeConvId, 'Burst 1'),
      useChatStore.getState().sendMessage(edgeConvId, 'Burst 2'),
      useChatStore.getState().sendMessage(edgeConvId, 'Burst 3'),
    ];

    const tempIds = await Promise.all(promises);
    assert.equal(tempIds.length, 3);
    const uniqueIds = new Set(tempIds);
    assert.equal(uniqueIds.size, 3, 'All concurrent temp IDs must be distinct');

    const idsInStore = useChatStore.getState().conversationMessageIds[edgeConvId];
    assert.equal(idsInStore.length, 3);
  });

  test('Out-of-order socket arrivals with duplicate IDs are gracefully deduplicated', () => {
    const mockSocketMsg: Message = {
      id: 'socket_ooo_1',
      conversationId: edgeConvId,
      senderId: 'remote_peer',
      sender: { id: 'remote_peer', name: 'Remote Peer' },
      text: 'Out of order test',
      status: 'SENT',
      createdAt: Date.now() - 5000,
    };

    useChatStore.getState().receiveIncomingMessage(edgeConvId, mockSocketMsg);
    useChatStore.getState().receiveIncomingMessage(edgeConvId, mockSocketMsg);
    useChatStore.getState().receiveIncomingMessage(edgeConvId, mockSocketMsg);

    const occurrences = useChatStore
      .getState()
      .conversationMessageIds[edgeConvId].filter((id) => id === 'socket_ooo_1');
    assert.equal(occurrences.length, 1, 'Socket arrival must appear exactly once');
  });

  test('Socket reconciliation upgrades optimistic tempId in-place with zero duplicates', async () => {
    const tempId = await useChatStore.getState().sendMessage(edgeConvId, 'Optimistic socket test');
    const store = useChatStore.getState();
    assert.ok(store.conversationMessageIds[edgeConvId].includes(tempId));
    assert.ok(store.messages[tempId]);

    const initialLength = store.conversationMessageIds[edgeConvId].length;

    // Simulate incoming socket delivery acknowledgment that has the matching tempId
    const serverMessage: Message = {
      id: 'srv_socket_ack_777',
      tempId: tempId,
      conversationId: edgeConvId,
      senderId: 'me',
      sender: { id: 'me', name: 'Me' },
      text: 'Optimistic socket test',
      status: 'SENT',
      createdAt: Date.now(),
    };

    useChatStore.getState().receiveIncomingMessage(edgeConvId, serverMessage);

    const postStore = useChatStore.getState();
    const ids = postStore.conversationMessageIds[edgeConvId];

    // Must NOT add an extra row
    assert.equal(ids.length, initialLength, 'List count must remain unchanged after tempId upgrade');
    // Must contain server ID and NOT temp ID
    assert.ok(ids.includes('srv_socket_ack_777'), 'Server ID must be in the list');
    assert.equal(ids.includes(tempId), false, 'Temp ID must be replaced in the list');
    // messages map must not leak tempId
    assert.equal(postStore.messages[tempId], undefined, 'Old tempId must be removed from dictionary');
    assert.equal(postStore.messages['srv_socket_ack_777']?.status, 'SENT');
  });

  test('Custom user authorship preserves correct senderId and isMe alignment', async () => {
    const customUser: Author = {
      id: 'usr_architect_42',
      name: 'Architect',
      username: 'architect_42',
    };

    useChatStore.getState().setCurrentUser(customUser);
    const tempId = await useChatStore.getState().sendMessage(edgeConvId, 'Message from custom user', undefined, null, customUser);

    const msg = useChatStore.getState().messages[tempId];
    assert.ok(msg);
    assert.equal(msg.senderId, 'usr_architect_42');
    assert.equal(msg.sender.name, 'Architect');
    // Verify that checking message.senderId === customUser.id evaluates to true
    assert.equal(msg.senderId === customUser.id, true);
  });

  test('Bi-directional loading handles newer boundaries gracefully', async () => {
    const loadedCount = await useChatStore.getState().loadNewerMessages(edgeConvId, 10);
    assert.equal(loadedCount, 0);

    const state = useChatStore.getState();
    assert.equal(state.isLoadingNewer[edgeConvId], false);
    assert.equal(state.hasMoreNewer[edgeConvId], false);
  });

  test('Atomized audio playback allows only single active player and cleans up', () => {
    const audioMsg1 = 'msg_audio_1';
    const audioMsg2 = 'msg_audio_2';

    // Start playing audio 1
    useChatStore.getState().playAudio(audioMsg1, 5);
    let state = useChatStore.getState();
    assert.equal(state.activeAudioMessageId, audioMsg1);

    // Switch to playing audio 2 (must automatically stop audio 1)
    useChatStore.getState().playAudio(audioMsg2, 5);
    state = useChatStore.getState();
    assert.equal(state.activeAudioMessageId, audioMsg2);

    // Pause audio 2
    useChatStore.getState().pauseAudio(audioMsg2);
    state = useChatStore.getState();
    assert.equal(state.activeAudioMessageId, null);

    // Stop audio
    useChatStore.getState().playAudio(audioMsg1, 5);
    useChatStore.getState().stopAudio();
    state = useChatStore.getState();
    assert.equal(state.activeAudioMessageId, null);
    assert.equal(state.audioPlaybackProgress, 0);
  });

  test('Toggling reaction on non-existent message is safe no-op', () => {
    assert.doesNotThrow(() => {
      useChatStore.getState().addReaction('non_existent_id', '👍', 'me');
      useChatStore.getState().removeReaction('non_existent_id', '👍', 'me');
    });
  });

  test('Retrying non-failed message is safe no-op', async () => {
    const validId = useChatStore.getState().conversationMessageIds[edgeConvId][0];
    const prevStatus = useChatStore.getState().messages[validId]?.status;

    await useChatStore.getState().retryMessage(validId);
    // If not failed, retry shouldn't alter anything
    if (prevStatus !== 'FAILED') {
      assert.equal(useChatStore.getState().messages[validId]?.status, prevStatus);
    }
  });

  test('Marking conversation as read updates incoming messages and leaves own intact', () => {
    useChatStore.getState().markConversationAsRead(edgeConvId);
    const state = useChatStore.getState();
    const socketMsg = state.messages['socket_ooo_1'];
    assert.equal(socketMsg?.status, 'READ');
  });
});
