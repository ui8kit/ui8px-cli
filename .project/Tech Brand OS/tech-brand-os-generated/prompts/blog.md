# Tech Brand OS Blog Prompt

Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.

## Attach
- `tech-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- publicationName: {{publicationName}}
- editorialFocus: {{editorialFocus}}
- readerAudience: {{readerAudience}}
- contentPillars: {{contentPillars}}
- primaryEngagementGoal: {{primaryEngagementGoal}}

## Optional Inputs
- newsletterCTA: {{newsletterCTA}}
- featuredArticleFormat: {{featuredArticleFormat}}
- categorySystem: {{categorySystem}}
- authorStrategy: {{authorStrategy}}

## Surface Goal
Create an editorial content system that feels branded, readable, and reusable across home, category, and article views.

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
- blog home hero
- intro statement
- featured article grid
- category/archive pattern
- article detail layout
- newsletter cta
- author or credibility section

## Surface Overrides
- Lean harder into editorial warmth and reading comfort.
- Use serif display type for hero and article headings.
- Use signature article cards rather than default generic cards.

## Deliverables
- content information architecture
- category and tag strategy
- blog home layout
- article page layout
- component pattern list
- implementation plan

## Audit Checklist
- Are article cards distinctive and reusable?
- Does the article page privilege reading comfort over decoration?
- Do category colors or tags feel systematic rather than arbitrary?
- Does the blog feel like the same brand as the landing and app?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.

## Copy-Ready Prompt
```text
Design a blog surface in the Tech Brand OS style.

Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.
Surface goal: Create an editorial content system that feels branded, readable, and reusable across home, category, and article views.

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
- Lean harder into editorial warmth and reading comfort.
- Use serif display type for hero and article headings.
- Use signature article cards rather than default generic cards.

Implementation target:
- Next.js + shadcn/ui + Tailwind CSS

Required inputs:
- publicationName: {{publicationName}}
- editorialFocus: {{editorialFocus}}
- readerAudience: {{readerAudience}}
- contentPillars: {{contentPillars}}
- primaryEngagementGoal: {{primaryEngagementGoal}}

Optional inputs:
- newsletterCTA: {{newsletterCTA}}
- featuredArticleFormat: {{featuredArticleFormat}}
- categorySystem: {{categorySystem}}
- authorStrategy: {{authorStrategy}}

Expected sections:
- blog home hero
- intro statement
- featured article grid
- category/archive pattern
- article detail layout
- newsletter cta
- author or credibility section

Deliverables:
- content information architecture
- category and tag strategy
- blog home layout
- article page layout
- component pattern list
- implementation plan

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a blog or media experience for {{publicationName}} in the Tech Brand OS style.
- Editorial focus: {{editorialFocus}}.
- Reader audience: {{readerAudience}}.
- Content pillars: {{contentPillars}}.
- Primary engagement goal: {{primaryEngagementGoal}}.
- Optional newsletter CTA: {{newsletterCTA}}.
- Build a coherent system for blog home, category/archive views, and article detail pages.
- Keep the brand feeling calm, credible, and human, with strong readability and a recognizable editorial card pattern.
- Use warm neutral surfaces, charcoal type, restrained accent, large rounded shells, and low-noise motion.
- Deliver:
- 1. Editorial system strategy.
- 2. Page archetypes and content slots.
- 3. Signature components and tag strategy.
- 4. Final implementation or parser-friendly Tailwind prototype.

Audit before finishing:
- Are article cards distinctive and reusable?
- Does the article page privilege reading comfort over decoration?
- Do category colors or tags feel systematic rather than arbitrary?
- Does the blog feel like the same brand as the landing and app?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.
```
