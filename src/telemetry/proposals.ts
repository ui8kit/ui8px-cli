import fs from 'node:fs';
import path from 'node:path';
import { policyRoot } from '../policy/load-policy.js';
import { ObservedEvent } from './observed.js';

export interface UtilityProposal {
  class: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: 'review';
  scopes: Record<string, number>;
  rules: Record<string, number>;
  examples: Array<{ file: string; line: number; column: number }>;
  suggest?: string[];
}

export interface ProposalsFile {
  unknownUtilities: Record<string, UtilityProposal>;
}

function readProposals(filePath: string): ProposalsFile {
  if (!fs.existsSync(filePath)) {
    return { unknownUtilities: {} };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ProposalsFile;
}

function writeJsonAtomic(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(tmp, filePath);
}

export function updateProposals(rootDir: string, events: ObservedEvent[]): string | undefined {
  if (!events.length) {
    return undefined;
  }
  const filePath = path.join(policyRoot(rootDir), 'telemetry', 'proposals.json');
  const proposals = readProposals(filePath);

  for (const event of events) {
    const key = event.class;
    const existing = proposals.unknownUtilities[key] ?? {
      class: key,
      count: 0,
      firstSeen: event.time,
      lastSeen: event.time,
      status: 'review' as const,
      scopes: {},
      rules: {},
      examples: [],
      suggest: event.suggest,
    };

    existing.count += 1;
    existing.lastSeen = event.time;
    existing.scopes[event.scope] = (existing.scopes[event.scope] ?? 0) + 1;
    existing.rules[event.rule] = (existing.rules[event.rule] ?? 0) + 1;
    if (event.suggest?.length) {
      existing.suggest = event.suggest;
    }
    const alreadyHasExample = existing.examples.some(
      (example) => example.file === event.file && example.line === event.line && example.column === event.column,
    );
    if (!alreadyHasExample && existing.examples.length < 10) {
      existing.examples.push({ file: event.file, line: event.line, column: event.column });
    }

    proposals.unknownUtilities[key] = existing;
  }

  writeJsonAtomic(filePath, proposals);
  return filePath;
}

export function readPolicyProposals(rootDir: string): ProposalsFile {
  return readProposals(path.join(policyRoot(rootDir), 'telemetry', 'proposals.json'));
}
