import fs from 'node:fs';
import path from 'node:path';
import { loadPolicy } from '../policy/load-policy.js';
import { LoadedPolicy } from '../policy/types.js';
import { GRID_UNIT, GridScope, isAllowedSpacing, isSpacingProperty } from './rules.js';
import { parseSpacingMeasurements } from './parse-css-values.js';
import { ValidateGridSummary, ValidateGridViolation } from './types.js';

const DECLARATION_REGEX = /([a-z-]+)\s*:\s*([^;{}]+);/g;

function extractStyleDeclarations(cssText: string) {
  const declarations: Array<{ property: string; value: string }> = [];
  const normalized = `${cssText.replace(/\n/g, ' ')};`;

  let match: RegExpExecArray | null;
  while ((match = DECLARATION_REGEX.exec(normalized)) !== null) {
    declarations.push({
      property: match[1].trim().toLowerCase(),
      value: match[2].trim(),
    });
  }

  return declarations;
}

/** one style rule of a stylesheet: its selector (the nearest enclosing style rule) and its own declarations */
export interface CssRule {
  selector: string;
  declarations: Array<{ property: string; value: string }>;
}

/**
 * The style rules of a stylesheet (compiled Tailwind output included): nested rules and at-rules (`@media`, `@layer`,
 * `@supports`) are walked; a declaration belongs to the nearest enclosing style rule. Custom properties are kept as
 * declarations (`--x`) so `var(--x)` can be resolved.
 */
export function parseStylesheet(css: string): CssRule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const stack: string[] = [];
  const rules = new Map<string, CssRule>();
  const order: CssRule[] = [];
  let buffer = '';
  let quote: string | null = null;
  let parens = 0;

  const owner = (): string | undefined => {
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      if (!stack[i].startsWith('@')) return stack[i];
    }
    return undefined;
  };
  const flushDeclaration = () => {
    const decl = buffer.trim();
    buffer = '';
    const colon = decl.indexOf(':');
    const selector = owner();
    if (colon <= 0 || selector === undefined) return;
    const property = decl.slice(0, colon).trim();
    const value = decl.slice(colon + 1).trim().replace(/\s*!important$/, '');
    if (!/^-{0,2}[a-zA-Z][\w-]*$/.test(property)) return;
    let rule = rules.get(selector);
    if (!rule) {
      rule = { selector, declarations: [] };
      rules.set(selector, rule);
      order.push(rule);
    }
    rule.declarations.push({ property: property.startsWith('--') ? property : property.toLowerCase(), value });
  };

  for (const char of text) {
    if (quote) {
      buffer += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      buffer += char;
      continue;
    }
    if (char === '(') parens += 1;
    if (char === ')') parens = Math.max(0, parens - 1);
    if (parens > 0) {
      buffer += char;
      continue;
    }
    if (char === '{') {
      const prelude = buffer.trim().replace(/\s+/g, ' ');
      buffer = '';
      const parent = owner();
      if (!prelude.startsWith('@') && parent !== undefined && prelude.includes('&')) {
        stack.push(prelude.replace(/&/g, parent));
      } else if (!prelude.startsWith('@') && parent !== undefined) {
        stack.push(`${parent} ${prelude}`);
      } else {
        stack.push(prelude);
      }
      continue;
    }
    if (char === ';') {
      flushDeclaration();
      continue;
    }
    if (char === '}') {
      flushDeclaration();
      stack.pop();
      continue;
    }
    buffer += char;
  }
  return order;
}

/** `var(--name, fallback)` replaced by the value declared in the stylesheet, else by its fallback; `--spacing` stays */
export function resolveVars(value: string, vars: Map<string, string>, depth = 0): string {
  if (depth > 8 || !value.includes('var(')) return value;
  let out = '';
  let i = 0;
  while (i < value.length) {
    const at = value.indexOf('var(', i);
    if (at < 0) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, at);
    let depthParens = 0;
    let end = at + 3;
    for (; end < value.length; end += 1) {
      if (value[end] === '(') depthParens += 1;
      if (value[end] === ')') {
        depthParens -= 1;
        if (depthParens === 0) break;
      }
    }
    const inner = value.slice(at + 4, end);
    const comma = inner.indexOf(',');
    const name = (comma < 0 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma < 0 ? undefined : inner.slice(comma + 1).trim();
    if (name === '--spacing') {
      out += 'var(--spacing)';
    } else if (vars.has(name)) {
      out += resolveVars(vars.get(name)!, vars, depth + 1);
    } else if (fallback !== undefined) {
      out += resolveVars(fallback, vars, depth + 1);
    } else {
      out += 'none';
    }
    i = end + 1;
  }
  return out;
}

