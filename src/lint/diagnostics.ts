export type DiagnosticRule = 'UI8PX001' | 'UI8PX002' | 'UI8PX003' | 'UI8PX004' | 'UI8PX005';

export interface LintDiagnostic {
  rule: DiagnosticRule;
  file: string;
  line: number;
  column: number;
  className: string;
  message: string;
  scope: string;
  reason: string;
  suggest?: string[];
}

export function formatDiagnostic(diagnostic: LintDiagnostic): string {
  const lines = [
    `${diagnostic.file}:${diagnostic.line}:${diagnostic.column} ${diagnostic.rule} ${diagnostic.message}`,
    `Scope: ${diagnostic.scope}`,
    `Reason: ${diagnostic.reason}`,
  ];
  if (diagnostic.suggest?.length) {
    lines.push(`Suggestion: use ${diagnostic.suggest.join(' or ')}`);
  }
  return lines.join('\n');
}

export function formatDiagnostics(diagnostics: LintDiagnostic[]): string {
  if (!diagnostics.length) {
    return 'No ui8px lint violations found.';
  }
  return diagnostics.map(formatDiagnostic).join('\n\n');
}
