# Why Tailwind

`ui8px` is built around explicit utility classes because Tailwind already solves a hard problem well: it lets developers build interfaces quickly while generating only the CSS that appears in source code.

## The Problem With Runtime Style Props

Many component systems expose props like this:

```tsx
<Card px="6" py="4" justify="end" />
```

That can be pleasant to write, but Tailwind cannot automatically infer that this means:

```text
px-6 py-4 justify-end
```

If those classes are assembled at runtime, Tailwind needs a safelist or custom extraction step. Safelists are safe, but they often include unused classes and can grow over time.

## The ui8px Approach

Write the classes that Tailwind can see:

```html
<div class="flex items-center justify-end gap-4 px-6 py-4">
  ...
</div>
```

Then let `ui8px` enforce the design rules:

```bash
npx ui8px lint ./...
```

This gives the best of both sides:

- Tailwind sees real classes and keeps CSS small.
- `ui8px` prevents random spacing, raw colors, duplicated intent, and unsupported patterns.
- LLMs receive clear terminal diagnostics and can fix violations directly.

## Why Not Generate CSS From Patterns Immediately

CSS frameworks like Bootstrap and UIKit provide many named classes. That is useful, but it can also hide duplication and make a project depend on a large prebuilt surface.

`ui8px` starts lower:

1. Keep utility classes explicit.
2. Detect repeated utility compositions.
3. Propose semantic `ui-*` patterns only when repetition proves they are useful.
4. Let humans or agents review those proposals.

The tool does not turn every repeated class list into CSS automatically. It reports candidates.

## Keeping CSS Small

Tailwind compiles utilities it can find. If a project writes:

```html
<div class="px-6 py-4"></div>
```

Tailwind emits only what is needed for `px-6` and `py-4`.

If a project safelists:

```css
@source inline("px-{0,1,2,3,4,6,8,10,12}");
```

Tailwind emits every listed class, whether it is used or not.

`ui8px` favors explicit class usage over large safelists so performance audits have less unused CSS to report.

## Why This Works Well With LLMs

LLMs are good at generating Tailwind classes, but they need constraints. `ui8px` makes constraints executable:

- allowed classes
- denied classes
- layout/control scopes
- repeated pattern detection
- telemetry for common mistakes

Instead of relying on a prompt like "please use an 8px grid", the project gets a repeatable command:

```bash
npx ui8px lint ./...
```

That command works locally, in CI, and in an agent workflow.
