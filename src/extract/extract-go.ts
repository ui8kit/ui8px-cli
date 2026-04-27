import { lineColumnAt, splitClassTokens } from './extract-html.js';
import { ClassOccurrence } from './types.js';

const GO_CLASS_VALUE_RE = /["']class["']\s*:\s*["']([^"']+)["']/g;
const RETURN_LITERAL_RE = /\breturn\s+((?:"(?:\\.|[^"\\])*")|(?:`[^`]*`))/g;
const UTILITY_HINT_RE =
  /(?:^|\s)(?:[a-z0-9-]+:)*(?:flex|inline-flex|grid|block|hidden|items-|justify-|content-|gap-|p[trblxy]?-|m[trblxy]?-|w-|h-|min-w-|min-h-|max-w-|max-h-|text-|font-|leading-|tracking-|bg-|border|rounded|shadow|object-|aspect-|overflow-|col-span-|row-span-|order-|basis-|grow|shrink|ui-)/;

function isIdentifierChar(char: string | undefined): boolean {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}

function unquoteGoString(raw: string): string {
  if (raw.startsWith('`') && raw.endsWith('`')) {
    return raw.slice(1, -1);
  }
  try {
    return JSON.parse(raw) as string;
  } catch {
    return raw.slice(1, -1);
  }
}

function looksLikeUtilityList(value: string): boolean {
  return UTILITY_HINT_RE.test(value);
}

function findMatchingParen(content: string, openIndex: number): number {
  let depth = 0;
  let quote: '"' | '`' | undefined;
  let escaped = false;

  for (let i = openIndex; i < content.length; i += 1) {
    const char = content[i];
    if (quote) {
      if (quote === '"' && char === '\\' && !escaped) {
        escaped = true;
        continue;
      }
      if (char === quote && !escaped) {
        quote = undefined;
      }
      escaped = false;
      continue;
    }

    if (char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '(') {
      depth += 1;
      continue;
    }
    if (char === ')') {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function extractStringLiterals(fragment: string): Array<{ raw: string; value: string; index: number }> {
  const literals: Array<{ raw: string; value: string; index: number }> = [];
  const re = /"(?:\\.|[^"\\])*"|`[^`]*`/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(fragment)) !== null) {
    literals.push({
      raw: match[0],
      value: unquoteGoString(match[0]),
      index: match.index,
    });
  }
  return literals;
}

function extractCnCalls(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  const callRe = /(?:\butils\.)?\bCn\s*\(/g;
  let match: RegExpExecArray | null;
  while ((match = callRe.exec(content)) !== null) {
    const before = content[match.index - 1];
    if (isIdentifierChar(before)) {
      continue;
    }
    const openIndex = content.indexOf('(', match.index);
    const closeIndex = findMatchingParen(content, openIndex);
    if (closeIndex === -1) {
      continue;
    }
    const args = content.slice(openIndex + 1, closeIndex);
    const literalValues = extractStringLiterals(args)
      .map((literal) => literal.value)
      .filter(looksLikeUtilityList);
    if (!literalValues.length) {
      continue;
    }
    const raw = literalValues.join(' ');
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
      kind: 'go-cn',
    });
    callRe.lastIndex = closeIndex + 1;
  }
  return occurrences;
}

function extractReturnLiterals(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  let match: RegExpExecArray | null;
  while ((match = RETURN_LITERAL_RE.exec(content)) !== null) {
    const raw = unquoteGoString(match[1]);
    if (!looksLikeUtilityList(raw)) {
      continue;
    }
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
      kind: 'go-return',
    });
  }
  return occurrences;
}

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
  return [
    ...occurrences,
    ...extractCnCalls(file, content),
    ...extractReturnLiterals(file, content),
  ];
}
