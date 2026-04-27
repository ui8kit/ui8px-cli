import fs from 'node:fs';
import path from 'node:path';
import { extractCssClasses } from './extract-css.js';
import { extractGoClasses } from './extract-go.js';
import { extractHtmlClasses } from './extract-html.js';
import { extractTemplClasses } from './extract-templ.js';
import { ClassOccurrence } from './types.js';

const SUPPORTED_EXTENSIONS = new Set(['.templ', '.html', '.css', '.go']);
const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.ui8px',
  'node_modules',
  'dist',
  'coverage',
  '.cache',
  '.next',
  '.nuxt',
  '.svelte-kit',
]);

export interface ScanOptions {
  ignore?: string[];
}

interface IgnorePattern {
  value: string;
  directoryOnly: boolean;
  anchored: boolean;
  hasSlash: boolean;
  regex?: RegExp;
}

function normalizeInputPath(input: string): { target: string; recursive: boolean } {
  if (input.endsWith('/...') || input.endsWith('\\...')) {
    return { target: input.slice(0, -4) || '.', recursive: true };
  }
  if (input === './...' || input === '...') {
    return { target: '.', recursive: true };
  }
  return { target: input, recursive: true };
}

function normalizeForMatch(value: string): string {
  return value.split(path.sep).join('/');
}

function escapeRegExp(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function wildcardToRegExp(pattern: string, anchored: boolean, hasSlash: boolean): RegExp {
  const source = pattern
    .split('*')
    .map((part) => escapeRegExp(part))
    .join('[^/]*');
  if (anchored || hasSlash) {
    return new RegExp(`^${source}(?:/.*)?$`);
  }
  return new RegExp(`(^|/)${source}(?:/.*)?$`);
}

function parseIgnoreLine(line: string): IgnorePattern | undefined {
  const trimmed = line.trim().replace(/\\/g, '/');
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) {
    return undefined;
  }
  const directoryOnly = trimmed.endsWith('/');
  const anchored = trimmed.startsWith('/');
  const value = trimmed.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!value) {
    return undefined;
  }
  const hasSlash = value.includes('/');
  return {
    value,
    directoryOnly,
    anchored,
    hasSlash,
    regex: value.includes('*') ? wildcardToRegExp(value, anchored, hasSlash) : undefined,
  };
}

function readGitignorePatterns(rootDir: string): string[] {
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    return [];
  }
  return fs.readFileSync(gitignorePath, 'utf8').split(/\r?\n/);
}

function compileIgnorePatterns(rootDir: string, extraIgnore: string[] = []): IgnorePattern[] {
  return [...readGitignorePatterns(rootDir), ...extraIgnore]
    .map(parseIgnoreLine)
    .filter((pattern): pattern is IgnorePattern => Boolean(pattern));
}

function matchesIgnorePattern(relativePath: string, isDirectory: boolean, pattern: IgnorePattern): boolean {
  if (pattern.directoryOnly && !isDirectory && !relativePath.startsWith(`${pattern.value}/`) && !relativePath.includes(`/${pattern.value}/`)) {
    return false;
  }
  if (pattern.regex) {
    return pattern.regex.test(relativePath);
  }
  if (pattern.anchored || pattern.hasSlash) {
    return relativePath === pattern.value || relativePath.startsWith(`${pattern.value}/`);
  }
  return relativePath.split('/').includes(pattern.value);
}

function isIgnoredPath(fullPath: string, rootDir: string, isDirectory: boolean, ignorePatterns: IgnorePattern[]): boolean {
  const relativePath = normalizeForMatch(path.relative(rootDir, fullPath));
  if (!relativePath || relativePath.startsWith('..')) {
    return false;
  }
  return ignorePatterns.some((pattern) => matchesIgnorePattern(relativePath, isDirectory, pattern));
}

function walkDirectory(dir: string, files: string[], rootDir: string, ignorePatterns: IgnorePattern[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name) && !isIgnoredPath(fullPath, rootDir, true, ignorePatterns)) {
        walkDirectory(fullPath, files, rootDir, ignorePatterns);
      }
      continue;
    }
    if (
      entry.isFile() &&
      SUPPORTED_EXTENSIONS.has(path.extname(entry.name)) &&
      !isIgnoredPath(fullPath, rootDir, false, ignorePatterns)
    ) {
      files.push(fullPath);
    }
  }
}

export function scanFiles(inputs: string[], rootDir = process.cwd(), options: ScanOptions = {}): string[] {
  const files = new Set<string>();
  const ignorePatterns = compileIgnorePatterns(rootDir, options.ignore);
  for (const input of inputs.length ? inputs : ['./...']) {
    const { target } = normalizeInputPath(input);
    const absolute = path.resolve(rootDir, target);
    if (!fs.existsSync(absolute)) {
      continue;
    }
    const stat = fs.statSync(absolute);
    if (isIgnoredPath(absolute, rootDir, stat.isDirectory(), ignorePatterns)) {
      continue;
    }
    if (stat.isDirectory()) {
      const collected: string[] = [];
      walkDirectory(absolute, collected, rootDir, ignorePatterns);
      for (const file of collected) {
        files.add(file);
      }
      continue;
    }
    if (stat.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(absolute))) {
      files.add(absolute);
    }
  }
  return [...files].sort();
}

export function extractClassesFromFile(file: string): ClassOccurrence[] {
  const content = fs.readFileSync(file, 'utf8');
  const extension = path.extname(file);
  if (extension === '.templ') {
    return extractTemplClasses(file, content);
  }
  if (extension === '.html') {
    return extractHtmlClasses(file, content);
  }
  if (extension === '.css') {
    return extractCssClasses(file, content);
  }
  if (extension === '.go') {
    return extractGoClasses(file, content);
  }
  return [];
}

export function extractClasses(inputs: string[], rootDir = process.cwd(), options: ScanOptions = {}): ClassOccurrence[] {
  return scanFiles(inputs, rootDir, options).flatMap((file) => extractClassesFromFile(file));
}
