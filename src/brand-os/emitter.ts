import { join } from 'node:path';
import {
  AliasColorToken,
  BrandOsAnimationKeyframes,
  BrandOsAnimationUtility,
  BrandOsCategoryUtilityConfig,
  BrandOsResolvedPaths,
  BrandOsSchema,
  ParserFixture,
  ParserFixtureSource,
  PromptPack,
  PromptPackSurface,
  StringMap,
} from './types.js';
import {
  ensureDir,
  formatBulletList,
  formatCssDeclarations,
  toCamelCase,
  toKebabCase,
  toTitleCase,
  writeTextFile,
} from './utils.js';

function formatTokenVars(tokens: StringMap): string {
  return Object.entries(tokens)
    .map(([key, value]) => `    --${toKebabCase(key)}: ${value};`)
    .join('\n');
}

function buildCategoryVars(categories: Record<string, AliasColorToken> | undefined, mode: 'light' | 'dark'): string {
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

function getCategoryAliases(token: AliasColorToken, config: BrandOsCategoryUtilityConfig): string[] {
  const aliasFields = config.aliasFields ?? ['aliases', 'referenceAliases'];
  const aliases = new Set<string>();

  for (const field of aliasFields) {
    for (const alias of token[field] ?? []) {
      aliases.add(alias);
    }
  }

  return [...aliases];
}

function buildCategoryUtilityClasses(
  categories: Record<string, AliasColorToken> | undefined,
  config: BrandOsCategoryUtilityConfig | undefined,
): string {
  if (!categories) {
    return '';
  }

  const normalizedConfig: Required<BrandOsCategoryUtilityConfig> = {
    enabled: config?.enabled ?? true,
    classPrefix: config?.classPrefix ?? 'tag',
    textColor: config?.textColor ?? 'hsl(var(--primary))',
    includeCanonicalTokenClass: config?.includeCanonicalTokenClass ?? true,
    aliasFields: config?.aliasFields ?? ['aliases', 'referenceAliases'],
  };

  if (!normalizedConfig.enabled) {
    return '';
  }

  const lines: string[] = [];

  for (const [key, value] of Object.entries(categories)) {
    const cssVar = `--${toKebabCase(key)}`;
    const classNames = new Set<string>();

    if (normalizedConfig.includeCanonicalTokenClass) {
      classNames.add(`${normalizedConfig.classPrefix}-${toKebabCase(key)}`);
    }

    for (const alias of getCategoryAliases(value, normalizedConfig)) {
      classNames.add(`${normalizedConfig.classPrefix}-${toKebabCase(alias)}`);
    }

    for (const className of classNames) {
      lines.push(`  .${className} {`);
      lines.push(`    background-color: hsl(var(${cssVar}));`);
      lines.push(`    color: ${normalizedConfig.textColor};`);
      lines.push('  }');
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}

function buildUtilityRecipes(schema: BrandOsSchema): string {
  const recipes = schema.emit?.theme?.utilityRecipes ?? [];
  const lines: string[] = [];

  for (const recipe of recipes) {
    lines.push(`  .${recipe.className} {`);
    lines.push(...formatCssDeclarations(recipe.declarations));
    lines.push('  }');
    lines.push('');

    for (const [pseudo, declarations] of Object.entries(recipe.pseudoDeclarations ?? {})) {
      lines.push(`  .${recipe.className}:${pseudo} {`);
      lines.push(...formatCssDeclarations(declarations));
      lines.push('  }');
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}

function buildKeyframeBlock(name: string, keyframes: BrandOsAnimationKeyframes): string[] {
  const lines = [`  @keyframes ${name} {`];

  for (const [step, declarations] of Object.entries(keyframes)) {
    lines.push(`    ${step} {`);
    lines.push(...formatCssDeclarations(declarations, '      '));
    lines.push('    }');
  }

  lines.push('  }');
  lines.push('');
  return lines;
}

function buildAnimationBlocks(schema: BrandOsSchema): string {
  const themeConfig = schema.emit?.theme;
  const keyframes = themeConfig?.keyframes ?? {};
  const utilities = themeConfig?.animationUtilities ?? [];
  const stagger = themeConfig?.staggerUtilities;
  const lines: string[] = [];

  for (const [name, definition] of Object.entries(keyframes)) {
    lines.push(...buildKeyframeBlock(name, definition));
  }

  for (const utility of utilities) {
    lines.push(`  .${utility.className} { animation: ${utility.animation}; }`);
  }

  if (utilities.length > 0) {
    lines.push('');
  }

  if (stagger) {
    const declarations = stagger.declarations ?? {
      opacity: '0',
      'animation-fill-mode': 'forwards',
    };
    const classPrefix = stagger.classPrefix ?? 'stagger';

    stagger.delays.forEach((delay, index) => {
      lines.push(`  .${classPrefix}-${index + 1} {`);
      lines.push(`    animation-delay: ${delay};`);
      lines.push(...formatCssDeclarations(declarations));
      lines.push('  }');
    });
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function buildReducedMotionBlock(schema: BrandOsSchema): string {
  const themeConfig = schema.emit?.theme;
  const animationSelectors = (themeConfig?.animationUtilities ?? [])
    .filter((utility) => utility.reducedMotion !== false)
    .map((utility) => `.${utility.className}`);

  const stagger = themeConfig?.staggerUtilities;
  if (stagger && stagger.reducedMotion !== false) {
    const classPrefix = stagger.classPrefix ?? 'stagger';
    stagger.delays.forEach((_, index) => {
      animationSelectors.push(`.${classPrefix}-${index + 1}`);
    });
  }

  const extraSelectors = themeConfig?.reducedMotion?.extraSelectors ?? [];
  const allSelectors = [...animationSelectors, ...extraSelectors];

  if (allSelectors.length === 0) {
    return '';
  }

  const resetDeclarations = themeConfig?.reducedMotion?.resetDeclarations ?? {
    animation: 'none !important',
    opacity: '1 !important',
    transform: 'none !important',
  };

  const lines = [
    '@media (prefers-reduced-motion: reduce) {',
    `  ${allSelectors.join(',\n  ')} {`,
    ...formatCssDeclarations(resetDeclarations),
    '  }',
    '}',
  ];

  return lines.join('\n');
}

function buildThemeCss(schema: BrandOsSchema, schemaFileName: string): string {
  const lightColors = formatTokenVars(schema.tokens.color.light);
  const darkColors = formatTokenVars(schema.tokens.color.dark);
  const lightCategories = buildCategoryVars(schema.tokens.color.categories, 'light');
  const darkCategories = buildCategoryVars(schema.tokens.color.categories, 'dark');
  const charts = buildChartVars(schema.tokens.color.charts);
  const radiusVars = buildRadiusVars(schema.tokens.radius);
  const radiusDefault = schema.tokens.radius.lg ?? schema.tokens.radius.md ?? '1rem';
  const themeConfig = schema.emit?.theme;
  const bodyFontKey = themeConfig?.bodyFontFamilyKey ?? 'ui';
  const headingFontKey = themeConfig?.headingFontFamilyKey ?? 'display';
  const bodyFontFamily = schema.tokens.typography.families[bodyFontKey] ?? schema.tokens.typography.families.ui ?? 'system-ui, sans-serif';
  const headingFontFamily = schema.tokens.typography.families[headingFontKey] ?? bodyFontFamily;
  const headingSelectors = themeConfig?.headingSelectors ?? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const headingLetterSpacing = themeConfig?.headingLetterSpacing ?? '-0.02em';
  const bodyApplyClasses = themeConfig?.bodyApplyClasses ?? ['bg-background', 'text-foreground', 'antialiased'];
  const utilityRecipeBlocks = buildUtilityRecipes(schema);
  const animationBlocks = buildAnimationBlocks(schema);
  const categoryUtilityBlocks = buildCategoryUtilityClasses(schema.tokens.color.categories, themeConfig?.categoryUtilities);
  const reducedMotionBlock = buildReducedMotionBlock(schema);

  const utilityBlocks = [utilityRecipeBlocks, animationBlocks, categoryUtilityBlocks]
    .filter((block) => block.trim().length > 0)
    .join('\n\n');

  const themeLines = [
    '/* Generated by ui8px brand OS emitter. */',
    `/* Source of truth: ${schemaFileName} */`,
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
    `    @apply ${bodyApplyClasses.join(' ')};`,
    `    font-family: ${bodyFontFamily};`,
    '  }',
    '',
    `  ${headingSelectors.join(',\n  ')} {`,
    `    font-family: ${headingFontFamily};`,
    `    letter-spacing: ${headingLetterSpacing};`,
    '  }',
    '}',
  ];

  if (utilityBlocks.trim().length > 0) {
    themeLines.push('', '@layer utilities {', utilityBlocks, '}');
  }

  if (reducedMotionBlock) {
    themeLines.push('', reducedMotionBlock);
  }

  themeLines.push('');
  return themeLines.join('\n');
}

function buildNamedColorLines(schema: BrandOsSchema): string[] {
  const lightColors = schema.tokens.color.light;
  const darkColors = schema.tokens.color.dark;
  const namedKeys = Object.keys(lightColors).filter((key) => !key.endsWith('-foreground'));

  const lines: string[] = [];
  for (const key of namedKeys) {
    const kebab = toKebabCase(key);
    const foregroundKey = `${key}-foreground`;
    const hasForeground = foregroundKey in lightColors || foregroundKey in darkColors;

    if (hasForeground) {
      lines.push(`    ${JSON.stringify(kebab)}: {`);
      lines.push(`      DEFAULT: "hsl(var(--${kebab}))",`);
      lines.push(`      foreground: "hsl(var(--${toKebabCase(foregroundKey)}))",`);
      lines.push('    },');
      continue;
    }

    lines.push(`    ${JSON.stringify(kebab)}: "hsl(var(--${kebab}))",`);
  }

  if (schema.tokens.color.categories) {
    for (const key of Object.keys(schema.tokens.color.categories)) {
      const kebab = toKebabCase(key);
      lines.push(`    ${JSON.stringify(kebab)}: "hsl(var(--${kebab}))",`);
    }
  }

  if (schema.tokens.color.charts) {
    for (const key of Object.keys(schema.tokens.color.charts)) {
      lines.push(`    ${JSON.stringify(`chart-${key}`)}: "hsl(var(--chart-${key}))",`);
    }
  }

  return lines;
}

function buildTailwindExtend(schema: BrandOsSchema): string {
  const exportName = schema.emit?.tailwind?.exportName ?? `${toCamelCase(schema.meta.name)}TailwindExtend`;
  const colorLines = buildNamedColorLines(schema);
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

  const includeAnimationUtilities = schema.emit?.tailwind?.includeAnimationUtilities !== false;
  const keyframes = schema.emit?.theme?.keyframes ?? {};
  const animationUtilities = schema.emit?.theme?.animationUtilities ?? [];
  const keyframeLines: string[] = [];
  const animationLines: string[] = [];

  if (includeAnimationUtilities) {
    for (const [name, definition] of Object.entries(keyframes)) {
      keyframeLines.push(`    ${name}: {`);
      for (const [step, declarations] of Object.entries(definition)) {
        const inline = Object.entries(declarations)
          .map(([property, value]) => `${property}: ${JSON.stringify(value)}`)
          .join(', ');
        keyframeLines.push(`      ${step}: { ${inline} },`);
      }
      keyframeLines.push('    },');
    }

    for (const utility of animationUtilities) {
      const animationName = utility.className.replace(/^animate-/, '');
      animationLines.push(`    ${JSON.stringify(animationName)}: ${JSON.stringify(utility.animation)},`);
    }
  }

  const lines = [
    '/* Generated by ui8px brand OS emitter. */',
    `export const ${exportName} = {`,
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
  ];

  if (includeAnimationUtilities && keyframeLines.length > 0) {
    lines.push('  keyframes: {', keyframeLines.join('\n'), '  },');
  }

  if (includeAnimationUtilities && animationLines.length > 0) {
    lines.push('  animation: {', animationLines.join('\n'), '  },');
  }

  lines.push(`} as const;`, '', `export default ${exportName};`, '');
  return lines.join('\n');
}

function buildBrandReadme(schema: BrandOsSchema, promptPack: PromptPack): string {
  const docsConfig = schema.emit?.docs;
  const thesis = schema.brandThesis;
  const generatedKitTitle = docsConfig?.generatedKitTitle ?? `${schema.meta.name} Generated Kit`;

  return [
    `# ${generatedKitTitle}`,
    '',
    'This directory was generated from the machine-readable brand operating system source files.',
    '',
    '## Included',
    '- `theme.css`: generated CSS variables and brand utility recipes',
    '- `tailwind.extend.ts`: Tailwind extension object derived from brand tokens',
    `- \`prompts/\`: ${Object.keys(promptPack.surfaces).length} isolated surface prompt files`,
    '- `parser-fixtures/`: parser contract fixtures derived from the reference input set',
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
    '1. Attach the schema file as the source-of-truth brand contract.',
    '2. Use one file from `prompts/` as the isolated surface prompt.',
    '3. If you need parser-friendly HTML/Tailwind output, validate against the parser contract and the emitted fixture set.',
    '4. Use `theme.css` and `tailwind.extend.ts` as generated adapters, not as the canonical source of truth.',
    '',
  ].join('\n');
}

function buildPromptMarkdown(
  surfaceName: string,
  surface: PromptPackSurface,
  promptPack: PromptPack,
  schema: BrandOsSchema,
  schemaFileName: string,
): string {
  const docsConfig = schema.emit?.docs;
  const brandLabel = docsConfig?.promptTitlePrefix ?? schema.meta.name;
  const promptIntro = docsConfig?.promptIntro ?? `Use this file as the isolated surface prompt when you want to start building directly with the ${brandLabel}.`;
  const attachFiles = docsConfig?.promptAttachFiles ?? [schemaFileName];
  const brandSummary = promptPack.sharedContext.brandSummary;
  const styleKeywords = formatBulletList(promptPack.sharedContext.styleKeywords);
  const negativeKeywords = formatBulletList(promptPack.sharedContext.negativeStyleKeywords);
  const crossRules = formatBulletList(promptPack.sharedContext.crossSurfaceRules);
  const implementationTarget = promptPack.sharedContext.implementationBias?.preferredStack ?? 'the target implementation stack';
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
    `Design a ${surfaceName} surface in the ${brandLabel} style.`,
    '',
    `Treat \`${schemaFileName}\` as the source-of-truth brand contract.`,
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
    '4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.',
    '5. Generate the requested implementation in a coherent brand system style.',
    '',
    'Reference prompt instructions:',
    ...surface.promptTemplate.map((line) => `- ${line}`),
    '',
    'Audit before finishing:',
    ...[...(surface.auditChecklist ?? []), ...(promptPack.auditPromptAddendum ?? [])].map((item) => `- ${item}`),
  ];

  return [
    `# ${brandLabel} ${toTitleCase(surfaceName)} Prompt`,
    '',
    promptIntro,
    '',
    '## Attach',
    ...attachFiles.map((fileName) => `- \`${fileName}\``),
    '- Optionally attach generated adapters such as `theme.css` and `tailwind.extend.ts` if the implementation target needs them.',
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

function buildPromptIndex(promptPack: PromptPack, schema: BrandOsSchema): string {
  const surfaceNames = Object.keys(promptPack.surfaces);
  return [
    `# ${schema.meta.name} Prompt Index`,
    '',
    'These files are isolated prompts for starting surface-specific application work with the brand schema attached as the source-of-truth contract.',
    '',
    ...surfaceNames.map((surface) => `- \`${surface}.md\` — ${promptPack.surfaces[surface].goal}`),
    '',
  ].join('\n');
}

function buildFixtureReadme(fixtures: ParserFixture[], fixtureSource: ParserFixtureSource, schema: BrandOsSchema): string {
  const docsConfig = schema.emit?.docs;
  const title = docsConfig?.parserFixtureTitle ?? `${schema.meta.name} Parser Fixtures`;
  const referenceName = docsConfig?.parserFixtureReference ?? fixtureSource.referenceProjectName ?? 'the reference input set';

  return [
    `# ${title}`,
    '',
    `These fixtures are derived from ${referenceName} and are intended to validate how a parser splits classes into structural, semantic, decorative, and unknown buckets.`,
    '',
    '## How To Use',
    '1. Read a fixture file from this directory.',
    '2. Classify each class according to the parser contract.',
    '3. Compare the parser result to the `expected` buckets.',
    '4. Emit warnings for any mismatches or unknown classes.',
    '',
    '## Fixture Count',
    `- ${fixtures.length} fixture(s)`,
    '',
  ].join('\n');
}

function buildManifest(outputDir: string, promptPack: PromptPack, fixtures: ParserFixture[], schema: BrandOsSchema): string {
  return `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      brandName: schema.meta.name,
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

function emitParserFixtures(outputDir: string, source: ParserFixtureSource, schema: BrandOsSchema): ParserFixture[] {
  const fixturesDir = join(outputDir, 'parser-fixtures');
  ensureDir(fixturesDir);

  writeTextFile(join(fixturesDir, 'index.json'), `${JSON.stringify(source, null, 2)}\n`);
  for (const fixture of source.fixtures) {
    writeTextFile(join(fixturesDir, `${fixture.id}.json`), `${JSON.stringify(fixture, null, 2)}\n`);
  }
  writeTextFile(join(fixturesDir, 'README.md'), buildFixtureReadme(source.fixtures, source, schema));
  return source.fixtures;
}

function emitPrompts(outputDir: string, promptPack: PromptPack, schema: BrandOsSchema, schemaFileName: string): void {
  const promptsDir = join(outputDir, 'prompts');
  ensureDir(promptsDir);

  for (const [surfaceName, surface] of Object.entries(promptPack.surfaces)) {
    writeTextFile(join(promptsDir, `${surfaceName}.md`), buildPromptMarkdown(surfaceName, surface, promptPack, schema, schemaFileName));
  }

  writeTextFile(join(promptsDir, 'README.md'), buildPromptIndex(promptPack, schema));
}

export function emitBrandOsArtifacts(
  paths: BrandOsResolvedPaths,
  schema: BrandOsSchema,
  promptPack: PromptPack,
  parserContract: Record<string, unknown>,
  fixtureSource: ParserFixtureSource,
): { promptCount: number; fixtureCount: number } {
  ensureDir(paths.emitDir);
  writeTextFile(join(paths.emitDir, 'theme.css'), buildThemeCss(schema, paths.schemaFileName));
  writeTextFile(join(paths.emitDir, 'tailwind.extend.ts'), buildTailwindExtend(schema));
  writeTextFile(join(paths.emitDir, 'README.md'), buildBrandReadme(schema, promptPack));
  writeTextFile(join(paths.emitDir, 'parser-contract.json'), `${JSON.stringify(parserContract, null, 2)}\n`);
  emitPrompts(paths.emitDir, promptPack, schema, paths.schemaFileName);
  const emittedFixtures = emitParserFixtures(paths.emitDir, fixtureSource, schema);
  writeTextFile(join(paths.emitDir, 'manifest.json'), buildManifest(paths.emitDir, promptPack, emittedFixtures, schema));

  return {
    promptCount: Object.keys(promptPack.surfaces).length,
    fixtureCount: emittedFixtures.length,
  };
}
