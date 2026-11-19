import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { ValidateGridCliArgs } from '../cli/parse-args.js';
import { printValidateGridUsage } from '../cli/usage.js';
import { buildBacklog, formatCliSummary } from '../validate-grid/format-output.js';
import { validateMap } from '../validate-grid/validate-map.js';

function printValidateUsage(): string {
  return printValidateGridUsage();
}

export function runValidateGrid(args: ValidateGridCliArgs): Promise<number> {
  try {
    const report = validateMap({
      inputPath: args.input,
      spacingBase: args.spacingBase,
      rootFontSize: args.rootFontSize,
      scope: args.scope,
    });

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
