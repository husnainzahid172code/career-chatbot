// Navigation and global functionality

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  ThemeManager.init();
  updateThemeToggle();

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = ThemeManager.toggle();
      updateThemeToggle();
    });
  }
});

function updateThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Prevent body scroll when modal is open
function preventScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = 'auto';
}

// Add to window object for global access
window.preventScroll = preventScroll;
window.enableScroll = enableScroll;
