import path from 'node:path';
import { LoadedPolicy, MatchedScope } from './types.js';

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/^\.\//, '');
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function globToRegex(glob: string): RegExp {
  const normalized = normalizePath(glob);
  let source = '';
  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];
    if (char === '*' && next === '*') {
      source += '.*';
      i += 1;
      continue;
    }
    if (char === '*') {
      source += '[^/]*';
      continue;
    }
    source += escapeRegex(char);
  }
  return new RegExp(`^${source}$`);
}

export function relativeProjectPath(filePath: string, rootDir = process.cwd()): string {
  return normalizePath(path.relative(rootDir, path.resolve(rootDir, filePath)));
}

export function matchScope(policy: LoadedPolicy, filePath: string): MatchedScope {
  const relative = relativeProjectPath(filePath, policy.rootDir);
  for (const scope of policy.scopes.scopes) {
    for (const pattern of scope.files) {
      if (globToRegex(pattern).test(relative)) {
        return { name: scope.name, spacing: scope.spacing };
      }
    }
  }

  const fallback = policy.scopes.scopes.find((scope) => scope.name === policy.scopes.defaultScope);
  return {
    name: fallback?.name ?? policy.scopes.defaultScope,
    spacing: fallback?.spacing ?? 'layout',
  };
}
