export interface BaseCliArgs {
  help: boolean;
}

export interface InitCliArgs extends BaseCliArgs {
  command: 'init';
  force: boolean;
  preset: 'default' | 'go';
}

export interface LintCliArgs extends BaseCliArgs {
  command: 'lint';
  paths: string[];
  ignore: string[];
  learn: boolean;
  json: boolean;
  verbose: boolean;
}

export interface ValidateGridCliArgs extends BaseCliArgs {
  command: 'validate-grid';
  design: 'grid';
  input: string;
  output: string;
  spacingBase: number;
  rootFontSize: number;
  verbose: boolean;
}

export interface ValidatePatternsCliArgs extends BaseCliArgs {
  command: 'validate-patterns';
  paths: string[];
  ignore: string[];
  minCount: number;
  output?: string;
  verbose: boolean;
}

export interface ValidateAriaCliArgs extends BaseCliArgs {
  command: 'validate-aria';
  paths: string[];
  ignore: string[];
  packagePath?: string;
  manifestPath?: string;
  json: boolean;
  verbose: boolean;
}

export interface PolicyReviewCliArgs extends BaseCliArgs {
  command: 'policy-review';
}

export interface GlobalHelpCliArgs extends BaseCliArgs {
  command: 'help';
}

export type CliArgs =
  | InitCliArgs
  | LintCliArgs
  | ValidateGridCliArgs
  | ValidatePatternsCliArgs
  | ValidateAriaCliArgs
  | PolicyReviewCliArgs
  | GlobalHelpCliArgs;

const DEFAULT_SPACING_BASE = 4;
const DEFAULT_ROOT_FONT_SIZE = 16;
const DEFAULT_PATTERN_MIN_COUNT = 2;

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

function collectIgnoreValues(argv: string[], index: number, target: string[]): number {
  const inlineValue = argv[index].startsWith('--ignore=') ? argv[index].slice('--ignore='.length) : undefined;
  if (inlineValue !== undefined) {
    if (!inlineValue) {
      fail('--ignore requires at least one path.');
    }
    target.push(...inlineValue.split(',').map((value) => value.trim()).filter(Boolean));
    return index;
  }

  let next = index + 1;
  while (next < argv.length && !argv[next].startsWith('-')) {
    target.push(argv[next]);
    next += 1;
  }
  if (next === index + 1) {
    fail('--ignore requires at least one path.');
  }
  return next - 1;
}

export function parseArgs(argv: string[]): CliArgs {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    return { command: 'help', help: true };
  }

  if (argv.includes('--design')) {
    return parseLegacyValidateGridArgs(argv);
  }

  const [command, subcommand, ...rest] = argv;
  if (command === 'init') {
    return parseInitArgs([subcommand, ...rest].filter(Boolean));
  }
  if (command === 'lint') {
    return parseLintArgs([subcommand, ...rest].filter(Boolean));
  }
  if (command === 'validate') {
    if (subcommand === 'grid') {
      return parseValidateGridArgs(rest);
    }
    if (subcommand === 'patterns') {
      return parseValidatePatternsArgs(rest);
    }
    if (subcommand === 'aria') {
      return parseValidateAriaArgs(rest);
    }
    fail(`Unknown validate subcommand: ${subcommand ?? 'undefined'}.`);
  }
  if (command === 'policy') {
    if (subcommand === 'review') {
      return parsePolicyReviewArgs(rest);
    }
    fail(`Unknown policy subcommand: ${subcommand ?? 'undefined'}.`);
  }

  fail(`Unknown command: ${command}.`);
}

function parseInitArgs(argv: string[]): InitCliArgs {
  let force = false;
  let preset: InitCliArgs['preset'] = 'default';
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { command: 'init', help: true, force, preset };
    }
    if (arg === '--force') {
      force = true;
      continue;
    }
    if (arg === '--preset') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--preset requires a value.');
      }
      if (value !== 'default' && value !== 'go') {
        fail(`Unsupported preset: ${value}. Supported presets: default, go.`);
      }
      preset = value;
      i += 1;
      continue;
    }
    fail(`Unknown option for init: ${arg}`);
  }
  return { command: 'init', help: false, force, preset };
}

function parseLintArgs(argv: string[]): LintCliArgs {
  const paths: string[] = [];
  const ignore: string[] = [];
  let learn = false;
  let json = false;
  let verbose = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { command: 'lint', help: true, paths: [], ignore, learn, json, verbose };
    }
    if (arg === '--ignore' || arg.startsWith('--ignore=')) {
      i = collectIgnoreValues(argv, i, ignore);
      continue;
    }
    if (arg === '--learn') {
      learn = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--verbose') {
      verbose = true;
      continue;
    }
    if (arg.startsWith('-')) {
      fail(`Unknown option for lint: ${arg}`);
    }
    paths.push(arg);
  }

  return {
    command: 'lint',
    help: false,
    paths: paths.length ? paths : ['./...'],
    ignore,
    learn,
    json,
    verbose,
  };
}

