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

function normalizeInputPath(input: string): { target: string; recursive: boolean } {
  if (input.endsWith('/...') || input.endsWith('\\...')) {
    return { target: input.slice(0, -4) || '.', recursive: true };
  }
  if (input === './...' || input === '...') {
    return { target: '.', recursive: true };
  }
  return { target: input, recursive: true };
}

function walkDirectory(dir: string, files: string[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        walkDirectory(fullPath, files);
      }
      continue;
    }
    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
}

export function scanFiles(inputs: string[], rootDir = process.cwd()): string[] {
  const files = new Set<string>();
  for (const input of inputs.length ? inputs : ['./...']) {
    const { target } = normalizeInputPath(input);
    const absolute = path.resolve(rootDir, target);
    if (!fs.existsSync(absolute)) {
      continue;
    }
    const stat = fs.statSync(absolute);
    if (stat.isDirectory()) {
      const collected: string[] = [];
      walkDirectory(absolute, collected);
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

export function extractClasses(inputs: string[], rootDir = process.cwd()): ClassOccurrence[] {
  return scanFiles(inputs, rootDir).flatMap((file) => extractClassesFromFile(file));
}
