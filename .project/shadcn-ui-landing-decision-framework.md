# Shadcn UI Landing Decision Framework

## Purpose
This framework is for building branded landing pages on `Next.js + shadcn/ui` without falling into one of two traps:

- a generic "default shadcn" look
- a chaotic custom design that abandons system discipline

The goal is to make decisions consistently:

- where to stay close to `shadcn/ui`
- where to create custom sections
- where to introduce brand-specific tokens
- when motion is justified
- how to prompt an LLM so the result feels like a real product, not a random concept

## The Core Rule
Do not ask:

- "Which `shadcn` components should I use first?"

Ask:

- "What is this landing trying to make the user understand, feel, and do?"

`shadcn/ui` is a **systems layer**, not a brand generator.

Its job:

- controls
- accessibility primitives
- interaction patterns
- baseline consistency

Your job above it:

- narrative
- composition
- hierarchy
- trust
- emotion
- distinctiveness

## The Decision Stack
Design decisions should happen in this order.

### 1. Product and audience
Define:

- what the product is
- who the user is
- what the user cares about
- what the user fears
- how much trust is needed before conversion

Examples:

- AI startup landing: clarity, excitement, proof, speed
- fintech landing: trust, seriousness, clarity, control
- editorial brand landing: taste, pacing, voice, atmosphere

### 2. Landing objective
Pick one primary job for the page.

Possible primary jobs:

- explain the product
- drive signup
- book demo
- collect leads
- launch a brand
- establish trust
- present a content ecosystem

If there are three primary goals, there are zero primary goals.

### 3. Information architecture
Before styling, decide the section sequence.

Typical landing sequence:

1. Hero
2. Social proof
3. Problem / value explanation
4. Feature or benefit group
5. Product showcase
6. FAQ or trust reinforcement
7. Final CTA

Do not add sections because other SaaS sites have them. Each section must answer a user question or remove a conversion objection.

### 4. Design grammar
Decide the visual logic before coding.

This includes:

- spacing rhythm
- density
- radius language
- shadow policy
- border policy
- typography pair
- image treatment
- CTA hierarchy
- motion personality

Without this layer, the landing becomes a pile of nice individual components with no shared voice.

### 5. System mapping
Only now decide what should be:

- raw layout markup
- branded wrapper components
- `shadcn/ui` primitives
- one-off brand decoration

### 6. Motion threshold
Ask whether motion is actually improving the message or only decorating it.

### 7. Implementation detail
Only after the previous decisions should you care about the exact class strings or wrapper component names.

