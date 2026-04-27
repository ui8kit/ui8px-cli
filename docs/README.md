# ui8px Documentation

`ui8px` is a small developer tool for teams that want Tailwind-style speed without losing spacing discipline. It does not replace Tailwind, a component library, or a design system. It adds a policy layer around explicit utility classes so prototypes, production views, and LLM-generated code stay aligned to an 8px grid.

## Start Here

Read these guides in order if you are new to the project:

1. [101: 8px Grid Design](./101-8px-grid.md)
2. [Why Tailwind](./why-tailwind.md)
3. [CLI API Reference](./cli-api.md)
4. [Policy Files](./policy-files.md)
5. [Examples And Use Cases](./examples-and-use-cases.md)
6. [Testing, CI, And Publishing](./testing-ci-publishing.md)

## What ui8px Guarantees

`ui8px` gives a practical guarantee: layout spacing uses a clear 8px rhythm unless a project explicitly opts into a narrower control scope.

That means:

- Layout files should use values like `px-2`, `px-4`, `px-6`, `px-8`.
- Compact control files may use fine tuning like `px-3`, `py-1`, `gap-1`.
- Go component libraries can opt into `init --preset go` so variant helpers and primitives get control-scope fine tuning while examples stay strict.
- Raw palette utilities like `bg-red-500` can be denied in favor of semantic tokens like `bg-destructive`.
- Repeated class sets can be discovered and reviewed before they become `ui-*` semantic patterns.

## Design Philosophy

`ui8px` intentionally keeps the source of truth close to the code:

- It validates classes that Tailwind can already see.
- It avoids broad safelists that inflate CSS.
- It does not generate CSS by default.
- It records recurring friction in `.ui8px/telemetry/` for human or LLM-assisted review.

The goal is not to turn utility classes into a Bootstrap clone. The goal is to keep low-level primitives clean while letting higher-level apps and brands promote only proven repeated patterns.
