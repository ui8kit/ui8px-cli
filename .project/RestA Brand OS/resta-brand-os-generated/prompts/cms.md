# RestA Brand OS Cms Prompt

Use this file as the isolated surface prompt when you want to start building directly with the RestA Brand OS.

## Attach
- `resta-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- restaurantName: {{restaurantName}}
- contentTypes: {{contentTypes}}
- userRoles: {{userRoles}}
- primaryTasks: {{primaryTasks}}

## Optional Inputs
- approvalWorkflow: {{approvalWorkflow}}
- reservationFlow: {{reservationFlow}}
- menuTaxonomy: {{menuTaxonomy}}
- locationCount: {{locationCount}}

## Surface Goal
Support restaurant staff in managing menus, reservations, promotions, events, testimonials, and site content.

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
- app shell
- menu or content list
- detail editor
- status and publishing controls
- reservation or event context panel

## Surface Overrides
- Use the same palette and warmth, but reduce promotional flourish significantly.
- Favor structured forms, statuses, and safe editing over decorative storytelling.
- Keep the CMS hospitality-aware without turning it into a marketing page.

## Deliverables
- workflow model
- screen architecture
- component strategy
- state model
- final implementation or prototype

## Audit Checklist
- Can staff confidently understand publish, edit, reserve, and promo states?
- Is the CMS branded without being over-decorated?
- Do forms and content lists feel calmer than guest-facing landing surfaces?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.

## Copy-Ready Prompt
```text
Design a cms surface in the RestA Brand OS style.

Treat `resta-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.
Surface goal: Support restaurant staff in managing menus, reservations, promotions, events, testimonials, and site content.

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
- Use the same palette and warmth, but reduce promotional flourish significantly.
- Favor structured forms, statuses, and safe editing over decorative storytelling.
- Keep the CMS hospitality-aware without turning it into a marketing page.

Implementation target:
- Tailwind 4 + shadcn-compatible tokens or parser-friendly Tailwind HTML, with eventual UI8Kit compatibility in mind

Required inputs:
- restaurantName: {{restaurantName}}
- contentTypes: {{contentTypes}}
- userRoles: {{userRoles}}
- primaryTasks: {{primaryTasks}}

Optional inputs:
- approvalWorkflow: {{approvalWorkflow}}
- reservationFlow: {{reservationFlow}}
- menuTaxonomy: {{menuTaxonomy}}
- locationCount: {{locationCount}}

Expected sections:
- app shell
- menu or content list
- detail editor
- status and publishing controls
- reservation or event context panel

Deliverables:
- workflow model
- screen architecture
- component strategy
- state model
- final implementation or prototype

Suggested page purpose: Enable restaurant staff to safely manage menus, events, promotions, reservations, and customer content.
Suggested required sections: cms-topbar, menu-list-panel, reservation-or-event-editor, status-and-publishing-panel

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a restaurant CMS for {{restaurantName}} in the RestA Brand OS style.
- Content types: {{contentTypes}}.
- User roles: {{userRoles}}.
- Primary tasks: {{primaryTasks}}.
- Keep the interface operationally safe, but still visibly part of the RestA family.

Audit before finishing:
- Can staff confidently understand publish, edit, reserve, and promo states?
- Is the CMS branded without being over-decorated?
- Do forms and content lists feel calmer than guest-facing landing surfaces?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.
```
