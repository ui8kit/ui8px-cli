import fs from 'node:fs';
import path from 'node:path';
import { policyRoot } from '../policy/load-policy.js';
import { LintDiagnostic } from '../lint/diagnostics.js';

export interface ObservedEvent {
  time: string;
  class: string;
  file: string;
  line: number;
  column: number;
  scope: string;
  rule: string;
  status: 'denied' | 'disallowed' | 'unknown' | 'conflict';
  suggest?: string[];
}

function statusForRule(rule: string): ObservedEvent['status'] {
  if (rule === 'UI8PX003') {
    return 'denied';
  }
  if (rule === 'UI8PX004') {
    return 'conflict';
  }
  if (rule === 'UI8PX002' || rule === 'UI8PX005') {
    return 'unknown';
  }
  return 'disallowed';
}

export function diagnosticsToObserved(diagnostics: LintDiagnostic[]): ObservedEvent[] {
  const time = new Date().toISOString();
  return diagnostics.map((diagnostic) => ({
    time,
    class: diagnostic.className,
    file: diagnostic.file,
    line: diagnostic.line,
    column: diagnostic.column,
    scope: diagnostic.scope,
    rule: diagnostic.rule,
    status: statusForRule(diagnostic.rule),
    suggest: diagnostic.suggest,
  }));
}

export function appendObserved(rootDir: string, events: ObservedEvent[]): string | undefined {
  if (!events.length) {
    return undefined;
  }
  const filePath = path.join(policyRoot(rootDir), 'telemetry', 'observed.jsonl');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const content = `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
  fs.appendFileSync(filePath, content, 'utf8');
  return filePath;
}
