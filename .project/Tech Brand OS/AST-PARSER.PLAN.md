# AST Parser Plan

## Goal
Build a parser pipeline that can take parser-friendly HTML + Tailwind prototypes and convert them into structured, system-safe UI output for future `UI8Kit` generation.

The long-term target is:

1. parse HTML into a stable AST
2. classify classes using the Brand OS parser contract
3. normalize layout and semantics
4. map eligible nodes into `UI8Kit` primitives and utility props
5. preserve decorative styling as a separate brand layer
6. emit an audit report for unsupported or ambiguous cases

## End State
The parser should eventually support this flow:

`HTML/Tailwind prototype`
-> `DOM AST`
-> `class classification`
-> `normalized semantic AST`
-> `UI8Kit mapping`
-> `React/UI8Kit output + audit report`

## Phase 1. HTML AST Ingestion
Parse source HTML into a consistent intermediate representation.

Requirements:
- preserve tag names
- preserve attributes
- preserve `class`
- preserve child order
- preserve text nodes
- preserve inline semantic hints like `data-kind`, `data-slot`, `data-layer`

Output:
- `HtmlNode[]`
- source location metadata where possible

## Phase 2. Class Classification
Run every class token through the Brand OS parser contract.

Buckets:
- `structural`
- `semantic`
- `decorative`
- `unknown`

Rules:
- classification is per class, not per element
- mixed nodes are normal
- unknown classes must never be silently dropped
- arbitrary values should only pass when explicitly approved by the contract

Output:
- `ClassifiedNode`

## Phase 3. Semantic Normalization
Convert raw DOM structure into a more meaningful internal model.

Examples:
- repeated card-like structures -> `CardPattern`
- hero shell + copy + actions + media -> `HeroPattern`
- nav shell + links + actions -> `HeaderPattern`
- article card overlay pattern -> `ArticleCardPattern`

This phase should also infer:
- likely section boundaries
- likely wrapper components
- likely content roles

Helpful signals:
- tag names
- `data-kind`
- repeated class signatures
- known named utilities like `pill-nav` or `floating-button`

Output:
- `NormalizedNode`
- optional `patternName`
- optional `wrapperCandidate`

## Phase 4. UI8Kit Mapping
Map normalized nodes into `UI8Kit` primitives and props where possible.

Examples:
- structural layout -> `Block`, `Stack`, `Group`, `Container`, `Grid`, `Box`
- typography -> `Text`, `Title`
- CTA / control patterns -> `Button`, `Field`, `Badge`
- article or feature shells -> branded wrappers or future block components

Mapping policy:
- `structural` classes should prefer utility props
- `semantic` classes should prefer tokens, variants, or named wrappers
- `decorative` classes should stay outside the core system layer
- `unknown` classes should produce a migration warning

Output:
- `Ui8KitNode`
- `mappingWarnings[]`

## Phase 5. Brand Layer Preservation
Not everything should be converted into `UI8Kit props`.

Preserve a separate brand layer for:
- gradients
- overlays
- blur
- one-off transforms
- campaign visuals
- non-whitelisted decorative effects

This layer should remain attachable at app level so the system layer stays clean.

Output:
- `systemLayer`
- `brandLayer`
- `unsupportedDecorativeLayer`

## Phase 6. Audit and Backlog
Every parse should generate a report.

The report should include:
- mapped nodes
- wrapper candidates
- unsupported classes
- unknown arbitrary values
- token candidates
- variant candidates
- recipe candidates
- nodes that still require manual review

This turns parser work into framework roadmap input.

## Important Mapping Rules

### Structural
Good candidates for direct `UI8Kit props` conversion:
- spacing
- layout
- width / height
- container constraints
- flex / grid behavior
- position when it remains compositional

### Semantic
Good candidates for tokens or variants:
- `bg-card`
- `text-muted-foreground`
- `rounded-[2.5rem]` when approved as brand shell radius
- named utilities like `pill-nav`

### Decorative
Should remain outside the core prop layer:
- gradient overlays
- backdrop blur
- one-off hover zooms
- atmospheric image treatments

### Unknown
Must be reported.

Examples:
- unsupported arbitrary values
- raw custom classes not covered by parser contract
- mixed patterns without enough semantic context

## Data Structures To Introduce Later
- `HtmlNode`
- `ClassifiedClassToken`
- `ClassifiedNode`
- `NormalizedNode`
- `PatternMatch`
- `Ui8KitNode`
- `ParseAuditReport`

## Suggested Implementation Order
1. HTML tokenizer / parser wrapper
2. class classifier using `tech-brand-os-parser-contract.json`
3. fixture runner against `parser-fixtures`
4. normalized AST pass
5. simple `UI8Kit` primitive mapping for layout + typography
6. wrapper inference for repeated patterns
7. audit report emitter
8. code generator

## Success Criteria
- reference fixtures classify correctly
- mixed nodes split cleanly across structural/semantic/decorative
- at least hero/card/container patterns can normalize reliably
- structural utilities convert into safe `UI8Kit props`
- decorative layers remain separable
- unknowns are visible and actionable

## Non-Goals For The First Version
- perfect visual equivalence
- full arbitrary Tailwind support
- automatic conversion of every custom animation
- guessing business semantics with no structural signal

First version should optimize for:
- safety
- explainability
- deterministic conversion
- backlog generation for missing `UI8Kit` features
