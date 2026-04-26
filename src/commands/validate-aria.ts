import path from 'node:path';
import { ValidateAriaCliArgs } from '../cli/parse-args.js';
import { printValidateAriaUsage } from '../cli/usage.js';
import { validateAriaPatterns } from '../aria/validate-aria.js';

function relative(file: string): string {
  return path.relative(process.cwd(), file).replace(/\\/g, '/');
}

export function runValidateAria(args: ValidateAriaCliArgs): Promise<number> {
  if (args.help) {
    console.log(printValidateAriaUsage());
    return Promise.resolve(0);
  }

  const result = validateAriaPatterns(args.paths, process.cwd(), {
    packagePath: args.packagePath,
    manifestPath: args.manifestPath,
  });

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return Promise.resolve(result.diagnostics.length > 0 ? 1 : 0);
  }

  console.log(`Checked files: ${result.checkedFiles}`);
  console.log(`Found UI8Kit ARIA hooks: ${result.usages.length}`);
  console.log(`ARIA config: ${result.config.mode} (${result.config.source})`);
  console.log(`Violations: ${result.diagnostics.length}`);

  if (!result.diagnostics.length) {
    console.log('No UI8Kit ARIA bundle violations found.');
    return Promise.resolve(0);
  }

  const diagnostics = args.verbose ? result.diagnostics : result.diagnostics.slice(0, 25);
  for (const diagnostic of diagnostics) {
    console.log('');
    console.log(
      `${relative(diagnostic.file)}:${diagnostic.line}:${diagnostic.column} ${diagnostic.rule} missing ARIA pattern "${diagnostic.pattern}"`,
    );
    console.log(diagnostic.message);
    console.log(`Bundle source: ${diagnostic.source}`);
    console.log(`Suggestion: add "${diagnostic.pattern}" to ui8kit.aria.patterns or use aria mode "full".`);
  }

  if (!args.verbose && result.diagnostics.length > diagnostics.length) {
    console.log('');
    console.log(`...and ${result.diagnostics.length - diagnostics.length} more violations. Re-run with --verbose to show all.`);
  }

  return Promise.resolve(1);
}
