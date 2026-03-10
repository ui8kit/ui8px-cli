# brand-os

`brand-os` is a Node/Bun CLI for four workflows:

- scaffold UI8Kit-ready Vite + React projects
- validate utility class maps against an `8 + 4` layout spacing policy
- emit generated assets from a Brand OS schema
- parse HTML into a classified and normalized AST

The package is published as `brand-os`, so commands use `npx brand-os`.

Flag-based command map:

- `npx brand-os [OPTION]... [DIRECTORY]` — scaffold mode
- `npx brand-os --design grid --input <path> --output <path>` — validate mode
- `npx brand-os --schema <schema-path>` — Brand OS emit mode
- `npx brand-os --ast-suite <brand-schema-path> ...` — AST parser mode
- `npx brand-os --help` — list all modes and options

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

## 5) How to build a new brand package (quick)

The minimal brand package consists of:

- `*.schema.json` — base Brand OS definition
- `*-parser-contract.json` — class classifier rules
- `*-prompt-pack.json` — prompt templates
- `*-parser-fixtures.source.json` — sample-based classifier tests

Typical file layout:

```txt
.project/my-brand/my-brand.schema.json
.project/my-brand/my-brand-parser-contract.json
.project/my-brand/my-brand-prompt-pack.json
.project/my-brand/my-brand-parser-fixtures.source.json
```

Common command:

```bash
npx brand-os --schema ".project/my-brand/my-brand.schema.json"
```

The schema can define:

- `meta` (`name`, `slug`, `description`) identifiers
- `tokens` (color, typography, radius, shadow, spacing, motion)
- optional `designGrammar` and `recipes` for visual consistency
- `emit.assets` to copy your shared/tailwind3/tailwind4 adapter files

By default, companion files are auto-discovered with these suffixes based on the schema `slug`:

- `-prompt-pack.json`
- `-parser-contract.json`
- `-parser-fixtures.source.json`
- output directory: `<slug>-generated`

Optional custom names:

```bash
npx brand-os \
  --schema ".project/my-brand/my-brand.schema.json" \
  --prompt-pack ".project/my-brand/my-prompts.json" \
  --parser-contract ".project/my-brand/contracts/my-contract.json" \
  --fixtures ".project/my-brand/fixtures/my-fixtures.json" \
  --emit-dir ".project/my-brand/generated"
```

Validate brand parsing fixtures:

```bash
npx brand-os --ast-suite ".project/my-brand/my-brand.schema.json"
```

### Copy-paste starter pack (minimal)

Use this starter block as a starting point for a brand.

```json
{
  "meta": {
    "name": "My Brand OS",
    "slug": "my-brand",
    "description": "A consistent brand language for web and product surfaces."
  },
  "emit": {
    "assets": []
  },
  "tokens": {
    "color": {
      "light": {
        "background": "hsl(0 0% 100%)",
        "foreground": "hsl(220 20% 10%)",
        "card": "hsl(0 0% 100%)",
        "popover": "hsl(0 0% 100%)",
        "primary": "hsl(215 85% 54%)",
        "primaryForeground": "hsl(0 0% 100%)",
        "secondary": "hsl(210 40% 96%)",
        "secondaryForeground": "hsl(220 20% 20%)",
        "muted": "hsl(210 40% 96%)",
        "mutedForeground": "hsl(220 20% 40%)",
        "accent": "hsl(45 95% 70%)",
        "accentForeground": "hsl(220 20% 20%)",
        "destructive": "hsl(0 84% 60%)",
        "destructiveForeground": "hsl(0 0% 100%)",
        "border": "hsl(214 32% 91%)",
        "input": "hsl(214 32% 91%)",
        "ring": "hsl(215 85% 54%)"
      },
      "dark": {},
      "categories": {}
    },
    "typography": {
      "families": {
        "display": "Inter",
        "body": "Inter",
        "ui": "Inter"
      }
    },
    "radius": {
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem"
    },
    "shadow": {
      "sm": "0 1px 2px rgba(15, 23, 42, 0.05)",
      "md": "0 2px 8px rgba(15, 23, 42, 0.10)"
    }
  },
  "designGrammar": {
    "shapeLanguage": {
      "core": "Clear hierarchy, generous whitespace, soft elevation."
    }
  },
  "recipes": {
    "pageArchetypes": {},
    "sectionArchetypes": {}
  }
}
```

