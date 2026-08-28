/**
 * theme.js
 * ----------------------------------------------------------------------
 * Minimal theme engine. Each theme is a [data-theme="..."] block of CSS
 * custom properties in styles.css. This module just cycles the
 * data-theme attribute on <html> and remembers the choice.
 *
 * To add a theme: add a new CSS block in styles.css, then add its name
 * to THEMES below — nothing else needs to change.
 * ----------------------------------------------------------------------
 */

const ThemeEngine = (() => {
  const THEMES = ['violet-dream', 'sunset-drift', 'mono-ink'];
  const STORAGE_KEY = 'mi_theme_v1';

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.addEventListener('click', cycleTheme);
  }

  function cycleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || THEMES[0];
    const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
    const next = THEMES[nextIndex];
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return { init };
})();
