(() => {
  const CTA_TEXT = [
    'book a call',
    'book your call',
    'get started',
    'get a website quote',
    'view packages',
    'view services',
    'explore services',
    'work with me',
    'start your project',
    'send message',
    'submit',
    'let’s grow',
    "let's grow"
  ];

  const CTA_HREF_PARTS = [
    'calendly.com/sharpgrowthco',
    '/contact',
    '/packages',
    '/services',
    '/thank-you'
  ];

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isNavigationLink(el) {
    return Boolean(el.closest('nav, header') && !normalize(el.textContent).includes('book'));
  }

  function shouldPolish(el) {
    if (!el || isNavigationLink(el)) return false;
    const text = normalize(el.textContent || el.value || el.getAttribute('aria-label'));
    const href = (el.getAttribute('href') || '').toLowerCase();
    const className = (el.className || '').toString().toLowerCase();
    if (className.includes('btn-primary') || className.includes('btn-gold') || className.includes('btn-outline')) return true;
    if (CTA_TEXT.some((phrase) => text.includes(phrase))) return true;
    return CTA_HREF_PARTS.some((part) => href.includes(part)) && text.length > 0 && text.length < 60;
  }

  function polishButtons() {
    document.querySelectorAll('a, button, input[type="submit"]').forEach((el) => {
      if (!shouldPolish(el)) return;
      el.classList.add('sgc-luxury-cta');
      if (!el.getAttribute('aria-label') && normalize(el.textContent || el.value)) {
        el.setAttribute('aria-label', (el.textContent || el.value).replace(/\s+/g, ' ').trim());
      }
    });
  }

  let queued = false;
  function schedulePolish() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      polishButtons();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedulePolish, { once: true });
  } else {
    schedulePolish();
  }
  window.addEventListener('load', schedulePolish);
  window.addEventListener('popstate', schedulePolish);
  window.addEventListener('hashchange', schedulePolish);
  document.addEventListener('click', () => setTimeout(schedulePolish, 80), true);

  const observer = new MutationObserver(schedulePolish);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'href', 'value'] });
})();
