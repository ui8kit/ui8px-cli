#!/usr/bin/env node
/**
 * brand-os — Scaffold apps, validate layout maps, emit Brand OS assets, and parse ASTs.
 *
 * Usage examples:
 *   npx brand-os [OPTION]... [DIRECTORY]
 *   npx brand-os --design grid --input <path> --output <path>
 */

import { CliArgs, parseArgs } from './cli/parse-args.js';
import { printAstParserUsage, runAstParser } from './commands/ast-parser.js';
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
  console.log(printAstParserUsage());
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
    if (args.mode === 'ast-parser') {
      const exitCode = await runAstParser(args);
      process.exit(exitCode);
      return;
    }

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
