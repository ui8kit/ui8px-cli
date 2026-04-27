import { formatDiagnostics } from './diagnostics.js';
import { LintResult } from './lint-classes.js';

export function formatLintSummary(result: LintResult, verbose: boolean): string {
  const lines = [
    `Checked files: ${result.filesChecked}`,
    `Checked class lists: ${result.classListsChecked}`,
    `Checked class tokens: ${result.tokensChecked}`,
    `Violations: ${result.diagnostics.length}`,
  ];

  if (verbose || result.diagnostics.length > 0) {
    lines.push('');
    lines.push(formatDiagnostics(result.diagnostics));
  } else {
    lines.push('No ui8px lint violations found.');
  }

  return lines.join('\n');
}
