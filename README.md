# brand-os

`brand-os` is a Node/Bun CLI for four workflows:

- scaffold UI8Kit-ready Vite + React projects
- validate utility class maps against an `8 + 4` layout spacing policy
- emit generated assets from a Brand OS schema
- parse HTML into a classified and normalized AST

The package is published as `brand-os`, so commands use `npx brand-os`.

## Install

No global install needed.

```bash
npx brand-os my-app
npx brand-os --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
npx brand-os --schema "./brand.schema.json"
```

You can also run with npm or bun:

```bash
npm exec brand-os -- my-app --template react-resta
bunx brand-os my-app --template react-resta
```

## 1) Scaffolding

Usage:

```bash
npx brand-os [OPTION]... [DIRECTORY]
```

### Scaffolding options

- `-t, --template <name>` — template name (`react` or `react-resta`), default `react`
- `-i, --immediate` — install dependencies and run dev server after creation
- `-h, --help` — show help

### Examples

```bash
npx brand-os my-app
npx brand-os my-app --template react-resta
npx brand-os my-app --template react-resta --immediate
```

## 2) Layout validation mode

Use this when you need to verify a class-to-CSS JSON map:

```bash
npx brand-os --design grid --input ui8kit.map.json --output ui8kit.map.backlog.json
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

## 3) Brand OS emit mode

Use this when you want to generate prompt files, parser fixtures, parser-contract snapshots, and brand-owned adapter assets from a Brand OS schema:

```bash
npx brand-os --schema "./.project/Tech Brand OS/tech-brand-os.schema.json"
npx brand-os --schema "./.project/RestA Brand OS/resta-brand-os.schema.json" --emit-dir "./generated/resta"
```

Main options:

- `--schema <path>` — path to the Brand OS schema file
- `--prompt-pack <path>` — override prompt pack JSON path
- `--parser-contract <path>` — override parser contract JSON path
- `--fixtures <path>` — override parser fixture source JSON path
- `--emit-dir <path>` — output directory for generated assets
- `--verbose`

## 4) AST parser mode

Use this when you want to validate parser fixtures or parse HTML into a classified and normalized AST.

Validate one or more fixture suites:

```bash
npx brand-os --ast-suite "./.project/Tech Brand OS/tech-brand-os.schema.json" --ast-suite "./.project/RestA Brand OS/resta-brand-os.schema.json"
```

Parse a real HTML file:

```bash
npx brand-os --ast-input "./.project/RestA Brand OS/reference/RoseUI-Welcome-Restaurant.html" --ast-suite "./.project/RestA Brand OS/resta-brand-os.schema.json" --ast-output "./resta-hero-ast.json"
```

Main options:

- `--ast-input <path>` — HTML file to parse
- `--ast-output <path>` — JSON report output path
- `--ast-contract <path>` — explicit parser contract path
- `--ast-suite <path>` — Brand OS schema used to resolve parser contract and fixture source
- `--verbose`

## Development

```bash
npm run typecheck
npm run build
```

The build output is published from `dist/` through `bin.brand-os`.

## Publish

```bash
npm publish --access=public
```

## License

MIT
