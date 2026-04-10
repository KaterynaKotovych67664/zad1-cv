

(function () {
  'use strict';

  const STUDENT_ID = '67664';
  const THEME_KEY = 'cv_theme_67664';

  
  function init() {
    console.log(`CV Application - Student ID: ${STUDENT_ID}`);
    
    setupThemeSwitcher();
    setupSectionToggle();
    setupFormValidation();
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

  
  function setupFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
      console.warn('Contact form not found');
      return;
    }

    
    form.addEventListener('blur', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.target.id !== 'backend-url') {
          validateField(e.target);
        }
      }
    }, true);

    
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      if (validateForm()) {
        console.log('Form is valid');
        displaySuccessMessage();
        form.reset();
        clearAllErrors();
      } else {
        console.warn('Form validation failed');
      }
    });
  }

  
  function validateForm() {
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let isValid = true;

    isValid = validateField(fname) && isValid;
    isValid = validateField(lname) && isValid;
    isValid = validateField(email) && isValid;
    isValid = validateField(message) && isValid;

    return isValid;
  }

  
  function validateField(field) {
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    
    clearFieldError(field);

    
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = `${getFieldLabel(fieldName)} jest wymagane`;
    } 
    
    else if ((fieldName === 'fname' || fieldName === 'lname')) {
      if (/\d/.test(field.value)) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} nie może zawierać cyfr`;
      }
      
      if (field.value.trim().length < 2) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} musi zawierać co najmniej 2 znaki`;
      }
    }
    
    else if (fieldName === 'email') {
      if (!isValidEmail(field.value)) {
        isValid = false;
        errorMessage = 'Proszę wprowadzić poprawny adres email';
      }
    }
    
    else if (fieldName === 'message') {
      if (field.value.trim().length < 5) {
        isValid = false;
        errorMessage = 'Wiadomość musi zawierać co najmniej 5 znaków';
      }
    }

    if (!isValid) {
      showFieldError(field, errorMessage);
      console.warn(`Validation error for ${fieldName}: ${errorMessage}`);
    }

    return isValid;
  }

  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  
  function getFieldLabel(fieldName) {
    const labels = {
      fname: 'Imię',
      lname: 'Nazwisko',
      email: 'Email',
      message: 'Wiadomość'
    };
    return labels[fieldName] || fieldName;
  }

  
  function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (errorElement) {
      errorElement.textContent = message;
    }
    
    field.classList.add('error');
  }

  
  function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    field.classList.remove('error');
  }

  
  function clearAllErrors() {
    const fields = document.querySelectorAll('[name]');
    fields.forEach(field => clearFieldError(field));
  }

  
  function displaySuccessMessage() {
    const successElement = document.getElementById('form-success');
    
    if (!successElement) return;
    
    successElement.textContent = '✅ Wiadomość została wysłana! Dziękujemy za kontakt.';
    successElement.classList.add('show');
    
    
    setTimeout(() => {
      successElement.classList.remove('show');
      successElement.textContent = '';
    }, 5000);
    
    console.log('Form submitted successfully');
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
