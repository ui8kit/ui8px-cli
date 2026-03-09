import fs from 'node:fs';
import path from 'node:path';
import { isAllowedSpacing, isSpacingProperty } from './rules.js';
import { parseSpacingMeasurements } from './parse-css-values.js';
import { ValidateGridSummary, ValidateGridViolation } from './types.js';

const DECLARATION_REGEX = /([a-z-]+)\s*:\s*([^;{}]+);/g;

function extractStyleDeclarations(cssText: string) {
  const declarations: Array<{ property: string; value: string }> = [];
  const normalized = cssText.replace(/\n/g, ' ');

  let match: RegExpExecArray | null;
  while ((match = DECLARATION_REGEX.exec(normalized)) !== null) {
    declarations.push({
      property: match[1].trim().toLowerCase(),
      value: match[2].trim(),
    });
  }

  return declarations;
}

export function validateMap(
  inputPath: string,
  spacingBase: number,
  rootFontSize: number,
): ValidateGridSummary {
  const inputAbsolutePath = path.resolve(process.cwd(), inputPath);
  const mapContent = fs.readFileSync(inputAbsolutePath, 'utf8');
  const classMap = JSON.parse(mapContent);

  if (!classMap || typeof classMap !== 'object' || Array.isArray(classMap)) {
    throw new Error('Input JSON must be a map object with class names as keys.');
  }

  const violations: ValidateGridViolation[] = [];
  let declarationsChecked = 0;
  let classesChecked = 0;

  for (const [className, rawCss] of Object.entries(classMap)) {
    if (typeof rawCss !== 'string') {
      continue;
    }

    classesChecked += 1;

    const declarations = extractStyleDeclarations(rawCss);
    for (const declaration of declarations) {
      if (!isSpacingProperty(declaration.property)) {
        continue;
      }

      declarationsChecked += 1;

      const pixels = parseSpacingMeasurements(
        declaration.value,
        spacingBase,
        rootFontSize,
      );

      for (const pxValue of pixels) {
        if (!isAllowedSpacing(pxValue)) {
          violations.push({
            className,
            property: declaration.property,
            rawValue: declaration.value,
            resolvedPx: pxValue,
            reason: `${pxValue}px is not aligned to the 8/4px layout policy`,
          });
        }
      }
    }
  }

  return {
    classesChecked,
    declarationsChecked,
    violations,
  };
}
