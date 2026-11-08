/**
 * Zero-Lag Markdown & Entity Tokenizer
 * Pure parsing worklet with zero UI dependencies
 */

export type TokenType =
  | 'text'
  | 'bold'
  | 'italic'
  | 'strike'
  | 'inline_code'
  | 'code_block'
  | 'spoiler'
  | 'mention'
  | 'url';

export interface Token {
  type: TokenType;
  content: string;
  raw: string;
}

export function tokenizeMarkdown(text: string): Token[] {
  if (!text) return [];

  // Patterns
  // 1. Code block ```code```
  // 2. Spoiler ||text||
  // 3. Bold **text**
  // 4. Italic __text__ or *text*
  // 5. Strikethrough ~~text~~
  // 6. Inline code `text`
  // 7. Mention @username
  // 8. URL https?://...
  const combinedRegex =
    /(```[\s\S]*?```|\|\|[\s\S]*?\|\||\*\*[\s\S]*?\*\*|__[\s\S]*?__|~~[\s\S]*?~~|`[^`]+`|@[\w_]+|https?:\/\/[^\s]+)/g;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchText = match[0];

    // Push preceding normal text if any
    if (matchStart > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex, matchStart),
        raw: text.slice(lastIndex, matchStart),
      });
    }

    if (matchText.startsWith('```') && matchText.endsWith('```')) {
      tokens.push({
        type: 'code_block',
        content: matchText.slice(3, -3).trim(),
        raw: matchText,
      });
    } else if (matchText.startsWith('||') && matchText.endsWith('||')) {
      tokens.push({
        type: 'spoiler',
        content: matchText.slice(2, -2),
        raw: matchText,
      });
    } else if (matchText.startsWith('**') && matchText.endsWith('**')) {
      tokens.push({
        type: 'bold',
        content: matchText.slice(2, -2),
        raw: matchText,
      });
    } else if (matchText.startsWith('__') && matchText.endsWith('__')) {
      tokens.push({
        type: 'italic',
        content: matchText.slice(2, -2),
        raw: matchText,
      });
    } else if (matchText.startsWith('~~') && matchText.endsWith('~~')) {
      tokens.push({
        type: 'strike',
        content: matchText.slice(2, -2),
        raw: matchText,
      });
    } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
      tokens.push({
        type: 'inline_code',
        content: matchText.slice(1, -1),
        raw: matchText,
      });
    } else if (matchText.startsWith('@')) {
      tokens.push({
        type: 'mention',
        content: matchText,
        raw: matchText,
      });
    } else if (matchText.startsWith('http://') || matchText.startsWith('https://')) {
      const clean = matchText.replace(/[.,;:!?)]+$/, '');
      const trailing = matchText.slice(clean.length);
      tokens.push({
        type: 'url',
        content: clean,
        raw: clean,
      });
      if (trailing) {
        tokens.push({
          type: 'text',
          content: trailing,
          raw: trailing,
        });
      }
    } else {
      tokens.push({
        type: 'text',
        content: matchText,
        raw: matchText,
      });
    }

    lastIndex = matchStart + matchText.length;
  }

  // Trailing text
  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.slice(lastIndex),
      raw: text.slice(lastIndex),
    });
  }

  return tokens;
}
