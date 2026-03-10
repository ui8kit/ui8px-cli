import { existsSync } from 'node:fs';
import { BrandOsCliArgs } from '../cli/parse-args.js';
import { emitBrandOsArtifacts } from '../brand-os/emitter.js';
import { BrandOsSchema, ParserFixtureSource, PromptPack } from '../brand-os/types.js';
import { fail, readJsonFile, resolveBrandOsPaths } from '../brand-os/utils.js';

export async function runBrandOs(args: BrandOsCliArgs): Promise<void> {
  const rawSchemaPath = args.schema;
  const schemaPreview = readJsonFile<BrandOsSchema>(rawSchemaPath);
  const paths = resolveBrandOsPaths(rawSchemaPath, schemaPreview, {
    promptPack: args.promptPack,
    parserContract: args.parserContract,
    fixtures: args.fixtures,
    emitDir: args.emitDir,
  });

  if (!existsSync(paths.schemaPath)) {
    fail(`Brand schema "${paths.schemaPath}" was not found.`);
  }

  const schema = readJsonFile<BrandOsSchema>(paths.schemaPath);
  const promptPack = readJsonFile<PromptPack>(paths.promptPackPath);
  const parserContract = readJsonFile<Record<string, unknown>>(paths.parserContractPath);
  const fixtureSource = existsSync(paths.fixturesPath)
    ? readJsonFile<ParserFixtureSource>(paths.fixturesPath)
    : { schemaVersion: '1.0.0', brandId: schema.meta.slug ?? 'brand-os', fixtures: [] };

  const result = emitBrandOsArtifacts(paths, schema, promptPack, parserContract, fixtureSource);

  console.log(`Brand OS emitted to: ${paths.emitDir}`);
  console.log(`- prompts/${result.promptCount} surface prompt(s)`);
  console.log(`- parser-fixtures/${result.fixtureCount} fixture(s)`);
  console.log(`- copied adapter asset(s): ${result.copiedAssetCount}`);
  if (args.verbose) {
    console.log(`Schema: ${paths.schemaPath}`);
    console.log(`Prompt pack: ${paths.promptPackPath}`);
    console.log(`Parser contract: ${paths.parserContractPath}`);
    console.log(`Fixtures: ${paths.fixturesPath}`);
  }
}

export function printBrandOsUsage(): string {
  return [
    'Usage:',
    '  npx brand-os --schema <schema-path> [options]',
    '',
    'Options:',
    '  --schema <path>           brand OS schema path (required)',
    '  --prompt-pack <path>      prompt pack JSON path',
    '  --parser-contract <path>  parser contract JSON path',
    '  --fixtures <path>         parser fixture source JSON path',
    '  --emit-dir <path>         output directory for generated artifacts',
    '  --verbose                 print resolved input paths',
    '  -h, --help                show help',
    '',
    'Examples:',
    '  npx brand-os --schema .project/brand.schema.json',
    '  npx brand-os --schema .project/brand.schema.json --emit-dir .project/brand-generated --verbose',
  ].join('\n');
}
