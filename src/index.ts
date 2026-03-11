#!/usr/bin/env node
/**
 * ui8px — Validate utility class maps against an 8 + 4 spacing policy.
 *
 * Usage example:
 *   npx ui8px --design grid --input <path> --output <path>
 */

import { CliArgs, parseArgs } from './cli/parse-args.js';
import { printValidateUsage, runValidateGrid } from './commands/validate-grid.js';

function fail(message: string, code = 2): never {
  console.error(`\n${message}`);
  process.exit(code);
}

function printUsage(): void {
  console.log(printValidateUsage());
}

async function main(): Promise<void> {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse arguments.';
    fail(message);
    return;
  }

  if (args.help) {
    printUsage();
    return;
  }

  try {
    const exitCode = await runValidateGrid(args);
    process.exit(exitCode);
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    fail(message);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unexpected error.';
  fail(message);
});
