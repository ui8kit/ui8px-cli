# CLI API Reference

This page documents the public `ui8px` commands.

## Global Help

```bash
npx ui8px --help
npx ui8px -h
```

Prints available commands and exits with code `0`.

## `init`

```bash
npx ui8px init
npx ui8px init --force
npx ui8px init --preset go
```

Creates the project-local `.ui8px/` directory:

```text
.ui8px/
  policy/
    allowed.json
    denied.json
    scopes.json
    groups.json
    patterns.json
  telemetry/
  reports/
```

Options:

- `--force`: overwrite existing policy files.
- `--preset default|go`: choose the policy preset to write. `go` is designed for Go component libraries that keep compact control helpers in `ui/**`, `components/**`, and `utils/**/*.go`.

## `lint`

```bash
npx ui8px lint ./...
npx ui8px lint src/views src/components
npx ui8px lint ./... --learn
npx ui8px lint ./... --json
npx ui8px lint ./... --verbose
```

Scans source files and validates class tokens against the current policy.

Supported source types:

- `.templ`: static `class="..."` values
- `.html`: static `class="..."` values
- `.css`: `@apply ...;` utility lists
- `.go`: static `templ.Attributes{"class": "..."}` values, `utils.Cn(...)`, `Cn(...)`, mixed literal/dynamic `Cn` calls, and static `return "..."` helper strings

Options:

- `--learn`: write `.ui8px/telemetry/observed.jsonl` and update `.ui8px/telemetry/proposals.json`.
- `--json`: print the lint result as JSON.
- `--verbose`: include diagnostics even when no violations are found.

Exit codes:

- `0`: no lint violations
- `1`: violations found
- `2`: invalid command or runtime error

## `validate aria`

```bash
npx ui8px validate aria ./...
npx ui8px validate aria internal/site/views --package package.json
npx ui8px validate aria ./... --manifest web/static/js/manifest.json
npx ui8px validate aria ./... --json
```

Scans source files for static `data-ui8kit="..."` hooks and common UI8Kit component calls, then verifies that the required `@ui8kit/aria` pattern is included in the configured bundle.

Default config resolution:

1. `web/static/js/manifest.json`, if it exists, because it describes the actual generated site bundle.
2. `package.json` `ui8kit.aria`, if no manifest exists.

Options:

- `--package <path>`: package.json path with `ui8kit.aria` config.
- `--manifest <path>`: generated UI8Kit asset manifest path.
- `--json`: print the validation result as JSON.
- `--verbose`: print every diagnostic instead of the first page.

Pattern mapping:

- `data-ui8kit="dialog"` requires `dialog`.
- `data-ui8kit="sheet"` requires `dialog`.
- `data-ui8kit="alertdialog"` requires `dialog`.
- `data-ui8kit="accordion"` requires `accordion`.
- `data-ui8kit="tabs"` requires `tabs`.
- `data-ui8kit="combobox"` requires `combobox`.
- `data-ui8kit="tooltip"` requires `tooltip`.
- `@ui.Accordion(...)` requires `accordion`.
- `@ui.Tabs(...)` requires `tabs`.
- `@ui8layout.Shell(...)`, `@ui.Dialog(...)`, `@ui.Sheet(...)`, and `@ui.AlertDialog(...)` require `dialog`.

Exit codes:

- `0`: all used hooks are covered by the bundle.
- `1`: at least one required pattern is missing.
- `2`: invalid command or runtime error.

## `validate grid`

```bash
npx ui8px validate grid --input class-map.json --output class-map.backlog.json
```

Validates a prebuilt map of class names to CSS declarations. This is useful when another tool has already produced a class map and you want to check the resolved CSS values against the 8/4px spacing policy.

Options:

- `--input <path>`: required input JSON file.
- `--output <path>`: required output report file.
- `--spacing-base <number>`: multiplier for `var(--spacing)`, default `4`.
- `--root-font-size <number>`: root font size for `rem`, default `16`.
- `--verbose`: print each violation.

Input shape:

```json
{
  "p-2": "padding: calc(var(--spacing) * 2);",
  "h-11": "height: calc(var(--spacing) * 11);"
}
```

Legacy form is still supported:

```bash
npx ui8px --design grid --input class-map.json --output class-map.backlog.json
```

## `validate patterns`

```bash
npx ui8px validate patterns ./...
npx ui8px validate patterns ./... --min-count 3
npx ui8px validate patterns ./... --output .ui8px/reports/patterns.json
npx ui8px validate patterns ./... --verbose
```

Finds repeated utility-class compositions.

It:

- extracts class lists from source files;
- normalizes order;
- removes duplicates inside a class list;
- resolves simple conflict groups;
- counts repeated compositions;
- writes a report.

Default report:

```text
.ui8px/reports/patterns.json
```

This command exits with `1` when repeated patterns are found. That is intentional: it lets CI use the command as a policy gate if a project wants that. For exploratory use, run it manually and review the report.

## `policy review`

```bash
npx ui8px policy review
```

Reads `.ui8px/telemetry/proposals.json` and prints the most frequent unknown, denied, or disallowed classes seen during `lint --learn`.

This command does not edit policy files.

## Rule IDs

- `UI8PX001`: disallowed spacing token for the current scope.
- `UI8PX002`: utility class not in allowed policy.
- `UI8PX003`: utility class is explicitly denied.
- `UI8PX004`: conflicting utilities inside one class list.
- `UI8PX005`: unknown `ui-*` semantic class.
- `UI8PX101`: UI8Kit ARIA markup hook requires a pattern that is missing from the configured bundle.

## Exit Codes

- `0`: success, no blocking findings.
- `1`: lint, grid, or pattern findings.
- `2`: invalid usage or runtime error.
