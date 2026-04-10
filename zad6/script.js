

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
    
    
    loadDataFromJSON();
  }

  
  function loadDataFromJSON() {
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data loaded successfully:', data);
        
        populateSkills(data.skills);
        populateProjects(data.projects);
        populateExperience(data.experience);
      })
      .catch(error => {
        console.error('Error loading JSON data:', error);
        displayErrorMessage('Nie udało się załadować danych');
      });
  }

  
  function populateSkills(skills) {
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;

    
    skillsList.innerHTML = '';

    if (!skills || skills.length === 0) {
      skillsList.innerHTML = '<li>Brak umiejętności</li>';
      return;
    }

    skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
    });

    console.log(`Loaded ${skills.length} skills`);
  }

  
  function populateProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    
    projectsList.innerHTML = '';

    if (!projects || projects.length === 0) {
      projectsList.innerHTML = '<li>Brak projektów</li>';
      return;
    }

    projects.forEach(project => {
      const li = document.createElement('li');
      const projectName = project.link
        ? `<strong><a href="${project.link}" target="_blank" rel="noopener noreferrer">${project.name}</a></strong>`
        : `<strong>${project.name}</strong>`;
      li.innerHTML = `${projectName} - ${project.description}`;
      projectsList.appendChild(li);
    });

    console.log(`Loaded ${projects.length} projects`);
  }

  
  function populateExperience(experienceList) {
    const experienceContainer = document.getElementById('experience-list');
    if (!experienceContainer) return;

    
    experienceContainer.innerHTML = '';

    if (!experienceList || experienceList.length === 0) {
      experienceContainer.innerHTML = '<p>Brak doświadczenia</p>';
      return;
    }

    experienceList.forEach(exp => {
      const article = document.createElement('article');
      article.className = 'item';

      const itemTop = document.createElement('div');
      itemTop.className = 'item__top';

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = `${exp.startDate} – ${exp.endDate}`;

      const place = document.createElement('span');
      place.className = 'place';
      place.textContent = exp.location;

      itemTop.appendChild(badge);
      itemTop.appendChild(place);
      article.appendChild(itemTop);

      const h3 = document.createElement('h3');
      h3.textContent = exp.title;
      article.appendChild(h3);

      const org = document.createElement('p');
      org.className = 'org';
      org.textContent = exp.organization;
      article.appendChild(org);

      const ul = document.createElement('ul');
      ul.className = 'list';
      exp.tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        ul.appendChild(li);
      });
      article.appendChild(ul);

      experienceContainer.appendChild(article);
    });

    console.log(`Loaded ${experienceList.length} experience entries`);
  }

  
  function displayErrorMessage(message) {
    const skillsList = document.getElementById('skills-list');
    const projectsList = document.getElementById('projects-list');
    const experienceContainer = document.getElementById('experience-list');

    if (skillsList) skillsList.innerHTML = `<li>❌ ${message}</li>`;
    if (projectsList) projectsList.innerHTML = `<li>❌ ${message}</li>`;
    if (experienceContainer) experienceContainer.innerHTML = `<p>❌ ${message}</p>`;
  }

  
  function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    themeToggle.addEventListener('click', function () {
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
    const newHref = currentHref === 'green.css' ? 'red.css' : 'green.css';
    
    themeLink.setAttribute('href', newHref);
    console.log(`Theme changed to: ${newHref === 'green.css' ? 'Green' : 'Red'}`);
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
        validateField(e.target);
      }
    }, true);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      if (validateForm()) {
        console.log('Form is valid');
        displayFormSuccessMessage();
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

  
  function displayFormSuccessMessage() {
    const successElement = document.getElementById('form-success');
    
    if (!successElement) return;
    
    successElement.textContent = '✅ Wiadomość została wysłana! Dziękujemy za kontakt.';
    successElement.classList.add('show');
    
    setTimeout(() => {
      successElement.classList.remove('show');
      successElement.textContent = '';
    }, 5000);
  }

  
  function saveThemePreference() {
    const themeLink = document.getElementById('theme-link');
    
    if (!themeLink) return;
    
    try {
      const currentHref = themeLink.getAttribute('href');
      const themeName = currentHref === 'green.css' ? 'green' : 'red';
      localStorage.setItem(THEME_KEY, themeName);
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
      } else {
        themeLink.setAttribute('href', 'green.css');
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
