(() => {
  'use strict';

  /**
   * 2026-06-11 Contact-only design safeguard.
   * Keeps the header consultation CTA wording and fit consistent without changing
   * hrefs, routes, form actions, targets, rel attributes, or click behavior.
   */
  const FINAL_TEXT = 'Complementary Consultation';
  const MATCH_TEXT = /^(book\s+a\s+)?(complimentary|complementary|free)?\s*consultation$/i;
  const HEADER_SELECTOR = 'button.hidden, button.sgc-mobile-book-cta, [role="button"].hidden, [role="button"].sgc-mobile-book-cta';

  function compactText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function isHeaderConsultationPill(element) {
    if (!element || element.getAttribute('href')) return false;
    if (!element.matches(HEADER_SELECTOR)) return false;
    return MATCH_TEXT.test(compactText(element.textContent || element.getAttribute('aria-label')));
  }

  function setImportant(element, property, value) {
    if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === 'important') return;
    element.style.setProperty(property, value, 'important');
  }

  function applyFinalConsultationPill() {
    document.querySelectorAll('button, [role="button"]').forEach((element) => {
      if (!isHeaderConsultationPill(element)) return;
      if (compactText(element.textContent) !== FINAL_TEXT) {
        element.textContent = FINAL_TEXT;
      }
      element.setAttribute('aria-label', FINAL_TEXT);
      element.classList.add('sgc-contact-consultation-cta-fit');
      setImportant(element, 'width', '22.5rem');
      setImportant(element, 'min-width', '22.5rem');
      setImportant(element, 'max-width', 'calc(100vw - 2rem)');
      setImportant(element, 'padding-left', '1.25rem');
      setImportant(element, 'padding-right', '1.25rem');
      setImportant(element, 'font-size', '0.72rem');
      setImportant(element, 'letter-spacing', '0.045em');
      setImportant(element, 'white-space', 'nowrap');
      setImportant(element, 'overflow', 'visible');
      setImportant(element, 'text-overflow', 'clip');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyFinalConsultationPill, { once: true });
  else applyFinalConsultationPill();

  window.addEventListener('load', applyFinalConsultationPill, { once: true });
  [50, 150, 350, 750, 1200, 2000, 3500, 5200, 7600, 10000].forEach((delay) => window.setTimeout(applyFinalConsultationPill, delay));

  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(() => {
      pending = false;
      applyFinalConsultationPill();
    });
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-label']
    });
  }

  window.SGCContactConsultationPillFinal = Object.freeze({
    version: '2026-06-11-final-fit-safeguard',
    text: FINAL_TEXT
  });
})();
