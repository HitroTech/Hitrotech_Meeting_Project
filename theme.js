// ---------- HitroTech Meet: light / dark theme toggle ----------
// Light is the default. A saved choice is applied by the inline snippet in
// <head> before first paint; this file only handles the toggle itself.

const THEME_KEY = 'hitrotech-theme';
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  // Private browsing can throw on write; the toggle still works for this visit.
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) { /* not persisted */ }
});

applyTheme(document.documentElement.dataset.theme || 'light');
