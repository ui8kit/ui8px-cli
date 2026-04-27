import { conflictGroupFor } from '../lint/conflict-groups.js';

const ORDER = [
  'display',
  'flexDirection',
  'flexWrap',
  'items',
  'justify',
  'gap',
  'gap-x',
  'gap-y',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'w',
  'h',
  'background',
  'text-size',
  'text-align',
  'font-weight',
  'radius',
  'shadow',
];

function orderIndex(token: string): number {
  const group = conflictGroupFor(token);
  if (!group) {
    return ORDER.length;
  }
  const cleanGroup = group.includes(':') ? group.split(':').at(-1) ?? group : group;
  const index = ORDER.indexOf(cleanGroup);
  return index === -1 ? ORDER.length : index;
}

export function canonicalizeTokens(tokens: string[]): string[] {
  const byConflictGroup = new Map<string, string>();
  const standalone = new Set<string>();

  for (const token of tokens) {
    const group = conflictGroupFor(token);
    if (group) {
      byConflictGroup.set(group, token);
    } else {
      standalone.add(token);
    }
  }

  return [...byConflictGroup.values(), ...standalone].sort((a, b) => {
    const diff = orderIndex(a) - orderIndex(b);
    return diff === 0 ? a.localeCompare(b) : diff;
  });
}

export function canonicalClassList(tokens: string[]): string {
  return canonicalizeTokens(tokens).join(' ');
}