/** the class names of a selector (`.lg\:py-16` -> `lg:py-16`) */
export function selectorClasses(selector: string): string[] {
  return [...selector.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => m[1].replace(/\\(.)/g, '$1'));
}

function compile(patterns: string[] | undefined): RegExp[] {
  return (patterns ?? []).map((p) => new RegExp(p));
}

/** the scope of a CSS rule: the first policy scope whose `selectors` match it, else the default scope */
export function selectorScope(policy: LoadedPolicy, selector: string): { name: string; spacing: GridScope } {
  for (const scope of policy.scopes.scopes) {
    if (compile(scope.selectors).some((re) => re.test(selector))) {
      return { name: scope.name, spacing: scope.spacing };
    }
  }
  const fallback = policy.scopes.scopes.find((scope) => scope.name === policy.scopes.defaultScope);
  return { name: fallback?.name ?? policy.scopes.defaultScope, spacing: fallback?.spacing ?? 'layout' };
}

export interface ValidateGridInput {
  inputPath: string;
  spacingBase: number;
  rootFontSize: number;
  /** force one scope for every class / rule (otherwise: policy scopes, then the default scope) */
  scope?: GridScope;
  rootDir?: string;
}

export function validateMap(
  inputPathOrOptions: string | ValidateGridInput,
  spacingBaseArg?: number,
  rootFontSizeArg?: number,
): ValidateGridSummary {
  const options: ValidateGridInput = typeof inputPathOrOptions === 'string'
    ? { inputPath: inputPathOrOptions, spacingBase: spacingBaseArg ?? 4, rootFontSize: rootFontSizeArg ?? 16 }
    : inputPathOrOptions;
  const rootDir = options.rootDir ?? process.cwd();
  const inputAbsolutePath = path.resolve(rootDir, options.inputPath);
  const content = fs.readFileSync(inputAbsolutePath, 'utf8');
  const policy = loadPolicy(rootDir);
  // allowed utilities (hairlines `w-px`, `sr-only`, …) are policy decisions: the grid does not re-check them
  const exempt = new Set(policy.allowed.utilities);

  const entries: Array<{ className: string; classes: string[]; declarations: Array<{ property: string; value: string }> }> = [];
  if (/\.css$/i.test(inputAbsolutePath)) {
    const rules = parseStylesheet(content);
    const vars = new Map<string, string>();
    for (const rule of rules) for (const d of rule.declarations) if (d.property.startsWith('--') && !vars.has(d.property)) vars.set(d.property, d.value);
    for (const rule of rules) {
      entries.push({
        className: rule.selector,
        classes: selectorClasses(rule.selector),
        declarations: rule.declarations
          .filter((d) => !d.property.startsWith('--'))
          .map((d) => ({ property: d.property, value: resolveVars(d.value, vars) })),
      });
    }
  } else {
    const classMap = JSON.parse(content);
    if (!classMap || typeof classMap !== 'object' || Array.isArray(classMap)) {
      throw new Error('Input JSON must be a map object with class names as keys, or a .css stylesheet.');
    }
    for (const [className, rawCss] of Object.entries(classMap)) {
      if (typeof rawCss !== 'string') continue;
      entries.push({ className, classes: [className], declarations: extractStyleDeclarations(rawCss) });
    }
  }

  const violations: ValidateGridViolation[] = [];
  let declarationsChecked = 0;
  let classesChecked = 0;

  for (const entry of entries) {
    if (entry.classes.length > 0 && entry.classes.every((c) => exempt.has(c.split(':').at(-1) ?? c))) {
      continue;
    }
    classesChecked += 1;
    const scope = options.scope
      ? { name: options.scope, spacing: options.scope }
      : selectorScope(policy, entry.className);

    for (const declaration of entry.declarations) {
      if (!isSpacingProperty(declaration.property)) {
        continue;
      }

      declarationsChecked += 1;

      const pixels = parseSpacingMeasurements(declaration.value, options.spacingBase, options.rootFontSize);

      for (const pxValue of pixels) {
        if (!isAllowedSpacing(pxValue, scope.spacing)) {
          violations.push({
            className: entry.className,
            property: declaration.property,
            rawValue: declaration.value,
            resolvedPx: pxValue,
            scope: scope.name,
            reason: `${pxValue}px is not a multiple of ${GRID_UNIT[scope.spacing]}px (${scope.name} scope)`,
          });
        }
      }
    }
  }

  return {
    classesChecked,
    declarationsChecked,
    violations,
  };
}
