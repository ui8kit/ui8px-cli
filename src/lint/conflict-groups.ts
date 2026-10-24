import { parseClassToken, spacingPrefixFor } from '../policy/class-grammar.js';

const TEXT_SIZES = new Set(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl']);
const TEXT_ALIGNS = new Set(['text-left', 'text-center', 'text-right', 'text-justify']);
const DISPLAY = new Set(['block', 'inline', 'inline-block', 'inline-flex', 'flex', 'grid', 'hidden']);

export interface ClassConflict {
  group: string;
  classes: string[];
}

export function conflictGroupFor(token: string): string | undefined {
  const parsed = parseClassToken(token);
  const modifierPrefix = parsed.modifiers.length ? `${parsed.modifiers.join(':')}:` : '';
  const base = parsed.base;

  const spacingPrefix = spacingPrefixFor(base);
  if (spacingPrefix) {
    return `${modifierPrefix}${spacingPrefix}`;
  }
  if (DISPLAY.has(base)) {
    return `${modifierPrefix}display`;
  }
  if (base.startsWith('justify-')) {
    return `${modifierPrefix}justify`;
  }
  if (base.startsWith('items-')) {
    return `${modifierPrefix}items`;
  }
  if (base.startsWith('bg-')) {
    return `${modifierPrefix}background`;
  }
  if (base === 'rounded' || base.startsWith('rounded-')) {
    return `${modifierPrefix}radius`;
  }
  if (base === 'shadow' || base.startsWith('shadow-')) {
    return `${modifierPrefix}shadow`;
  }
  if (TEXT_SIZES.has(base)) {
    return `${modifierPrefix}text-size`;
  }
  if (TEXT_ALIGNS.has(base)) {
    return `${modifierPrefix}text-align`;
  }
  if (base.startsWith('font-')) {
    return `${modifierPrefix}font-weight`;
  }
  if (base.startsWith('grid-cols-')) {
    return `${modifierPrefix}grid-cols`;
  }

  return undefined;
}

export function findClassConflicts(tokens: string[]): ClassConflict[] {
  const seen = new Map<string, string[]>();
  for (const token of tokens) {
    const group = conflictGroupFor(token);
    if (!group) {
      continue;
    }
    const existing = seen.get(group) ?? [];
    existing.push(token);
    seen.set(group, existing);
  }

  return [...seen.entries()]
    .map(([group, classes]) => ({ group, classes: [...new Set(classes)] }))
    .filter((item) => item.classes.length > 1);
}
