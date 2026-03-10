export type CliTemplateName = 'react' | 'react-resta';

export interface ScaffoldCliArgs {
  mode: 'scaffold';
  help: boolean;
  target: string;
  template: CliTemplateName;
  immediate: boolean;
}

export interface ValidateGridCliArgs {
  mode: 'validate-grid';
  help: boolean;
  design: 'grid';
  input: string;
  output: string;
  spacingBase: number;
  rootFontSize: number;
  verbose: boolean;
}

export interface BrandOsCliArgs {
  mode: 'brand-os';
  help: boolean;
  schema: string;
  promptPack?: string;
  parserContract?: string;
  fixtures?: string;
  emitDir?: string;
  verbose: boolean;
}

export interface AstParserCliArgs {
  mode: 'ast-parser';
  help: boolean;
  input?: string;
  output?: string;
  parserContract?: string;
  suites: string[];
  verbose: boolean;
}

export type CliArgs = ScaffoldCliArgs | ValidateGridCliArgs | BrandOsCliArgs | AstParserCliArgs;

export const VALID_TEMPLATES: readonly CliTemplateName[] = ['react', 'react-resta'];
export const DEFAULT_TEMPLATE: CliTemplateName = 'react';

const DEFAULT_SPACING_BASE = 4;
const DEFAULT_ROOT_FONT_SIZE = 16;

function fail(message: string): never {
  throw new Error(`Error: ${message}`);
}

function parsePositiveNumber(value: string, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    fail(`${label} must be a positive number.`);
  }
  return parsed;
}

