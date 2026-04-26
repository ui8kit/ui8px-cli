import fs from 'node:fs';
import path from 'node:path';
import { scanFiles } from '../extract/scan-files.js';

export interface AriaUsage {
  file: string;
  line: number;
  column: number;
  value: string;
  pattern?: string;
  kind: 'data-ui8kit' | 'component-call';
}

export interface AriaDiagnostic {
  file: string;
  line: number;
  column: number;
  rule: 'UI8PX101';
  value: string;
  pattern: string;
  source: string;
  message: string;
}

export interface AriaConfig {
  source: string;
  mode: 'subset' | 'full' | 'missing';
  patterns: string[];
}

export interface AriaValidationResult {
  checkedFiles: number;
  usages: AriaUsage[];
  diagnostics: AriaDiagnostic[];
  config: AriaConfig;
}

const DATA_UI8KIT_RE = /data-ui8kit\\?=\\?["'`]([^"'`\\\s>]+)\\?["'`]/g;
const COMPONENT_CALL_RE = /@?\b[A-Za-z_]\w*\.(Accordion|Alert|AlertDialog|Combobox|Dialog|Sheet|Shell|Tabs|Tooltip)\s*\(/g;

const PATTERN_BY_VALUE = new Map<string, string>([
  ['accordion', 'accordion'],
  ['alert', 'alert'],
  ['alertdialog', 'dialog'],
  ['combobox', 'combobox'],
  ['dialog', 'dialog'],
  ['disclosure', 'disclosure'],
  ['listbox', 'listbox'],
  ['menu', 'menu'],
  ['menubutton', 'menubutton'],
  ['sheet', 'dialog'],
  ['switch', 'switch'],
  ['tabs', 'tabs'],
  ['tooltip', 'tooltip'],
]);

const PATTERN_BY_COMPONENT = new Map<string, string>([
  ['Accordion', 'accordion'],
  ['Alert', 'alert'],
  ['AlertDialog', 'dialog'],
  ['Combobox', 'combobox'],
  ['Dialog', 'dialog'],
  ['Sheet', 'dialog'],
  ['Shell', 'dialog'],
  ['Tabs', 'tabs'],
  ['Tooltip', 'tooltip'],
]);

function lineColumn(content: string, index: number): { line: number; column: number } {
  const before = content.slice(0, index);
  const lines = before.split(/\r?\n/);
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function readJSON(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function configFromManifest(filePath: string): AriaConfig | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const raw = readJSON(filePath);
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }
  const data = raw as { ariaMode?: unknown; patterns?: unknown };
  const mode = data.ariaMode === 'full' ? 'full' : 'subset';
  return {
    source: filePath,
    mode,
    patterns: stringArray(data.patterns),
  };
}

function configFromPackage(filePath: string): AriaConfig | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const raw = readJSON(filePath);
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }
  const pkg = raw as { ui8kit?: { aria?: { mode?: unknown; patterns?: unknown } } };
  const aria = pkg.ui8kit?.aria;
  if (!aria) {
    return undefined;
  }
  const mode = aria.mode === 'full' ? 'full' : 'subset';
  return {
    source: filePath,
    mode,
    patterns: stringArray(aria.patterns),
  };
}

export function resolveAriaConfig(rootDir: string, packagePath?: string, manifestPath?: string): AriaConfig {
  const explicitManifest = manifestPath ? path.resolve(rootDir, manifestPath) : undefined;
  const explicitPackage = packagePath ? path.resolve(rootDir, packagePath) : undefined;

  if (explicitManifest) {
    const config = configFromManifest(explicitManifest);
    if (config) {
      return config;
    }
  }
  if (explicitPackage) {
    const config = configFromPackage(explicitPackage);
    if (config) {
      return config;
    }
  }

  const defaultManifest = path.join(rootDir, 'web', 'static', 'js', 'manifest.json');
  const manifestConfig = configFromManifest(defaultManifest);
  if (manifestConfig) {
    return manifestConfig;
  }

  const defaultPackage = path.join(rootDir, 'package.json');
  const packageConfig = configFromPackage(defaultPackage);
  if (packageConfig) {
    return packageConfig;
  }

  return {
    source: 'none',
    mode: 'missing',
    patterns: [],
  };
}

export function extractAriaUsagesFromFile(file: string): AriaUsage[] {
  const content = fs.readFileSync(file, 'utf8');
  const usages: AriaUsage[] = [];
  for (const match of content.matchAll(DATA_UI8KIT_RE)) {
    const value = match[1];
    const pattern = PATTERN_BY_VALUE.get(value);
    if (!pattern) {
      continue;
    }
    const position = lineColumn(content, match.index ?? 0);
    usages.push({
      file,
      line: position.line,
      column: position.column,
      value,
      pattern,
      kind: 'data-ui8kit',
    });
  }
  for (const match of content.matchAll(COMPONENT_CALL_RE)) {
    const value = match[1];
    const pattern = PATTERN_BY_COMPONENT.get(value);
    if (!pattern) {
      continue;
    }
    const position = lineColumn(content, match.index ?? 0);
    usages.push({
      file,
      line: position.line,
      column: position.column,
      value,
      pattern,
      kind: 'component-call',
    });
  }
  return usages;
}

export function validateAriaPatterns(
  inputs: string[],
  rootDir = process.cwd(),
  options: { packagePath?: string; manifestPath?: string } = {},
): AriaValidationResult {
  const files = scanFiles(inputs, rootDir).filter((file) => {
    const ext = path.extname(file);
    return ext === '.templ' || ext === '.html' || ext === '.go';
  });
  const usages = files.flatMap((file) => extractAriaUsagesFromFile(file));
  const config = resolveAriaConfig(rootDir, options.packagePath, options.manifestPath);
  const included = new Set(config.patterns);
  const diagnostics: AriaDiagnostic[] = [];

  if (config.mode !== 'full') {
    for (const usage of usages) {
      if (!usage.pattern || included.has(usage.pattern)) {
        continue;
      }
      diagnostics.push({
        file: usage.file,
        line: usage.line,
        column: usage.column,
        rule: 'UI8PX101',
        value: usage.value,
        pattern: usage.pattern,
        source: config.source,
        message:
          usage.kind === 'data-ui8kit'
            ? `data-ui8kit="${usage.value}" requires @ui8kit/aria pattern "${usage.pattern}".`
            : `UI8Kit component "${usage.value}" requires @ui8kit/aria pattern "${usage.pattern}".`,
      });
    }
  }

  return {
    checkedFiles: files.length,
    usages,
    diagnostics,
    config,
  };
}
