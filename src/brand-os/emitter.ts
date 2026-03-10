import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { BrandOsCopiedAsset, BrandOsResolvedPaths, BrandOsSchema, ParserFixture, ParserFixtureSource, PromptPack, PromptPackSurface } from './types.js';
import { copyPath, ensureDir, fail, formatBulletList, resolveRelativeToSchemaDir, toTitleCase, writeTextFile } from './utils.js';

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
    '- Optionally attach any copied adapter assets from this generated kit that match the target stack.',
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

function copyAdapterAssets(paths: BrandOsResolvedPaths, schema: BrandOsSchema): string[] {
  const assets = schema.emit?.assets ?? [];
  const copiedOutputs: string[] = [];

  for (const asset of assets) {
    const sourcePath = resolveRelativeToSchemaDir(paths.schemaPath, asset.source);
    if (!existsSync(sourcePath)) {
      fail(`Adapter asset "${asset.source}" was not found relative to the schema.`);
    }

    const destinationPath = join(paths.emitDir, asset.output);
    copyPath(sourcePath, destinationPath);
    copiedOutputs.push(asset.output.replace(/\\/g, '/'));
  }

  return copiedOutputs;
}

function buildAssetList(assets: BrandOsCopiedAsset[] | undefined): string {
  if (!assets || assets.length === 0) {
    return '- None.';
  }

  return assets
    .map((asset) => `- \`${asset.output}\`${asset.description ? ` — ${asset.description}` : ''}`)
    .join('\n');
}

function buildBrandReadme(schema: BrandOsSchema, promptPack: PromptPack, copiedAssets: string[]): string {
  const docsConfig = schema.emit?.docs;
  const thesis = schema.brandThesis;
  const generatedKitTitle = docsConfig?.generatedKitTitle ?? `${schema.meta.name} Generated Kit`;

  return [
    `# ${generatedKitTitle}`,
    '',
    'This directory was generated from the machine-readable brand operating system source files.',
    '',
    '## Included',
    `- \`prompts/\`: ${Object.keys(promptPack.surfaces).length} isolated surface prompt files`,
    '- `parser-fixtures/`: parser contract fixtures derived from the reference input set',
    '- `parser-contract.json`: copied parser contract snapshot',
    copiedAssets.length > 0 ? `- adapter assets copied from the brand package: ${copiedAssets.length}` : '- no adapter assets were configured for copying',
    '',
    '## Adapter Assets',
    buildAssetList(schema.emit?.assets),
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
    '4. Use the copied adapter assets only for the stacks they were authored for. The CLI does not assume Tailwind version or CSS adapter strategy.',
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

function buildManifest(outputDir: string, promptPack: PromptPack, fixtures: ParserFixture[], schema: BrandOsSchema, copiedAssets: string[]): string {
  return `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      brandName: schema.meta.name,
      outputDir,
      files: {
        promptCount: Object.keys(promptPack.surfaces).length,
        prompts: Object.keys(promptPack.surfaces).map((surface) => `prompts/${surface}.md`),
        fixtureCount: fixtures.length,
        fixtureIndex: 'parser-fixtures/index.json',
        copiedAssets,
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
): { promptCount: number; fixtureCount: number; copiedAssetCount: number } {
  ensureDir(paths.emitDir);
  for (const legacyFile of ['theme.css', 'tailwind.extend.ts']) {
    const legacyPath = join(paths.emitDir, legacyFile);
    if (existsSync(legacyPath)) {
      rmSync(legacyPath, { force: true });
    }
  }
  const copiedAssets = copyAdapterAssets(paths, schema);
  writeTextFile(join(paths.emitDir, 'README.md'), buildBrandReadme(schema, promptPack, copiedAssets));
  writeTextFile(join(paths.emitDir, 'parser-contract.json'), `${JSON.stringify(parserContract, null, 2)}\n`);
  emitPrompts(paths.emitDir, promptPack, schema, paths.schemaFileName);
  const emittedFixtures = emitParserFixtures(paths.emitDir, fixtureSource, schema);
  writeTextFile(join(paths.emitDir, 'manifest.json'), buildManifest(paths.emitDir, promptPack, emittedFixtures, schema, copiedAssets));

  return {
    promptCount: Object.keys(promptPack.surfaces).length,
    fixtureCount: emittedFixtures.length,
    copiedAssetCount: copiedAssets.length,
  };
}
