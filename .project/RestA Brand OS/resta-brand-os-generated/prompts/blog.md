# RestA Brand OS Blog Prompt

Use this file as the isolated surface prompt when you want to start building directly with the RestA Brand OS.

## Attach
- `resta-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- publicationName: {{publicationName}}
- editorialFocus: {{editorialFocus}}
- readerAudience: {{readerAudience}}
- contentPillars: {{contentPillars}}
- primaryEngagementGoal: {{primaryEngagementGoal}}

## Optional Inputs
- newsletterCTA: {{newsletterCTA}}
- contentTone: {{contentTone}}
- seasonalFocus: {{seasonalFocus}}
- chefVoice: {{chefVoice}}

## Surface Goal
Create a branded editorial system for recipes, chef stories, seasonal updates, promotions, and restaurant culture.

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
- blog hero
- intro statement
- content card grid
- seasonal or promo feature
- chef story or cultural section
- newsletter or reservation cta

## Surface Overrides
- Keep the tone warm and story-driven rather than technical.
- Use signature display moments selectively to add charm.
- Recipes, ingredients, chefs, and dining moments should feel like the real protagonists.

## Deliverables
- editorial system strategy
- page archetypes
- content card and story patterns
- final implementation or prototype

## Audit Checklist
- Do stories feel like part of the same dining brand as the landing?
- Are content cards warm and recognizable rather than generic blog tiles?
- Does the blog support both promotion and cultural storytelling?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.

## Copy-Ready Prompt
```text
Design a blog surface in the RestA Brand OS style.

Treat `resta-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.
Surface goal: Create a branded editorial system for recipes, chef stories, seasonal updates, promotions, and restaurant culture.

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
- Keep the tone warm and story-driven rather than technical.
- Use signature display moments selectively to add charm.
- Recipes, ingredients, chefs, and dining moments should feel like the real protagonists.

Implementation target:
- Tailwind 4 + shadcn-compatible tokens or parser-friendly Tailwind HTML, with eventual UI8Kit compatibility in mind

Required inputs:
- publicationName: {{publicationName}}
- editorialFocus: {{editorialFocus}}
- readerAudience: {{readerAudience}}
- contentPillars: {{contentPillars}}
- primaryEngagementGoal: {{primaryEngagementGoal}}

Optional inputs:
- newsletterCTA: {{newsletterCTA}}
- contentTone: {{contentTone}}
- seasonalFocus: {{seasonalFocus}}
- chefVoice: {{chefVoice}}

Expected sections:
- blog hero
- intro statement
- content card grid
- seasonal or promo feature
- chef story or cultural section
- newsletter or reservation cta

Deliverables:
- editorial system strategy
- page archetypes
- content card and story patterns
- final implementation or prototype

Suggested page purpose: Publish recipes, seasonal stories, promotions, chef notes, and dining culture in a branded editorial style.
Suggested required sections: blog-hero, story-intro, content-card-grid, seasonal-promo, newsletter-or-reservation-cta

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a restaurant editorial or blog experience for {{publicationName}} in the RestA Brand OS style.
- Editorial focus: {{editorialFocus}}.
- Reader audience: {{readerAudience}}.
- Content pillars: {{contentPillars}}.
- Primary engagement goal: {{primaryEngagementGoal}}.
- Use story-led layouts, ingredient and chef culture cues, and polished hospitality warmth.
- Keep typography and imagery appetite-driven while preserving readability.

Audit before finishing:
- Do stories feel like part of the same dining brand as the landing?
- Are content cards warm and recognizable rather than generic blog tiles?
- Does the blog support both promotion and cultural storytelling?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.
```
