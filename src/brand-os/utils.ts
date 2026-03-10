import { basename, dirname, join, resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BrandOsCompanionPathsConfig, BrandOsResolvedPaths, BrandOsSchema } from './types.js';

export function fail(message: string): never {
  throw new Error(`Error: ${message}`);
}

export function readJsonFile<T>(filePath: string): T {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON read error';
    fail(`Failed to read JSON file "${filePath}": ${message}`);
  }
}

export function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

export function writeTextFile(filePath: string, content: string): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf8');
}

export function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function toCamelCase(value: string): string {
  const parts = value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9]/g, ''));

  if (parts.length === 0) {
    return 'brandOs';
  }

  const [first, ...rest] = parts;
  const identifier = `${first.charAt(0).toLowerCase()}${first.slice(1)}${rest
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')}`;

  return /^[a-zA-Z_$]/.test(identifier) ? identifier : `brandOs${identifier}`;
}

export function formatBulletList(items: string[] | undefined): string {
  if (!items || items.length === 0) {
    return '- None specified.';
  }
  return items.map((item) => `- ${item}`).join('\n');
}

export function resolveCompanionPath(schemaPath: string, provided: string | undefined, fallbackFileName: string): string {
  if (provided) {
    return resolve(process.cwd(), provided);
  }
  return join(dirname(schemaPath), fallbackFileName);
}

export function getSchemaBaseName(schemaPath: string): string {
  return basename(schemaPath).replace(/\.schema\.json$/i, '').replace(/\.json$/i, '');
}

export function getSchemaFileName(schemaPath: string): string {
  return basename(schemaPath);
}

function getSchemaSlug(schema: BrandOsSchema, schemaPath: string): string {
  return schema.meta.slug ?? getSchemaBaseName(schemaPath);
}

function resolveCompanionFileName(slug: string, suffix: string): string {
  return `${slug}${suffix}`;
}

export function resolveBrandOsPaths(
  schemaPathArg: string,
  schema: BrandOsSchema,
  provided: {
    promptPack?: string;
    parserContract?: string;
    fixtures?: string;
    emitDir?: string;
  },
): BrandOsResolvedPaths {
  const schemaPath = resolve(process.cwd(), schemaPathArg);
  const slug = getSchemaSlug(schema, schemaPath);
  const companionPaths: BrandOsCompanionPathsConfig = schema.emit?.companionPaths ?? {};
  const promptPackSuffix = companionPaths.promptPackSuffix ?? '-prompt-pack.json';
  const parserContractSuffix = companionPaths.parserContractSuffix ?? '-parser-contract.json';
  const fixturesSuffix = companionPaths.fixturesSuffix ?? '-parser-fixtures.source.json';
  const generatedDirSuffix = companionPaths.generatedDirSuffix ?? '-generated';

  const promptPackPath = resolveCompanionPath(
    schemaPath,
    provided.promptPack,
    resolveCompanionFileName(slug, promptPackSuffix),
  );
  const parserContractPath = resolveCompanionPath(
    schemaPath,
    provided.parserContract,
    resolveCompanionFileName(slug, parserContractSuffix),
  );
  const fixturesPath = resolveCompanionPath(
    schemaPath,
    provided.fixtures,
    resolveCompanionFileName(slug, fixturesSuffix),
  );

  const emitDir = provided.emitDir
    ? resolve(process.cwd(), provided.emitDir)
    : join(dirname(schemaPath), `${slug}${generatedDirSuffix}`);

  return {
    schemaPath,
    promptPackPath,
    parserContractPath,
    fixturesPath,
    emitDir,
    schemaFileName: getSchemaFileName(schemaPath),
  };
}

export function formatCssDeclarations(
  declarations: Record<string, string> | undefined,
  indent = '    ',
): string[] {
  if (!declarations) {
    return [];
  }
  return Object.entries(declarations).map(([property, value]) => `${indent}${property}: ${value};`);
}
