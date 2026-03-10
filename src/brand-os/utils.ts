import { basename, dirname, join, relative, resolve } from 'node:path';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
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

export function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
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

export function resolveRelativeToSchemaDir(schemaPath: string, relativePath: string): string {
  return resolve(dirname(schemaPath), relativePath);
}

export function getRelativePathFrom(fromDir: string, targetPath: string): string {
  return relative(fromDir, targetPath).replace(/\\/g, '/');
}

export function copyPath(sourcePath: string, destinationPath: string): void {
  const stats = statSync(sourcePath);

  if (stats.isDirectory()) {
    ensureDir(destinationPath);
    for (const entry of readdirSync(sourcePath)) {
      copyPath(join(sourcePath, entry), join(destinationPath, entry));
    }
    return;
  }

  ensureDir(dirname(destinationPath));
  copyFileSync(sourcePath, destinationPath);
}
