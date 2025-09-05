// Shared helpers
(function() {
  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); }

  // Unified theme management (works across all pages)
  function applyTheme(theme) {
    const body = document.body;
    const isDark = theme === 'dark';
    body.classList.toggle('dark', isDark);
    body.classList.toggle('light', !isDark);
    // Keep a data-theme attribute for CSS that targets it
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    // Update any visible toggle label if present
    const toggle = qs('[data-toggle-theme]') || qs('#theme-toggle');
    if (toggle) toggle.innerHTML = isDark ? '☀️ Theme' : '🌙 Theme';
  }

  function toggleTheme() {
    const current = (localStorage.getItem('theme') || 'light');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Init theme on load
  (function(){
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    applyTheme(saved || 'light');
    const toggle = qs('[data-toggle-theme]') || qs('#theme-toggle');
    on(toggle, 'click', toggleTheme);
  })();

  window.QA = { qs, on, applyTheme, toggleTheme };
})();


