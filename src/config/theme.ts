/**
 * Design tokens mirrored for TypeScript use (OG images, inline SVG, tests).
 * The CSS source of truth is the @theme block in src/app/globals.css —
 * keep both in sync when changing a color.
 */
export const theme = {
  colors: {
    bg: "#08090D",
    surface: "#10131B",
    elevated: "#191E2A",
    text: "#F4F6FC",
    muted: "#9299AB",
    primary: "#6575FF",
    violet: "#8B5CF6",
    cyan: "#00D4FF",
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;
