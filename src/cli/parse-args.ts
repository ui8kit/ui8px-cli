export interface ValidateGridCliArgs {
  help: boolean;
  design: 'grid';
  input: string;
  output: string;
  spacingBase: number;
  rootFontSize: number;
  verbose: boolean;
}

export type CliArgs = ValidateGridCliArgs;

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
    design?: string;
    input?: string;
    output?: string;
    spacingBase: number;
    rootFontSize: number;
    verbose: boolean;
    positional: string[];
  } = {
    help: false,
    spacingBase: DEFAULT_SPACING_BASE,
    rootFontSize: DEFAULT_ROOT_FONT_SIZE,
    verbose: false,
    positional: [],
  };

  const positional = parsed.positional;

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
      i += 1;
      continue;
    }

    if (arg === '--input') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--input requires a file path.');
      }
      parsed.input = value;
      i += 1;
      continue;
    }

    if (arg === '--output') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--output requires a file path.');
      }
      parsed.output = value;
      i += 1;
      continue;
    }

    if (arg === '--spacing-base') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--spacing-base requires a number.');
      }
      parsed.spacingBase = parsePositiveNumber(value, '--spacing-base');
      i += 1;
      continue;
    }

    if (arg === '--root-font-size') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--root-font-size requires a number.');
      }
      parsed.rootFontSize = parsePositiveNumber(value, '--root-font-size');
      i += 1;
      continue;
    }

    if (arg === '--verbose') {
      parsed.verbose = true;
      continue;
    }

    if (arg.startsWith('-')) {
      fail(`Unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  if (parsed.help) {
    return {
      help: true,
      design: 'grid',
      input: parsed.input ?? '',
      output: parsed.output ?? '',
      spacingBase: parsed.spacingBase,
      rootFontSize: parsed.rootFontSize,
      verbose: parsed.verbose,
    } as CliArgs;
  }

  if (parsed.design !== 'grid') {
    fail(`Only --design grid is supported. Received --design ${parsed.design ?? 'undefined'}.`);
  }

  if (positional.length > 0) {
    fail('Positional arguments are not supported.');
  }

  if (!parsed.input) {
    fail('--input is required.');
  }

  if (!parsed.output) {
    fail('--output is required.');
  }

  return {
    help: false,
    design: 'grid',
    input: parsed.input,
    output: parsed.output,
    spacingBase: parsed.spacingBase,
    rootFontSize: parsed.rootFontSize,
    verbose: parsed.verbose,
  };
}
