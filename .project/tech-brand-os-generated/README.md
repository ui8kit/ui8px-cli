# Tech Brand OS Generated Kit

This directory was generated from the machine-readable Tech Brand OS source files.

## Included
- `theme.css`: generated CSS variables and brand utility recipes
- `tailwind.extend.ts`: Tailwind extension object derived from brand tokens
- `prompts/`: five isolated prompt files for landing, blog, cms, dashboard, and docs
- `parser-fixtures/`: parser contract fixtures derived from the reference project

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
1. Attach `tech-brand-os.schema.json` as the source-of-truth brand contract.
2. Use one file from `prompts/` as the isolated surface prompt.
3. If you need parser-friendly HTML/Tailwind output, validate against `tech-brand-os-parser-contract.json` and the emitted fixture set.
4. Use `theme.css` and `tailwind.extend.ts` as generated adapters, not as the canonical source of truth.
