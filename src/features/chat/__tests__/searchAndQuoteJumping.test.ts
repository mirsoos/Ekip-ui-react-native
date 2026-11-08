import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';
import type { Message } from '../types/chat.types.ts';

describe('Search & Targeted Quote-Jumping (Module 5 & 7)', () => {
  const convId = 'search_quote_conv_test';

  it('searches messages case-insensitively and navigates matches with next/prev wrap-around', () => {
    const store = useChatStore.getState();

    const messages: Message[] = [
      {
        id: 'msg_search_1',
        conversationId: convId,
        senderId: 'alex',
        sender: { id: 'alex', name: 'Alex' },
        text: 'The quick brown fox jumps over the lazy dog',
        status: 'READ',
        createdAt: 1000,
      },
      {
        id: 'msg_search_2',
        conversationId: convId,
        senderId: 'me',
        sender: { id: 'me', name: 'Me' },
        text: 'Another message with fox keyword',
        status: 'READ',
        createdAt: 2000,
      },
      {
        id: 'msg_search_3',
        conversationId: convId,
        senderId: 'alex',
        sender: { id: 'alex', name: 'Alex' },
        text: 'Completely unrelated text',
        status: 'READ',
        createdAt: 3000,
      },
    ];

    store.seedConversation(convId, messages);

    // Search for "fox"
    store.setSearchQuery('FOX', convId);
    let state = useChatStore.getState().searchState;
    assert.equal(state.isActive, true);
    assert.equal(state.matchingMessageIds.length, 2);
    assert.equal(state.currentIndex, 0);
    assert.equal(useChatStore.getState().highlightedMessageId, state.matchingMessageIds[0]);

    // Navigate next
    store.goToSearchMatch('next');
    state = useChatStore.getState().searchState;
    assert.equal(state.currentIndex, 1);
    assert.equal(useChatStore.getState().highlightedMessageId, state.matchingMessageIds[1]);

    // Wrap-around next -> back to 0
    store.goToSearchMatch('next');
    state = useChatStore.getState().searchState;
    assert.equal(state.currentIndex, 0);

    // Wrap-around prev -> back to 1
    store.goToSearchMatch('prev');
    state = useChatStore.getState().searchState;
    assert.equal(state.currentIndex, 1);

    // Clear search
    store.clearSearch();
    state = useChatStore.getState().searchState;
    assert.equal(state.isActive, false);
    assert.equal(state.matchingMessageIds.length, 0);
    assert.equal(useChatStore.getState().highlightedMessageId, null);
  });

  it('targeted quote-jumping highlights message and clears on demand', () => {
    const store = useChatStore.getState();
    const targetId = 'msg_search_1';

    store.setHighlightedMessageId(targetId);
    assert.equal(useChatStore.getState().highlightedMessageId, targetId);

    store.setHighlightedMessageId(null);
    assert.equal(useChatStore.getState().highlightedMessageId, null);
  });

  it('pins, edits, and updates messages accurately', () => {
    const store = useChatStore.getState();
    const msgId = 'msg_search_1';

    // Pin
    store.pinMessage(convId, msgId);
    assert.equal(useChatStore.getState().messages[msgId].isPinned, true);

    // Unpin
    store.pinMessage(convId, msgId);
    assert.equal(useChatStore.getState().messages[msgId].isPinned, false);

    // Edit
    store.editMessage(msgId, 'Updated text content');
    const updated = useChatStore.getState().messages[msgId];
    assert.equal(updated.text, 'Updated text content');
    assert.equal(updated.isEdited, true);
  });
});
