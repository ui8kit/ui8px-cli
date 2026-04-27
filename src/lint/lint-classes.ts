import path from 'node:path';
import { ClassOccurrence } from '../extract/types.js';
import { checkClassToken } from '../policy/class-grammar.js';
import { matchScope } from '../policy/match-scope.js';
import { spacingSuggestion } from '../policy/suggestions.js';
import { LoadedPolicy } from '../policy/types.js';
import { findClassConflicts } from './conflict-groups.js';
import { LintDiagnostic } from './diagnostics.js';

export interface LintResult {
  filesChecked: number;
  classListsChecked: number;
  tokensChecked: number;
  diagnostics: LintDiagnostic[];
}

function displayPath(file: string, rootDir: string): string {
  return path.relative(rootDir, file).replace(/\\/g, '/');
}

export function lintOccurrences(policy: LoadedPolicy, occurrences: ClassOccurrence[]): LintResult {
  const diagnostics: LintDiagnostic[] = [];
  const files = new Set<string>();
  let tokensChecked = 0;

  for (const occurrence of occurrences) {
    files.add(occurrence.file);
    const scope = matchScope(policy, occurrence.file);
    const conflicts = findClassConflicts(occurrence.tokens);
    for (const conflict of conflicts) {
      diagnostics.push({
        rule: 'UI8PX004',
        file: displayPath(occurrence.file, policy.rootDir),
        line: occurrence.line,
        column: occurrence.column,
        className: conflict.classes.join(' '),
        message: `conflicting utility classes "${conflict.classes.join(' ')}"`,
        scope: scope.name,
        reason: `Only one class from conflict group "${conflict.group}" should appear in a class list.`,
        suggest: [conflict.classes.at(-1) ?? conflict.classes[0]],
      });
    }

    for (const token of occurrence.tokens) {
      tokensChecked += 1;
      const denied = policy.denied.utilities[token];
      if (denied) {
        diagnostics.push({
          rule: 'UI8PX003',
          file: displayPath(occurrence.file, policy.rootDir),
          line: occurrence.line,
          column: occurrence.column,
          className: token,
          message: `denied utility class "${token}"`,
          scope: scope.name,
          reason: denied.reason,
          suggest: denied.suggest,
        });
        continue;
      }

      const result = checkClassToken(policy, scope, token);
      if (result.allowed) {
        continue;
      }

      const isUiPattern = token.includes('ui-') || token.split(':').at(-1)?.startsWith('ui-');
      const isSpacing = Boolean(result.spacingPrefix && result.spacingValue);
      diagnostics.push({
        rule: isUiPattern ? 'UI8PX005' : isSpacing ? 'UI8PX001' : 'UI8PX002',
        file: displayPath(occurrence.file, policy.rootDir),
        line: occurrence.line,
        column: occurrence.column,
        className: token,
        message: `disallowed utility class "${token}"`,
        scope: scope.name,
        reason: result.reason ?? `${token} is not allowed by current ui8px policy.`,
        suggest:
          result.spacingPrefix && result.spacingValue
            ? spacingSuggestion(result.spacingPrefix, result.spacingValue)
            : undefined,
      });
    }
  }

  return {
    filesChecked: files.size,
    classListsChecked: occurrences.length,
    tokensChecked,
    diagnostics,
  };
}
