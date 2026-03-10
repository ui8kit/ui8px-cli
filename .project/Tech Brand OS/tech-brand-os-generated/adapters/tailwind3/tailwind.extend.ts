export const techBrandTailwindExtend = {
  fontFamily: {
    display: ["Merriweather", "Georgia", "serif"],
    ui: ["Inter", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
  },
  colors: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    success: {
      DEFAULT: "hsl(var(--success))",
      foreground: "hsl(var(--success-foreground))",
    },
    warning: {
      DEFAULT: "hsl(var(--warning))",
      foreground: "hsl(var(--warning-foreground))",
    },
    info: {
      DEFAULT: "hsl(var(--info))",
      foreground: "hsl(var(--info-foreground))",
    },
    promo: {
      DEFAULT: "hsl(var(--promo))",
      foreground: "hsl(var(--promo-foreground))",
    },
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    "surface-elevated": "hsl(var(--surface-elevated))",
    "surface-subtle": "hsl(var(--surface-subtle))",
    "surface-strong": "hsl(var(--surface-strong))",
    cream: "hsl(var(--cream))",
    "cream-foreground": "hsl(var(--cream-foreground))",
    "category-1": "hsl(var(--category-1))",
    "category-2": "hsl(var(--category-2))",
    "category-3": "hsl(var(--category-3))",
    "category-4": "hsl(var(--category-4))",
    "category-5": "hsl(var(--category-5))",
    "category-6": "hsl(var(--category-6))",
    "category-7": "hsl(var(--category-7))",
    "chart-1": "hsl(var(--chart-1))",
    "chart-2": "hsl(var(--chart-2))",
    "chart-3": "hsl(var(--chart-3))",
    "chart-4": "hsl(var(--chart-4))",
    "chart-5": "hsl(var(--chart-5))",
  },
  borderRadius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    media: "var(--radius-media)",
    shell: "var(--radius-shell)",
    pill: "var(--radius-pill)",
  },
  boxShadow: {
    none: "var(--shadow-none)",
    soft: "var(--shadow-soft-token)",
    elevated: "var(--shadow-elevated)",
    floating: "var(--shadow-floating)",
  },
} as const;

export default techBrandTailwindExtend;
