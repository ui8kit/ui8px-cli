# 101: 8px Grid Design

An 8px grid is a spacing system where layout measurements move in predictable 8px steps. It is one of the most common conventions in modern interface design because it keeps spacing consistent across pages, components, and screen sizes.

## The Basic Idea

Most browsers use `16px` as the default root font size. Tailwind's default spacing scale maps numbers to `rem` values, and common values resolve like this:

| Utility | Pixels |
| --- | ---: |
| `p-1` | 4px |
| `p-2` | 8px |
| `p-3` | 12px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-10` | 40px |
| `p-12` | 48px |

For strict layout rhythm, `ui8px` treats the even spacing steps as the layout scale:

```text
2, 4, 6, 8, 10, 12, 16, 20, 24
```

That gives:

```text
8, 16, 24, 32, 40, 48, 64, 80, 96px
```

## Layout Spacing vs Control Fine Tuning

Not every interface measurement has the same job.

Layout spacing controls the larger structure of a page:

```html
<section class="px-6 py-8">
  <div class="grid gap-6">
    ...
  </div>
</section>
```

Control fine tuning controls compact geometry inside small interactive elements:

```html
<button class="inline-flex items-center gap-1 px-3 py-1">
  Save
</button>
```

`px-3` is `12px`. It divides by 4, but not by 8. That makes it useful for controls, but risky as a general layout habit.

## How ui8px Handles This

`ui8px` makes this distinction explicit:

- `layout` scope is strict 8px.
- `control` scope permits 4px fine tuning.

The scope is decided by file path, not by guessing component intent:

```json
{
  "defaultScope": "layout",
  "scopes": [
    {
      "name": "controls",
      "files": ["src/ui/**", "src/components/**"],
      "spacing": "control"
    },
    {
      "name": "layout",
      "files": ["src/views/**", "src/pages/**"],
      "spacing": "layout"
    }
  ]
}
```

This lets a team keep page layout strict while still building practical buttons, inputs, badges, tabs, and other compact primitives.

## Why This Matters For LLM-Generated Code

LLMs often default to familiar Tailwind patterns like `px-3`, `py-2`, or `gap-3`. Those choices are not always wrong, but without a policy they accumulate randomly.

`ui8px` turns those decisions into explicit feedback:

```text
src/views/landing.templ:24:16 UI8PX001 disallowed utility class "px-3"
Scope: layout
Reason: px-3 is not allowed in layout scope.
Suggestion: use px-2 or px-4
```

That message is useful for humans and for coding agents. It explains the rule, the context, and the fix.

## Recommended Defaults

Use strict 8px values for:

- Page sections
- Containers
- Grid gaps
- Card spacing
- Major layout padding and margin

Allow 4px fine tuning for:

- Button inner padding
- Input height and padding
- Badge padding
- Icon gaps
- Tab triggers
- Small toolbar controls

Keep this distinction visible in `.ui8px/policy/scopes.json`.
