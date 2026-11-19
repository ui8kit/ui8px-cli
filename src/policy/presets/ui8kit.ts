// The `ui8kit` preset: the one UI8Kit policy (8+4 grid, tokens, logical alignment). A project's .ui8px/policy/*.json
// writes `"extends": "ui8kit"` and keeps only its local deltas (`ui8px init --preset ui8kit`).
//
// Spacing values are Tailwind steps on a 4px `--spacing`: layout takes even steps only (multiples of 8px, 0 to 640px),
// control (buttons, fields, badges, …) also takes the odd steps up to 15 (multiples of 4px). Hairlines (`gap-px`, `p-px`,
// `w-px`, `h-px`) are allowed utilities in every scope (rule 03 of ui8kit/contract).
import {
  DEFAULT_ALLOWED_POLICY,
  DEFAULT_DENIED_POLICY,
  DEFAULT_GROUPS_POLICY,
  DEFAULT_PATTERNS_POLICY,
  DEFAULT_SCOPES_POLICY,
} from '../default-policy.js';
import { AllowedPolicy, DeniedPolicy, GroupsPolicy, PatternsPolicy, ScopesPolicy } from '../types.js';

const range = (from: number, to: number, step: number): string[] => {
  const out: string[] = [];
  for (let v = from; v <= to; v += step) out.push(String(v));
  return out;
};

export const UI8KIT_HAIRLINES = ['gap-px', 'gap-x-px', 'gap-y-px', 'p-px', 'w-px', 'h-px'];

export const UI8KIT_PHYSICAL_ALIGN = ['text-left', 'text-right'];

export const UI8KIT_ALLOWED_POLICY: AllowedPolicy = {
  spacing: {
    layout: range(0, 160, 2),
    control: [...range(0, 16, 1), ...range(18, 160, 2)],
  },
  // physical text alignment is denied (logical text-start / text-end follow the writing direction)
  utilities: [
    ...DEFAULT_ALLOWED_POLICY.utilities.filter((u) => !UI8KIT_PHYSICAL_ALIGN.includes(u)),
    ...UI8KIT_HAIRLINES,
    'w-1/4',
    'w-1/3',
    'w-1/2',
    'w-2/3',
    'w-3/4',
    'min-h-screen',
    'aspect-4/3',
    'aspect-21/9',
    'text-start',
    'text-end',
    // align-self (logical: start / end follow the writing direction), for a narrow box in a stretching column
    'self-start',
    'self-center',
    'self-end',
    'self-stretch',
  ],
};

export const UI8KIT_DENIED_POLICY: DeniedPolicy = {
  utilities: {
    ...DEFAULT_DENIED_POLICY.utilities,
    'bg-blue-500': {
      reason: 'Use semantic color tokens instead of raw palette colors.',
      suggest: ['bg-primary'],
    },
    'bg-gradient-to-r': {
      reason: 'Gradients are not part of UI8Kit blocks.',
      suggest: ['bg-muted'],
    },
    'text-left': {
      reason: 'Physical alignment breaks right-to-left pages; use the logical class (follows dir).',
      suggest: ['text-start'],
    },
    'text-right': {
      reason: 'Physical alignment breaks right-to-left pages; use the logical class (follows dir).',
      suggest: ['text-end'],
    },
  },
};

export const UI8KIT_SCOPES_POLICY: ScopesPolicy = DEFAULT_SCOPES_POLICY;

export const UI8KIT_GROUPS_POLICY: GroupsPolicy = {
  conflictGroups: {
    ...DEFAULT_GROUPS_POLICY.conflictGroups,
    textAlign: ['text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end'],
  },
};

export const UI8KIT_PATTERNS_POLICY: PatternsPolicy = DEFAULT_PATTERNS_POLICY;
