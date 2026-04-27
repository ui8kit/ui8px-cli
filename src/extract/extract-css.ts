import { lineColumnAt, splitClassTokens } from './extract-html.js';
import { ClassOccurrence } from './types.js';

const APPLY_RE = /([^{}]+)\{[^{}]*?@apply\s+([^;{}]+);/g;

function extractSelector(rawSelector: string): string | undefined {
  const selector = rawSelector.trim().split(',')[0]?.trim();
  if (!selector) {
    return undefined;
  }
  return selector;
}

export function extractCssClasses(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  let match: RegExpExecArray | null;
  while ((match = APPLY_RE.exec(content)) !== null) {
    const raw = match[2].trim();
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
      kind: 'css-apply',
      selector: extractSelector(match[1]),
    });
  }
  return occurrences;
}
