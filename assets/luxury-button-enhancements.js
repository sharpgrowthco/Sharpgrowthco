(() => {
  'use strict';

  /**
   * 2026-06-11 design-only button styling.
   * This script never changes hrefs, routes, anchors, form actions, button text,
   * targets, rel attributes, or click behavior. It only adds/removes CSS classes
   * for the exact approved CTA labels and styles only the outermost matching CTA
   * so nested button visuals cannot render as double buttons.
   */
  const PRIMARY_LABELS = new Set([
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

  const SECONDARY_LABELS = new Set([
    'view services',
    'explore my services',
    'explore services',
    'see my services',
    'see full testimonial',
    'see full details',
    'view full packages & pricing',
    'view packages'
  ]);

  const TARGET_SELECTOR = 'a, button, input[type="button"], input[type="submit"], [role="button"]';
  const MANAGED_CLASSES = ['sgc-luxury-cta', 'btn-primary-gold', 'btn-secondary-gold-outline', 'sgc-luxury-cta-nested-neutral'];

  function normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/\s*→\s*$/, '')
      .trim()
      .toLowerCase();
  }

  function elementLabel(element) {
    if (!element) return '';
    if (element.matches && element.matches('input[type="button"], input[type="submit"]')) {
      return normalizeText(element.value || element.getAttribute('aria-label') || element.getAttribute('title'));
    }
    return normalizeText(element.textContent || element.getAttribute('aria-label') || element.getAttribute('title'));
  }

  function styleForLabel(label) {
    if (PRIMARY_LABELS.has(label)) return 'primary-gold';
    if (SECONDARY_LABELS.has(label)) return 'secondary-gold-outline';
    return '';
  }

  function clearManagedClasses(element) {
    MANAGED_CLASSES.forEach((className) => element.classList.remove(className));
    if (element.dataset.sgcButtonStyleManaged === 'true') {
      delete element.dataset.sgcButtonStyleManaged;
      delete element.dataset.sgcButtonStyle;
    }
    delete element.dataset.sgcNestedButtonNeutralized;
  }

  function applyContactConsultationFit(element) {
    if (!element || element.getAttribute('href')) return;
    if (elementLabel(element) !== 'complementary consultation') return;
    if (!element.matches('.hidden, .sgc-mobile-book-cta') && !element.classList.contains('sgc-contact-consultation-cta-fit')) return;
    element.classList.add('sgc-contact-consultation-cta-fit');
    element.style.setProperty('width', '22.5rem', 'important');
    element.style.setProperty('min-width', '22.5rem', 'important');
    element.style.setProperty('max-width', 'calc(100vw - 2rem)', 'important');
    element.style.setProperty('padding-left', '1.25rem', 'important');
    element.style.setProperty('padding-right', '1.25rem', 'important');
    element.style.setProperty('font-size', '0.72rem', 'important');
    element.style.setProperty('letter-spacing', '0.045em', 'important');
    element.style.setProperty('white-space', 'nowrap', 'important');
    element.style.setProperty('overflow', 'visible', 'important');
    element.style.setProperty('text-overflow', 'clip', 'important');
  }

  function applyAllDesignOnlyClasses() {
    const candidates = Array.from(document.querySelectorAll(TARGET_SELECTOR));
    const matches = candidates
      .map((element) => ({ element, label: elementLabel(element) }))
      .map((item) => ({ ...item, style: styleForLabel(item.label) }))
      .filter((item) => item.style);

    candidates.forEach(clearManagedClasses);

    const outerMatches = matches.filter(({ element }) => {
      return !matches.some((other) => other.element !== element && other.element.contains(element));
    });

    outerMatches.forEach(({ element, style }) => {
      element.classList.add('sgc-luxury-cta');
      element.classList.toggle('btn-primary-gold', style === 'primary-gold');
      element.classList.toggle('btn-secondary-gold-outline', style === 'secondary-gold-outline');
      element.dataset.sgcButtonStyleManaged = 'true';
      element.dataset.sgcButtonStyle = style;

      element.querySelectorAll('button, a, [role="button"], [class*="btn"], [class*="button"], [class*="cta"]').forEach((child) => {
        if (child === element) return;
        child.classList.add('sgc-luxury-cta-nested-neutral');
        child.dataset.sgcNestedButtonNeutralized = 'true';
      });
    });

    candidates.forEach(applyContactConsultationFit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllDesignOnlyClasses, { once: true });
  } else {
    applyAllDesignOnlyClasses();
  }

  window.addEventListener('load', applyAllDesignOnlyClasses, { once: true });
  [50, 150, 350, 900, 1800, 3200, 5200].forEach((delay) => window.setTimeout(applyAllDesignOnlyClasses, delay));

  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(() => {
      pending = false;
      applyAllDesignOnlyClasses();
    });
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  window.SGCLuxuryButtonEnhancements = Object.freeze({
    mode: 'design-only-outermost-single-layer',
    primaryLabels: Array.from(PRIMARY_LABELS),
    secondaryLabels: Array.from(SECONDARY_LABELS),
    version: '2026-06-11-single-layer-shiny-gold-mobile'
  });
})();
