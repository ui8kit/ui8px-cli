import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { ValidateGridCliArgs } from '../cli/parse-args.js';
import { buildBacklog, formatCliSummary } from '../validate-grid/format-output.js';
import { validateMap } from '../validate-grid/validate-map.js';

function printValidateUsage(): string {
  return `Usage:\n  npx brand-os --design grid --input <path> --output <path> [options]\n\nOptions:\n  --design grid          validate mode (required for spacing checks)\n  --input <path>         path to class map JSON\n  --output <path>        backlog output path\n  --spacing-base <number>    spacing base for var(--spacing) (default: 4)\n  --root-font-size <number>  root font size for rem conversion (default: 16)\n  --verbose                  show detailed violations in console\n  -h, --help                show help`;
}

export function runValidateGrid(args: ValidateGridCliArgs): Promise<number> {
  try {
    const report = validateMap(args.input, args.spacingBase, args.rootFontSize);

    const backlog = buildBacklog(
      args.input,
      args.output,
      args.design,
      args.spacingBase,
      args.rootFontSize,
      report.classesChecked,
      report.declarationsChecked,
      report.violations,
    );

    const absoluteOutput = path.resolve(process.cwd(), args.output);
    writeFileSync(absoluteOutput, `${JSON.stringify(backlog, null, 2)}\n`, 'utf8');

    console.log(formatCliSummary(backlog, args.verbose));
    console.log(`Report saved to: ${absoluteOutput}`);

    return Promise.resolve(report.violations.length > 0 ? 1 : 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown validation error';
    throw new Error(message);
  }
}

export { printValidateUsage };
