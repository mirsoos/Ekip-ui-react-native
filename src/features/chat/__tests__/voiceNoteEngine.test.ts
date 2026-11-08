import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useChatStore } from '../store/chatStore.ts';

describe('Advanced Voice Note Engine (Module 1)', () => {
  it('audio playback speeds cycle between 1.0x, 1.5x, and 2.0x', () => {
    const store = useChatStore.getState();
    assert.equal(store.audioPlaybackSpeed, 1.0);

    store.setAudioPlaybackSpeed(1.5);
    assert.equal(useChatStore.getState().audioPlaybackSpeed, 1.5);

    store.setAudioPlaybackSpeed(2.0);
    assert.equal(useChatStore.getState().audioPlaybackSpeed, 2.0);

    store.setAudioPlaybackSpeed(1.0);
    assert.equal(useChatStore.getState().audioPlaybackSpeed, 1.0);
  });

  it('seeking audio clamps progress between 0 and 1 cleanly', () => {
    const store = useChatStore.getState();
    const testMsgId = 'audio_test_msg_1';

    // Seek to 0.45
    store.seekAudio(testMsgId, 0.45);
    assert.equal(useChatStore.getState().activeAudioMessageId, testMsgId);
    assert.equal(useChatStore.getState().audioPlaybackProgress, 0.45);

    // Seek out of bounds: negative clamps to 0
    store.seekAudio(testMsgId, -0.2);
    assert.equal(useChatStore.getState().audioPlaybackProgress, 0);

    // Seek out of bounds: > 1 clamps to 1
    store.seekAudio(testMsgId, 1.5);
    assert.equal(useChatStore.getState().audioPlaybackProgress, 1);

    store.stopAudio();
    assert.equal(useChatStore.getState().activeAudioMessageId, null);
    assert.equal(useChatStore.getState().audioPlaybackProgress, 0);
  });

  it('concurrency rule: auto-pauses active audio when stopAudio is called on recording begin', () => {
    const store = useChatStore.getState();
    store.playAudio('audio_playing_now', 20);
    assert.equal(useChatStore.getState().activeAudioMessageId, 'audio_playing_now');

    // Simulate recorder start trigger
    store.stopAudio();
    assert.equal(useChatStore.getState().activeAudioMessageId, null);
    assert.equal(useChatStore.getState().audioPlaybackProgress, 0);
  });
});
