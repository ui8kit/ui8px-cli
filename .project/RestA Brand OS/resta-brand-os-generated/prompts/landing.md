# RestA Brand OS Landing Prompt

Use this file as the isolated surface prompt when you want to start building directly with the RestA Brand OS.

## Attach
- `resta-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- restaurantName: {{restaurantName}}
- cuisineType: {{cuisineType}}
- audience: {{audience}}
- primaryGoal: {{primaryGoal}}
- primaryCTA: {{primaryCTA}}
- signaturePositioning: {{signaturePositioning}}
- proofSignals: {{proofSignals}}

## Optional Inputs
- secondaryCTA: {{secondaryCTA}}
- locationContext: {{locationContext}}
- heroImageType: {{heroImageType}}
- promotionFocus: {{promotionFocus}}
- serviceModes: {{serviceModes}}

## Surface Goal
Convert first-time visitors into diners by showcasing atmosphere, menu quality, trust, and one primary action.

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
- hero-photo-overlay
- story or promise intro
- featured dishes or chef specials
- promo or event section
- testimonials or review proof
- reservation cta
- contact or location block

## Surface Overrides
- Prioritize appetite, atmosphere, and trust over generic SaaS hierarchy.
- Use food or dining imagery as the central emotional driver.
- Let the primary CTA be reservation, menu view, or booking depending on the restaurant goal.

## Deliverables
- section architecture
- visual grammar
- brand/system split
- final implementation or prototype

## Audit Checklist
- Does the hero create desire and clarity immediately?
- Is the primary action obvious and credible?
- Would the landing still work if the rose accent were reduced and only the composition remained?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.

## Copy-Ready Prompt
```text
Design a landing surface in the RestA Brand OS style.

Treat `resta-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.
Surface goal: Convert first-time visitors into diners by showcasing atmosphere, menu quality, trust, and one primary action.

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
- Prioritize appetite, atmosphere, and trust over generic SaaS hierarchy.
- Use food or dining imagery as the central emotional driver.
- Let the primary CTA be reservation, menu view, or booking depending on the restaurant goal.

Implementation target:
- Tailwind 4 + shadcn-compatible tokens or parser-friendly Tailwind HTML, with eventual UI8Kit compatibility in mind

Required inputs:
- restaurantName: {{restaurantName}}
- cuisineType: {{cuisineType}}
- audience: {{audience}}
- primaryGoal: {{primaryGoal}}
- primaryCTA: {{primaryCTA}}
- signaturePositioning: {{signaturePositioning}}
- proofSignals: {{proofSignals}}

Optional inputs:
- secondaryCTA: {{secondaryCTA}}
- locationContext: {{locationContext}}
- heroImageType: {{heroImageType}}
- promotionFocus: {{promotionFocus}}
- serviceModes: {{serviceModes}}

Expected sections:
- hero-photo-overlay
- story or promise intro
- featured dishes or chef specials
- promo or event section
- testimonials or review proof
- reservation cta
- contact or location block

Deliverables:
- section architecture
- visual grammar
- brand/system split
- final implementation or prototype

Suggested page purpose: Turn first-time visitors into interested diners through atmosphere, menu promise, trust, and reservation intent.
Suggested required sections: hero-photo-overlay, value-or-story-intro, chef-or-menu-promo, featured-dishes-grid, testimonials-strip, reservation-cta, contact-or-location

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a restaurant landing page for {{restaurantName}} in the RestA Brand OS style.
- Cuisine type: {{cuisineType}}.
- Audience: {{audience}}.
- Primary goal: {{primaryGoal}}.
- Primary CTA: {{primaryCTA}}.
- Signature positioning: {{signaturePositioning}}.
- Proof signals: {{proofSignals}}.
- Use food-first imagery, warm hospitality tone, rose-led emphasis, and polished but approachable dining design.
- Keep the page conversion-focused without feeling pushy or generic.
- Deliver in order: strategy, section architecture, visual grammar, component plan, final implementation.

Audit before finishing:
- Does the hero create desire and clarity immediately?
- Is the primary action obvious and credible?
- Would the landing still work if the rose accent were reduced and only the composition remained?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.
```
