# Tech Brand OS Cms Prompt

Use this file as the isolated surface prompt when you want to start building directly with the Tech Brand OS.

## Attach
- `tech-brand-os.schema.json`
- Optionally attach any copied adapter assets from this generated kit that match the target stack.

## Required Inputs
- productName: {{productName}}
- contentTypes: {{contentTypes}}
- userRoles: {{userRoles}}
- primaryTasks: {{primaryTasks}}

## Optional Inputs
- approvalWorkflow: {{approvalWorkflow}}
- localizationNeeds: {{localizationNeeds}}
- mediaManagementNeeds: {{mediaManagementNeeds}}
- statusModel: {{statusModel}}

## Surface Goal
Support safe content operations with a branded but practical interface.

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
- top navigation or app shell
- resource list view
- filters/search
- detail or editor panel
- status and publishing controls
- activity/help side panel

## Surface Overrides
- Switch from serif display to sans headings for operational clarity.
- Reduce decorative expressiveness and increase workflow predictability.
- Preserve brand warmth in surfaces and spacing, not in unnecessary ornament.

## Deliverables
- workflow model
- screen architecture
- component strategy
- state model
- implementation plan

## Audit Checklist
- Can users safely understand edit, save, publish, and destructive actions?
- Does the CMS feel branded without sacrificing operational clarity?
- Are forms and tables more important than decoration?
- Do status colors remain semantic and restrained?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.

## Copy-Ready Prompt
```text
Design a cms surface in the Tech Brand OS style.

Treat `tech-brand-os.schema.json` as the source-of-truth brand contract.

Brand summary: Tech Brand OS is a calm, intelligent, human-centered technology brand. It combines editorial warmth with product clarity, using soft warm neutrals, dark charcoal text, restrained sage and muted promo accents, large rounded shells, pill interactions, and low-noise depth.
Surface goal: Support safe content operations with a branded but practical interface.

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
- Switch from serif display to sans headings for operational clarity.
- Reduce decorative expressiveness and increase workflow predictability.
- Preserve brand warmth in surfaces and spacing, not in unnecessary ornament.

Implementation target:
- Next.js + shadcn/ui + Tailwind CSS

Required inputs:
- productName: {{productName}}
- contentTypes: {{contentTypes}}
- userRoles: {{userRoles}}
- primaryTasks: {{primaryTasks}}

Optional inputs:
- approvalWorkflow: {{approvalWorkflow}}
- localizationNeeds: {{localizationNeeds}}
- mediaManagementNeeds: {{mediaManagementNeeds}}
- statusModel: {{statusModel}}

Expected sections:
- top navigation or app shell
- resource list view
- filters/search
- detail or editor panel
- status and publishing controls
- activity/help side panel

Deliverables:
- workflow model
- screen architecture
- component strategy
- state model
- implementation plan

Suggested page purpose: Support safe creation, editing, moderation, and publishing workflows.
Suggested required sections: cms-topbar, cms-list-panel, cms-detail-editor, activity-or-help-panel

Now follow this working sequence:
1. Read the audience and product goal.
2. Define the information architecture and section order.
3. Define the visual grammar: typography, spacing, surfaces, shape language, and motion stance.
4. Decide what stays standard in the system layer, what should be wrapped, and what should become a custom block.
5. Generate the requested implementation in a coherent brand system style.

Reference prompt instructions:
- Design a CMS or content operations interface for {{productName}} using Tech Brand OS.
- Content types: {{contentTypes}}.
- User roles: {{userRoles}}.
- Primary tasks: {{primaryTasks}}.
- Optional approval workflow: {{approvalWorkflow}}.
- Use the Tech Brand OS to make the CMS feel calm, trustworthy, and precise rather than bland or corporate.
- Keep shadcn primitives standard where possible and use branded wrappers for layout shells, status panels, and editorial previews.
- Favor safe CRUD patterns, explicit status feedback, and restrained depth.
- Deliver:
- 1. Workflow and IA.
- 2. Screen zones and editing patterns.
- 3. Component mapping.
- 4. Final implementation or parser-friendly prototype.

Audit before finishing:
- Can users safely understand edit, save, publish, and destructive actions?
- Does the CMS feel branded without sacrificing operational clarity?
- Are forms and tables more important than decoration?
- Do status colors remain semantic and restrained?
- Identify any areas that still look generic or template-like.
- Identify any places where the brand layer is too heavy for the surface.
- List what should remain standard shadcn, what should be wrapped, and what should be a custom block.
- List any missing tokens, variants, or section recipes needed to keep the implementation coherent.
- If motion is used, explain why it is necessary and what happens under reduced motion.
```
