# ui8px

`ui8px` is a framework-agnostic CLI for keeping utility-class projects aligned to a strict 8px design grid. It is intended for Tailwind-style workflows where classes remain explicit in source code, while a policy layer prevents drift, raw palette usage, accidental 4px layout spacing, and repeated unreviewed patterns.

Run without installing:

```bash
npx ui8px@latest lint ./...
```

## Documentation

For a full onboarding path, read the docs:

- [101: 8px Grid Design](./docs/101-8px-grid.md)
- [Why Tailwind](./docs/why-tailwind.md)
- [CLI API Reference](./docs/cli-api.md)
- [Policy Files](./docs/policy-files.md)
- [Examples And Use Cases](./docs/examples-and-use-cases.md)
- [Testing, CI, And Publishing](./docs/testing-ci-publishing.md)

## Commands

```bash
npx ui8px init
npx ui8px init --preset go
npx ui8px lint ./...
npx ui8px lint ./... --ignore .manual .project
npx ui8px lint ./... --learn
npx ui8px validate aria ./...
npx ui8px validate grid --input class-map.json --output class-map.backlog.json
npx ui8px validate patterns ./...
npx ui8px policy review
```

Legacy class-map validation is still supported:

```bash
npx ui8px --design grid --input class-map.json --output class-map.backlog.json
```

## Project Files

`ui8px init` creates:

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

If `.ui8px` is missing, `ui8px lint` uses bundled defaults. For Go component libraries, use `npx ui8px init --preset go` to make `ui/**`, `components/**`, and `utils/**/*.go` control scope while examples and views remain strict layout scope.

`ui8px` reads the current working directory's `.gitignore` automatically during file scanning. Use `--ignore` to add extra ignored files or folders for a single run:

```bash
npx ui8px lint ./... --ignore .manual .project snapshots
npx ui8px validate patterns ./... --ignore fixtures/reference
npx ui8px validate aria ./... --ignore .manual
```

Place scan paths before `--ignore`; every non-option value after `--ignore` is treated as an ignore entry.

## 8px Spacing Policy

Layout scope is strict 8px:

```json
{
  "spacing": {
    "layout": ["0", "2", "4", "6", "8", "10", "12", "16", "20", "24"],
    "control": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "10", "12"]
  }
}
```

Examples:

- `px-2` = 8px, allowed in layout.
- `px-4` = 16px, allowed in layout.
- `px-3` = 12px, denied in layout as fine tuning.
- `px-3` is allowed in control scope for buttons, fields, badges, tabs, and other compact primitives.

Scopes are file/folder based:

```json
{
  "defaultScope": "layout",
  "scopes": [
    {
      "name": "controls",
      "files": ["src/ui/**", "src/components/**", "ui/**", "components/**"],
      "spacing": "control"
    },
    {
      "name": "layout",
      "files": ["src/views/**", "src/pages/**", "examples/**", "internal/site/views/**"],
      "spacing": "layout"
    }
  ]
}
```

## Linting

```bash
npx ui8px lint ./...
npx ui8px lint ./... --ignore .manual .project
```

Supported source types:

- `.templ` and `.html`: static `class="..."` values.
- `.css`: `@apply ...;` utility lists.
- `.go`: static `templ.Attributes{"class": "..."}` style values, `utils.Cn(...)`, `Cn(...)`, mixed literal/dynamic `Cn` calls, and static `return "..."` helper strings.

Go examples:

```go
return utils.Cn(base, "px-3", props.Class)
```

```go
return "h-8 px-3 text-sm"
```

The extractor reads only static string literals. It does not execute Go code and ignores dynamic arguments.

By default, lint scanning skips built-in transient folders (`.git`, `.ui8px`, `node_modules`, `dist`, coverage/cache folders) and entries from the local `.gitignore`.

Example diagnostic:

```text
src/views/landing.templ:24:16 UI8PX001 disallowed utility class "px-3"
Scope: layout
Reason: px-3 is not allowed in layout scope.
Suggestion: use px-2 or px-4
```

Rules:

- `UI8PX001`: disallowed spacing token for current scope.
- `UI8PX002`: utility class not in allowed policy.
- `UI8PX003`: utility class is explicitly denied.
- `UI8PX004`: conflicting utilities inside the same class list.
- `UI8PX005`: unknown `ui-*` semantic class.

## Learn Mode

```bash
npx ui8px lint ./... --learn
```

Learn mode writes:

```text
.ui8px/telemetry/observed.jsonl
.ui8px/telemetry/proposals.json
```

Plain `lint` does not mutate files. `--learn` records unknown, denied, and disallowed classes so a developer or LLM-assisted workflow can review recurring issues later.

## Pattern Discovery

```bash
npx ui8px validate patterns ./...
```

This command finds repeated class-list compositions. It normalizes class order, removes internal duplicates, resolves simple conflict groups, and writes:

```text
.ui8px/reports/patterns.json
```

Example:

```text
Repeated pattern found 14 times:
  flex items-center justify-between gap-4 px-6 py-4
Suggested semantic class:
  ui-section-header
```

`ui8px` does not automatically generate `@apply` CSS. It reports candidates so semantic `ui-*` patterns can be reviewed intentionally.

## ARIA Bundle Validation

```bash
npx ui8px validate aria ./...
```

This command scans source files for static `data-ui8kit="..."` hooks and common UI8Kit component calls such as `@ui8layout.Shell(...)`, `@ui.Accordion(...)`, and `@ui.Tabs(...)`. It checks that the matching `@ui8kit/aria` pattern is included in the site bundle. It reads the generated `web/static/js/manifest.json` when present, otherwise it falls back to `package.json` `ui8kit.aria`.

Examples:

- `data-ui8kit="dialog"` requires the `dialog` pattern.
- `data-ui8kit="sheet"` and `data-ui8kit="alertdialog"` also require `dialog`.
- `data-ui8kit="tabs"` requires `tabs`.
- `@ui8layout.Shell(...)` requires `dialog` because the shell owns a mobile sheet.

Use `--package <path>` or `--manifest <path>` when the files live outside the current working directory.

## Grid Map Validation

The existing map validator remains available:

```bash
npx ui8px validate grid --input class-map.json --output class-map.backlog.json
```

It checks CSS declaration values in a class map and reports values that do not resolve to the 8/4px grid.

## Exit Codes

- `0` — no blocking violations.
- `1` — lint, grid, or pattern violations found.
- `2` — invalid usage or runtime error.

## Publishing

Before publishing:

```bash
npm run preflight
npm publish --access public --provenance
```
