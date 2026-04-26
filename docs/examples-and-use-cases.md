# Examples And Use Cases

This guide shows how `ui8px` fits into real frontend work.

## Case 1: Lint A Templ View

Source:

```templ
templ LandingHero() {
  <section class="px-3 py-8">
    <div class="flex items-center justify-between gap-6">
      <h1 class="text-4xl font-bold">Launch faster</h1>
    </div>
  </section>
}
```

Run:

```bash
npx ui8px lint ./...
```

Result:

```text
src/views/landing.templ:2:12 UI8PX001 disallowed utility class "px-3"
Scope: layout
Reason: px-3 is not allowed in layout scope.
Suggestion: use px-2 or px-4
```

Fix:

```templ
templ LandingHero() {
  <section class="px-4 py-8">
    <div class="flex items-center justify-between gap-6">
      <h1 class="text-4xl font-bold">Launch faster</h1>
    </div>
  </section>
}
```

## Case 2: Allow Fine Tuning In Controls

Source:

```templ
templ Button() {
  <button class="inline-flex items-center gap-1 px-3 py-1">
    Save
  </button>
}
```

If the file is inside `src/ui/**` or `src/components/**`, this passes because those folders are in control scope.

Why this is allowed:

- `gap-1` = 4px
- `px-3` = 12px
- `py-1` = 4px

Those values are useful for compact controls but should not become general page layout habits.

## Case 3: Deny Raw Palette Colors

Source:

```html
<button class="bg-red-500 text-white px-4 py-2">
  Delete
</button>
```

Policy:

```json
{
  "utilities": {
    "bg-red-500": {
      "reason": "Use semantic color tokens instead of raw palette colors.",
      "suggest": ["bg-destructive"]
    }
  }
}
```

Preferred source:

```html
<button class="bg-destructive text-destructive-foreground px-4 py-2">
  Delete
</button>
```

## Case 4: Learn From LLM Mistakes

Run:

```bash
npx ui8px lint ./... --learn
```

This writes:

```text
.ui8px/telemetry/observed.jsonl
.ui8px/telemetry/proposals.json
```

Example proposal:

```json
{
  "unknownUtilities": {
    "px-3": {
      "class": "px-3",
      "count": 12,
      "status": "review",
      "scopes": {
        "layout": 12
      },
      "suggest": ["px-2", "px-4"]
    }
  }
}
```

This does not automatically change the policy. It gives the team evidence: either deny the class more explicitly, or allow it in a narrower scope.

## Case 5: Discover Repeated Patterns

Source A:

```html
<div class="justify-end px-6 py-4"></div>
```

Source B:

```html
<div class="px-6 py-4 justify-end"></div>
```

Run:

```bash
npx ui8px validate patterns ./...
```

`ui8px` treats those as the same pattern because it canonicalizes class order.

Possible output:

```text
Repeated pattern found 2 times:
  justify-end px-6 py-4
Suggested semantic class:
  ui-actions-row
```

The next step is review, not automatic CSS generation. If the pattern is truly reusable, add it to `patterns.json` and create a matching CSS rule intentionally.

## Case 6: Validate A Generated Class Map

Input:

```json
{
  "h-11": "height: calc(var(--spacing) * 11);",
  "p-2": "padding: calc(var(--spacing) * 2);"
}
```

Run:

```bash
npx ui8px validate grid --input class-map.json --output class-map.backlog.json --verbose
```

Possible output:

```text
Input: class-map.json
Output: class-map.backlog.json
Design: grid
Spacing base: 4px
Checked classes: 2
Checked declarations: 2
Violations: 1
Found 1 violations.
- h-11 | height: calc(var(--spacing) * 11) -> 44px
```

This command is useful when validating compiled or generated CSS maps.

## Case 7: Lint Go Variant Helpers

Initialize a Go-friendly policy:

```bash
npx ui8px init --preset go
```

Source:

```go
package utils

func ButtonSizeVariant(size string) string {
  return "h-8 px-3 text-sm"
}
```

Because `utils/*.go` is in control scope in the Go preset, `px-3` is allowed here. The same class remains denied in layout examples such as `tests/examples/**`.

`ui8px` also reads static utility literals inside `Cn` calls:

```go
return utils.Cn(base, "px-3", props.Class)
```

```go
return Cn("inline-flex items-center", "px-3 py-2")
```

Dynamic arguments are ignored. The linter only extracts static string literals, so it does not execute Go code or require a Go build.

Pattern discovery includes those Go class lists too:

```bash
npx ui8px validate patterns ui components utils styles tests/examples
```