function parseValidatePatternsArgs(argv: string[]): ValidatePatternsCliArgs {
  const paths: string[] = [];
  const ignore: string[] = [];
  let minCount = DEFAULT_PATTERN_MIN_COUNT;
  let output: string | undefined;
  let verbose = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { command: 'validate-patterns', help: true, paths: [], ignore, minCount, output, verbose };
    }
    if (arg === '--ignore' || arg.startsWith('--ignore=')) {
      i = collectIgnoreValues(argv, i, ignore);
      continue;
    }
    if (arg === '--min-count') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--min-count requires a number.');
      }
      minCount = parsePositiveNumber(value, '--min-count');
      i += 1;
      continue;
    }
    if (arg === '--output') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--output requires a file path.');
      }
      output = value;
      i += 1;
      continue;
    }
    if (arg === '--verbose') {
      verbose = true;
      continue;
    }
    if (arg.startsWith('-')) {
      fail(`Unknown option for validate patterns: ${arg}`);
    }
    paths.push(arg);
  }

  return {
    command: 'validate-patterns',
    help: false,
    paths: paths.length ? paths : ['./...'],
    ignore,
    minCount,
    output,
    verbose,
  };
}

function parseValidateAriaArgs(argv: string[]): ValidateAriaCliArgs {
  const paths: string[] = [];
  const ignore: string[] = [];
  let packagePath: string | undefined;
  let manifestPath: string | undefined;
  let json = false;
  let verbose = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { command: 'validate-aria', help: true, paths: [], ignore, packagePath, manifestPath, json, verbose };
    }
    if (arg === '--ignore' || arg.startsWith('--ignore=')) {
      i = collectIgnoreValues(argv, i, ignore);
      continue;
    }
    if (arg === '--package') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--package requires a file path.');
      }
      packagePath = value;
      i += 1;
      continue;
    }
    if (arg === '--manifest') {
      const value = argv[i + 1];
      if (!value || value.startsWith('-')) {
        fail('--manifest requires a file path.');
      }
      manifestPath = value;
      i += 1;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--verbose') {
      verbose = true;
      continue;
    }
    if (arg.startsWith('-')) {
      fail(`Unknown option for validate aria: ${arg}`);
    }
    paths.push(arg);
  }

  return {
    command: 'validate-aria',
    help: false,
    paths: paths.length ? paths : ['./...'],
    ignore,
    packagePath,
    manifestPath,
    json,
    verbose,
  };
}

function parsePolicyReviewArgs(argv: string[]): PolicyReviewCliArgs {
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      return { command: 'policy-review', help: true };
    }
    fail(`Unknown option for policy review: ${arg}`);
  }
  return { command: 'policy-review', help: false };
}

function parseValidateGridArgs(argv: string[]): ValidateGridCliArgs {
  const parsed: {
    help: boolean;
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

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
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
      fail(`Unknown option for validate grid: ${arg}`);
    }

    parsed.positional.push(arg);
  }

  if (parsed.help) {
    return {
      command: 'validate-grid',
      help: true,
      design: 'grid',
      input: parsed.input ?? '',
      output: parsed.output ?? '',
      spacingBase: parsed.spacingBase,
      rootFontSize: parsed.rootFontSize,
      verbose: parsed.verbose,
    };
  }

  if (parsed.positional.length > 0) {
    fail('Positional arguments are not supported for validate grid.');
  }

  if (!parsed.input) {
    fail('--input is required.');
  }

  if (!parsed.output) {
    fail('--output is required.');
  }

  return {
    command: 'validate-grid',
    help: false,
    design: 'grid',
    input: parsed.input,
    output: parsed.output,
    spacingBase: parsed.spacingBase,
    rootFontSize: parsed.rootFontSize,
    verbose: parsed.verbose,
  };
}

function parseLegacyValidateGridArgs(argv: string[]): ValidateGridCliArgs {
  const withoutDesign: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--design') {
      const value = argv[i + 1];
      if (value !== 'grid') {
        fail(`Only --design grid is supported. Received --design ${value ?? 'undefined'}.`);
      }
      i += 1;
      continue;
    }
    withoutDesign.push(arg);
  }
  return parseValidateGridArgs(withoutDesign);
}
