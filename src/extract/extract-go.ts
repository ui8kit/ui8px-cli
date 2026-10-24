import { lineColumnAt, splitClassTokens } from './extract-html.js';
import { ClassOccurrence } from './types.js';

const GO_CLASS_VALUE_RE = /["']class["']\s*:\s*("(?:\\.|[^"\\])*"|`[^`]*`|'[^']*')/g;
const CLASS_FIELD_RE = /\bClass\s*:\s*("(?:\\.|[^"\\])*"|`[^`]*`)/g;
const SIMPLE_STRING_DECL_RE =
  /\b(?:const|var)\s+[A-Za-z_]\w*(?:\s+string)?\s*=\s*("(?:\\.|[^"\\])*"|`[^`]*`)/g;
const GROUPED_STRING_DECL_RE = /\b(?:const|var)\s*\(/g;
const GROUPED_ASSIGN_RE = /\b[A-Za-z_]\w*(?:\s+string)?\s*=\s*("(?:\\.|[^"\\])*"|`[^`]*`)/g;
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

function occurrenceFromLiteral(
  file: string,
  content: string,
  index: number,
  raw: string,
  kind: ClassOccurrence['kind'],
  requireHint: boolean,
): ClassOccurrence | undefined {
  if (requireHint && !looksLikeUtilityList(raw)) {
    return undefined;
  }
  const tokens = splitClassTokens(raw);
  if (!tokens.length) {
    return undefined;
  }
  const { line, column } = lineColumnAt(content, index);
  return { file, line, column, raw, tokens, kind };
}

function extractByRegex(
  file: string,
  content: string,
  re: RegExp,
  kind: ClassOccurrence['kind'],
  requireHint: boolean,
): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  let match: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((match = re.exec(content)) !== null) {
    const occurrence = occurrenceFromLiteral(
      file,
      content,
      match.index,
      unquoteGoString(match[1]),
      kind,
      requireHint,
    );
    if (occurrence) {
      occurrences.push(occurrence);
    }
  }
  return occurrences;
}

function extractCnCalls(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  const callRe = /(?:\butils\.)?\b[Cc]n\s*\(/g;
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
    // Each literal argument is its own class list so mutually exclusive
    // conditional branches do not produce false UI8PX004 conflicts.
    for (const literal of extractStringLiterals(args)) {
      if (!looksLikeUtilityList(literal.value)) {
        continue;
      }
      const occurrence = occurrenceFromLiteral(
        file,
        content,
        openIndex + 1 + literal.index,
        literal.value,
        'go-cn',
        false,
      );
      if (occurrence) {
        occurrences.push(occurrence);
      }
    }
    callRe.lastIndex = closeIndex + 1;
  }
  return occurrences;
}

function extractGroupedStringDecls(file: string, content: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  const callRe = new RegExp(GROUPED_STRING_DECL_RE.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = callRe.exec(content)) !== null) {
    const openIndex = content.indexOf('(', match.index);
    const closeIndex = findMatchingParen(content, openIndex);
    if (closeIndex === -1) {
      continue;
    }
    const body = content.slice(openIndex + 1, closeIndex);
    const assignRe = new RegExp(GROUPED_ASSIGN_RE.source, 'g');
    let assign: RegExpExecArray | null;
    while ((assign = assignRe.exec(body)) !== null) {
      const occurrence = occurrenceFromLiteral(
        file,
        content,
        openIndex + 1 + assign.index,
        unquoteGoString(assign[1]),
        'go-static',
        true,
      );
      if (occurrence) {
        occurrences.push(occurrence);
      }
    }
    callRe.lastIndex = closeIndex + 1;
  }
  return occurrences;
}

export function extractGoClasses(file: string, content: string): ClassOccurrence[] {
  return [
    ...extractByRegex(file, content, GO_CLASS_VALUE_RE, 'go-static', false),
    ...extractByRegex(file, content, CLASS_FIELD_RE, 'go-static', false),
    ...extractByRegex(file, content, SIMPLE_STRING_DECL_RE, 'go-static', true),
    ...extractGroupedStringDecls(file, content),
    ...extractCnCalls(file, content),
    ...extractByRegex(file, content, RETURN_LITERAL_RE, 'go-return', true),
  ];
}
