import { ClassOccurrence } from '../extract/types.js';
import { canonicalClassList } from './canonicalize.js';
import { fingerprint } from './fingerprint.js';

export interface PatternOccurrence {
  file: string;
  line: number;
  column: number;
}

export interface DetectedPattern {
  canonical: string;
  fingerprint: string;
  count: number;
  suggestedName: string;
  occurrences: PatternOccurrence[];
}

function suggestPatternName(canonical: string): string {
  if (canonical.includes('justify-between')) {
    return 'ui-section-header';
  }
  if (canonical.includes('justify-end')) {
    return 'ui-actions-row';
  }
  if (canonical.includes('grid')) {
    return 'ui-grid-cluster';
  }
  return 'ui-utility-pattern';
}

export function detectPatterns(occurrences: ClassOccurrence[], minCount: number): DetectedPattern[] {
  const map = new Map<string, DetectedPattern>();

  for (const occurrence of occurrences) {
    if (occurrence.tokens.length < 2) {
      continue;
    }
    const canonical = canonicalClassList(occurrence.tokens);
    if (!canonical) {
      continue;
    }
    const existing = map.get(canonical) ?? {
      canonical,
      fingerprint: fingerprint(canonical),
      count: 0,
      suggestedName: suggestPatternName(canonical),
      occurrences: [],
    };
    existing.count += 1;
    existing.occurrences.push({
      file: occurrence.file,
      line: occurrence.line,
      column: occurrence.column,
    });
    map.set(canonical, existing);
  }

  return [...map.values()]
    .filter((pattern) => pattern.count >= minCount)
    .sort((a, b) => b.count - a.count || a.canonical.localeCompare(b.canonical));
}
