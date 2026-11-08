import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { draftStorage } from '../lib/draftStorage.ts';
import { useChatStore } from '../store/chatStore.ts';

describe('Persistence, Drafts & Offline Outbox Queue (Module 8)', () => {
  it('auto-saves, restores, and clears input drafts keyed by conversationId', () => {
    const convA = 'conv_draft_alpha';
    const convB = 'conv_draft_beta';

    assert.equal(draftStorage.getDraft(convA), '');

    // Save draft for convA
    draftStorage.saveDraft(convA, 'Draft for conversation alpha');
    assert.equal(draftStorage.getDraft(convA), 'Draft for conversation alpha');

    // convB remains pristine
    assert.equal(draftStorage.getDraft(convB), '');

    // Save draft for convB
    draftStorage.saveDraft(convB, 'Draft for conversation beta');
    assert.equal(draftStorage.getDraft(convB), 'Draft for conversation beta');

    // Clear convA
    draftStorage.clearDraft(convA);
    assert.equal(draftStorage.getDraft(convA), '');
    assert.equal(draftStorage.getDraft(convB), 'Draft for conversation beta');
  });

  it('offline outbox enqueues messages with QUEUED status when offline', async () => {
    const convId = 'offline_outbox_conv_1';
    const store = useChatStore.getState();

    // Set offline
    store.setIsOnline(false);
    assert.equal(useChatStore.getState().isOnline, false);

    // Enqueue message
    const tempId = store.enqueueOutboxMessage(convId, 'Offline message waiting in queue');
    const msg = useChatStore.getState().messages[tempId];
    assert.ok(msg);
    assert.equal(msg.status, 'QUEUED');
    assert.equal(useChatStore.getState().outboxQueue.length, 1);

    // Turn back online: triggers sequential dispatch
    store.setIsOnline(true);
    assert.equal(useChatStore.getState().isOnline, true);

    // Wait for queue processing (200ms dispatch + 400ms delivered + 1000ms read)
    await new Promise((r) => setTimeout(r, 350));

    // Message should now be SENT and upgraded to permanent server ID
    const queueAfter = useChatStore.getState().outboxQueue;
    assert.equal(queueAfter.length, 0);

    const ids = useChatStore.getState().conversationMessageIds[convId] || [];
    const serverId = ids[0];
    assert.ok(serverId.startsWith('srv_'));
    const dispatched = useChatStore.getState().messages[serverId];
    assert.ok(dispatched);
    assert.equal(dispatched.status, 'SENT');
  });

  it('sendMessage automatically routes to outbox queue with QUEUED status when offline', async () => {
    const convId = 'offline_outbox_auto_route';
    const store = useChatStore.getState();

    store.setIsOnline(false);

    // Call high-level sendMessage while offline
    const tempId = await store.sendMessage(convId, 'Automatic offline outbox route test');
    const msg = useChatStore.getState().messages[tempId];
    assert.ok(msg);
    assert.equal(msg.status, 'QUEUED');

    // Turn online and verify it auto-dispatches
    store.setIsOnline(true);
    await new Promise((r) => setTimeout(r, 350));

    const ids = useChatStore.getState().conversationMessageIds[convId] || [];
    const serverId = ids[0];
    assert.ok(serverId.startsWith('srv_'));
    assert.equal(useChatStore.getState().messages[serverId]?.status, 'SENT');
  });

  it('concurrency lock prevents duplicate dispatches during rapid enqueuing', async () => {
    const convId = 'offline_outbox_concurrency';
    const store = useChatStore.getState();

    store.setIsOnline(true);

    // Rapidly enqueue 2 messages
    const id1 = store.enqueueOutboxMessage(convId, 'Message 1');
    const id2 = store.enqueueOutboxMessage(convId, 'Message 2');

    assert.ok(id1);
    assert.ok(id2);

    // Wait for queue to clear
    await new Promise((r) => setTimeout(r, 500));

    assert.equal(useChatStore.getState().outboxQueue.length, 0);
    const ids = useChatStore.getState().conversationMessageIds[convId] || [];
    assert.equal(ids.length, 2);
    // Both IDs should be distinct server IDs
    assert.notEqual(ids[0], ids[1]);
    assert.ok(ids[0].startsWith('srv_'));
    assert.ok(ids[1].startsWith('srv_'));
  });

  it('MMKV standard methods getString, set, delete operate synchronously', () => {
    draftStorage.set('test_key_1', 'val_alpha');
    assert.equal(draftStorage.getString('test_key_1'), 'val_alpha');

    draftStorage.delete('test_key_1');
    assert.equal(draftStorage.getString('test_key_1'), undefined);
  });
});
