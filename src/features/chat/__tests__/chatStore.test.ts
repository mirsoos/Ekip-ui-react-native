import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';
import type { Message } from '../types/chat.types.ts';

describe('Chat Store & Optimistic Engine', () => {
  const convId = 'test_conversation_123';

  test('Initial state is empty for new conversation', () => {
    const state = useChatStore.getState();
    assert.deepEqual(state.conversationMessageIds[convId] || [], []);
  });

  test('Optimistic send immediately inserts message into store with SENDING status', async () => {
    const tempId = await useChatStore.getState().sendMessage(convId, 'Hello world zero-latency');

    assert.ok(tempId.startsWith('temp_'));

    const state = useChatStore.getState();
    const ids = state.conversationMessageIds[convId];
    assert.ok(ids.includes(tempId));
    assert.equal(ids[0], tempId); // Inverted list: newest is at index 0

    const msg = state.messages[tempId];
    assert.ok(msg);
    assert.equal(msg.text, 'Hello world zero-latency');
    assert.equal(msg.status, 'SENDING');
    assert.equal(msg.isOptimistic, true);
  });

  test('Message pipeline transitions from SENDING to SENT and upgrades ID', async () => {
    // Wait for the pipeline timeout (300ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const state = useChatStore.getState();
    const ids = state.conversationMessageIds[convId];
    const serverId = ids[0];
    assert.ok(serverId.startsWith('srv_'), `Expected server ID starting with srv_, got: ${serverId}`);

    const msg = state.messages[serverId];
    assert.ok(msg);
    assert.equal(msg.status, 'SENT');
    assert.equal(msg.isOptimistic, false);
  });

  test('Message pipeline transitions to DELIVERED and READ', async () => {
    // Wait for delivery (600ms + 1400ms = ~2100ms total from start)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const state = useChatStore.getState();
    const ids = state.conversationMessageIds[convId];
    const serverId = ids[0];
    const msg = state.messages[serverId];
    assert.ok(msg);
    assert.equal(msg.status, 'READ');
  });

  test('Failure simulation transitions to FAILED with retry capability', async () => {
    const failTempId = await useChatStore.getState().sendMessage(convId, '/fail');

    // Wait for failure dispatch
    await new Promise((resolve) => setTimeout(resolve, 350));

    const state = useChatStore.getState();
    const msg = state.messages[failTempId];
    assert.ok(msg);
    assert.equal(msg.status, 'FAILED');
    assert.ok(msg.error?.includes('timeout'));

    // Test retry
    await useChatStore.getState().retryMessage(failTempId);
    const retryingMsg = useChatStore.getState().messages[failTempId];
    assert.equal(retryingMsg?.status, 'SENDING');

    // Wait for retry completion
    await new Promise((resolve) => setTimeout(resolve, 350));
    const finalState = useChatStore.getState();
    const finalIds = finalState.conversationMessageIds[convId];
    const retriedServerId = finalIds[0];
    assert.ok(retriedServerId.startsWith('srv_'));
    assert.equal(finalState.messages[retriedServerId]?.status, 'SENT');
  });

  test('Deduplication prevents duplicate entries for the same ID', () => {
    const incoming: Message = {
      id: 'incoming_dedup_1',
      conversationId: convId,
      senderId: 'alex_r',
      sender: { id: 'alex_r', name: 'Alex' },
      text: 'First arrival',
      status: 'SENT',
      createdAt: Date.now(),
    };

    useChatStore.getState().receiveIncomingMessage(convId, incoming);
    const countAfterFirst = useChatStore.getState().conversationMessageIds[convId].filter(
      (id) => id === 'incoming_dedup_1'
    ).length;
    assert.equal(countAfterFirst, 1);

    // Duplicate message ingest with updated text/status
    const updatedIncoming: Message = {
      ...incoming,
      text: 'Updated arrival',
      status: 'DELIVERED',
    };
    useChatStore.getState().receiveIncomingMessage(convId, updatedIncoming);
    const countAfterSecond = useChatStore.getState().conversationMessageIds[convId].filter(
      (id) => id === 'incoming_dedup_1'
    ).length;
    assert.equal(countAfterSecond, 1); // Still exactly 1 entry in the array
    assert.equal(useChatStore.getState().messages['incoming_dedup_1'].status, 'DELIVERED');
    assert.equal(useChatStore.getState().messages['incoming_dedup_1'].text, 'Updated arrival');
  });

  test('Emoji reactions toggle on and off per user', () => {
    const msgId = 'incoming_dedup_1';

    // Add heart reaction
    useChatStore.getState().addReaction(msgId, '❤️', 'user_1');
    assert.deepEqual(useChatStore.getState().messages[msgId].reactions?.['❤️'], ['user_1']);

    // Add second user to same reaction
    useChatStore.getState().addReaction(msgId, '❤️', 'user_2');
    assert.deepEqual(useChatStore.getState().messages[msgId].reactions?.['❤️'], ['user_1', 'user_2']);

    // Toggle off user_1
    useChatStore.getState().addReaction(msgId, '❤️', 'user_1');
    assert.deepEqual(useChatStore.getState().messages[msgId].reactions?.['❤️'], ['user_2']);

    // Toggle off user_2 (should delete key)
    useChatStore.getState().addReaction(msgId, '❤️', 'user_2');
    assert.equal(useChatStore.getState().messages[msgId].reactions?.['❤️'], undefined);
  });

  test('Historical message loading appends older messages to the tail of inverted list', async () => {
    const initialCount = useChatStore.getState().conversationMessageIds[convId].length;
    const loaded = await useChatStore.getState().loadHistoricalMessages(convId, 10);
    assert.ok(loaded > 0);

    const newCount = useChatStore.getState().conversationMessageIds[convId].length;
    assert.equal(newCount, initialCount + loaded);
  });

  test('Message deletion cleanly removes from both normalized map and ID array', () => {
    const msgId = 'incoming_dedup_1';
    assert.ok(useChatStore.getState().messages[msgId]);
    assert.ok(useChatStore.getState().conversationMessageIds[convId].includes(msgId));

    useChatStore.getState().deleteMessage(convId, msgId);

    assert.equal(useChatStore.getState().messages[msgId], undefined);
    assert.equal(useChatStore.getState().conversationMessageIds[convId].includes(msgId), false);
  });

  test('Search bar open state toggles and clearing resets query and matches', () => {
    assert.equal(useChatStore.getState().isSearchBarOpen, false);

    // Open search bar
    useChatStore.getState().setSearchBarOpen(true);
    assert.equal(useChatStore.getState().isSearchBarOpen, true);

    // Set search query
    useChatStore.getState().setSearchQuery('test', convId);
    assert.equal(useChatStore.getState().searchState.query, 'test');

    // Close search bar (auto-clears query & state)
    useChatStore.getState().setSearchBarOpen(false);
    assert.equal(useChatStore.getState().isSearchBarOpen, false);
    assert.equal(useChatStore.getState().searchState.query, '');
    assert.equal(useChatStore.getState().searchState.matchingMessageIds.length, 0);
  });

  test('customBackgroundUri getter and setter updates theme background', () => {
    assert.equal(useChatStore.getState().customBackgroundUri, null);

    const testUri = 'file:///path/to/custom_bg.jpg';
    useChatStore.getState().setCustomBackgroundUri(testUri);
    assert.equal(useChatStore.getState().customBackgroundUri, testUri);

    useChatStore.getState().setCustomBackgroundUri(null);
    assert.equal(useChatStore.getState().customBackgroundUri, null);
  });

  test('clearConversation purges all messages and resets selectedMessage/replyingTo', async () => {
    const clearConvId = 'conv_to_clear_999';
    const tempId = await useChatStore.getState().sendMessage(clearConvId, 'To be cleared');
    assert.ok(useChatStore.getState().conversationMessageIds[clearConvId]?.includes(tempId));
    assert.ok(useChatStore.getState().messages[tempId]);

    const msg = useChatStore.getState().messages[tempId];
    useChatStore.getState().setReplyingTo(msg);
    useChatStore.getState().setSelectedMessage(msg);
    assert.equal(useChatStore.getState().replyingTo?.id, tempId);
    assert.equal(useChatStore.getState().selectedMessage?.id, tempId);

    // Clear the conversation
    useChatStore.getState().clearConversation(clearConvId);

    const afterState = useChatStore.getState();
    assert.deepEqual(afterState.conversationMessageIds[clearConvId], []);
    assert.equal(afterState.messages[tempId], undefined);
    assert.equal(afterState.replyingTo, null);
    assert.equal(afterState.selectedMessage, null);
  });
});

