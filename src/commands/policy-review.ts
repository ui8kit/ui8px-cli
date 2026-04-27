import { PolicyReviewCliArgs } from '../cli/parse-args.js';
import { printPolicyReviewUsage } from '../cli/usage.js';
import { readPolicyProposals } from '../telemetry/proposals.js';

export function runPolicyReview(args: PolicyReviewCliArgs): Promise<number> {
  if (args.help) {
    console.log(printPolicyReviewUsage());
    return Promise.resolve(0);
  }

  const proposals = readPolicyProposals(process.cwd());
  const items = Object.values(proposals.unknownUtilities).sort((a, b) => b.count - a.count);
  if (!items.length) {
    console.log('No ui8px policy proposals found.');
    return Promise.resolve(0);
  }

  console.log(`Policy proposals: ${items.length}`);
  for (const item of items.slice(0, 20)) {
    console.log('');
    console.log(`${item.class} (${item.count} occurrences)`);
    console.log(`Status: ${item.status}`);
    if (item.suggest?.length) {
      console.log(`Suggestion: ${item.suggest.join(' or ')}`);
    }
    const example = item.examples[0];
    if (example) {
      console.log(`Example: ${example.file}:${example.line}:${example.column}`);
    }
  }
  return Promise.resolve(0);
}
