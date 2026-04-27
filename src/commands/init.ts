import path from 'node:path';
import { InitCliArgs } from '../cli/parse-args.js';
import { printInitUsage } from '../cli/usage.js';
import { initPolicyFiles, policyRoot } from '../policy/load-policy.js';

export function runInit(args: InitCliArgs): Promise<number> {
  if (args.help) {
    console.log(printInitUsage());
    return Promise.resolve(0);
  }

  const written = initPolicyFiles(process.cwd(), args.force, args.preset);
  const root = policyRoot(process.cwd());
  if (!written.length) {
    console.log(`ui8px policy already exists at ${root}`);
    console.log('Use --force to overwrite existing policy files.');
    return Promise.resolve(0);
  }

  console.log(`Initialized ui8px policy at ${root}`);
  console.log(`Preset: ${args.preset}`);
  for (const file of written) {
    console.log(`- ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`);
  }
  return Promise.resolve(0);
}
