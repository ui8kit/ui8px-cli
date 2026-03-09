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

export type CliArgs = ScaffoldCliArgs | ValidateGridCliArgs;

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
    mode: 'scaffold' | 'validate-grid';
    input?: string;
    output?: string;
    design?: string;
    spacingBase: number;
    rootFontSize: number;
    verbose: boolean;
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
      parsed.mode = 'validate-grid';
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
