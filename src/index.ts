#!/usr/bin/env node
/**
 * ui8px — Enforce strict 8px utility-class policy.
 *
 * Usage example:
 *   npx ui8px lint ./...
 */

import { CliArgs, parseArgs } from './cli/parse-args.js';
import { runCommand } from './cli/router.js';

function fail(message: string, code = 2): never {
  console.error(`\n${message}`);
  process.exit(code);
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

  try {
    const exitCode = await runCommand(args);
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
