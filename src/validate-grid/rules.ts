export const SPACING_PROPERTIES = new Set([
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-block',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block-start',
  'margin-block-end',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-block',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block-start',
  'padding-block-end',
  'gap',
  'column-gap',
  'row-gap',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
]);

export function isSpacingProperty(propertyName: string): boolean {
  return SPACING_PROPERTIES.has(propertyName);
}

function isMultiple(value: number, unit: number, epsilon = 1e-9): boolean {
  return Math.abs(value % unit) < epsilon || Math.abs(value % unit - unit) < epsilon;
}

export function isAllowedSpacing(valuePx: number): boolean {
  if (!Number.isFinite(valuePx)) {
    return false;
  }

  const absolute = Math.abs(valuePx);
  if (absolute < 1e-9) {
    return true;
  }

  return isMultiple(absolute, 8) || isMultiple(absolute, 4);
}
