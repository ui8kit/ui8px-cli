import {
  ValidateGridBacklog,
  ValidateGridSummary,
  ValidateGridViolation,
} from './types.js';

export function buildBacklog(
  inputPath: string,
  outputPath: string,
  design: string,
  spacingBase: number,
  rootFontSize: number,
  classCount: number,
  declarationCount: number,
  violations: ValidateGridViolation[],
): ValidateGridBacklog {
  return {
    meta: {
      input: inputPath,
      output: outputPath,
      design,
      spacingBase,
      rootFontSize,
      generatedAt: new Date().toISOString(),
      classesScanned: classCount,
      declarationsScanned: declarationCount,
    },
    summary: {
      classesChecked: classCount,
      declarationsChecked: declarationCount,
      violations: violations.length,
    },
    violations,
  };
}

export function formatCliSummary(report: ValidateGridBacklog, verbose: boolean): string {
  const lines: string[] = [];
  lines.push(`Input: ${report.meta.input}`);
  lines.push(`Output: ${report.meta.output}`);
  lines.push(`Design: ${report.meta.design}`);
  lines.push(`Spacing base: ${report.meta.spacingBase}px`);
  lines.push(`Checked classes: ${report.summary.classesChecked}`);
  lines.push(`Checked declarations: ${report.summary.declarationsChecked}`);
  lines.push(`Violations: ${report.summary.violations}`);

  if (!report.summary.violations) {
    lines.push('No violations found.');
    return lines.join('\n');
  }

  lines.push(`Found ${report.summary.violations} violations.`);

  if (verbose) {
    for (const item of report.violations) {
      lines.push(`- ${item.className} | ${item.property}: ${item.rawValue} -> ${item.resolvedPx}px`);
    }
  }

  return lines.join('\n');
}

export type { ValidateGridSummary };
