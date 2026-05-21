(() => {
  const CALENDLY = 'https://calendly.com/sharpgrowthco';
  const CONTACT = '/contact';
  const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/\s*→\s*$/, '');
  const consultationLabels = new Set([
    'book a consultation',
    'book a free consultation',
    'book a custom growth plan',
    'get a website quote',
    'work with jenna',
    'start your growth journey'
  ]);
  const contactLabels = new Set([
    'work with me',
    'start your project'
  ]);

  function ensureAnchorTarget(anchor, href, external = false) {
    if (!anchor) return;
    anchor.setAttribute('href', href);
    if (external) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    } else {
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    }
  }

  function wireButtons() {
    document.querySelectorAll('a').forEach((a) => {
      const label = normalize(a.textContent);
      if (consultationLabels.has(label)) ensureAnchorTarget(a, CALENDLY, true);
      if (contactLabels.has(label)) ensureAnchorTarget(a, CONTACT, false);
    });

    document.querySelectorAll('button').forEach((button) => {
      const type = (button.getAttribute('type') || '').trim().toLowerCase();
      if (type === 'submit') return;
      const label = normalize(button.textContent);
      if (consultationLabels.has(label)) {
        if (button.dataset.sgcCalendlyFixed !== 'true') {
          button.dataset.sgcCalendlyFixed = 'true';
          button.setAttribute('type', 'button');
          button.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
          button.style.cursor = 'pointer';
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.open(CALENDLY, '_blank', 'noopener,noreferrer');
          }, true);
        }
      }
      if (contactLabels.has(label)) {
        if (button.dataset.sgcContactFixed !== 'true') {
          button.dataset.sgcContactFixed = 'true';
          button.setAttribute('type', 'button');
          button.setAttribute('aria-label', 'Open the Sharp Growth Co. contact form');
          button.style.cursor = 'pointer';
          button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            window.location.assign(CONTACT);
          }, true);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }
  window.addEventListener('load', wireButtons);
  setTimeout(wireButtons, 250);
  setTimeout(wireButtons, 1000);
  new MutationObserver(wireButtons).observe(document.documentElement, { childList: true, subtree: true });
})();
