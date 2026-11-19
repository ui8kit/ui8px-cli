# Changelog

## 0.3.0 (2026-11-19)

- `validate grid` is scope-aware on class maps and compiled CSS: layout = multiples of 8px, control = multiples of 4px
  (`scopes.json` `selectors` match a CSS rule or a class-map entry; `--scope` forces one). Stylesheets are walked through
  nested rules and at-rules; `var(--x, fallback)`, `rem` and `calc(var(--spacing) * N)` resolve to px.
- Presets and `extends`: a policy file may write `"extends": "ui8kit"` and keep only its local deltas;
  `ui8px init --preset ui8kit` writes extends-only files.
- The `ui8kit` preset (the one UI8Kit policy): the 8+4 grid; hairlines; fractions; `min-h-screen`, `aspect-4/3`,
  `aspect-21/9`; logical `text-start` / `text-end` and `self-start` / `self-center` / `self-end` / `self-stretch`; the
  keyword sizes `size-full` / `max-w-full`; what the kit primitives draw (`inset-ring` in semantic colours,
  `bg-primary/90`, `bg-secondary/80`, `transition-colors`, `list-none`).
- Denied: physical `text-left` / `text-right` (UI8PX003, suggestion `text-start` / `text-end`), raw palette colours,
  gradients. A denied utility is denied under any modifier (`md:text-left`), and the suggestion keeps the modifiers.
- Class grammar: logical spacing prefixes (`ps`, `pe`, `ms`, `me`, `start`, `end`, `inset-s`, `inset-e`), `size-*`,
  `space-x/y-*`, the `rtl:` / `ltr:` modifiers; `z-*` and `inset-ring` / `inset-shadow` are not spacing.
- An error code table in the README (UI8PX001–005, GRID).

## 0.2.5

- See the git history up to tag `v0.2.5`.
