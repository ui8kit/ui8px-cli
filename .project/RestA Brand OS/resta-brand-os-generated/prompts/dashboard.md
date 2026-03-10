# RestA Brand OS Dashboard Prompt

Use this file as the isolated surface prompt when you want to start building directly with the RestA Brand OS.

## Attach
- `resta-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- restaurantName: {{restaurantName}}
- dashboardAudience: {{dashboardAudience}}
- primaryMetrics: {{primaryMetrics}}
- decisionsSupported: {{decisionsSupported}}

## Optional Inputs
- timeFilters: {{timeFilters}}
- locationScope: {{locationScope}}
- alertingModel: {{alertingModel}}
- reviewSignals: {{reviewSignals}}

## Surface Goal
Help restaurant operators scan reservations, occupancy, guest feedback, promotions, and menu performance quickly.

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
- dashboard header
- metric summary grid
- reservation and occupancy panels
- reviews or promotion panels
- table or queue views

## Surface Overrides
- Use operational clarity first and hospitality warmth second.
- Preserve rose as an accent, not as a flood color for every metric.
- Use data and review signals in a way that still feels connected to the guest experience.

## Deliverables
- information hierarchy
- panel system
- metric and list patterns
- final implementation or prototype

## Audit Checklist
- Can a manager scan what matters in seconds?
- Do review, occupancy, and promotion signals feel clearly differentiated?
- Does the dashboard avoid generic enterprise coldness?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.

## Copy-Ready Prompt
```text
Design a dashboard surface in the RestA Brand OS style.

Treat `resta-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: RestA Brand OS is a warm, polished, hospitality-first restaurant brand. It combines rose-led emotional emphasis, soft zinc-based neutrals, appetizing photography, approachable premium dining cues, and clear guest actions such as reservation, menu exploration, and event discovery.
Surface goal: Help restaurant operators scan reservations, occupancy, guest feedback, promotions, and menu performance quickly.

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
- Use operational clarity first and hospitality warmth second.
- Preserve rose as an accent, not as a flood color for every metric.
- Use data and review signals in a way that still feels connected to the guest experience.

Implementation target:
- Tailwind 4 + shadcn-compatible tokens or parser-friendly Tailwind HTML, with eventual UI8Kit compatibility in mind

Required inputs:
- restaurantName: {{restaurantName}}
- dashboardAudience: {{dashboardAudience}}
- primaryMetrics: {{primaryMetrics}}
- decisionsSupported: {{decisionsSupported}}

Optional inputs:
- timeFilters: {{timeFilters}}
- locationScope: {{locationScope}}
- alertingModel: {{alertingModel}}
- reviewSignals: {{reviewSignals}}

Expected sections:
- dashboard header
- metric summary grid
- reservation and occupancy panels
- reviews or promotion panels
- table or queue views

Deliverables:
- information hierarchy
- panel system
- metric and list patterns
- final implementation or prototype

Suggested page purpose: Help restaurant managers monitor reservations, seating, reviews, promotion performance, and menu signals.
Suggested required sections: dashboard-header, metric-summary-grid, reservation-and-occupancy-panels, review-or-promo-panels, table-or-list-view

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a restaurant operations dashboard for {{restaurantName}} in the RestA Brand OS style.
- Audience: {{dashboardAudience}}.
- Primary metrics: {{primaryMetrics}}.
- Decisions supported: {{decisionsSupported}}.
- The dashboard should feel disciplined and readable while still inheriting the brand's hospitality DNA.

Audit before finishing:
- Can a manager scan what matters in seconds?
- Do review, occupancy, and promotion signals feel clearly differentiated?
- Does the dashboard avoid generic enterprise coldness?
- Identify any area that feels like generic restaurant template output rather than a coherent RestA system.
- Identify any place where decorative rose styling is doing too much work instead of layout or content.
- List what should stay system-level, what should be wrapped, and what should remain campaign-only.
- List missing tokens, variants, or section recipes required for long-term compatibility with Tailwind 4 templates and future UI8Kit conversion.
```
