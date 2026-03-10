# Tech Brand OS Dashboard Prompt

Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.

## Attach
- `tech-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- productName: {{productName}}
- dashboardAudience: {{dashboardAudience}}
- primaryMetrics: {{primaryMetrics}}
- decisionsSupported: {{decisionsSupported}}

## Optional Inputs
- chartTypes: {{chartTypes}}
- alertingModel: {{alertingModel}}
- dataDensityPreference: {{dataDensityPreference}}
- timeFilters: {{timeFilters}}

## Surface Goal
Make data, anomalies, and actions easy to scan without losing brand coherence.

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
- dashboard header
- filters/date controls
- metric summary cards
- charts or trend panels
- table or list view
- alerts or insight panel
- quick actions

## Surface Overrides
- Use sans headings and more compact density.
- Keep brand warmth in tone, spacing, and surfaces, not in editorial flourishes.
- Use category or chart accents with discipline.

## Deliverables
- information priority map
- dashboard panel architecture
- metric hierarchy
- component and chart strategy
- implementation plan

## Audit Checklist
- Can the user spot anomalies quickly?
- Is the number hierarchy stronger than the surface styling?
- Do charts use semantic color roles rather than random hues?
- Does the dashboard still belong to the same brand family?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.

## Copy-Ready Prompt
```text
Design a dashboard surface in the Tech Brand OS style.

Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.
Surface goal: Make data, anomalies, and actions easy to scan without losing brand coherence.

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
- Use sans headings and more compact density.
- Keep brand warmth in tone, spacing, and surfaces, not in editorial flourishes.
- Use category or chart accents with discipline.

Implementation target:
- Next.js + shadcn/ui + Tailwind CSS

Required inputs:
- productName: {{productName}}
- dashboardAudience: {{dashboardAudience}}
- primaryMetrics: {{primaryMetrics}}
- decisionsSupported: {{decisionsSupported}}

Optional inputs:
- chartTypes: {{chartTypes}}
- alertingModel: {{alertingModel}}
- dataDensityPreference: {{dataDensityPreference}}
- timeFilters: {{timeFilters}}

Expected sections:
- dashboard header
- filters/date controls
- metric summary cards
- charts or trend panels
- table or list view
- alerts or insight panel
- quick actions

Deliverables:
- information priority map
- dashboard panel architecture
- metric hierarchy
- component and chart strategy
- implementation plan

Suggested page purpose: Enable fast scanning, anomaly detection, and confident decision-making.
Suggested required sections: dashboard-header, metric-summary-grid, chart-panel-row, table-panel

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a dashboard for {{productName}} using Tech Brand OS.
- Audience: {{dashboardAudience}}.
- Primary metrics: {{primaryMetrics}}.
- Decisions supported: {{decisionsSupported}}.
- Optional chart types: {{chartTypes}}.
- The result should feel like the same brand as the landing and blog, but optimized for scanability, control, and decision-making.
- Use low-noise cards, restrained accents, strong number hierarchy, and compact but breathable spacing.
- Do not over-style charts or introduce generic glassmorphism.
- Deliver:
- 1. information hierarchy
- 2. panel and grid layout
- 3. metric, chart, and table patterns
- 4. final implementation or parser-friendly prototype

Audit before finishing:
- Can the user spot anomalies quickly?
- Is the number hierarchy stronger than the surface styling?
- Do charts use semantic color roles rather than random hues?
- Does the dashboard still belong to the same brand family?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.
```
