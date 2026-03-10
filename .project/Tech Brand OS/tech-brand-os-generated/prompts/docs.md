# Tech Brand OS Docs Prompt

Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.

## Attach
- `tech-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- productName: {{productName}}
- docAudience: {{docAudience}}
- docTypes: {{docTypes}}
- navigationDepth: {{navigationDepth}}

## Optional Inputs
- apiReferenceStyle: {{apiReferenceStyle}}
- codeLanguageBias: {{codeLanguageBias}}
- searchModel: {{searchModel}}
- calloutTypes: {{calloutTypes}}

## Surface Goal
Present technical documentation with clarity, navigability, and trustworthy brand tone.

## Brand Summary
Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.

## Style Keywords
- calm technology
- editorial-tech
- warm minimalism
- tactile precision
- premium but approachable
- low-noise product design

## Negative Style Keywords
- generic saas
- neon cyberpunk
- cold enterprise
- glassmorphism heavy
- startup cliché gradients
- over-gamified dashboard

## Cross-Surface Rules
- Prioritize information hierarchy over decorative effects.
- Keep one clear primary action per screen or surface.
- Use brand identity through typography, spacing, surfaces, and composition before one-off effects.
- Prefer soft neutral canvases, charcoal text, and restrained accent usage.
- Use large rounded shells and pill controls as signature shape language.
- Use serif display type mainly for landing and editorial surfaces; keep app, dashboard, and docs headings predominantly sans.
- Use motion only when it improves comprehension or brand calm; never use motion as camouflage for weak composition.
- Avoid over-customizing basic shadcn primitives; use wrappers and branded sections for distinctiveness.
- Do not use arbitrary values unless they map to approved brand tokens or parser-safe exceptions.
- The result should feel like one brand across website, apps, docs, and media.

## Section Expectations
- docs home or intro hero
- sidebar or section nav
- article shell
- code blocks and copy interactions
- callouts
- toc or anchors
- related links or next steps

## Surface Overrides
- Use sans headings, body sans, and mono for code.
- Favor reading comfort and navigation over expressive marketing flourishes.
- Keep the warm neutral palette and rounded shells, but reduce editorial drama.

## Deliverables
- docs information architecture
- navigation model
- article shell and code treatment
- component strategy
- implementation plan

## Audit Checklist
- Can developers scan the docs quickly?
- Are code blocks and callouts clearer than the surrounding decoration?
- Does the docs surface still inherit the same brand DNA?
- Would the layout work for long-form and reference pages equally well?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.

## Copy-Ready Prompt
```text
Design a docs surface in the Tech Brand OS style.

Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.
Surface goal: Present technical documentation with clarity, navigability, and trustworthy brand tone.

Style keywords:
- calm technology
- editorial-tech
- warm minimalism
- tactile precision
- premium but approachable
- low-noise product design

Avoid:
- generic saas
- neon cyberpunk
- cold enterprise
- glassmorphism heavy
- startup cliché gradients
- over-gamified dashboard

Cross-surface rules:
- Prioritize information hierarchy over decorative effects.
- Keep one clear primary action per screen or surface.
- Use brand identity through typography, spacing, surfaces, and composition before one-off effects.
- Prefer soft neutral canvases, charcoal text, and restrained accent usage.
- Use large rounded shells and pill controls as signature shape language.
- Use serif display type mainly for landing and editorial surfaces; keep app, dashboard, and docs headings predominantly sans.
- Use motion only when it improves comprehension or brand calm; never use motion as camouflage for weak composition.
- Avoid over-customizing basic shadcn primitives; use wrappers and branded sections for distinctiveness.
- Do not use arbitrary values unless they map to approved brand tokens or parser-safe exceptions.
- The result should feel like one brand across website, apps, docs, and media.

Surface-specific overrides:
- Use sans headings, body sans, and mono for code.
- Favor reading comfort and navigation over expressive marketing flourishes.
- Keep the warm neutral palette and rounded shells, but reduce editorial drama.

Implementation target:
- Next.js + shadcn/ui + Tailwind CSS

Required inputs:
- productName: {{productName}}
- docAudience: {{docAudience}}
- docTypes: {{docTypes}}
- navigationDepth: {{navigationDepth}}

Optional inputs:
- apiReferenceStyle: {{apiReferenceStyle}}
- codeLanguageBias: {{codeLanguageBias}}
- searchModel: {{searchModel}}
- calloutTypes: {{calloutTypes}}

Expected sections:
- docs home or intro hero
- sidebar or section nav
- article shell
- code blocks and copy interactions
- callouts
- toc or anchors
- related links or next steps

Deliverables:
- docs information architecture
- navigation model
- article shell and code treatment
- component strategy
- implementation plan

Suggested page purpose: Make technical information navigable, readable, and trustworthy.
Suggested required sections: docs-hero, docs-sidebar-layout, docs-article-shell, callout-and-code-patterns

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a documentation experience for {{productName}} using Tech Brand OS.
- Audience: {{docAudience}}.
- Doc types: {{docTypes}}.
- Navigation depth: {{navigationDepth}}.
- Optional API reference style: {{apiReferenceStyle}}.
- Make the documentation feel technical, calm, and trustworthy, using Tech Brand OS tokens, surfaces, and spacing while simplifying typography toward sans + mono.
- Prioritize navigation, article readability, code clarity, and copyable patterns.
- Deliver:
- 1. docs IA and navigation model
- 2. page shell and article grammar
- 3. component patterns for code, callouts, tables, and links
- 4. final implementation or parser-friendly prototype

Audit before finishing:
- Can developers scan the docs quickly?
- Are code blocks and callouts clearer than the surrounding decoration?
- Does the docs surface still inherit the same brand DNA?
- Would the layout work for long-form and reference pages equally well?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.
```
