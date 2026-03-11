# ui8px

`ui8px` validates utility class maps against an `8 + 4` spacing policy.

Run directly:

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

You can also run with npm or bun:

```bash
npm exec ui8px@latest -- --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
bunx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

## Usage

```bash
npx ui8px@latest --design grid --input <input-json> --output <backlog-json> [options]
```

## Options

- `--input <path>` — input class map JSON (required)
- `--output <path>` — output backlog JSON path (required)
- `--spacing-base <number>` — multiplier for `var(--spacing)`; default `4`
- `--root-font-size <number>` — root font size for `rem`; default `16`
- `--verbose` — print each violation in terminal
- `--design grid` — required mode flag
- `-h, --help` — print usage and exit with `0`

## Output examples

### Validation failed (without `--verbose`)

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

```text
Input: ui8kit.map.json
Output: ui8kit.map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 120
Checked declarations: 340
Violations: 2
Found 2 violations.
Report saved to: /Users/.../ui8kit.map.backlog.json
```

### Validation failed (with `--verbose`)

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json --verbose
```

```text
Input: ui8kit.map.json
Output: ui8kit.map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 120
Checked declarations: 340
Violations: 2
Found 2 violations.
- h-11 | height: calc(var(--spacing) * 11) -> 44px
- ml-7 | margin-left: 7px -> 7px
Report saved to: /Users/.../ui8kit.map.backlog.json
```

### No violations

```bash
npx ui8px@latest --design grid --input ui8kit.clean.map.json --output ui8kit.clean.backlog.json
```

```text
Input: ui8kit.clean.map.json
Output: ui8kit.clean.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 56
Checked declarations: 110
Violations: 0
No violations found.
Report saved to: /Users/.../ui8kit.clean.backlog.json
```

### Parser errors

```text
Error: --input is required.
```

```text
Error: --output is required.
```

```text
Error: Unknown option: --foo
```

## Exit codes

- `0` — no violations
- `1` — violations found
- `2` — invalid usage or runtime error

# ui8px

`ui8px` validates utility class maps against an `8 + 4` spacing policy.

No one-off install is required:

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

You can also run with npm or bun:

```bash
npm exec ui8px@latest -- --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
bunx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

## Usage

```bash
npx ui8px@latest --design grid --input <input-json> --output <backlog-json> [options]
```

## Example

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json --verbose
```

Terminal output:

```text
Input: ui8kit.map.json
Output: ui8kit.map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 120
Checked declarations: 340
Violations: 2
Found 2 violations.
- h-11 | height: calc(var(--spacing) * 11) -> 44px
- ml-7 | margin-left: 7px -> 7px
Report saved to: /Users/.../ui8kit.map.backlog.json
```

Example backlog file:

```json
{
  "meta": {
    "input": "ui8kit.map.json",
    "output": "ui8kit.map.backlog.json",
    "design": "grid",
    "spacingBase": 4,
    "rootFontSize": 16,
    "generatedAt": "2026-03-11T12:00:00.000Z",
    "classesScanned": 120,
    "declarationsScanned": 340
  },
  "summary": {
    "classesChecked": 120,
    "declarationsChecked": 340,
    "violations": 2
  },
  "violations": [
    {
      "className": "h-11",
      "property": "height",
      "rawValue": "calc(var(--spacing) * 11)",
      "resolvedPx": 44,
      "reason": "44px is not aligned to the 8/4px layout policy"
    },
    {
      "className": "ml-7",
      "property": "margin-left",
      "rawValue": "7px",
      "resolvedPx": 7,
      "reason": "7px is not aligned to the 8/4px layout policy"
    }
  ]
}
```

## `--help`

```bash
npx ui8px@latest --help
npx ui8px@latest -h
```

Shows usage instructions and exits with code `0`.

### Example usage output

```text
Usage:
  npx ui8px --design grid --input <path> --output <path> [options]

Options:
  --design grid          validate mode (required for spacing checks)
  --input <path>         path to class map JSON
  --output <path>        backlog output path
  --spacing-base <number>    spacing base for var(--spacing) (default: 4)
  --root-font-size <number>  root font size for rem conversion (default: 16)
  --verbose                  show detailed violations in console
  -h, --help                show help
```

## Parameters

- `--design grid` — required and only supported mode.
- `--input <path>` — input class map JSON (required).
- `--output <path>` — output backlog JSON path (required).
- `--spacing-base <number>` — multiplier for `var(--spacing)` (default `4`).
- `--root-font-size <number>` — base font size for `rem` values (default `16`).
- `--verbose` — print detailed violations.
- `-h, --help` — show usage.

## Argument parsing behaviour

- `--design` must be exactly `grid`.
- One of the required flags `--input` and `--output` can be omitted only with `--help`.
- Unknown flags and extra positional arguments are rejected.
- Missing required values (`--input`, `--output`, `--spacing-base`, `--root-font-size`, `--design`) result in a validation error.
- `--verbose` is optional and defaults to `false`.

## Examples of parser errors

```bash
npx ui8px@latest --design grid --output ui8kit.map.backlog.json
```

```text
Error: --input is required.
Exit code: 2
```

```bash
npx ui8px@latest --design grid --input ui8kit.map.json
```

```text
Error: --output is required.
Exit code: 2
```

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json --foo
```

```text
Error: Unknown option: --foo
Exit code: 2
```

Error messages are prefixed with `Error:` by the parser and printed by the CLI wrapper before exiting.

## Example with no violations

```bash
npx ui8px@latest --design grid --input ui8kit.clean.map.json --output ui8kit.clean.backlog.json
```

Terminal output:

```text
Input: ui8kit.clean.map.json
Output: ui8kit.clean.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 56
Checked declarations: 110
Violations: 0
No violations found.
Report saved to: /Users/.../ui8kit.clean.backlog.json
```

Example backlog:

```json
{
  "meta": {
    "input": "ui8kit.clean.map.json",
    "output": "ui8kit.clean.backlog.json",
    "design": "grid",
    "spacingBase": 4,
    "rootFontSize": 16,
    "generatedAt": "2026-03-11T12:10:00.000Z",
    "classesScanned": 56,
    "declarationsScanned": 110
  },
  "summary": {
    "classesChecked": 56,
    "declarationsChecked": 110,
    "violations": 0
  },
  "violations": []
}
```

## `--verbose` vs standard output

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

Standard output:

```text
Input: ui8kit.map.json
Output: ui8kit.map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 120
Checked declarations: 340
Violations: 2
Found 2 violations.
Report saved to: /Users/.../ui8kit.map.backlog.json
```

```bash
npx ui8px@latest --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json --verbose
```

Verbose output:

```text
Input: ui8kit.map.json
Output: ui8kit.map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 120
Checked declarations: 340
Violations: 2
Found 2 violations.
- h-11 | height: calc(var(--spacing) * 11) -> 44px
- ml-7 | margin-left: 7px -> 7px
Report saved to: /Users/.../ui8kit.map.backlog.json
```

## Exit codes

- `0` — no violations.
- `1` — violations found.
- `2` — invalid usage or runtime error.
