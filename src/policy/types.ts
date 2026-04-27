export interface AllowedPolicy {
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

export interface DeniedPolicy {
  utilities: Record<string, DeniedUtility>;
}

export interface ScopeRule {
  name: string;
  files: string[];
  spacing: 'layout' | 'control';
}

export interface ScopesPolicy {
  defaultScope: string;
  scopes: ScopeRule[];
}

export interface GroupsPolicy {
  conflictGroups: Record<string, string[]>;
}

export interface PatternsPolicy {
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
