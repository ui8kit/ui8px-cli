import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AstParserCliArgs } from '../cli/parse-args.js';
import { buildAstParseReport } from '../ast-parser/html.js';
import { classifyClassToken } from '../ast-parser/classifier.js';
import { FixtureValidationResult, ParserContract, SuiteValidationReport } from '../ast-parser/types.js';
import { BrandOsSchema, ParserFixtureSource } from '../brand-os/types.js';
import { fail, readJsonFile, resolveBrandOsPaths, writeTextFile } from '../brand-os/utils.js';

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

function buildActualBuckets(classes: string[], contract: ParserContract): Record<'structural' | 'semantic' | 'decorative' | 'unknown', string[]> {
  const buckets = {
    structural: [] as string[],
    semantic: [] as string[],
    decorative: [] as string[],
    unknown: [] as string[],
  };

  for (const className of classes) {
    const classified = classifyClassToken(className, contract);
    buckets[classified.bucket].push(className);
  }

  return buckets;
}

function validateFixtureSet(contract: ParserContract, fixtureSource: ParserFixtureSource): FixtureValidationResult[] {
  return fixtureSource.fixtures.map((fixture) => {
    const actual = buildActualBuckets(fixture.classes, contract);
    const expected = fixture.expected;
    const mismatches: FixtureValidationResult['mismatches'] = [];

    (['structural', 'semantic', 'decorative', 'unknown'] as const).forEach((bucket) => {
      const expectedValues = expected[bucket] ?? [];
      const actualValues = actual[bucket] ?? [];
      if (!arraysEqual(actualValues, expectedValues)) {
        mismatches.push({
          fixtureId: fixture.id,
          bucket,
          expected: expectedValues,
          actual: actualValues,
        });
      }
    });

    return {
      fixtureId: fixture.id,
      title: fixture.title,
      passed: mismatches.length === 0,
      mismatches,
    };
  });
}

function resolveSuiteReport(schemaArg: string): SuiteValidationReport {
  const schemaPreview = readJsonFile<BrandOsSchema>(schemaArg);
  const paths = resolveBrandOsPaths(schemaArg, schemaPreview, {});
  const contract = readJsonFile<ParserContract>(paths.parserContractPath);
  const fixtures = readJsonFile<ParserFixtureSource>(paths.fixturesPath);
  const results = validateFixtureSet(contract, fixtures);
  const passedCount = results.filter((result) => result.passed).length;
  const failedCount = results.length - passedCount;

  return {
    brandId: fixtures.brandId ?? schemaPreview.meta.slug ?? schemaPreview.meta.name,
    contractPath: paths.parserContractPath,
    fixtureSourcePath: paths.fixturesPath,
    fixtureCount: results.length,
    passedCount,
    failedCount,
    results,
  };
}

function printSuiteSummary(report: SuiteValidationReport): void {
  console.log(`Suite: ${report.brandId}`);
  console.log(`- fixtures: ${report.fixtureCount}`);
  console.log(`- passed: ${report.passedCount}`);
  console.log(`- failed: ${report.failedCount}`);
}

export async function runAstParser(args: AstParserCliArgs): Promise<number> {
  if (args.input) {
    const sourcePath = resolve(process.cwd(), args.input);
    if (!existsSync(sourcePath)) {
      fail(`AST input "${sourcePath}" was not found.`);
    }

    let contractPath: string | undefined;
    if (args.parserContract) {
      contractPath = resolve(process.cwd(), args.parserContract);
    } else if (args.suites.length === 1) {
      const schemaPreview = readJsonFile<BrandOsSchema>(args.suites[0]);
      contractPath = resolveBrandOsPaths(args.suites[0], schemaPreview, {}).parserContractPath;
    }

    if (!contractPath) {
      fail('Unable to resolve parser contract for AST input parsing.');
    }
    if (!existsSync(contractPath)) {
      fail(`Parser contract "${contractPath}" was not found.`);
    }

    const html = readFileSync(sourcePath, 'utf8');
    const contract = readJsonFile<ParserContract>(contractPath);
    const report = buildAstParseReport(sourcePath, contractPath, html, contract);

    if (args.output) {
      writeTextFile(resolve(process.cwd(), args.output), `${JSON.stringify(report, null, 2)}\n`);
    }

    console.log(`AST parsed: ${sourcePath}`);
    console.log(`- nodes: ${report.summary.nodeCount}`);
    console.log(`- classes: ${report.summary.classCount}`);
    console.log(`- structural: ${report.summary.structuralCount}`);
    console.log(`- semantic: ${report.summary.semanticCount}`);
    console.log(`- decorative: ${report.summary.decorativeCount}`);
    console.log(`- unknown: ${report.summary.unknownCount}`);
    console.log(`- style attributes: ${report.summary.styleAttributeCount}`);
    console.log(`- normalized nodes: ${report.summary.normalizedNodeCount}`);
    console.log(`- normalized matches: ${report.summary.normalizedMatchCount}`);
    console.log(`- ui8kit mappings: ${report.summary.ui8kitMappingCount}`);
    if (args.verbose) {
      console.log(`- matched kinds: ${JSON.stringify(report.summary.matchedKinds)}`);
      console.log(`- ui8kit mapped kinds: ${JSON.stringify(report.summary.ui8kitMappedKinds)}`);
    }

    return report.summary.unknownCount > 0 ? 1 : 0;
  }

  const suiteReports = args.suites.map((suitePath) => resolveSuiteReport(suitePath));
  const combined = {
    generatedAt: new Date().toISOString(),
    suiteCount: suiteReports.length,
    reports: suiteReports,
  };

  suiteReports.forEach(printSuiteSummary);

  if (args.output) {
    writeTextFile(resolve(process.cwd(), args.output), `${JSON.stringify(combined, null, 2)}\n`);
  }

  const totalFailures = suiteReports.reduce((sum, report) => sum + report.failedCount, 0);
  return totalFailures > 0 ? 1 : 0;
}

export function printAstParserUsage(): string {
  return [
    'Usage:',
    '  npx brand-os --ast-suite <brand-schema-path> [--ast-suite <brand-schema-path> ...] [--ast-output <path>] [--verbose]',
    '  npx brand-os --ast-input <html-path> [--ast-contract <contract-path> | --ast-suite <brand-schema-path>] --ast-output <path> [--verbose]',
    '',
    'Options:',
    '  --ast-input <path>        parse an HTML file into a classified AST',
    '  --ast-output <path>       write JSON output report to path',
    '  --ast-contract <path>     parser contract JSON path for HTML parsing',
    '  --ast-suite <path>        brand schema path used to resolve parser contract + fixture source',
    '  --verbose                 print resolved paths where supported',
    '  -h, --help                show help',
    '',
    'Examples:',
    '  npx brand-os --ast-suite ".project/Tech Brand OS/tech-brand-os.schema.json" --ast-suite ".project/RestA Brand OS/resta-brand-os.schema.json" --ast-output .project/ast-suite-report.json',
    '  npx brand-os --ast-input ".project/RestA Brand OS/reference/RoseUI-Welcome-Restaurant.html" --ast-suite ".project/RestA Brand OS/resta-brand-os.schema.json" --ast-output .project/resta-hero-ast.json',
  ].join('\n');
}
