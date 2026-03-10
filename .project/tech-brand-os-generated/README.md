# Tech Brand OS Generated Kit

This directory was generated from the machine-readable brand operating system source files.

## Included
- `theme.css`: generated CSS variables and brand utility recipes
- `tailwind.extend.ts`: Tailwind extension object derived from brand tokens
- `prompts/`: 5 isolated surface prompt files
- `parser-fixtures/`: parser contract fixtures derived from the reference input set

## Brand Summary
Thoughtful technology should feel precise without becoming cold and modern without losing warmth.

## Personality
- warm
- intelligent
- calm
- precise
- human
- editorial
- tactile

## Anti-Personality
- generic-saas
- neon-cyberpunk
- cold-enterprise
- playful-chaotic
- glassmorphism-heavy
- over-animated

## Usage
1. Attach the schema file as the source-of-truth brand contract.
2. Use one file from `prompts/` as the isolated surface prompt.
3. If you need parser-friendly HTML/Tailwind output, validate against the parser contract and the emitted fixture set.
4. Use `theme.css` and `tailwind.extend.ts` as generated adapters, not as the canonical source of truth.
