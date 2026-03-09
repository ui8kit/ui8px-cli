# ui8px

`ui8px` is a Node/Bun CLI for two workflows:

- scaffold UI8Kit-ready Vite + React projects
- validate utility class maps against an `8 + 4` layout spacing policy

The package is published as `ui8px`, so commands use `npx ui8px`.

## Install

No global install needed.

```bash
npx ui8px my-app
npx ui8px --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

You can also run with npm or bun:

```bash
npm exec ui8px -- my-app --template react-resta
bunx ui8px my-app --template react-resta
```

## 1) Scaffolding

Usage:

```bash
npx ui8px [OPTION]... [DIRECTORY]
```

### Scaffolding options

- `-t, --template <name>` — template name (`react` or `react-resta`), default `react`
- `-i, --immediate` — install dependencies and run dev server after creation
- `-h, --help` — show help

### Examples

```bash
npx ui8px my-app
npx ui8px my-app --template react-resta
npx ui8px my-app --template react-resta --immediate
```

## 2) Layout validation mode

Use this when you need to verify a class-to-CSS JSON map:

```bash
npx ui8px --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
```

Optional flags:

- `--spacing-base <number>` (default: `4`)
- `--root-font-size <number>` (default: `16`)
- `--verbose`

### Supported validation scope

The validator checks only:

- `margin`, `margin-*`
- `padding`, `padding-*`
- `gap`, `row-gap`, `column-gap`
- `width`, `height`, `min-width`, `min-height`, `max-width`, `max-height`
- `top`, `right`, `bottom`, `left`, `inset`

All other properties are ignored in this mode.

### 8 + 4 policy

A value is valid when resolved to pixels it is:

- `0`
- divisible by `8`
- or divisible by `4`

Supported measurable units:

- direct `px`
- `rem` (resolved through `--root-font-size`)
- `calc(var(--spacing) * N)` (resolved through `--spacing-base`)

Ignored values:

- `auto`, `fit-content`, `min-content`, `max-content`, `%`, `vh`, `vw`

### Backlog output format

```json
{
  "meta": {
    "input": "ui8kit.map.json",
    "output": "ui8kit.map.backlog.json",
    "design": "grid",
    "spacingBase": 4,
    "rootFontSize": 16,
    "generatedAt": "2026-03-07T12:00:00.000Z",
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
    }
  ]
}
```

## Exit codes

- `0` — no violations
- `1` — violations found
- `2` — invalid usage or runtime error

## Development

```bash
bun run typecheck
bun run build
```

The build output is published from `dist/` through `bin.ui8px`.

## Publish

```bash
npm publish --access=public
```

## License

MIT