`my-brand-parser-contract.json`

```json
{
  "version": "1.0",
  "buckets": {
    "structural": [
      "container",
      "mx-auto",
      "max-w-*",
      "flex",
      "grid",
      "gap-*",
      "w-full",
      "h-full",
      "min-h-screen",
      "p-*",
      "px-*",
      "py-*",
      "items-*",
      "justify-*"
    ],
    "semantic": [
      "text-*",
      "font-*",
      "leading-*",
      "tracking-*",
      "truncate",
      "font-bold",
      "font-semibold"
    ],
    "decorative": [
      "rounded-*",
      "bg-*",
      "text-white",
      "shadow-*",
      "border",
      "border-*",
      "ring",
      "ring-*",
    "hover:*"
  ]
  },
  "customUtilities": {
    "structural": [],
    "semantic": [],
    "decorative": []
  },
  "semanticPrefix": [],
  "decorativePrefix": [
    "hover:",
    "focus:",
    "active:"
  ],
  "fallback": {
    "structural": [
      "hidden",
      "block"
    ],
    "semantic": [
      "font-medium"
    ],
    "decorative": [
      "hidden"
    ]
  }
}
```

`my-brand-parser-fixtures.source.json`

```json
{
  "schemaVersion": "1.0.0",
  "brandId": "my-brand",
  "referenceProjectName": "my-brand-reference",
  "fixtures": [
    {
      "id": "my-brand-hero",
      "title": "Hero structure",
      "sourceFile": "hero.html",
      "description": "Basic hero layout with CTA",
      "classes": [
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
        "container",
        "mx-auto",
        "px-4",
        "bg-white",
        "text-center",
        "rounded-lg",
        "shadow-md",
        "text-4xl",
        "font-bold"
      ],
      "expected": {
        "structural": [
          "min-h-screen",
          "flex",
          "items-center",
          "justify-center",
          "container",
          "mx-auto",
          "px-4"
        ],
        "semantic": [
          "text-center",
          "text-4xl",
          "font-bold"
        ],
        "decorative": [
          "bg-white",
          "rounded-lg",
          "shadow-md"
        ],
        "unknown": []
      },
      "notes": ["Adjust as you onboard your own brand patterns."]
    }
  ]
}
```

`my-brand-prompt-pack.json`

```json
{
  "sharedContext": {
    "brandSummary": "My Brand OS focuses on clarity, speed, and conversion-first UI.",
    "styleKeywords": ["clean", "confident", "modern", "accessible"],
    "crossSurfaceRules": [
      "Preserve consistent spacing rhythm across landing, docs, dashboard, CMS surfaces.",
      "Keep hierarchy explicit through scale and contrast."
    ]
  },
  "surfaces": {
    "landing": {
      "goal": "Generate a conversion-ready landing page section set.",
      "requiredInputs": [
        "landing goals",
        "primary CTA",
        "value proposition"
      ],
      "optionalInputs": ["social proof", "metrics"],
      "promptTemplate": [
        "Use this brand OS for all visual decisions.",
        "Prioritize clarity-first hierarchy and measurable conversion path."
      ],
      "auditChecklist": [
        "Does hero include a single primary CTA?",
        "Are section breaks consistent and predictable?"
      ],
      "deliverables": ["hero", "benefits", "social proof", "FAQ", "footer"]
    }
  }
}
```

## 6) 5-minute first run checklist

1. Prepare `.project/my-brand/` files: `my-brand.schema.json`, `my-brand-parser-contract.json`, `my-brand-prompt-pack.json`, `my-brand-parser-fixtures.source.json`.
2. Create `my-brand.adapters/` and add at least `shared/tokens.css` and `tailwind4/index.css`; optionally add `tailwind3/tailwind.extend.ts` and `tailwind4/shadcn.css`.
3. Verify schema `meta.slug` matches file prefix (`my-brand`) or pass explicit paths.
4. Run:
   `npx brand-os --schema ".project/my-brand/my-brand.schema.json"`
5. Validate parser fixtures:
   `npx brand-os --ast-suite ".project/my-brand/my-brand.schema.json"`
6. If the command returns violations, inspect the unknown classes in the report and add only missing entries to the contract buckets.

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
