

(function () {
  'use strict';

  const STUDENT_ID = '67664';
  const THEME_KEY = 'cv_theme_67664';

  
  function init() {
    console.log(`CV Application - Student ID: ${STUDENT_ID}`);
    
    setupThemeSwitcher();
    setupSectionToggle();
    loadThemePreference();
  }

  
  function setupThemeSwitcher() {
    const themeBtn = document.getElementById('theme-toggle');

    if (!themeBtn) {
      console.warn('Theme toggle button not found');
      return;
    }

    themeBtn.addEventListener('click', function () {
      toggleTheme();
      saveThemePreference();
    });
  }

  
  function toggleTheme() {
    const themeLink = document.getElementById('theme-link');
    
    if (!themeLink) {
      console.warn('Theme link not found');
      return;
    }

    const currentHref = themeLink.getAttribute('href');
    
    if (currentHref.includes('green.css')) {
      themeLink.setAttribute('href', 'red.css');
      console.log('Theme changed to: Red');
    } else {
      themeLink.setAttribute('href', 'green.css');
      console.log('Theme changed to: Green');
    }
  }

  
  function setupSectionToggle() {
    const toggleBtn = document.getElementById('toggle-skills');
    const skillsContent = document.getElementById('skills-content');

    if (!toggleBtn || !skillsContent) {
      console.warn('Toggle button or skills content not found');
      return;
    }

    toggleBtn.addEventListener('click', function () {
      toggleSection(toggleBtn, skillsContent);
    });
  }

  
  function toggleSection(btn, content) {
    const isHidden = content.classList.contains('hidden');
    
    if (isHidden) {
      content.classList.remove('hidden');
      btn.textContent = '▼';
      btn.setAttribute('aria-expanded', 'true');
      console.log('Skills section shown');
    } else {
      content.classList.add('hidden');
      btn.textContent = '▶';
      btn.setAttribute('aria-expanded', 'false');
      console.log('Skills section hidden');
    }
  }

  
  function saveThemePreference() {
    const themeLink = document.getElementById('theme-link');
    
    if (!themeLink) return;
    
    const currentHref = themeLink.getAttribute('href');
    const theme = currentHref.includes('red.css') ? 'red' : 'green';
    
    try {
      localStorage.setItem(THEME_KEY, theme);
      console.log(`Theme preference saved: ${theme}`);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  
  function loadThemePreference() {
    const themeLink = document.getElementById('theme-link');
    
    if (!themeLink) return;
    
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      
      if (savedTheme === 'red') {
        themeLink.setAttribute('href', 'red.css');
        console.log('Loaded theme: Red');
      } else {
        themeLink.setAttribute('href', 'green.css');
        console.log('Loaded theme: Green');
      }
    } catch (e) {
      console.warn('Could not load theme preference:', e);
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
