import { LoadedPolicy, MatchedScope } from './types.js';

const SPACING_PREFIXES = new Set([
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
  'mt',
  'mr',
  'mb',
  'ml',
  'gap',
  'gap-x',
  'gap-y',
  'w',
  'h',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'z',
]);

const ALLOWED_MODIFIERS = new Set([
  'hover',
  'focus',
  'focus-visible',
  'active',
  'disabled',
  'visited',
  'dark',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'group-hover',
]);

const DYNAMIC_PATTERNS = [
  /^col-span-(?:1|2|3|4|5|6|7|8|9|10|11|12|full)$/,
  /^row-span-(?:1|2|3|4|5|6|7|8|9|10|11|12|full)$/,
  /^order-(?:1|2|3|4|5|6|7|8|9|10|11|12|first|last|none)$/,
  /^basis-(?:0|1\/2|1\/3|2\/3|1\/4|2\/4|3\/4|full|auto)$/,
  /^opacity-(?:0|25|50|75|100)$/,
];

export interface ParsedClassToken {
  original: string;
  base: string;
  modifiers: string[];
}

export interface ClassCheckResult {
  allowed: boolean;
  reason?: string;
  spacingPrefix?: string;
  spacingValue?: string;
  fineTuning?: boolean;
}

export function parseClassToken(token: string): ParsedClassToken {
  const parts = token.split(':').filter(Boolean);
  const base = parts.pop() ?? token;
  return {
    original: token,
    base,
    modifiers: parts,
  };
}

function hasAllowedModifiers(modifiers: string[]): boolean {
  return modifiers.every((modifier) => ALLOWED_MODIFIERS.has(modifier));
}

function parseSpacingClass(base: string): { prefix: string; value: string } | undefined {
  for (const prefix of [...SPACING_PREFIXES].sort((a, b) => b.length - a.length)) {
    const marker = `${prefix}-`;
    if (base.startsWith(marker)) {
      return { prefix, value: base.slice(marker.length) };
    }
  }
  return undefined;
}

export function checkClassToken(
  policy: LoadedPolicy,
  scope: MatchedScope,
  token: string,
): ClassCheckResult {
  const parsed = parseClassToken(token);
  if (!hasAllowedModifiers(parsed.modifiers)) {
    return { allowed: false, reason: `Unsupported modifier chain: ${parsed.modifiers.join(':')}` };
  }

  if (policy.allowed.utilities.includes(parsed.base)) {
    return { allowed: true };
  }

  if (parsed.base.startsWith('ui-')) {
    return {
      allowed: Object.prototype.hasOwnProperty.call(policy.patterns.patterns, parsed.base),
      reason: `Unknown ui-* semantic class: ${parsed.base}`,
    };
  }

  const spacing = parseSpacingClass(parsed.base);
  if (spacing) {
    const scale = policy.allowed.spacing[scope.spacing];
    const allowed = scale.includes(spacing.value);
    const layoutScale = policy.allowed.spacing.layout;
    return {
      allowed,
      reason: allowed ? undefined : `${parsed.base} is not allowed in ${scope.name} scope.`,
      spacingPrefix: spacing.prefix,
      spacingValue: spacing.value,
      fineTuning: !layoutScale.includes(spacing.value),
    };
  }

  if (DYNAMIC_PATTERNS.some((pattern) => pattern.test(parsed.base))) {
    return { allowed: true };
  }

  return { allowed: false, reason: `Unknown utility class: ${parsed.base}` };
}
