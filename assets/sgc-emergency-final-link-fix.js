(() => {
  const CALENDLY = 'https://calendly.com/sharpgrowthco';
  const ROUTES = {
    home: '/',
    services: '/services/',
    about: '/about/',
    packages: '/packages/',
    contact: '/contact/',
    work: '/work/'
  };

  const normalize = (text) => (text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*→\s*$/, '')
    .trim()
    .toLowerCase();

  const bookingLabels = new Set([
    'book a consultation',
    'book a free consultation',
    'book a call',
    'book a custom growth plan',
    'book a custom growth plan',
    'get a website quote',
    'start your growth journey',
    'schedule a consultation',
    'start your project today'
  ]);

  const contactLabels = new Set([
    'work with me',
    'start your project'
  ]);

  const servicesLabels = new Set([
    'services',
    'view services',
    'explore my services',
    'see all services'
  ]);

  const packagesLabels = new Set([
    'packages',
    'view packages',
    'view all packages'
  ]);

  const aboutLabels = new Set(['about']);
  const workLabels = new Set(['my work', 'work']);
  const homeLabels = new Set(['home']);

  function applyAnchor(a) {
    const label = normalize(a.textContent || a.innerText);
    const href = (a.getAttribute('href') || '').trim();

    if (bookingLabels.has(label)) {
      a.href = CALENDLY;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
      return;
    }

    if (contactLabels.has(label) || href === '/contact' || href.endsWith('/contact')) {
      a.href = ROUTES.contact;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      if (contactLabels.has(label)) {
        a.setAttribute('aria-label', 'Work with Me — Contact');
      }
      return;
    }

    if (servicesLabels.has(label) || href === '/services' || href.endsWith('/services')) {
      a.href = ROUTES.services;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      return;
    }

    if (packagesLabels.has(label) || href === '/packages' || href.endsWith('/packages')) {
      a.href = ROUTES.packages;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      return;
    }

    if (aboutLabels.has(label) || href === '/about' || href.endsWith('/about')) {
      a.href = ROUTES.about;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      return;
    }

    if (workLabels.has(label) || href === '/work' || href.endsWith('/work')) {
      a.href = ROUTES.work;
      a.removeAttribute('target');
      a.removeAttribute('rel');
      return;
    }

    if (homeLabels.has(label)) {
      a.href = ROUTES.home;
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  }

  function applyButton(button) {
    const label = normalize(button.textContent || button.innerText);
    if (bookingLabels.has(label)) {
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
      if (button.dataset.sgcCalendlyFinal !== 'true') {
        button.dataset.sgcCalendlyFinal = 'true';
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.open(CALENDLY, '_blank', 'noopener,noreferrer');
        }, true);
      }
    }

    if (contactLabels.has(label)) {
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.setAttribute('aria-label', 'Work with Me — Contact');
      if (button.dataset.sgcContactFinal !== 'true') {
        button.dataset.sgcContactFinal = 'true';
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.location.href = ROUTES.contact;
        }, true);
      }
    }
  }

  function fixEverything() {
    document.querySelectorAll('a').forEach(applyAnchor);
    document.querySelectorAll('button').forEach(applyButton);
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest && event.target.closest('a,button');
    if (!target) return;
    const label = normalize(target.textContent || target.innerText);
    if (bookingLabels.has(label)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(CALENDLY, '_blank', 'noopener,noreferrer');
      return;
    }
    if (contactLabels.has(label)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = ROUTES.contact;
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixEverything);
  } else {
    fixEverything();
  }
  window.addEventListener('load', fixEverything);
  setTimeout(fixEverything, 100);
  setTimeout(fixEverything, 500);
  setTimeout(fixEverything, 1500);
  new MutationObserver(fixEverything).observe(document.documentElement, { childList: true, subtree: true });
})();
