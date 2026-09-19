import { useCallback, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "rosic-theme";
export const THEME_VALUES = Object.freeze(["light", "dark"]);

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function isTheme(value) {
  return THEME_VALUES.includes(value);
}

export function getSystemTheme(fallback = "light") {
  if (!canUseDom() || typeof window.matchMedia !== "function") return fallback;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function readThemePreference() {
  if (!canUseDom()) return null;

  try {
    const preference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(preference) ? preference : null;
  } catch {
    // Storage can be unavailable in private browsing contexts. The system setting
    // remains a reliable non-persistent fallback in that case.
    return null;
  }
}

export function getInitialTheme(fallback = "light") {
  return readThemePreference() ?? getSystemTheme(fallback);
}

export function applySiteTheme(theme) {
  if (!canUseDom()) return;

  const resolvedTheme = isTheme(theme) ? theme : getSystemTheme();
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", resolvedTheme === "dark" ? "#151c15" : "#fafaf5");
}

function writeThemePreference(preference) {
  if (!canUseDom()) return;

  try {
    if (isTheme(preference)) {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch {
    // The visual setting still applies for the current visit when storage is blocked.
  }
}

/**
 * Keeps the site theme in sync with an explicit visitor choice, or with the
 * operating-system preference until the visitor makes that choice.
 *
 * Pass "system" or null to setTheme to resume following the system preference.
 */
export function useSiteTheme(fallback = "light") {
  const [preference, setPreference] = useState(() => readThemePreference());
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme(fallback));
  const theme = preference ?? systemTheme;

  useEffect(() => {
    if (!canUseDom() || typeof window.matchMedia !== "function") return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event) => setSystemTheme(event.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", syncSystemTheme);
    return () => mediaQuery.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    writeThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    applySiteTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setPreference((currentPreference) => {
      const currentTheme = currentPreference ?? getSystemTheme(fallback);
      const requestedTheme = typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme;

      if (requestedTheme === "system" || requestedTheme == null) return null;
      return isTheme(requestedTheme) ? requestedTheme : currentPreference;
    });
  }, [fallback]);

  return useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
}
