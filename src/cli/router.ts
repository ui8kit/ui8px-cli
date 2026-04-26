import { CliArgs } from './parse-args.js';
import { printGlobalUsage } from './usage.js';
import { runInit } from '../commands/init.js';
import { runLint } from '../commands/lint.js';
import { runPolicyReview } from '../commands/policy-review.js';
import { runValidateAria } from '../commands/validate-aria.js';
import { runValidateGrid } from '../commands/validate-grid.js';
import { runValidatePatterns } from '../commands/validate-patterns.js';

export function runCommand(args: CliArgs): Promise<number> {
  switch (args.command) {
    case 'help':
      console.log(printGlobalUsage());
      return Promise.resolve(0);
    case 'init':
      return runInit(args);
    case 'lint':
      return runLint(args);
    case 'validate-grid':
      return runValidateGrid(args);
    case 'validate-patterns':
      return runValidatePatterns(args);
    case 'validate-aria':
      return runValidateAria(args);
    case 'policy-review':
      return runPolicyReview(args);
    default:
      return Promise.resolve(2);
  }
}
