import { lineColumnAt, splitClassTokens } from './extract-html.js';
import { ClassOccurrence } from './types.js';

const GO_CLASS_VALUE_RE = /["']class["']\s*:\s*["']([^"']+)["']/g;

export function extractGoClasses(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  let match: RegExpExecArray | null;
  while ((match = GO_CLASS_VALUE_RE.exec(content)) !== null) {
    const raw = match[1];
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
      kind: 'go-static',
    });
  }
  return occurrences;
}
