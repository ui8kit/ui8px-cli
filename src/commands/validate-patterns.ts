import fs from 'node:fs';
import path from 'node:path';
import { ValidatePatternsCliArgs } from '../cli/parse-args.js';
import { printValidatePatternsUsage } from '../cli/usage.js';
import { extractClasses } from '../extract/scan-files.js';
import { detectPatterns } from '../patterns/detect-patterns.js';
import { policyRoot } from '../policy/load-policy.js';

export function runValidatePatterns(args: ValidatePatternsCliArgs): Promise<number> {
  if (args.help) {
    console.log(printValidatePatternsUsage());
    return Promise.resolve(0);
  }

  const rootDir = process.cwd();
  const occurrences = extractClasses(args.paths, rootDir, { ignore: args.ignore });
  const patterns = detectPatterns(occurrences, args.minCount);
  const output = args.output ?? path.join(policyRoot(rootDir), 'reports', 'patterns.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), patterns }, null, 2)}\n`, 'utf8');

  console.log(`Checked class lists: ${occurrences.length}`);
  console.log(`Repeated patterns: ${patterns.length}`);
  if (!patterns.length) {
    console.log('No repeated utility patterns found.');
  } else {
    for (const pattern of patterns.slice(0, args.verbose ? patterns.length : 10)) {
      console.log('');
      console.log(`Repeated pattern found ${pattern.count} times:`);
      console.log(`  ${pattern.canonical}`);
      console.log(`Suggested semantic class:`);
      console.log(`  ${pattern.suggestedName}`);
    }
  }
  console.log(`Report saved to: ${output}`);

  return Promise.resolve(patterns.length > 0 ? 1 : 0);
}
