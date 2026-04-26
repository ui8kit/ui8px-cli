export function printGlobalUsage(): string {
  return `Usage:
  npx ui8px <command> [options]

Commands:
  init                         create .ui8px policy files
  lint [paths...]              validate utility classes in source files
  validate grid                validate a generated class map against 8/4px CSS values
  validate patterns [paths...] find repeated utility compositions
  policy review                show learned policy proposals

Examples:
  npx ui8px init
  npx ui8px lint ./...
  npx ui8px lint ./... --learn
  npx ui8px validate grid --input class-map.json --output class-map.backlog.json
  npx ui8px validate patterns ./...`;
}

export function printInitUsage(): string {
  return `Usage:
  npx ui8px init [--preset default|go] [--force]

Options:
  --preset  policy preset to write (default: default)
  --force   overwrite existing .ui8px policy files
  -h, --help show help`;
}

export function printLintUsage(): string {
  return `Usage:
  npx ui8px lint [paths...] [options]

Options:
  --learn   append diagnostics to .ui8px/telemetry/observed.jsonl and proposals.json
  --json    print diagnostics as JSON
  --verbose print extracted class locations
  -h, --help show help`;
}

export function printValidateGridUsage(): string {
  return `Usage:
  npx ui8px validate grid --input <path> --output <path> [options]

Options:
  --input <path>             path to class map JSON
  --output <path>            backlog output path
  --spacing-base <number>    spacing base for var(--spacing) (default: 4)
  --root-font-size <number>  root font size for rem conversion (default: 16)
  --verbose                  show detailed violations in console
  -h, --help                 show help`;
}

export function printValidatePatternsUsage(): string {
  return `Usage:
  npx ui8px validate patterns [paths...] [options]

Options:
  --min-count <number>  minimum occurrences before reporting a pattern (default: 2)
  --output <path>       report output path (default: .ui8px/reports/patterns.json)
  --verbose             include source locations in console output
  -h, --help            show help`;
}

export function printPolicyReviewUsage(): string {
  return `Usage:
  npx ui8px policy review

Reads .ui8px/telemetry/proposals.json and prints the most common candidates.`;
}
