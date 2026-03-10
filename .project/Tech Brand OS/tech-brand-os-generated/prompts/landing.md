# Tech Brand OS Landing Prompt

Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.

## Attach
- `tech-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- productName: {{productName}}
- productCategory: {{productCategory}}
- audience: {{audience}}
- primaryGoal: {{primaryGoal}}
- primaryCTA: {{primaryCTA}}
- valueProposition: {{valueProposition}}
- proofSignals: {{proofSignals}}

## Optional Inputs
- secondaryCTA: {{secondaryCTA}}
- brandAdjectives: {{brandAdjectives}}
- competitiveAngle: {{competitiveAngle}}
- heroAssetType: {{heroAssetType}}
- pricingModel: {{pricingModel}}

## Surface Goal
Explain the product, establish trust, and drive a single primary CTA.

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
- hero
- proof-strip
- value narrative
- feature grid or benefit sequence
- product frame or screenshot section
- faq or objection handling
- final cta

## Surface Overrides
- Use serif display for the main hero heading if it supports the product tone.
- Make the hero feel premium and calm rather than loud or novelty-driven.
- Use one signature composition move, not six competing ones.

## Deliverables
- section architecture
- visual grammar
- system mapping: standard shadcn vs wrappers vs custom sections
- final implementation or prototype

## Audit Checklist
- Does the hero communicate one core idea in under 5 seconds?
- Is there only one dominant CTA?
- Would the page still feel premium without animation?
- Does the page feel like Tech Brand OS rather than generic SaaS?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.

## Copy-Ready Prompt
```text
Design a landing surface in the Tech Brand OS style.

Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.
Surface goal: Explain the product, establish trust, and drive a single primary CTA.

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
- Use serif display for the main hero heading if it supports the product tone.
- Make the hero feel premium and calm rather than loud or novelty-driven.
- Use one signature composition move, not six competing ones.

Implementation target:
- Next.js + shadcn/ui + Tailwind CSS

Required inputs:
- productName: {{productName}}
- productCategory: {{productCategory}}
- audience: {{audience}}
- primaryGoal: {{primaryGoal}}
- primaryCTA: {{primaryCTA}}
- valueProposition: {{valueProposition}}
- proofSignals: {{proofSignals}}

Optional inputs:
- secondaryCTA: {{secondaryCTA}}
- brandAdjectives: {{brandAdjectives}}
- competitiveAngle: {{competitiveAngle}}
- heroAssetType: {{heroAssetType}}
- pricingModel: {{pricingModel}}

Expected sections:
- hero
- proof-strip
- value narrative
- feature grid or benefit sequence
- product frame or screenshot section
- faq or objection handling
- final cta

Deliverables:
- section architecture
- visual grammar
- system mapping: standard shadcn vs wrappers vs custom sections
- final implementation or prototype

Suggested page purpose: Position a product, establish trust, and drive one primary CTA.
Suggested required sections: hero-editorial-tech, proof-strip, feature-narrative, feature-grid, final-cta

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a landing page for {{productName}} in the Tech Brand OS style.
- Product category: {{productCategory}}.
- Audience: {{audience}}.
- Primary goal: {{primaryGoal}}.
- Primary CTA: {{primaryCTA}}.
- Value proposition: {{valueProposition}}.
- Proof signals: {{proofSignals}}.
- Optional brand adjectives: {{brandAdjectives}}.
- Use Next.js + shadcn/ui + Tailwind as the implementation target unless another mode is requested.
- Keep shadcn as the system layer and create branded section wrappers for identity.
- Use a calm, intelligent, warm technology aesthetic with soft neutral surfaces, charcoal text, restrained accent usage, large rounded shells, and pill CTA language.
- Avoid generic startup gradients, neon colors, and excessive glass effects.
- Deliver in this order:
- 1. Product and audience reading.
- 2. Section architecture with reason for each section.
- 3. Visual grammar for type, spacing, surfaces, and motion.
- 4. Component and wrapper plan.
- 5. Final implementation or parser-friendly Tailwind prototype.

Audit before finishing:
- Does the hero communicate one core idea in under 5 seconds?
- Is there only one dominant CTA?
- Would the page still feel premium without animation?
- Does the page feel like Tech Brand OS rather than generic SaaS?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.
```
