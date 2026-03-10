# RestA Brand OS Generated Kit

This directory was generated from the machine-readable brand operating system source files.

## Included
- `prompts/`: 5 isolated surface prompt files
- `parser-fixtures/`: parser contract fixtures derived from the reference input set
- `parser-contract.json`: copied parser contract snapshot
- adapter assets copied from the brand package: 5

## Adapter Assets
- `adapters/shared/tokens.css` — Shared brand tokens and plain CSS utilities.
- `adapters/tailwind3/theme.css` — Tailwind 3 CSS entrypoint for RestA.
- `adapters/tailwind3/tailwind.extend.ts` — Tailwind 3 theme extension adapter for RestA.
- `adapters/tailwind4/index.css` — Tailwind 4 CSS entrypoint for RestA.
- `adapters/tailwind4/shadcn.css` — Tailwind 4 shadcn-style theme adapter for RestA.

## Brand Summary
RestA should feel warm, refined, appetizing, and welcoming without becoming kitschy or generic.

## Personality
- warm
- welcoming
- polished
- sensory
- celebratory
- approachable-premium
- hospitality-first

## Anti-Personality
- cold-enterprise
- clinical-minimalist
- fast-food-generic
- cyberpunk-tech
- over-styled-luxury
- cartoonish-playful

## Usage
1. Attach the schema file as the source-of-truth brand contract.
2. Use one file from `prompts/` as the isolated surface prompt.
3. If you need parser-friendly HTML/Tailwind output, validate against the parser contract and the emitted fixture set.
4. Use the copied adapter assets only for the stacks they were authored for. The CLI does not assume Tailwind version or CSS adapter strategy.
