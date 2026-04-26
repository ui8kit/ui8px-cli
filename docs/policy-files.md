# Policy Files

`ui8px` stores project-specific rules in `.ui8px/`. If the directory does not exist, the CLI uses bundled defaults. Run `ui8px init` when you want to make the rules explicit and version them with the project.

## Directory Layout

```text
.ui8px/
  policy/
    allowed.json
    denied.json
    scopes.json
    groups.json
    patterns.json
  telemetry/
    observed.jsonl
    proposals.json
  reports/
    patterns.json
```

Recommended version-control policy:

- Commit `.ui8px/policy/*.json`.
- Commit selected `.ui8px/reports/*.json` only if they are useful for review.
- Usually do not commit `.ui8px/telemetry/observed.jsonl`.
- Optionally commit `.ui8px/telemetry/proposals.json` if the team wants shared learning history.

## `allowed.json`

Defines the spacing scales and base utility allowlist.

```json
{
  "spacing": {
    "layout": ["0", "2", "4", "6", "8", "10", "12", "16", "20", "24"],
    "control": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "10", "12"]
  },
  "utilities": [
    "flex",
    "grid",
    "items-center",
    "justify-between",
    "bg-card",
    "text-foreground"
  ]
}
```

The spacing scale is interpreted by class prefix. For example, if layout allows `"6"`, then layout may use `p-6`, `px-6`, `gap-6`, `h-6`, and other spacing-like prefixes.

## `denied.json`

Defines classes that should be rejected even if they might otherwise match a broad rule.

```json
{
  "utilities": {
    "bg-red-500": {
      "reason": "Use semantic color tokens instead of raw palette colors.",
      "suggest": ["bg-destructive"]
    },
    "px-3": {
      "reason": "12px is fine tuning and should not be used in layout files.",
      "suggest": ["px-2", "px-4"]
    }
  }
}
```

Use `denied.json` for:

- raw palette colors;
- arbitrary values;
- recurring LLM mistakes;
- classes that violate the project grammar.

## `scopes.json`

Maps files to policy scopes.

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

Scope matching is file based. That is deliberate: it is more reliable in CI than trying to infer intent from markup.

## `groups.json`

Defines conflict groups. A conflict means a class list contains two classes where only one should win.

Examples:

```text
px-4 px-6
justify-start justify-end
text-sm text-lg
```

The bundled defaults cover common groups such as display, spacing, alignment, text size, radius, shadow, and background.

## `patterns.json`

Stores approved semantic `ui-*` classes.

```json
{
  "patterns": {
    "ui-section-header": [
      "flex",
      "items-center",
      "justify-between",
      "gap-4",
      "px-6",
      "py-4"
    ]
  }
}
```

`ui8px` treats unknown `ui-*` classes as suspicious because semantic names can hide duplicated or oversized CSS. Add a pattern only after it becomes a real repeated primitive.

## Telemetry Files

`ui8px lint --learn` writes facts to:

```text
.ui8px/telemetry/observed.jsonl
```

Each line is one JSON event:

```json
{"time":"2026-04-26T09:00:00.000Z","class":"px-3","file":"src/views/landing.templ","line":24,"column":16,"scope":"layout","rule":"UI8PX001","status":"disallowed","suggest":["px-2","px-4"]}
```

The aggregated memory lives in:

```text
.ui8px/telemetry/proposals.json
```

Use it to see which missing or denied classes appear often enough to discuss.
