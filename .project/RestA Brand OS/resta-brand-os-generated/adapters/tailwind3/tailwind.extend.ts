export const restaBrandTailwindExtend = {
  fontFamily: {
    sans: ["Nunito", "sans-serif"],
    pretty: ["Pacifico", "cursive"],
    serif: ["Lora", "serif"],
    mono: ["IBM Plex Mono", "monospace"],
  },
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: {
      DEFAULT: "var(--card)",
      foreground: "var(--card-foreground)",
    },
    popover: {
      DEFAULT: "var(--popover)",
      foreground: "var(--popover-foreground)",
    },
    primary: {
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      foreground: "var(--secondary-foreground)",
    },
    muted: {
      DEFAULT: "var(--muted)",
      foreground: "var(--muted-foreground)",
    },
    accent: {
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    destructive: {
      DEFAULT: "var(--destructive)",
      foreground: "var(--destructive-foreground)",
    },
    promo: {
      DEFAULT: "var(--promo)",
      foreground: "var(--promo-foreground)",
    },
    "promo-soft": {
      DEFAULT: "var(--promo-soft)",
      foreground: "var(--promo-soft-foreground)",
    },
    rating: {
      DEFAULT: "var(--rating)",
      foreground: "var(--rating-foreground)",
    },
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",
    rose: {
      50: "var(--rose-50)",
      100: "var(--rose-100)",
      200: "var(--rose-200)",
      300: "var(--rose-300)",
      400: "var(--rose-400)",
      500: "var(--rose-500)",
      600: "var(--rose-600)",
      700: "var(--rose-700)",
      800: "var(--rose-800)",
      900: "var(--rose-900)",
    },
    zinc: {
      50: "var(--zinc-50)",
      100: "var(--zinc-100)",
      200: "var(--zinc-200)",
      300: "var(--zinc-300)",
      400: "var(--zinc-400)",
      500: "var(--zinc-500)",
      600: "var(--zinc-600)",
      700: "var(--zinc-700)",
      800: "var(--zinc-800)",
      900: "var(--zinc-900)",
    },
    pink: {
      500: "var(--pink-500)",
      600: "var(--pink-600)",
      700: "var(--pink-700)",
    },
  },
  borderRadius: {
    xs: "var(--radius-xs)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    "2xl": "var(--radius-2xl)",
    "3xl": "var(--radius-3xl)",
    card: "var(--radius-card)",
    shell: "var(--radius-shell)",
    pill: "var(--radius-pill)",
  },
  boxShadow: {
    "2xs": "var(--shadow-2xs)",
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    DEFAULT: "var(--shadow)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    "2xl": "var(--shadow-2xl)",
    none: "none",
  },
} as const;

export default restaBrandTailwindExtend;
