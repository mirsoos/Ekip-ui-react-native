import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeMarkdown } from '../lib/markdownTokenizer.ts';
import { extractFirstUrl, extractAllUrls, fetchLinkPreview } from '../lib/openGraphService.ts';

describe('Rich Text & Telegram Spoilers (Module 2 & 3)', () => {
  it('tokenizes bold, italic, strikethrough, inline code, and code blocks accurately', () => {
    const raw = 'Hello **bold** world __italic__ and ~~strike~~ with `inline code` done.';
    const tokens = tokenizeMarkdown(raw);

    const bold = tokens.find((t) => t.type === 'bold');
    assert.ok(bold);
    assert.equal(bold?.content, 'bold');

    const italic = tokens.find((t) => t.type === 'italic');
    assert.ok(italic);
    assert.equal(italic?.content, 'italic');

    const strike = tokens.find((t) => t.type === 'strike');
    assert.ok(strike);
    assert.equal(strike?.content, 'strike');

    const code = tokens.find((t) => t.type === 'inline_code');
    assert.ok(code);
    assert.equal(code?.content, 'inline code');
  });

  it('tokenizes Telegram spoilers with ||masking|| syntax', () => {
    const raw = 'Check out this secret: ||spoiler password 123|| for testing.';
    const tokens = tokenizeMarkdown(raw);

    const spoiler = tokens.find((t) => t.type === 'spoiler');
    assert.ok(spoiler);
    assert.equal(spoiler?.content, 'spoiler password 123');
  });

  it('tokenizes @mentions and URLs correctly', () => {
    const raw = 'Hey @alex_rivers, check out https://github.com for details!';
    const tokens = tokenizeMarkdown(raw);

    const mention = tokens.find((t) => t.type === 'mention');
    assert.ok(mention);
    assert.equal(mention?.content, '@alex_rivers');

    const url = tokens.find((t) => t.type === 'url');
    assert.ok(url);
    assert.equal(url?.content, 'https://github.com');
  });

  it('strips trailing punctuation from URLs without corrupting link target', () => {
    const raw = 'Check this out: (https://github.com/expo/expo).';
    const tokens = tokenizeMarkdown(raw);
    const url = tokens.find((t) => t.type === 'url');
    assert.ok(url);
    assert.equal(url?.content, 'https://github.com/expo/expo');
    assert.equal(extractFirstUrl(raw), 'https://github.com/expo/expo');
  });

  it('extracts URLs and generates OpenGraph preview metadata with caching', async () => {
    const text = 'Visit https://github.com or https://youtube.com';
    const firstUrl = extractFirstUrl(text);
    assert.equal(firstUrl, 'https://github.com');

    const allUrls = extractAllUrls(text);
    assert.equal(allUrls.length, 2);

    const preview = await fetchLinkPreview('https://github.com');
    assert.equal(preview.siteName, 'GitHub');
    assert.ok(preview.title);
    assert.ok(preview.image);

    // Second call should return cached instance immediately
    const cached = await fetchLinkPreview('https://github.com');
    assert.equal(cached, preview);
  });
});
