import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { BrandOsCliArgs } from '../cli/parse-args.js';

type StringMap = Record<string, string>;

interface BrandOsCategoryToken {
  light: string;
  dark: string;
  referenceAliases?: string[];
  suggestedTechAliases?: string[];
}

interface BrandOsSchema {
  meta: {
    name: string;
    description?: string;
  };
  brandThesis?: {
    summary?: string;
    promise?: string;
    positioning?: string;
    personality?: string[];
    antiPersonality?: string[];
    voice?: {
      tone?: string[];
      avoid?: string[];
    };
  };
  tokens: {
    color: {
      light: StringMap;
      dark: StringMap;
      categories?: Record<string, BrandOsCategoryToken>;
      charts?: Record<string, string>;
    };
    typography: {
      families: StringMap;
      weights?: Record<string, number>;
      sizes?: StringMap;
      lineHeights?: Record<string, number | string>;
      tracking?: StringMap;
      surfaceOverrides?: Record<string, StringMap>;
    };
    spacing?: {
      baseUnit?: number;
      scale?: StringMap;
      sectionRhythm?: StringMap;
      container?: StringMap;
    };
    radius: StringMap;
    shadow: StringMap;
    motion?: {
      durations?: StringMap;
      easings?: StringMap;
      presets?: Record<string, Record<string, string | number | boolean>>;
      reducedMotion?: Record<string, boolean>;
    };
  };
  designGrammar?: {
    densityModes?: StringMap;
    shapeLanguage?: {
      core?: string;
    };
    surfaceLanguage?: {
      base?: string;
      depthRule?: string;
      accentRule?: string;
      contrastRule?: string;
    };
    imageTreatment?: {
      style?: string;
      preferred?: string[];
      avoid?: string[];
    };
    contentVoice?: {
      adjectives?: string[];
      avoid?: string[];
    };
  };
  componentPolicy?: {
    keepStandard?: string[];
    wrapEarly?: string[];
    customBlocks?: string[];
    rawHtmlAllowedFor?: string[];
    avoid?: string[];
  };
  recipes?: {
    pageArchetypes?: Record<string, { purpose?: string; requiredSections?: string[] }>;
    sectionArchetypes?: Record<string, { purpose?: string; requiredSlots?: string[]; fixedTraits?: string[] }>;
  };
}

interface PromptPackSurface {
  goal: string;
  requiredInputs: string[];
  optionalInputs?: string[];
  sectionExpectations?: string[];
  surfaceOverrides?: string[];
  deliverables?: string[];
  promptTemplate: string[];
  auditChecklist?: string[];
}

interface PromptPack {
  sharedContext: {
    brandSummary: string;
    styleKeywords?: string[];
    negativeStyleKeywords?: string[];
    crossSurfaceRules?: string[];
    implementationBias?: {
      preferredStack?: string;
      systemLayer?: string[];
      brandLayer?: string[];
    };
    motionBias?: {
      defaultLevel?: string;
      allowedEscalation?: string[];
      forbiddenWithoutJustification?: string[];
    };
  };
  surfaces: Record<string, PromptPackSurface>;
  auditPromptAddendum?: string[];
}

interface ParserFixtureExpected {
  structural: string[];
  semantic: string[];
  decorative: string[];
  unknown?: string[];
}

interface ParserFixture {
  id: string;
  title: string;
  sourceFile: string;
  description: string;
  classes: string[];
  expected: ParserFixtureExpected;
  notes?: string[];
}

interface ParserFixtureSource {
  schemaVersion: string;
  brandId: string;
  fixtures: ParserFixture[];
}

function fail(message: string): never {
  throw new Error(`Error: ${message}`);
}

function readJsonFile<T>(filePath: string): T {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON read error';
    fail(`Failed to read JSON file "${filePath}": ${message}`);
  }
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeTextFile(filePath: string, content: string): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf8');
}

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function resolveCompanionPath(schemaPath: string, provided: string | undefined, fallbackFileName: string): string {
  if (provided) {
    return resolve(process.cwd(), provided);
  }
  return join(dirname(schemaPath), fallbackFileName);
}