## What Should Usually Stay Standard Shadcn
These are not the main source of brand uniqueness, so keep them stable unless the product truly demands otherwise:

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Tabs`
- `Accordion`
- `Dialog`
- `Sheet`
- `Badge`
- `Tooltip`
- `Toast`

You can theme them, extend variants, and wrap them, but do not reinvent them just to feel unique.

## What Should Usually Be Custom
This is where the landing becomes its own product rather than a starter template:

- hero section
- proof strip
- feature narrative sections
- screenshot frames
- comparison layouts
- editorial cards
- testimonial presentation
- pricing highlight treatment
- CTA section
- footer composition

These are the parts where product storytelling and brand expression should live.

## The Three-Layer Model
Use this mental model on every landing.

### Layer 1. System layer
Stable UI infrastructure.

Examples:

- button behavior
- form states
- dialog mechanics
- accordion mechanics
- tabs mechanics

### Layer 2. Brand layer
The visual language that makes the landing recognizable.

Examples:

- type
- surfaces
- radius
- image framing
- depth
- accent strategy
- section rhythm

### Layer 3. Campaign or decor layer
The parts that should remain flexible and not pollute the design system core.

Examples:

- gradients
- glows
- background ornaments
- promo ribbons
- seasonal visual treatments
- special launch sections

This separation prevents the system from becoming either too sterile or too chaotic.

## Where Uniqueness Should Come From
If a landing feels generic, the problem is usually not the component library.

Uniqueness should come primarily from:

1. **Typography**
   - pairing
   - scale
   - contrast
   - voice

2. **Composition**
   - how sections are ordered
   - how wide content is
   - how dense or airy the page feels

3. **Surface language**
   - cards vs panels vs open sections
   - use of background blocks
   - border and shadow personality

4. **Image strategy**
   - product-first
   - editorial
   - illustrative
   - abstract
   - diagrammatic

5. **CTA ritual**
   - one clear primary action
   - how often it repeats
   - how secondary actions are framed

6. **Motion**
   - reveal
   - hover
   - emphasis
   - narrative transitions

## When To Start With Raw Tailwind Layout
Start with `section/div + Tailwind` when you are defining:

- page structure
- grid logic
- content width
- hero composition
- section rhythm
- responsive layout behavior

This is normal.

`shadcn/ui` does not solve page composition. It solves reliable UI primitives.

## When To Wrap Things Early
Create branded wrappers early if the same pattern appears more than once or is central to identity.

Good candidates:

- `Section`
- `SectionHeader`
- `HeroShell`
- `NewsletterForm`
- `FeatureCard`
- `CategoryBadge`
- `SocialIconButton`
- `MetricCard`
- `ProofStrip`

If a pattern appears in multiple places, stop copying class strings and name it.

## When To Extend Shadcn Variants
Add new variants only when the meaning is stable and reusable.

Good reasons:

- `Button variant="promo"`
- `Badge variant="success"`
- `Card variant="feature"`
- `Section variant="highlight"`

Bad reasons:

- `Button variant="launch-gradient-v2"`
- `Card variant="homepage-special-shadow"`
- `Badge variant="pink-glow"`

The rule:

- tokens encode meaning
- variants encode component behavior
- one-off art direction stays outside the core system

## Motion Decision Framework
Do not add `motion` by default.

Use this ladder.

### Level 0. No motion library
Use only CSS transitions and small hover states when:

- the page is mostly static
- the narrative is already strong
- performance and simplicity matter
- motion is not a conversion lever

### Level 1. Small entrance and hover motion
Use a light motion layer when:

- you want perceived polish
- cards, screenshots, or CTAs benefit from subtle emphasis
- sections reveal on scroll in a restrained way

### Level 2. Narrative motion
Use `framer-motion` or a comparable tool when:

- product storytelling depends on sequence
- screenshots transform between states
- tabs or steps need shared layout transitions
- comparison or reveal patterns are central to understanding the product

### Level 3. Interactive brand motion
Use stronger motion only if:

- the brand identity genuinely depends on motion
- it remains accessible
- it does not reduce clarity
- it still degrades gracefully

## When Motion Is A Mistake
Motion is a mistake when:

- the layout is weak and motion is being used as camouflage
- everything animates equally
- delays slow down comprehension
- hero motion competes with CTA
- mobile performance suffers
- reduced motion is ignored

## Decision Matrix

| Scenario | Shadcn usage | Custom section work | Motion stance |
| --- | --- | --- | --- |
| Fast MVP SaaS landing | High | Hero + CTA + proof strip | CSS only |
| Premium B2B landing | Medium | Hero, proof, product showcase, pricing emphasis | Light motion |
| Editorial or media landing | Medium | Strong custom layout and cards | CSS or light narrative motion |
| AI / storytelling landing | Medium | High custom composition | Motion only where it explains |
| Enterprise trust-first landing | High | Mostly restrained custom wrappers | Minimal motion |

## Quality Checks Before Coding
Ask these questions before you start implementing:

1. What is the one thing the user should understand in 5 seconds?
2. What is the one action the page wants from the user?
3. What is the brand mood: calm, bold, technical, editorial, premium, playful?
4. What gives this page its identity besides color?
5. Which sections are necessary and which are just inherited from startup cliches?
6. Which UI primitives should remain fully standard?
7. Which patterns deserve named wrappers?
8. Would the layout still work if all animations disappeared?

## Red Flags
If you see these, the landing is drifting toward generic or chaotic.

- every section is a boxed card
- every button has custom overrides
- hero copy is generic and interchangeable
- gradients are used to fake distinctiveness
- there is no hierarchy between primary and secondary CTA
- screenshots are decorative rather than explanatory
- too many arbitrary values
- motion appears before composition is stable
- the same visual pattern is copied manually instead of wrapped

## A Practical Build Order
This is the build order I recommend for most `Next.js + shadcn/ui` landings.

### Phase 1. Strategy and architecture
Define:

- audience
- value proposition
- primary CTA
- section sequence
- trust requirements
- content density

### Phase 2. Brand grammar
Define:

- type pair
- scale
- spacing rhythm
- radius language
- surface levels
- accent policy
- image treatment
- motion personality

### Phase 3. System mapping
Decide:

- what stays standard `shadcn`
- what gets branded wrappers
- what becomes a section component
- what stays one-off decoration

### Phase 4. Static layout implementation
Build:

- header
- hero
- proof
- feature blocks
- CTA
- footer

Without motion first.

### Phase 5. System polish
Add:

- variants
- state consistency
- hover states
- responsive adjustments
- accessibility review

### Phase 6. Motion only if justified
Add:

- reveal transitions
- hover emphasis
- narrative transitions

Only where they improve comprehension or brand character.

## Recommended Prompt Structure For LLM Work
Use the LLM in layers instead of asking for final code immediately.

### Stage 1. Concept prompt
Ask for:

- audience reading
- positioning
- information hierarchy
- section strategy
- visual direction

### Stage 2. System prompt
Ask for:

- what should use `shadcn`
- what should be wrapped
- what should be custom sections
- which tokens or variants are missing

### Stage 3. Implementation prompt
Ask for:

- actual `Next.js + shadcn/ui + Tailwind` implementation
- no inline styles
- consistent wrappers
- restrained one-off classes

### Stage 4. Audit prompt
Ask for:

- generic-looking areas
- over-customized areas
- accessibility risks
- motion risks
- token opportunities

## A Strong Prompt Template
Use this as a starting point.

```text
Design a branded landing page for [product].

Audience:
- [...]

Primary goal:
- [...]

Primary CTA:
- [...]

Brand direction:
- premium / editorial / calm / technical / bold / playful
- airy / balanced / dense
- light / dark / mixed emphasis

Requirements:
- build on Next.js + shadcn/ui
- use shadcn for interaction primitives, not as the main source of uniqueness
- create custom section composition where needed
- keep one clear primary action
- prioritize information hierarchy over decorative effects
- do not add motion unless it improves understanding or brand narrative

Deliver in 3 parts:
1. section architecture
2. design grammar
3. implementation plan: standard shadcn vs wrappers vs custom sections
```

## The Short Version
If you want the shortest possible rule set:

- Use `shadcn/ui` for reliability.
- Use custom sections for identity.
- Use typography and composition for distinctiveness.
- Use motion only after the static page already works.
- Name reusable patterns early.
- Do not confuse decorative classes with a brand system.

That is the difference between a nice landing and a repeatable landing design methodology.
