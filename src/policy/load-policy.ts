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
import {
  UI8KIT_ALLOWED_POLICY,
  UI8KIT_DENIED_POLICY,
  UI8KIT_GROUPS_POLICY,
  UI8KIT_PATTERNS_POLICY,
  UI8KIT_SCOPES_POLICY,
} from './presets/ui8kit.js';
import { AllowedPolicy, DeniedPolicy, GroupsPolicy, LoadedPolicy, PatternsPolicy, ScopesPolicy } from './types.js';

export type PolicyPreset = 'default' | 'go' | 'ui8kit';

type PolicyKind = 'allowed' | 'denied' | 'scopes' | 'groups' | 'patterns';
type PolicyOf = {
  allowed: AllowedPolicy;
  denied: DeniedPolicy;
  scopes: ScopesPolicy;
  groups: GroupsPolicy;
  patterns: PatternsPolicy;
};

/** the bundled presets a policy file can extend (`"extends": "<name>"`) */
export const PRESETS: Record<string, PolicyOf> = {
  default: {
    allowed: DEFAULT_ALLOWED_POLICY,
    denied: DEFAULT_DENIED_POLICY,
    scopes: DEFAULT_SCOPES_POLICY,
    groups: DEFAULT_GROUPS_POLICY,
    patterns: DEFAULT_PATTERNS_POLICY,
  },
  ui8kit: {
    allowed: UI8KIT_ALLOWED_POLICY,
    denied: UI8KIT_DENIED_POLICY,
    scopes: UI8KIT_SCOPES_POLICY,
    groups: UI8KIT_GROUPS_POLICY,
    patterns: UI8KIT_PATTERNS_POLICY,
  },
};

const unique = (values: string[]): string[] => [...new Set(values)];

/**
 * A local policy file over its preset: spacing scales and scopes replace the preset's when given; utilities are added
 * (remove one with denied.json); denied utilities, conflict groups and patterns are merged by key.
 */
export function mergePolicy<K extends PolicyKind>(kind: K, base: PolicyOf[K], local: Partial<PolicyOf[K]>): PolicyOf[K] {
  const { extends: _extends, ...delta } = local as Record<string, unknown>;
  if (kind === 'allowed') {
    const b = base as AllowedPolicy;
    const l = delta as Partial<AllowedPolicy>;
    return {
      spacing: { layout: l.spacing?.layout ?? b.spacing.layout, control: l.spacing?.control ?? b.spacing.control },
      utilities: unique([...b.utilities, ...(l.utilities ?? [])]),
    } as PolicyOf[K];
  }
  if (kind === 'denied') {
    const b = base as DeniedPolicy;
    const l = delta as Partial<DeniedPolicy>;
    return { utilities: { ...b.utilities, ...(l.utilities ?? {}) } } as PolicyOf[K];
  }
  if (kind === 'scopes') {
    const b = base as ScopesPolicy;
    const l = delta as Partial<ScopesPolicy>;
    return { defaultScope: l.defaultScope ?? b.defaultScope, scopes: l.scopes ?? b.scopes } as PolicyOf[K];
  }
  if (kind === 'groups') {
    const b = base as GroupsPolicy;
    const l = delta as Partial<GroupsPolicy>;
    return { conflictGroups: { ...b.conflictGroups, ...(l.conflictGroups ?? {}) } } as PolicyOf[K];
  }
  const b = base as PatternsPolicy;
  const l = delta as Partial<PatternsPolicy>;
  return { patterns: { ...b.patterns, ...(l.patterns ?? {}) } } as PolicyOf[K];
}

function readPolicyFile<K extends PolicyKind>(filePath: string, kind: K, fallback: PolicyOf[K]): PolicyOf[K] {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Partial<PolicyOf[K]> & { extends?: string };
  if (!content.extends) {
    return content as PolicyOf[K];
  }
  const preset = PRESETS[content.extends];
  if (!preset) {
    throw new Error(`${filePath}: unknown preset "${content.extends}" (known: ${Object.keys(PRESETS).join(', ')}).`);
  }
  return mergePolicy(kind, preset[kind], content);
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
    allowed: readPolicyFile(path.join(policyDir, 'allowed.json'), 'allowed', DEFAULT_ALLOWED_POLICY),
    denied: readPolicyFile(path.join(policyDir, 'denied.json'), 'denied', DEFAULT_DENIED_POLICY),
    scopes: readPolicyFile(path.join(policyDir, 'scopes.json'), 'scopes', DEFAULT_SCOPES_POLICY),
    groups: readPolicyFile(path.join(policyDir, 'groups.json'), 'groups', DEFAULT_GROUPS_POLICY),
    patterns: readPolicyFile(path.join(policyDir, 'patterns.json'), 'patterns', DEFAULT_PATTERNS_POLICY),
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
  const files: Array<[string, unknown]> = preset === 'ui8kit'
    ? [
      ['allowed.json', { extends: 'ui8kit', utilities: [] }],
      ['denied.json', { extends: 'ui8kit', utilities: {} }],
      ['scopes.json', { extends: 'ui8kit' }],
      ['groups.json', { extends: 'ui8kit' }],
      ['patterns.json', { extends: 'ui8kit' }],
    ]
    : [
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