function resolveEmitDir(schemaPath: string, provided: string | undefined): string {
  if (provided) {
    return resolve(process.cwd(), provided);
  }

  const schemaBaseName = basename(schemaPath).replace(/\.schema\.json$/i, '').replace(/\.json$/i, '');
  return join(dirname(schemaPath), `${schemaBaseName}-generated`);
}

function formatBulletList(items: string[] | undefined): string {
  if (!items || items.length === 0) {
    return '- None specified.';
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function formatTokenVars(tokens: StringMap): string {
  return Object.entries(tokens)
    .map(([key, value]) => `    --${toKebabCase(key)}: ${value};`)
    .join('\n');
}

function buildCategoryVars(categories: Record<string, BrandOsCategoryToken> | undefined, mode: 'light' | 'dark'): string {
  if (!categories) {
    return '';
  }

  return Object.entries(categories)
    .map(([key, value]) => `    --${toKebabCase(key)}: ${mode === 'light' ? value.light : value.dark};`)
    .join('\n');
}

function buildChartVars(charts: Record<string, string> | undefined): string {
  if (!charts) {
    return '';
  }

  return Object.entries(charts)
    .map(([key, value]) => `    --chart-${key}: ${value};`)
    .join('\n');
}

function buildRadiusVars(radius: StringMap): string {
  return Object.entries(radius)
    .map(([key, value]) => `    --radius-${toKebabCase(key)}: ${value};`)
    .join('\n');
}

function buildTagUtilityClasses(categories: Record<string, BrandOsCategoryToken> | undefined): string {
  if (!categories) {
    return '';
  }

  const lines: string[] = [];

  for (const [key, value] of Object.entries(categories)) {
    const cssVar = `--${toKebabCase(key)}`;
    const classNames = [
      `tag-${toKebabCase(key)}`,
      ...(value.referenceAliases ?? []).map((alias) => `tag-${toKebabCase(alias)}`),
      ...(value.suggestedTechAliases ?? []).map((alias) => `tag-${toKebabCase(alias)}`),
    ];

    for (const className of classNames) {
      lines.push(`  .${className} {`);
      lines.push(`    background-color: hsl(var(${cssVar}));`);
      lines.push('    color: hsl(var(--primary));');
      lines.push('  }');
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}

function buildThemeCss(schema: BrandOsSchema): string {
  const lightColors = formatTokenVars(schema.tokens.color.light);
  const darkColors = formatTokenVars(schema.tokens.color.dark);
  const lightCategories = buildCategoryVars(schema.tokens.color.categories, 'light');
  const darkCategories = buildCategoryVars(schema.tokens.color.categories, 'dark');
  const charts = buildChartVars(schema.tokens.color.charts);
  const radiusVars = buildRadiusVars(schema.tokens.radius);
  const radiusDefault = schema.tokens.radius.lg ?? schema.tokens.radius.md ?? '1rem';
  const displayFamily = schema.tokens.typography.families.display ?? schema.tokens.typography.families.ui ?? 'serif';
  const bodyFamily = schema.tokens.typography.families.ui ?? 'system-ui, sans-serif';
  const motion = schema.tokens.motion;
  const fadeInDuration = motion?.presets?.['fade-in']?.duration ?? '0.5s';
  const slideUpDuration = motion?.presets?.['slide-up']?.duration ?? '0.6s';
  const slideDownDuration = motion?.presets?.['slide-down']?.duration ?? '0.6s';
  const scaleInDuration = motion?.presets?.['scale-in']?.duration ?? '0.5s';
  const standardEase = motion?.easings?.standard ?? 'cubic-bezier(0.4, 0, 0.2, 1)';
  const revealEase = motion?.easings?.reveal ?? 'ease-out';
  const tagUtilities = buildTagUtilityClasses(schema.tokens.color.categories);

  return [
    '/* Generated by ui8px brand OS emitter. */',
    '/* Source of truth: tech-brand-os.schema.json */',
    '@tailwind base;',
    '@tailwind components;',
    '@tailwind utilities;',
    '',
    '@layer base {',
    '  :root {',
    lightColors,
    charts,
    lightCategories,
    radiusVars,
    `    --radius: ${radiusDefault};`,
    '  }',
    '',
    '  .dark {',
    darkColors,
    darkCategories,
    '  }',
    '}',
    '',
    '@layer base {',
    '  * {',
    '    @apply border-border;',
    '  }',
    '',
    '  html {',
    '    scroll-behavior: smooth;',
    '  }',
    '',
    '  body {',
    '    @apply bg-background text-foreground antialiased;',
    `    font-family: ${bodyFamily};`,
    '  }',
    '',
    '  h1,',
    '  h2,',
    '  h3,',
    '  h4,',
    '  h5,',
    '  h6 {',
    `    font-family: ${displayFamily};`,
    '    letter-spacing: -0.02em;',
    '  }',
    '}',
    '',
    '@layer utilities {',
    '  .pill-nav {',
    '    border-radius: var(--radius-pill);',
    '    background-color: hsl(var(--surface-elevated));',
    '    border: 1px solid hsl(var(--border) / 0.5);',
    '    backdrop-filter: blur(16px);',
    '  }',
    '',
    '  .card-hover {',
    `    transition: transform ${slideUpDuration} ${standardEase}, box-shadow ${slideUpDuration} ${standardEase};`,
    '    box-shadow: 0 4px 20px -4px hsl(var(--shadow-soft) / 0.10);',
    '  }',
    '',
    '  .card-hover:hover {',
    '    transform: scale(1.02);',
    '    box-shadow: 0 20px 40px -10px hsl(var(--shadow-soft) / 0.15);',
    '  }',
    '',
    '  .floating-button {',
    '    width: 3rem;',
    '    height: 3rem;',
    '    border-radius: var(--radius-pill);',
    '    display: inline-flex;',
    '    align-items: center;',
    '    justify-content: center;',
    '    background-color: hsl(var(--cream) / 0.90);',
    '    color: hsl(var(--cream-foreground));',
    '    backdrop-filter: blur(8px);',
    '    box-shadow: 0 4px 12px -2px hsl(var(--shadow-soft) / 0.15);',
    `    transition: transform ${standardEase} ${slideUpDuration}, background-color ${standardEase} ${slideUpDuration};`,
    '  }',
    '',
    '  .floating-button:hover {',
    '    transform: scale(1.10);',
    '    background-color: hsl(var(--cream));',
    '  }',
    '',
    '  @keyframes fadeIn {',
    '    from { opacity: 0; }',
    '    to { opacity: 1; }',
    '  }',
    '',
    '  @keyframes slideUp {',
    '    from {',
    '      opacity: 0;',
    '      transform: translateY(20px);',
    '    }',
    '    to {',
    '      opacity: 1;',
    '      transform: translateY(0);',
    '    }',
    '  }',
    '',
    '  @keyframes slideDown {',
    '    from {',
    '      opacity: 0;',
    '      transform: translateY(-20px);',
    '    }',
    '    to {',
    '      opacity: 1;',
    '      transform: translateY(0);',
    '    }',
    '  }',
    '',
    '  @keyframes scaleIn {',
    '    from {',
    '      opacity: 0;',
    '      transform: scale(0.95);',
    '    }',
    '    to {',
    '      opacity: 1;',
    '      transform: scale(1);',
    '    }',
    '  }',
    '',
    `  .animate-fade-in { animation: fadeIn ${fadeInDuration} ${revealEase}; }`,
    `  .animate-slide-up { animation: slideUp ${slideUpDuration} ${revealEase}; }`,
    `  .animate-slide-down { animation: slideDown ${slideDownDuration} ${revealEase}; }`,
    `  .animate-scale-in { animation: scaleIn ${scaleInDuration} ${revealEase}; }`,
    '',
    '  .stagger-1 { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }',
    '  .stagger-2 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }',
    '  .stagger-3 { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }',
    '  .stagger-4 { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }',
    '  .stagger-5 { animation-delay: 0.5s; opacity: 0; animation-fill-mode: forwards; }',
    '  .stagger-6 { animation-delay: 0.6s; opacity: 0; animation-fill-mode: forwards; }',
    '',
    tagUtilities,
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  .animate-fade-in,',
    '  .animate-slide-up,',
    '  .animate-slide-down,',
    '  .animate-scale-in,',
    '  .stagger-1,',
    '  .stagger-2,',
    '  .stagger-3,',
    '  .stagger-4,',
    '  .stagger-5,',
    '  .stagger-6 {',
    '    animation: none !important;',
    '    opacity: 1 !important;',
    '    transform: none !important;',
    '  }',
    '',
    '  .card-hover:hover,',
    '  .floating-button:hover {',
    '    transform: none !important;',
    '  }',
    '}',
    '',
  ].join('\n');
}

function buildColorEntry(key: string): string {
  const kebab = toKebabCase(key);
  const foregroundKey = `${kebab}-foreground`;
  return [
    `    ${JSON.stringify(kebab)}: {`,
    `      DEFAULT: "hsl(var(--${kebab}))",`,
    `      foreground: "hsl(var(--${foregroundKey}))",`,
    '    },',
  ].join('\n');
}

function buildTailwindExtend(schema: BrandOsSchema): string {
  const baseColorKeys = [
    'border',
    'input',
    'ring',
    'background',
    'foreground',
  ];

  const semanticColorKeys = [
    'primary',
    'secondary',
    'accent',
    'muted',
    'card',
    'popover',
    'destructive',
    'success',
    'warning',
    'info',
    'promo',
  ];

  const colorLines: string[] = [];
  for (const key of baseColorKeys) {
    colorLines.push(`    ${JSON.stringify(key)}: "hsl(var(--${key}))",`);
  }
  for (const key of semanticColorKeys) {
    colorLines.push(buildColorEntry(key));
  }
  if (schema.tokens.color.categories) {
    for (const key of Object.keys(schema.tokens.color.categories)) {
      const kebab = toKebabCase(key);
      colorLines.push(`    ${JSON.stringify(kebab)}: "hsl(var(--${kebab}))",`);
    }
  }
  if (schema.tokens.color.charts) {
    for (const key of Object.keys(schema.tokens.color.charts)) {
      colorLines.push(`    ${JSON.stringify(`chart-${key}`)}: "hsl(var(--chart-${key}))",`);
    }
  }

  const radiusLines = Object.keys(schema.tokens.radius)
    .map((key) => `    ${JSON.stringify(key)}: "var(--radius-${toKebabCase(key)})",`)
    .join('\n');

  const shadowLines = Object.entries(schema.tokens.shadow)
    .map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`)
    .join('\n');

  const fontLines = Object.entries(schema.tokens.typography.families)
    .map(([key, value]) => {
      const families = value.split(',').map((entry) => entry.trim()).filter(Boolean);
      const arrayLiteral = `[${families.map((family) => JSON.stringify(family)).join(', ')}]`;
      return `    ${JSON.stringify(key)}: ${arrayLiteral},`;
    })
    .join('\n');

  return [
    '/* Generated by ui8px brand OS emitter. */',
    'export const techBrandTailwindExtend = {',
    '  fontFamily: {',
    fontLines,
    '  },',
    '  colors: {',
    colorLines.join('\n'),
    '  },',
    '  borderRadius: {',
    radiusLines,
    '  },',
    '  boxShadow: {',
    shadowLines,
    '  },',
    '  keyframes: {',
    '    fadeIn: {',
    '      from: { opacity: "0" },',
    '      to: { opacity: "1" },',
    '    },',
    '    slideUp: {',
    '      from: { opacity: "0", transform: "translateY(20px)" },',
    '      to: { opacity: "1", transform: "translateY(0)" },',
    '    },',
    '    slideDown: {',
    '      from: { opacity: "0", transform: "translateY(-20px)" },',
    '      to: { opacity: "1", transform: "translateY(0)" },',
    '    },',
    '    scaleIn: {',
    '      from: { opacity: "0", transform: "scale(0.95)" },',
    '      to: { opacity: "1", transform: "scale(1)" },',
    '    },',
    '  },',
    '  animation: {',
    '    "fade-in": "fadeIn 0.5s ease-out",',
    '    "slide-up": "slideUp 0.6s ease-out",',
    '    "slide-down": "slideDown 0.6s ease-out",',
    '    "scale-in": "scaleIn 0.5s ease-out",',
    '  },',
    '} as const;',
    '',
    'export default techBrandTailwindExtend;',
    '',
  ].join('\n');
}

function buildBrandReadme(schema: BrandOsSchema, promptPack: PromptPack): string {
  const thesis = schema.brandThesis;

  return [
    '# Tech Brand OS Generated Kit',
    '',
    'This directory was generated from the machine-readable Tech Brand OS source files.',
    '',
    '## Included',
    '- `theme.css`: generated CSS variables and brand utility recipes',
    '- `tailwind.extend.ts`: Tailwind extension object derived from brand tokens',
    '- `prompts/`: five isolated prompt files for landing, blog, cms, dashboard, and docs',
    '- `parser-fixtures/`: parser contract fixtures derived from the reference project',
    '',
    '## Brand Summary',
    thesis?.summary ?? promptPack.sharedContext.brandSummary,
    '',
    '## Personality',
    formatBulletList(thesis?.personality),
    '',
    '## Anti-Personality',
    formatBulletList(thesis?.antiPersonality),
    '',
    '## Usage',
    '1. Attach `tech-brand-os.schema.json` as the source-of-truth brand contract.',
    '2. Use one file from `prompts/` as the isolated surface prompt.',
    '3. If you need parser-friendly HTML/Tailwind output, validate against `tech-brand-os-parser-contract.json` and the emitted fixture set.',
    '4. Use `theme.css` and `tailwind.extend.ts` as generated adapters, not as the canonical source of truth.',
    '',
  ].join('\n');
}

function buildPromptMarkdown(
  surfaceName: string,
  surface: PromptPackSurface,
  promptPack: PromptPack,
  schema: BrandOsSchema,
): string {
  const brandSummary = promptPack.sharedContext.brandSummary;
  const styleKeywords = formatBulletList(promptPack.sharedContext.styleKeywords);
  const negativeKeywords = formatBulletList(promptPack.sharedContext.negativeStyleKeywords);
  const crossRules = formatBulletList(promptPack.sharedContext.crossSurfaceRules);
  const implementationTarget = promptPack.sharedContext.implementationBias?.preferredStack ?? 'Next.js + shadcn/ui + Tailwind CSS';
  const requiredInputs = formatBulletList(surface.requiredInputs.map((item) => `${item}: {{${item}}}`));
  const optionalInputs = formatBulletList((surface.optionalInputs ?? []).map((item) => `${item}: {{${item}}}`));
  const sectionExpectations = formatBulletList(surface.sectionExpectations);
  const surfaceOverrides = formatBulletList(surface.surfaceOverrides);
  const deliverables = formatBulletList(surface.deliverables);
  const auditChecklist = formatBulletList([...(surface.auditChecklist ?? []), ...(promptPack.auditPromptAddendum ?? [])]);
  const pageRecipe = schema.recipes?.pageArchetypes?.[surfaceName];
  const pageRecipeLines = pageRecipe
    ? [
        `Suggested page purpose: ${pageRecipe.purpose ?? surface.goal}`,
        `Suggested required sections: ${(pageRecipe.requiredSections ?? []).join(', ') || 'Use surface expectations.'}`,
      ]
    : [];

  const promptBodyLines = [
    `Design a ${surfaceName} surface in the Tech Brand OS style.`,
    '',
    'Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.',
    '',
    `Brand summary: ${brandSummary}`,
    `Surface goal: ${surface.goal}`,
    '',
    'Style keywords:',
    ...(promptPack.sharedContext.styleKeywords ?? []).map((item) => `- ${item}`),
    '',
    'Avoid:',
    ...(promptPack.sharedContext.negativeStyleKeywords ?? []).map((item) => `- ${item}`),
    '',
    'Cross-surface rules:',
    ...(promptPack.sharedContext.crossSurfaceRules ?? []).map((item) => `- ${item}`),
    '',
    'Surface-specific overrides:',
    ...(surface.surfaceOverrides ?? []).map((item) => `- ${item}`),
    '',
    'Implementation target:',
    `- ${implementationTarget}`,
    '',
    'Required inputs:',
    ...surface.requiredInputs.map((item) => `- ${item}: {{${item}}}`),
    '',
    'Optional inputs:',
    ...((surface.optionalInputs ?? []).length > 0
      ? (surface.optionalInputs ?? []).map((item) => `- ${item}: {{${item}}}`)
      : ['- None.']),
    '',
    'Expected sections:',
    ...((surface.sectionExpectations ?? []).length > 0
      ? (surface.sectionExpectations ?? []).map((item) => `- ${item}`)
      : ['- None specified.']),
    '',
    'Deliverables:',
    ...((surface.deliverables ?? []).length > 0
      ? (surface.deliverables ?? []).map((item) => `- ${item}`)
      : ['- Final implementation.']),
    '',
    ...pageRecipeLines,
    ...(pageRecipeLines.length > 0 ? [''] : []),
    'Now follow this working sequence:',
    '1. Read the audience and product goal.',
    '2. Define the information architecture and section order.',
    '3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.',
    '4. Decide what stays standard shadcn, what should be wrapped, and what should become a custom block.',
    '5. Generate the requested implementation in a coherent Tech Brand OS style.',
    '',
    'Reference prompt instructions:',
    ...surface.promptTemplate.map((line) => `- ${line}`),
    '',
    'Audit before finishing:',
    ...[...(surface.auditChecklist ?? []), ...(promptPack.auditPromptAddendum ?? [])].map((item) => `- ${item}`),
  ];

  return [
    `# Tech Brand OS ${toTitleCase(surfaceName)} Prompt`,
    '',
    'Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.',
    '',
    '## Attach',
    '- `tech-brand-os.schema.json`',
    '- Optionally attach `theme.css` and `tailwind.extend.ts` if the implementation target needs concrete adapters.',
    '',
    '## Required Inputs',
    requiredInputs,
    '',
    '## Optional Inputs',
    optionalInputs,
    '',
    '## Surface Goal',
    surface.goal,
    '',
    '## Brand Summary',
    brandSummary,
    '',
    '## Style Keywords',
    styleKeywords,
    '',
    '## Negative Style Keywords',
    negativeKeywords,
    '',
    '## Cross-Surface Rules',
    crossRules,
    '',
    '## Section Expectations',
    sectionExpectations,
    '',
    '## Surface Overrides',
    surfaceOverrides,
    '',
    '## Deliverables',
    deliverables,
    '',
    '## Audit Checklist',
    auditChecklist,
    '',
    '## Copy-Ready Prompt',
    '```text',
    ...promptBodyLines,
    '```',
    '',
  ].join('\n');
}

function buildPromptIndex(promptPack: PromptPack): string {
  const surfaceNames = Object.keys(promptPack.surfaces);
  return [
    '# Tech Brand OS Prompt Index',
    '',
    'These files are isolated prompts for starting surface-specific application work with the Tech Brand OS attached as the source-of-truth brand contract.',
    '',
    ...surfaceNames.map((surface) => `- \`${surface}.md\` — ${promptPack.surfaces[surface].goal}`),
    '',
  ].join('\n');
}

function buildFixtureReadme(fixtures: ParserFixture[]): string {
  return [
    '# Tech Brand OS Parser Fixtures',
    '',
    'These fixtures are derived from the `tech-blog-rounded-main` reference and are intended to validate how a parser splits classes into structural, semantic, decorative, and unknown buckets.',
    '',
    '## How To Use',
    '1. Read a fixture file from this directory.',
    '2. Classify each class according to `tech-brand-os-parser-contract.json`.',
    '3. Compare the parser result to the `expected` buckets.',
    '4. Emit warnings for any mismatches or unknown classes.',
    '',
    '## Fixture Count',
    `- ${fixtures.length} fixture(s)`,
    '',
    '## Coverage',
    '- container shells',
    '- hero shells',
    '- gradient overlays',
    '- named brand utilities such as `pill-nav` and `floating-button`',
    '- motion utilities',
    '',
  ].join('\n');
}

function buildManifest(outputDir: string, promptPack: PromptPack, fixtures: ParserFixture[]): string {
  return `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      outputDir,
      files: {
        themeCss: 'theme.css',
        tailwindExtend: 'tailwind.extend.ts',
        promptCount: Object.keys(promptPack.surfaces).length,
        prompts: Object.keys(promptPack.surfaces).map((surface) => `prompts/${surface}.md`),
        fixtureCount: fixtures.length,
        fixtureIndex: 'parser-fixtures/index.json',
      },
    },
    null,
    2,
  )}\n`;
}

function emitParserFixtures(outputDir: string, source: ParserFixtureSource): ParserFixture[] {
  const fixturesDir = join(outputDir, 'parser-fixtures');
  ensureDir(fixturesDir);

  writeTextFile(join(fixturesDir, 'index.json'), `${JSON.stringify(source, null, 2)}\n`);
  for (const fixture of source.fixtures) {
    writeTextFile(join(fixturesDir, `${fixture.id}.json`), `${JSON.stringify(fixture, null, 2)}\n`);
  }
  writeTextFile(join(fixturesDir, 'README.md'), buildFixtureReadme(source.fixtures));
  return source.fixtures;
}

function emitPrompts(outputDir: string, promptPack: PromptPack, schema: BrandOsSchema): void {
  const promptsDir = join(outputDir, 'prompts');
  ensureDir(promptsDir);

  for (const [surfaceName, surface] of Object.entries(promptPack.surfaces)) {
    writeTextFile(join(promptsDir, `${surfaceName}.md`), buildPromptMarkdown(surfaceName, surface, promptPack, schema));
  }

  writeTextFile(join(promptsDir, 'README.md'), buildPromptIndex(promptPack));
}

export async function runBrandOs(args: BrandOsCliArgs): Promise<void> {
  const schemaPath = resolve(process.cwd(), args.schema);
  if (!existsSync(schemaPath)) {
    fail(`Brand schema "${schemaPath}" was not found.`);
  }

  const promptPackPath = resolveCompanionPath(schemaPath, args.promptPack, 'tech-brand-os-prompt-pack.json');
  const parserContractPath = resolveCompanionPath(schemaPath, args.parserContract, 'tech-brand-os-parser-contract.json');
  const fixturesPath = resolveCompanionPath(schemaPath, args.fixtures, 'tech-brand-os-parser-fixtures.source.json');
  const emitDir = resolveEmitDir(schemaPath, args.emitDir);

  const schema = readJsonFile<BrandOsSchema>(schemaPath);
  const promptPack = readJsonFile<PromptPack>(promptPackPath);
  const parserContract = readJsonFile<Record<string, unknown>>(parserContractPath);
  const fixtureSource = existsSync(fixturesPath)
    ? readJsonFile<ParserFixtureSource>(fixturesPath)
    : { schemaVersion: '1.0.0', brandId: 'tech-brand-os', fixtures: [] };

  ensureDir(emitDir);
  writeTextFile(join(emitDir, 'theme.css'), buildThemeCss(schema));
  writeTextFile(join(emitDir, 'tailwind.extend.ts'), buildTailwindExtend(schema));
  writeTextFile(join(emitDir, 'README.md'), buildBrandReadme(schema, promptPack));
  writeTextFile(join(emitDir, 'parser-contract.json'), `${JSON.stringify(parserContract, null, 2)}\n`);
  emitPrompts(emitDir, promptPack, schema);
  const emittedFixtures = emitParserFixtures(emitDir, fixtureSource);
  writeTextFile(join(emitDir, 'manifest.json'), buildManifest(emitDir, promptPack, emittedFixtures));

  console.log(`Brand OS emitted to: ${emitDir}`);
  console.log(`- theme.css`);
  console.log(`- tailwind.extend.ts`);
  console.log(`- prompts/${Object.keys(promptPack.surfaces).length} surface prompt(s)`);
  console.log(`- parser-fixtures/${emittedFixtures.length} fixture(s)`);
  if (args.verbose) {
    console.log(`Schema: ${schemaPath}`);
    console.log(`Prompt pack: ${promptPackPath}`);
    console.log(`Parser contract: ${parserContractPath}`);
    console.log(`Fixtures: ${fixturesPath}`);
  }
}

export function printBrandOsUsage(): string {
  return [
    'Usage:',
    '  npx ui8px --brand-os <schema-path> [options]',
    '',
    'Options:',
    '  --brand-os <path>         brand OS schema path (required)',
    '  --prompt-pack <path>      prompt pack JSON path',
    '  --parser-contract <path>  parser contract JSON path',
    '  --fixtures <path>         parser fixture source JSON path',
    '  --emit-dir <path>         output directory for generated artifacts',
    '  --verbose                 print resolved input paths',
    '  -h, --help                show help',
    '',
    'Examples:',
    '  npx ui8px --brand-os .project/tech-brand-os.schema.json',
    '  npx ui8px --brand-os .project/tech-brand-os.schema.json --emit-dir .project/tech-brand-os-generated --verbose',
  ].join('\n');
}
