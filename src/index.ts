#!/usr/bin/env node
/**
 * ui8px — Scaffold a minimal Vite + React app and validate utility class maps.
 *
 * Usage examples:
 *   npx ui8px [OPTION]... [DIRECTORY]
 *   npx ui8px --design grid --input <path> --output <path>
 */

import { CliArgs, parseArgs } from './cli/parse-args.js';
import { printBrandOsUsage, runBrandOs } from './commands/brand-os.js';
import { printScaffoldUsage, runScaffold } from './commands/scaffold.js';
import { printValidateUsage, runValidateGrid } from './commands/validate-grid.js';

function fail(message: string, code = 2): never {
  console.error(`\n${message}`);
  process.exit(code);
}

function printUsage(): void {
  console.log(printScaffoldUsage());
  console.log('');
  console.log(printValidateUsage());
  console.log('');
  console.log(printBrandOsUsage());
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
    if (args.mode === 'brand-os') {
      await runBrandOs(args);
      process.exit(0);
      return;
    }

    if (args.mode === 'validate-grid') {
      const exitCode = await runValidateGrid(args);
      process.exit(exitCode);
      return;
    }

    await runScaffold(args);
    process.exit(0);
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