export function parseArgs(argv: string[]): CliArgs {
  const parsed: {
    help: boolean;
    mode: 'scaffold' | 'validate-grid' | 'brand-os' | 'ast-parser';
    input?: string;
    output?: string;
    design?: string;
    spacingBase: number;
    rootFontSize: number;
    verbose: boolean;
    astInput?: string;
    astOutput?: string;
    astParserContract?: string;
    astSuites: string[];
    brandSchema?: string;
    promptPack?: string;
    parserContract?: string;
    fixtures?: string;
    emitDir?: string;
    target?: string;
    template: CliTemplateName;
    immediate: boolean;
    templateSpecified: boolean;
    immediateSpecified: boolean;
  } = {
    help: false,
    mode: 'scaffold',
    spacingBase: DEFAULT_SPACING_BASE,
    rootFontSize: DEFAULT_ROOT_FONT_SIZE,
    verbose: false,
    astSuites: [],
    template: DEFAULT_TEMPLATE as CliTemplateName,
    immediate: false,
    templateSpecified: false,
    immediateSpecified: false,
  };

  const positional: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (arg === '--ast-input') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--ast-input requires a file path.');
      }
      parsed.astInput = value;
      parsed.mode = 'ast-parser';
      i += 1;
      continue;
    }

    if (arg === '--ast-output') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--ast-output requires a file path.');
      }
      parsed.astOutput = value;
      parsed.mode = 'ast-parser';
      i += 1;
      continue;
    }

    if (arg === '--ast-contract') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--ast-contract requires a file path.');
      }
      parsed.astParserContract = value;
      parsed.mode = 'ast-parser';
      i += 1;
      continue;
    }

    if (arg === '--ast-suite') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--ast-suite requires a brand schema path.');
      }
      parsed.astSuites.push(value);
      parsed.mode = 'ast-parser';
      i += 1;
      continue;
    }

    if (arg === '--schema') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--schema requires a schema path.');
      }
      parsed.brandSchema = value;
      parsed.mode = 'brand-os';
      i += 1;
      continue;
    }

    if (arg === '--prompt-pack') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--prompt-pack requires a file path.');
      }
      parsed.promptPack = value;
      i += 1;
      continue;
    }

    if (arg === '--parser-contract') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--parser-contract requires a file path.');
      }
      parsed.parserContract = value;
      i += 1;
      continue;
    }

    if (arg === '--fixtures') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--fixtures requires a file path.');
      }
      parsed.fixtures = value;
      i += 1;
      continue;
    }

    if (arg === '--emit-dir') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--emit-dir requires a directory path.');
      }
      parsed.emitDir = value;
      i += 1;
      continue;
    }

    if (arg === '--design') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--design requires a mode value.');
      }
      parsed.design = value;
      parsed.mode = 'validate-grid';
      i += 1;
      continue;
    }

    if (arg === '--input') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--input requires a file path.');
      }
      parsed.input = value;
      parsed.mode = 'validate-grid';
      i += 1;
      continue;
    }

    if (arg === '--output') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--output requires a file path.');
      }
      parsed.output = value;
      parsed.mode = 'validate-grid';
      i += 1;
      continue;
    }

    if (arg === '--spacing-base') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--spacing-base requires a number.');
      }
      parsed.spacingBase = parsePositiveNumber(value, '--spacing-base');
      parsed.mode = 'validate-grid';
      i += 1;
      continue;
    }

    if (arg === '--root-font-size') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--root-font-size requires a number.');
      }
      parsed.rootFontSize = parsePositiveNumber(value, '--root-font-size');
      parsed.mode = 'validate-grid';
      i += 1;
      continue;
    }

    if (arg === '--verbose') {
      parsed.verbose = true;
      continue;
    }

    if (arg === '-t' || arg === '--template') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--template requires a template name.');
      }
      if (!VALID_TEMPLATES.includes(value as CliTemplateName)) {
        fail(`Unknown template "${value}".`);
      }
      parsed.template = value as CliTemplateName;
      parsed.templateSpecified = true;
      i += 1;
      continue;
    }

    if (arg === '-i' || arg === '--immediate') {
      parsed.immediate = true;
      parsed.immediateSpecified = true;
      continue;
    }

    if (arg.startsWith('-')) {
      fail(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  if (parsed.help) {
    if (parsed.mode === 'ast-parser') {
      return {
        mode: 'ast-parser',
        help: true,
        input: parsed.astInput,
        output: parsed.astOutput,
        parserContract: parsed.astParserContract,
        suites: parsed.astSuites,
        verbose: parsed.verbose,
      };
    }

    if (parsed.mode === 'brand-os') {
      return {
        mode: 'brand-os',
        help: true,
        schema: parsed.brandSchema ?? '',
        promptPack: parsed.promptPack,
        parserContract: parsed.parserContract,
        fixtures: parsed.fixtures,
        emitDir: parsed.emitDir,
        verbose: parsed.verbose,
      };
    }

    return {
      mode: parsed.mode === 'validate-grid' ? 'validate-grid' : 'scaffold',
      help: true,
      target: parsed.target ?? 'my-app',
      template: parsed.template,
      immediate: parsed.immediate,
      design: (parsed.design as any) || 'grid',
      input: parsed.input ?? '',
      output: parsed.output ?? '',
      spacingBase: parsed.spacingBase,
      rootFontSize: parsed.rootFontSize,
      verbose: parsed.verbose,
    } as CliArgs;
  }

  if (parsed.mode === 'ast-parser') {
    if (parsed.templateSpecified || parsed.immediateSpecified) {
      fail('Scaffold-only flags --template and --immediate are not allowed in AST parser mode.');
    }

    if (parsed.design || parsed.input || parsed.output || parsed.brandSchema) {
      fail('Validation and brand OS flags are not allowed in AST parser mode.');
    }

    if (positional.length > 0) {
      fail('Positional directory argument is not supported in AST parser mode.');
    }

    if (!parsed.astInput && parsed.astSuites.length === 0) {
      fail('AST parser mode requires either --ast-input or at least one --ast-suite.');
    }

    if (parsed.astInput && !parsed.astOutput) {
      fail('--ast-output is required when using --ast-input.');
    }

    if (parsed.astInput && !parsed.astParserContract && parsed.astSuites.length !== 1) {
      fail('Use --ast-contract or provide exactly one --ast-suite when parsing HTML input.');
    }

    return {
      mode: 'ast-parser',
      help: false,
      input: parsed.astInput,
      output: parsed.astOutput,
      parserContract: parsed.astParserContract,
      suites: parsed.astSuites,
      verbose: parsed.verbose,
    };
  }

  if (parsed.mode === 'brand-os') {
    if (parsed.templateSpecified || parsed.immediateSpecified) {
      fail('Scaffold-only flags --template and --immediate are not allowed in brand OS mode.');
    }

    if (parsed.design || parsed.input || parsed.output) {
      fail('Validation flags are not allowed in brand OS mode.');
    }

    if (positional.length > 0) {
      fail('Positional directory argument is not supported in brand OS mode.');
    }

    if (!parsed.brandSchema) {
      fail('--schema is required for brand OS mode.');
    }

    return {
      mode: 'brand-os',
      help: false,
      schema: parsed.brandSchema,
      promptPack: parsed.promptPack,
      parserContract: parsed.parserContract,
      fixtures: parsed.fixtures,
      emitDir: parsed.emitDir,
      verbose: parsed.verbose,
    };
  }

  if (parsed.mode === 'validate-grid') {
      if (parsed.templateSpecified || parsed.immediateSpecified) {
        fail('Scaffold-only flags --template and --immediate are not allowed in validation mode.');
      }

    if (parsed.design !== 'grid') {
      fail(`Only --design grid is supported. Received --design ${parsed.design ?? 'undefined'}.`);
    }

    if (positional.length > 0) {
      fail('Positional directory argument is not supported in validation mode.');
    }

    if (!parsed.input) {
      fail('--input is required for --design grid.');
    }

    if (!parsed.output) {
      fail('--output is required for --design grid.');
    }

    return {
      mode: 'validate-grid',
      help: false,
      design: 'grid',
      input: parsed.input,
      output: parsed.output,
      spacingBase: parsed.spacingBase,
      rootFontSize: parsed.rootFontSize,
      verbose: parsed.verbose,
    };
  }

  if (parsed.input || parsed.output) {
    fail('Use --design grid together with --input/--output for map validation.');
  }

  if (positional.length > 1) {
    fail('Only one project directory is supported.');
  }

  return {
    mode: 'scaffold',
    help: false,
    target: positional[0] ?? 'my-app',
    template: parsed.template,
    immediate: parsed.immediate,
  };
}
