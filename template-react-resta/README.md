# UI8Kit

A UI component library built as a set of reusable primitives: no inline styles, no custom `className`, with control via typed props.

## Features

- **Utility props** — Configure blocks via a strict utility-props API without mixing styles between components
- **Variant system** — Buttons and text use CVA variants: types, sizes, and styles are set as explicit props
- **Composable primitives** — Block, Container, Stack, Group, Box, Text, and Button work as building blocks without manual `className`

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Class Variance Authority (CVA)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type check |
| `npm run lint` | Run ESLint |

## Components

| Component | Description |
|-----------|-------------|
| **Block** | Base polymorphic container with support for utility-props and semantic component API. Use as the single top-level HTML5 wrapper only |
| **Container** | Limits content width via the `max` utility-prop, adding convenient padding |
| **Stack** | Column layout with default spacing (`flex-col`, `gap-4`) |
| **Group** | Flex row for horizontal layout (`flex`, `items-center`, `gap-4`) |
| **Box** | Generic container with utility-props support |
| **Text** | Typography component with fontSize, textColor, textAlign, fontWeight variants |
| **Button** | Polymorphic button/link with variant and size props |

## Path aliases

Configured in `vite.config.js` and `tsconfig.app.json`:

| Alias | Path |
|-------|------|
| `@` | `./src` |
| `@/components` | `./src/components` |
| `@/ui` | `./src/components/ui` |
| `@/layouts` | `./src/layouts` |
| `@/blocks` | `./src/blocks` |
| `@/lib` | `./src/lib` |
| `@/variants` | `./src/variants` |

## Usage rules

- **Block** — Use only once at the top level as the root HTML5 element wrapper. Do not nest Block inside other components
- **No `className`** — Prefer utility props (`p`, `gap`, `flex`, `bg`, etc.) and variant props
- **No custom tags** — Use `component` prop for semantic elements (`component="main"`, `component="section"`, etc.)
