const REMOVAL_TOKENS = [
  'auto',
  'fit-content',
  'max-content',
  'min-content',
  'intrinsic',
  'initial',
  'inherit',
  'unset',
  'revert',
  'none',
  'transparent',
];

function stripComments(value: string): string {
  return value.replace(/\/\*[^]*?\*\//g, '').trim();
}

function hasUnsupportedToken(value: string): boolean {
  const lower = value.toLowerCase();

  if (lower.includes('%') || lower.includes('vh') || lower.includes('vw')) {
    return true;
  }

  return REMOVAL_TOKENS.some((token) => new RegExp(`\\b${token}\\b`, 'i').test(lower));
}

function parsePxTokens(value: string): number[] {
  const matches = value.match(/[-+]?\d*\.?\d+px/g);
  if (!matches) {
    return [];
  }

  return matches.map((match) => parseFloat(match.replace('px', '')));
}

function parseRemTokens(value: string, rootFontSize: number): number[] {
  const matches = value.match(/[-+]?\d*\.?\d+rem/g);
  if (!matches) {
    return [];
  }

  return matches.map((match) => parseFloat(match.replace('rem', '')) * rootFontSize);
}

function parseSpacingTokens(value: string, spacingBase: number): number[] {
  const matches = Array.from(value.matchAll(/var\(--spacing\)\s*\*\s*([-+]?\d*\.?\d+)/g));
  if (!matches.length) {
    return [];
  }

  return matches.map((match) => parseFloat(match[1]) * spacingBase);
}

export function parseSpacingMeasurements(
  rawValue: string,
  spacingBase: number,
  rootFontSize: number,
): number[] {
  const value = stripComments(rawValue);

  if (!value) {
    return [];
  }

  if (hasUnsupportedToken(value)) {
    return [];
  }

  const pxValues = [
    ...parsePxTokens(value),
    ...parseRemTokens(value, rootFontSize),
    ...parseSpacingTokens(value, spacingBase),
  ];

  return pxValues.filter((px) => Number.isFinite(px));
}
