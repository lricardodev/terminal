import type { ThemeName, Theme } from "./types";

// Themes
export const THEMES: Record<ThemeName, Theme> = {
  matrix: {
    bg: "#0b0f10",
    fg: "#b4f1c8",
    muted: "#6ee7b7",
    accent: "#34d399",
    cursor: "#34d399",
  },
  ubuntu: {
    bg: "#2d0922",
    fg: "#f8f8f2",
    muted: "#a6e22e",
    accent: "#fd971f",
    cursor: "#f92672",
  },
  arch: {
    bg: "#0c0c0c",
    fg: "#ffffff",
    muted: "#00ff00",
    accent: "#0080ff",
    cursor: "#ff0000",
  },
};

export function themeDefaultText(theme: ThemeName): string {
  switch (theme) {
    case "matrix":
      return "Welcome to your personal terminal — MATRIX theme";
    case "ubuntu":
      return "Welcome to your personal terminal — UBUNTU theme";
    case "arch":
      return "Welcome to your personal terminal — ARCH theme";
    default:
      return "Welcome to your personal terminal";
  }
}

export function nextTheme(t: ThemeName): ThemeName {
  const order: ThemeName[] = ["matrix", "ubuntu", "arch"];
  const ix = order.indexOf(t);
  return order[(ix + 1) % order.length];
}
