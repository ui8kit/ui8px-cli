import { ClassOccurrence } from './types.js';

const CLASS_ATTRIBUTE_RE = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;

export function splitClassTokens(value: string): string[] {
  return value
    .trim()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function lineColumnAt(source: string, index: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index; i += 1) {
    if (source[i] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

export function extractHtmlClasses(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  let match: RegExpExecArray | null;
  while ((match = CLASS_ATTRIBUTE_RE.exec(content)) !== null) {
    const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? '';
    const tokens = splitClassTokens(raw);
    if (!tokens.length) {
      continue;
    }
    const { line, column } = lineColumnAt(content, match.index);
    occurrences.push({
      file,
      line,
      column,
      raw,
      tokens,
      kind: 'class-attribute',
    });
  }
  return occurrences;
}
