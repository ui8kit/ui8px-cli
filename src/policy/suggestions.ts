import { DeniedUtility } from './types.js';

export function formatSuggestion(suggest?: string[]): string | undefined {
  if (!suggest?.length) {
    return undefined;
  }
  if (suggest.length === 1) {
    return `use ${suggest[0]}`;
  }
  return `use ${suggest.slice(0, -1).join(', ')} or ${suggest.at(-1)}`;
}

export function deniedSuggestion(denied?: DeniedUtility): string[] | undefined {
  return denied?.suggest;
}

export function spacingSuggestion(prefix: string, value: string): string[] {
  if (value === '1' || value === '3' || value === '5' || value === '7') {
    const numeric = Number(value);
    const lower = Math.max(0, numeric - 1).toString();
    const upper = (numeric + 1).toString();
    return [`${prefix}-${lower}`, `${prefix}-${upper}`];
  }
  return [];
}
