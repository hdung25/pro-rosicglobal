import { Moon, Sun } from "lucide-react";
import "./ThemeToggle.css";

const DEFAULT_THEME_TOGGLE_LABELS = {
  switchToDark: "Chuyển sang giao diện tối",
  switchToLight: "Chuyển sang giao diện sáng",
  light: "Giao diện sáng",
  dark: "Giao diện tối",
};

/**
 * Presentational control. Keep theme ownership in the page shell:
 * const { theme, setTheme } = useSiteTheme();
 * <ThemeToggle theme={theme} onThemeChange={setTheme} />
 */
export function ThemeToggle({
  theme,
  onThemeChange,
  className = "",
  labels = DEFAULT_THEME_TOGGLE_LABELS,
}) {
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const copy = { ...DEFAULT_THEME_TOGGLE_LABELS, ...labels };
  const actionLabel = isDark ? copy.switchToLight : copy.switchToDark;

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : "theme-toggle--light"} ${className}`.trim()}
      role="switch"
      aria-checked={isDark}
      aria-label={actionLabel}
      title={actionLabel}
      onClick={() => onThemeChange?.(nextTheme)}
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        <Sun size={14} strokeWidth={1.9} />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        <Moon size={14} strokeWidth={1.9} />
      </span>
      <span className="theme-toggle__thumb" aria-hidden="true" />
      <span className="sr-only">{isDark ? copy.dark : copy.light}</span>
    </button>
  );
}
