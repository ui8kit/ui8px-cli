/** A policy file may extend a bundled preset (`"extends": "ui8kit"`) and keep only its local deltas. */
export interface Extendable {
  extends?: string;
}

export interface AllowedPolicy extends Extendable {
  spacing: {
    layout: string[];
    control: string[];
  };
  utilities: string[];
}

export interface DeniedUtility {
  reason: string;
  suggest?: string[];
}

export interface DeniedPolicy extends Extendable {
  utilities: Record<string, DeniedUtility>;
}

export interface ScopeRule {
  name: string;
  files: string[];
  spacing: 'layout' | 'control';
  /**
   * CSS selectors of this scope for `validate grid` on a stylesheet: regular expressions tested against each rule's
   * selector (e.g. `\\[data-shape="badge"\\]`). A rule no scope claims takes the default scope.
   */
  selectors?: string[];
}

export interface ScopesPolicy extends Extendable {
  defaultScope: string;
  scopes: ScopeRule[];
}

export interface GroupsPolicy extends Extendable {
  conflictGroups: Record<string, string[]>;
}

export interface PatternsPolicy extends Extendable {
  patterns: Record<string, string[]>;
}

export interface LoadedPolicy {
  rootDir: string;
  allowed: AllowedPolicy;
  denied: DeniedPolicy;
  scopes: ScopesPolicy;
  groups: GroupsPolicy;
  patterns: PatternsPolicy;
}

export interface MatchedScope {
  name: string;
  spacing: 'layout' | 'control';
}
