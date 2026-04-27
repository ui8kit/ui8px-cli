import { LintCliArgs } from '../cli/parse-args.js';
import { printLintUsage } from '../cli/usage.js';
import { extractClasses } from '../extract/scan-files.js';
import { formatLintSummary } from '../lint/format-output.js';
import { lintOccurrences } from '../lint/lint-classes.js';
import { loadPolicy } from '../policy/load-policy.js';
import { appendObserved, diagnosticsToObserved } from '../telemetry/observed.js';
import { updateProposals } from '../telemetry/proposals.js';

export function runLint(args: LintCliArgs): Promise<number> {
  if (args.help) {
    console.log(printLintUsage());
    return Promise.resolve(0);
  }

  const rootDir = process.cwd();
  const policy = loadPolicy(rootDir);
  const occurrences = extractClasses(args.paths, rootDir, { ignore: args.ignore });
  const result = lintOccurrences(policy, occurrences);

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatLintSummary(result, args.verbose));
  }

  if (args.learn && result.diagnostics.length) {
    const events = diagnosticsToObserved(result.diagnostics);
    const observedPath = appendObserved(rootDir, events);
    const proposalsPath = updateProposals(rootDir, events);
    if (!args.json) {
      if (observedPath) {
        console.log(`Observed events saved to: ${observedPath}`);
      }
      if (proposalsPath) {
        console.log(`Proposals updated at: ${proposalsPath}`);
      }
    }
  }

  return Promise.resolve(result.diagnostics.length > 0 ? 1 : 0);
}
