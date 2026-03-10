# RestA Brand OS Docs Prompt

Use this file as the isolated surface prompt when you want to start building directly with the RestA Brand OS.

## Attach
- `resta-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- documentationName: {{documentationName}}
- docAudience: {{docAudience}}
- docTypes: {{docTypes}}
- navigationDepth: {{navigationDepth}}

## Optional Inputs
- codeLanguageBias: {{codeLanguageBias}}
- policySections: {{policySections}}
- integrationTargets: {{integrationTargets}}

## Surface Goal
Document brand usage, restaurant content patterns, operational workflows, and implementation rules clearly.

## Brand Summary
RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.

## Style Keywords
- hospitality-first
- warm premium dining
- rose and zinc palette
- food-forward storytelling
- soft polished restaurant UI
- approachable celebratory elegance

## Negative Style Keywords
- cold enterprise
- generic fast-food
- cyberpunk neon
- clinical minimalism
- over-ornate luxury
- tech product styling

## Cross-Surface Rules
- Design for hospitality and appetite before decorative novelty.
- Keep one clear primary guest action on guest-facing surfaces.
- Use the script display family selectively for charm and brand identity, not for dense content.
- Let photography and menu storytelling do more brand work than excessive ornament.
- Use rose as the emotional accent and zinc as the stabilizing neutral system.
- Keep operational surfaces calmer and more structured while still feeling like the same brand.
- Use gradients for promotions and campaigns with restraint.
- Preserve clear reservation, menu, and contact pathways.
- The result should feel consistent from public site to restaurant back office to docs.

## Section Expectations
- docs intro
- sidebar or grouped navigation
- article shell
- checklists and callouts
- tables and examples

## Surface Overrides
- Keep docs clear and practical, but let the brand still feel warm and human.
- Use script display minimally or not at all in dense technical documentation.
- Favor readability and policy clarity over promotion.

## Deliverables
- docs information architecture
- navigation model
- article shell and callout patterns
- final implementation or prototype

## Audit Checklist
- Do docs remain readable and restrained?
- Does the warm brand layer survive without turning docs into marketing pages?
- Can the same docs patterns scale to internal ops and implementation guidance?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.

## Copy-Ready Prompt
```text
Design a docs surface in the RestA Brand OS style.

Treat `resta-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.
Surface goal: Document brand usage, restaurant content patterns, operational workflows, and implementation rules clearly.

Style keywords:
- hospitality-first
- warm premium dining
- rose and zinc palette
- food-forward storytelling
- soft polished restaurant UI
- approachable celebratory elegance

Avoid:
- cold enterprise
- generic fast-food
- cyberpunk neon
- clinical minimalism
- over-ornate luxury
- tech product styling

Cross-surface rules:
- Design for hospitality and appetite before decorative novelty.
- Keep one clear primary guest action on guest-facing surfaces.
- Use the script display family selectively for charm and brand identity, not for dense content.
- Let photography and menu storytelling do more brand work than excessive ornament.
- Use rose as the emotional accent and zinc as the stabilizing neutral system.
- Keep operational surfaces calmer and more structured while still feeling like the same brand.
- Use gradients for promotions and campaigns with restraint.
- Preserve clear reservation, menu, and contact pathways.
- The result should feel consistent from public site to restaurant back office to docs.

Surface-specific overrides:
- Keep docs clear and practical, but let the brand still feel warm and human.
- Use script display minimally or not at all in dense technical documentation.
- Favor readability and policy clarity over promotion.

Implementation target:
- Tailwind 4 + shadcn-compatible tokens or parser-friendly Tailwind HTML, with eventual UI8Kit compatibility in mind

Required inputs:
- documentationName: {{documentationName}}
- docAudience: {{docAudience}}
- docTypes: {{docTypes}}
- navigationDepth: {{navigationDepth}}

Optional inputs:
- codeLanguageBias: {{codeLanguageBias}}
- policySections: {{policySections}}
- integrationTargets: {{integrationTargets}}

Expected sections:
- docs intro
- sidebar or grouped navigation
- article shell
- checklists and callouts
- tables and examples

Deliverables:
- docs information architecture
- navigation model
- article shell and callout patterns
- final implementation or prototype

Suggested page purpose: Document brand usage, operational workflows, restaurant content patterns, and implementation guidance.
Suggested required sections: docs-hero, docs-sidebar-layout, docs-article-shell, callouts-and-checklists

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design documentation for {{documentationName}} in the RestA Brand OS style.
- Audience: {{docAudience}}.
- Doc types: {{docTypes}}.
- Navigation depth: {{navigationDepth}}.
- The result should feel operationally clear while preserving the warm and polished RestA brand character.

Audit before finishing:
- Do docs remain readable and restrained?
- Does the warm brand layer survive without turning docs into marketing pages?
- Can the same docs patterns scale to internal ops and implementation guidance?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.
```
