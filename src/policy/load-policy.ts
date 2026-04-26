import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_ALLOWED_POLICY,
  DEFAULT_DENIED_POLICY,
  DEFAULT_GROUPS_POLICY,
  DEFAULT_PATTERNS_POLICY,
  DEFAULT_SCOPES_POLICY,
  GO_SCOPES_POLICY,
} from './default-policy.js';
import { AllowedPolicy, DeniedPolicy, GroupsPolicy, LoadedPolicy, PatternsPolicy, ScopesPolicy } from './types.js';

export type PolicyPreset = 'default' | 'go';

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

function writeJsonFile(filePath: string, value: unknown, force: boolean): boolean {
  if (fs.existsSync(filePath) && !force) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return true;
}

export function policyRoot(rootDir = process.cwd()): string {
  return path.join(rootDir, '.ui8px');
}

export function loadPolicy(rootDir = process.cwd()): LoadedPolicy {
  const root = policyRoot(rootDir);
  const policyDir = path.join(root, 'policy');
  return {
    rootDir,
    allowed: readJsonFile<AllowedPolicy>(path.join(policyDir, 'allowed.json'), DEFAULT_ALLOWED_POLICY),
    denied: readJsonFile<DeniedPolicy>(path.join(policyDir, 'denied.json'), DEFAULT_DENIED_POLICY),
    scopes: readJsonFile<ScopesPolicy>(path.join(policyDir, 'scopes.json'), DEFAULT_SCOPES_POLICY),
    groups: readJsonFile<GroupsPolicy>(path.join(policyDir, 'groups.json'), DEFAULT_GROUPS_POLICY),
    patterns: readJsonFile<PatternsPolicy>(path.join(policyDir, 'patterns.json'), DEFAULT_PATTERNS_POLICY),
  };
}

function scopesForPreset(preset: PolicyPreset): ScopesPolicy {
  if (preset === 'go') {
    return GO_SCOPES_POLICY;
  }
  return DEFAULT_SCOPES_POLICY;
}

export function initPolicyFiles(rootDir = process.cwd(), force = false, preset: PolicyPreset = 'default'): string[] {
  const policyDir = path.join(policyRoot(rootDir), 'policy');
  const written: string[] = [];
  const files: Array<[string, unknown]> = [
    ['allowed.json', DEFAULT_ALLOWED_POLICY],
    ['denied.json', DEFAULT_DENIED_POLICY],
    ['scopes.json', scopesForPreset(preset)],
    ['groups.json', DEFAULT_GROUPS_POLICY],
    ['patterns.json', DEFAULT_PATTERNS_POLICY],
  ];

  for (const [name, value] of files) {
    const filePath = path.join(policyDir, name);
    if (writeJsonFile(filePath, value, force)) {
      written.push(filePath);
    }
  }

  fs.mkdirSync(path.join(policyRoot(rootDir), 'telemetry'), { recursive: true });
  fs.mkdirSync(path.join(policyRoot(rootDir), 'reports'), { recursive: true });
  return written;
}
