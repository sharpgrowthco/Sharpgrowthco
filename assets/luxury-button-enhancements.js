(() => {
  const PRIMARY_CTA_TEXT = new Set([
    'book a consultation',
    'work with me',
    'contact me',
    'book a custom growth plan',
    'start your project',
    'start your growth journey',
    'book a call',
    'book a complimentary consultation',
    'apply to work together'
  ]);

  const SECONDARY_CTA_TEXT = new Set([
    'view services',
    'explore services',
    'explore my services',
    'see my services',
    'see full testimonial',
    'see full details',
    'view full packages & pricing',
    'view packages'
  ]);

  const PRIMARY_INLINE_STYLES = {
    'border-radius': '999px',
    'background-color': 'var(--sgc-button-classic-gold)',
    'background-image': 'linear-gradient(115deg, var(--sgc-button-deep-gold) 0%, var(--sgc-button-classic-gold) 26%, var(--sgc-button-champagne) 48%, var(--sgc-button-ivory-gold) 56%, var(--sgc-button-classic-gold) 72%, var(--sgc-button-deep-gold) 100%)',
    'color': 'var(--sgc-button-charcoal)',
    'border': '1px solid rgba(255, 232, 182, 0.76)',
    'box-shadow': '0 14px 30px rgba(39, 24, 11, 0.17), 0 8px 18px rgba(218, 171, 87, 0.32), inset 0 1px 0 rgba(255, 250, 235, 0.7), inset 0 -1px 0 rgba(116, 75, 24, 0.28)',
    'overflow': 'hidden'
  };

  const SECONDARY_INLINE_STYLES = {
    'border-radius': '999px',
    'background-color': 'rgba(255, 250, 241, 0.02)',
    'background-image': 'linear-gradient(135deg, rgba(255, 244, 215, 0.05), rgba(203, 151, 62, 0.02))',
    'color': 'var(--sgc-button-classic-gold)',
    'border': '1px solid var(--sgc-button-gold-border)',
    'box-shadow': '0 8px 18px rgba(39, 24, 11, 0.08), inset 0 1px 0 rgba(255, 250, 235, 0.18)',
    'overflow': 'hidden'
  };

  const LEGACY_PRIMARY_TEXT = new Set([
    'book your call',
    'get started',
    'get a website quote',
    'send message',
    'submit',
    'let’s grow',
    "let's grow"
  ]);

  const PLAIN_NAV_TEXT = new Set([
    'home',
    'services',
    'my work',
    'work',
    'about',
    'packages',
    'contact'
  ]);

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function readableLabel(el) {
    if (!el) return '';
    return normalize(el.textContent || el.value || el.getAttribute('aria-label') || el.getAttribute('title'));
  }

  function isNavigationLink(el, text) {
    if (!text || text.includes('book') || text.includes('start your project')) return false;
    if (!PLAIN_NAV_TEXT.has(text)) return false;
    return Boolean(el.closest('nav, header, footer, [role="navigation"], .footer, .site-footer'));
  }

  function clearButtonStyleClasses(el) {
    el.classList.remove('btn-primary-gold', 'btn-secondary-gold-outline', 'sgc-button-unclassified');
  }

  function applyVisualStyleOverrides(el, styleType) {
    const styles = styleType === 'secondary' ? SECONDARY_INLINE_STYLES : PRIMARY_INLINE_STYLES;
    Object.entries(styles).forEach(([property, value]) => {
      el.style.setProperty(property, value, 'important');
    });
  }

  function classifyButton(el) {
    const text = readableLabel(el);
    if (!text || isNavigationLink(el, text)) return null;

    if (PRIMARY_CTA_TEXT.has(text)) return 'primary';
    if (SECONDARY_CTA_TEXT.has(text)) return 'secondary';

    const className = (el.className || '').toString().toLowerCase();
    if (className.includes('btn-outline')) return 'secondary';
    if (className.includes('btn-primary') || className.includes('btn-gold')) return 'primary';
    if (LEGACY_PRIMARY_TEXT.has(text)) return 'primary';

    return null;
  }

  function polishButtons() {
    document.querySelectorAll('a, button, input[type="submit"]').forEach((el) => {
      const styleType = classifyButton(el);
      clearButtonStyleClasses(el);
      if (!styleType) return;

      el.classList.add('sgc-luxury-cta');
      el.classList.add(styleType === 'secondary' ? 'btn-secondary-gold-outline' : 'btn-primary-gold');
      applyVisualStyleOverrides(el, styleType);

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
  [180, 650, 1500].forEach((delay) => window.setTimeout(schedulePolish, delay));

  const observer = new MutationObserver(schedulePolish);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'value', 'aria-label'] });
})();
