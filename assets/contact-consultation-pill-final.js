(() => {
  'use strict';

  /**
   * 2026-06-11 Contact-only CTA correction.
   * - Header/white-banner BOOK A CONSULTATION keeps the same placement rules as the site header
   *   but now uses the same light champagne-gold pill treatment as the other pages.
   * - Lower direct-contact CTA now uses the same BOOK A CONSULTATION label and sizing as the header pill.
     * - Contact form and footer CTAs keep the same shiny gold design, with the Apply button using a single clean pill layer.
     * Existing destinations and form behavior are preserved.
   */
  const CALENDLY = 'https://calendly.com/sharpgrowthco';
  const HEADER_TEXT = 'BOOK A CONSULTATION';
  const HEADER_ARIA = 'Book a consultation with Sharp Growth Co.';
  const LOWER_TEXT = 'BOOK A CONSULTATION';
  const MATCH_TEXT = /^(book\s+a\s+)?(complimentary|complementary|free)?\s*consultation$/i;
  const HEADER_SELECTOR = 'button.hidden, button.sgc-mobile-book-cta, [role="button"].hidden, [role="button"].sgc-mobile-book-cta';
  const STYLE_ID = 'sgc-contact-consultation-pill-final-styles';
  const GOLD_CLASS = 'sgc-contact-final-gold-cta';
  const HEADER_GOLD_CLASS = 'sgc-contact-header-book-gold';
  const HEADER_REPLACEMENT_CLASS = 'sgc-contact-header-book-gold-replacement';
  const HEADER_ORIGINAL_HIDDEN_CLASS = 'sgc-contact-header-original-hidden';
  const APPLY_CLASS = 'sgc-contact-main-apply-gold';
  const FOOTER_CLASS = 'sgc-contact-footer-start-gold';

  function compactText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function setImportant(element, property, value) {
    if (!element) return;
    if (element.style.getPropertyValue(property) === value && element.style.getPropertyPriority(property) === 'important') return;
    element.style.setProperty(property, value, 'important');
  }

  function applyInlineGold(element, forceDisplay = true) {
    setImportant(element, 'position', 'relative');
    setImportant(element, 'isolation', 'isolate');
    if (forceDisplay) setImportant(element, 'display', 'inline-flex');
    setImportant(element, 'align-items', 'center');
    setImportant(element, 'justify-content', 'center');
    setImportant(element, 'gap', '0.58em');
    setImportant(element, 'box-sizing', 'border-box');
    setImportant(element, 'border', '1px solid rgba(255, 244, 202, 0.92)');
    setImportant(element, 'border-radius', '9999px');
    setImportant(element, 'overflow', 'hidden');
    setImportant(element, 'background', 'radial-gradient(120% 125% at 88% 18%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 250, 233, 0.82) 18%, rgba(255, 244, 198, 0.34) 35%, rgba(255, 255, 255, 0) 54%), radial-gradient(115% 115% at 18% 16%, rgba(255, 251, 226, 0.88) 0%, rgba(246, 213, 122, 0.58) 32%, rgba(255, 255, 255, 0) 55%), linear-gradient(92deg, #d8a33b 0%, #f3cf69 34%, #e1aa2f 64%, #bc7920 100%)');
    setImportant(element, 'background-color', '#e0ad33');
    setImportant(element, 'background-image', 'radial-gradient(120% 125% at 88% 18%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 250, 233, 0.82) 18%, rgba(255, 244, 198, 0.34) 35%, rgba(255, 255, 255, 0) 54%), radial-gradient(115% 115% at 18% 16%, rgba(255, 251, 226, 0.88) 0%, rgba(246, 213, 122, 0.58) 32%, rgba(255, 255, 255, 0) 55%), linear-gradient(92deg, #d8a33b 0%, #f3cf69 34%, #e1aa2f 64%, #bc7920 100%)');
    setImportant(element, 'background-size', '100% 100%, 100% 100%, 100% 100%');
    setImportant(element, 'background-position', 'center center');
    setImportant(element, 'color', '#1c130f');
    setImportant(element, '-webkit-text-fill-color', '#1c130f');
    setImportant(element, 'font-family', "'Outfit', 'Raleway', sans-serif");
    setImportant(element, 'font-weight', '760');
    setImportant(element, 'line-height', '1');
    setImportant(element, 'text-align', 'center');
    setImportant(element, 'text-transform', 'uppercase');
    setImportant(element, 'text-decoration', 'none');
    setImportant(element, 'white-space', 'nowrap');
    setImportant(element, 'text-shadow', '0 1px 0 rgba(255, 246, 222, 0.42)');
    setImportant(element, 'box-shadow', '0 18px 30px rgba(95, 64, 25, 0.28), 0 8px 16px rgba(214, 165, 62, 0.2), inset 0 2px 1px rgba(255, 255, 255, 0.82), inset 0 -2px 4px rgba(128, 72, 12, 0.18)');
    setImportant(element, 'filter', 'none');
    setImportant(element, 'transform', 'translateZ(0)');
  }

  function injectStyles() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GOLD_CLASS} {
        -webkit-appearance: none !important;
        appearance: none !important;
        position: relative !important;
        isolation: isolate !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.58em !important;
        box-sizing: border-box !important;
        min-height: 3.18rem !important;
        padding: 0.92rem 1.72rem !important;
        border: 1px solid rgba(255, 244, 202, 0.92) !important;
        border-radius: 9999px !important;
        overflow: hidden !important;
        background-color: #e0ad33 !important;
        background-image:
          radial-gradient(120% 125% at 88% 18%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 250, 233, 0.82) 18%, rgba(255, 244, 198, 0.34) 35%, rgba(255, 255, 255, 0) 54%),
          radial-gradient(115% 115% at 18% 16%, rgba(255, 251, 226, 0.88) 0%, rgba(246, 213, 122, 0.58) 32%, rgba(255, 255, 255, 0) 55%),
          linear-gradient(92deg, #d8a33b 0%, #f3cf69 34%, #e1aa2f 64%, #bc7920 100%) !important;
        background-size: 100% 100%, 100% 100%, 100% 100% !important;
        background-position: center center !important;
        box-shadow:
          0 18px 30px rgba(95, 64, 25, 0.28),
          0 8px 16px rgba(214, 165, 62, 0.2),
          inset 0 2px 1px rgba(255, 255, 255, 0.82),
          inset 0 -2px 4px rgba(128, 72, 12, 0.18) !important;
        color: #1c130f !important;
        -webkit-text-fill-color: #1c130f !important;
        filter: none !important;
        font-family: 'Outfit', 'Raleway', sans-serif !important;
        font-weight: 760 !important;
        letter-spacing: 0.15em !important;
        line-height: 1 !important;
        text-align: center !important;
        text-shadow: 0 1px 0 rgba(255, 246, 222, 0.42) !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        transform: translateZ(0) !important;
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease !important;
      }

      .${GOLD_CLASS}::before {
        content: '' !important;
        position: absolute !important;
        inset: 5% 4.5% auto 4.5% !important;
        height: 46% !important;
        display: block !important;
        border: 1px solid rgba(255, 255, 255, 0.26) !important;
        border-bottom: 0 !important;
        border-radius: 9999px !important;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.19) 52%, rgba(255, 255, 255, 0) 100%) !important;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
        opacity: 0.9 !important;
        pointer-events: none !important;
        z-index: 0 !important;
        animation: none !important;
      }

      .${GOLD_CLASS}::after {
        content: '→' !important;
        display: inline-block !important;
        margin-left: 0.18em !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        color: #1c130f !important;
        -webkit-text-fill-color: #1c130f !important;
        font-size: 1.28em !important;
        font-weight: 520 !important;
        letter-spacing: 0 !important;
        line-height: 0.78 !important;
        opacity: 1 !important;
        transform: translateY(-0.02em) !important;
        animation: none !important;
        position: relative !important;
        z-index: 1 !important;
      }

      .${GOLD_CLASS} > * {
        position: relative !important;
        z-index: 1 !important;
      }

      .${GOLD_CLASS}:hover,
      .${GOLD_CLASS}:focus-visible {
        transform: translate3d(0, -2px, 0) !important;
        background-position: center center !important;
        color: #1c130f !important;
        -webkit-text-fill-color: #1c130f !important;
        box-shadow:
          0 20px 34px rgba(95, 64, 25, 0.32),
          0 10px 18px rgba(214, 165, 62, 0.24),
          inset 0 2px 1px rgba(255, 255, 255, 0.88),
          inset 0 -2px 4px rgba(128, 72, 12, 0.2) !important;
      }

      .${HEADER_GOLD_CLASS} {
        width: auto !important;
        min-width: 14.65rem !important;
        max-width: calc(100vw - 2rem) !important;
        height: 3.22rem !important;
        min-height: 3.22rem !important;
        padding: 0 1.72em !important;
        font-size: clamp(0.49rem, 0.78vw, 0.86rem) !important;
        letter-spacing: 0.15em !important;
        line-height: 1 !important;
      }

      .${HEADER_REPLACEMENT_CLASS} {
        display: inline-flex !important;
      }

      .${HEADER_ORIGINAL_HIDDEN_CLASS} {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        opacity: 0 !important;
      }

      .sgc-contact-card-consultation-pill {
        width: min(100%, 14.65rem) !important;
        min-width: 0 !important;
        max-width: 14.65rem !important;
        height: 3.22rem !important;
        min-height: 3.22rem !important;
        margin-top: 0.95rem !important;
        padding: 0 1.72em !important;
        font-size: clamp(0.49rem, 0.78vw, 0.86rem) !important;
        letter-spacing: 0.15em !important;
        line-height: 1 !important;
      }

      .${APPLY_CLASS} {
        width: 100% !important;
        min-height: 3.25rem !important;
        padding: 0.94rem 1.65rem !important;
        font-size: 0.82rem !important;
        letter-spacing: 0.125em !important;
      }

      .${APPLY_CLASS}::before,
      .${APPLY_CLASS}.sgc-luxury-cta::before,
      .${APPLY_CLASS}.btn-primary-gold::before,
      .${GOLD_CLASS}.${APPLY_CLASS}::before,
      button.${APPLY_CLASS}::before,
      a.${APPLY_CLASS}::before {
        content: none !important;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        inset: auto !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        opacity: 0 !important;
      }

      .${FOOTER_CLASS} {
        min-width: 12.85rem !important;
        max-width: 100% !important;
        min-height: 3.18rem !important;
        padding: 0.92rem 1.65rem !important;
        font-size: 0.82rem !important;
        letter-spacing: 0.125em !important;
      }

      @media (max-width: 767px) {
        .${HEADER_GOLD_CLASS}.hidden {
          display: none !important;
        }
      }

      @media (max-width: 640px) {
        .${HEADER_GOLD_CLASS}:not(.hidden) {
          min-width: 0 !important;
          width: auto !important;
          height: 2.86rem !important;
          min-height: 2.86rem !important;
          padding-inline: 1.05rem !important;
          font-size: 0.62rem !important;
          letter-spacing: 0.105em !important;
        }

        .sgc-contact-card-consultation-pill {
          width: min(100%, 14.65rem) !important;
          min-width: 0 !important;
          max-width: 14.65rem !important;
          height: 2.86rem !important;
          min-height: 2.86rem !important;
          padding-inline: 1.05rem !important;
          font-size: 0.62rem !important;
          letter-spacing: 0.105em !important;
        }

        .${APPLY_CLASS},
        .${FOOTER_CLASS} {
          width: 100% !important;
          min-height: 3rem !important;
          padding-inline: 1.1rem !important;
          font-size: 0.72rem !important;
          letter-spacing: 0.105em !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function isHeaderConsultationPill(element) {
    if (!element || element.getAttribute('href')) return false;
    if (!element.matches(HEADER_SELECTOR)) return false;
    return MATCH_TEXT.test(compactText(element.textContent || element.getAttribute('aria-label')));
  }

  function normalizeHeaderReplacement(replacement) {
    if (!replacement) return;
    replacement.type = 'button';
    replacement.textContent = HEADER_TEXT;
    replacement.setAttribute('aria-label', HEADER_ARIA);
    replacement.removeAttribute('href');
    replacement.removeAttribute('target');
    replacement.removeAttribute('rel');
    replacement.className = `${GOLD_CLASS} ${HEADER_GOLD_CLASS} ${HEADER_REPLACEMENT_CLASS}`;
    replacement.onclick = () => window.open(CALENDLY, '_blank', 'noopener,noreferrer');
    applyInlineGold(replacement, true);
    setImportant(replacement, 'width', 'auto');
    setImportant(replacement, 'min-width', '14.65rem');
    setImportant(replacement, 'max-width', 'calc(100vw - 2rem)');
    setImportant(replacement, 'height', '3.22rem');
    setImportant(replacement, 'min-height', '3.22rem');
    setImportant(replacement, 'padding-left', '1.72em');
    setImportant(replacement, 'padding-right', '1.72em');
    setImportant(replacement, 'font-size', 'clamp(0.49rem, 0.78vw, 0.86rem)');
    setImportant(replacement, 'letter-spacing', '0.15em');
    setImportant(replacement, 'border-radius', '9999px');
    setImportant(replacement, 'white-space', 'nowrap');
    setImportant(replacement, 'overflow', 'hidden');
  }

  function applyHeaderConsultationPill() {
    document.querySelectorAll(`.${HEADER_REPLACEMENT_CLASS}`).forEach(normalizeHeaderReplacement);
    document.querySelectorAll('button, [role="button"]').forEach((element) => {
      if (!isHeaderConsultationPill(element)) return;

      if (element.classList.contains('hidden')) {
        let replacement = document.querySelector(`.${HEADER_REPLACEMENT_CLASS}`);
        if (!replacement || replacement.tagName !== 'BUTTON') {
          const button = document.createElement('button');
          if (replacement) replacement.replaceWith(button);
          else element.insertAdjacentElement('afterend', button);
          replacement = button;
        }
        normalizeHeaderReplacement(replacement);

        element.classList.add(HEADER_ORIGINAL_HIDDEN_CLASS);
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('tabindex', '-1');
        element.textContent = '';
        setImportant(element, 'display', 'none');
        setImportant(element, 'visibility', 'hidden');
        setImportant(element, 'pointer-events', 'none');
        setImportant(element, 'opacity', '0');
        return;
      }

      if (element.classList.contains('sgc-mobile-book-cta')) {
        element.classList.add(HEADER_ORIGINAL_HIDDEN_CLASS);
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('tabindex', '-1');
        element.textContent = '';
        setImportant(element, 'display', 'none');
        setImportant(element, 'visibility', 'hidden');
        setImportant(element, 'pointer-events', 'none');
        setImportant(element, 'opacity', '0');
      }
    });
  }

  function findDirectContactCard() {
    return Array.from(document.querySelectorAll('section div, main div, aside, article'))
      .filter((element) => {
        const text = compactText(element.textContent);
        return text.includes('Get in touch directly') && /SharpGrowthCo@gmail\.com/i.test(text);
      })
      .sort((a, b) => compactText(a.textContent).length - compactText(b.textContent).length)[0] || null;
  }

  function findEmailElement(card) {
    return Array.from(card.querySelectorAll('a, p, span, div'))
      .filter((element) => !element.querySelector('.sgc-contact-card-consultation-pill'))
      .find((element) => /SharpGrowthCo@gmail\.com/i.test(compactText(element.textContent)));
  }

  function findExistingLowerConsultationLink(card) {
    return Array.from(card.querySelectorAll('a, button'))
      .find((element) => !/SharpGrowthCo@gmail\.com/i.test(compactText(element.textContent)) && /consultation/i.test(compactText(element.textContent)));
  }

  function removeExtraPlainLowerConsultationText(card, keep) {
    Array.from(card.querySelectorAll('p, span, div'))
      .filter((element) => element !== keep && !element.contains(keep))
      .forEach((element) => {
        if (element.classList.contains('sgc-contact-card-consultation-pill')) return;
        if (element.querySelector('.sgc-contact-card-consultation-pill')) return;
        const text = compactText(element.textContent);
        if (text === 'Complementary Consultation' || text === LOWER_TEXT || text === 'Book a free consultation') element.remove();
      });
  }

  function applyLowerCardConsultationPill() {
    const card = findDirectContactCard();
    if (!card) return;
    let pill = card.querySelector('.sgc-contact-card-consultation-pill') || findExistingLowerConsultationLink(card);
    if (!pill) {
      pill = document.createElement('a');
      const emailElement = findEmailElement(card);
      if (emailElement && emailElement.parentElement) emailElement.insertAdjacentElement('afterend', pill);
      else card.appendChild(pill);
    }
    removeExtraPlainLowerConsultationText(card, pill);
    pill.classList.add(GOLD_CLASS, 'sgc-contact-card-consultation-pill');
    pill.classList.remove('text-base', 'btn-secondary-gold-outline', 'sgc-luxury-cta', 'btn-primary-gold', 'sgc-contact-consultation-cta-fit', HEADER_GOLD_CLASS, HEADER_REPLACEMENT_CLASS);
    applyInlineGold(pill);
    setImportant(pill, 'width', 'min(100%, 14.65rem)');
    setImportant(pill, 'min-width', '0');
    setImportant(pill, 'max-width', '14.65rem');
    setImportant(pill, 'margin-left', '0');
    setImportant(pill, 'margin-right', 'auto');
    pill.textContent = LOWER_TEXT;
    pill.setAttribute('href', CALENDLY);
    pill.setAttribute('target', '_blank');
    pill.setAttribute('rel', 'noopener noreferrer');
    pill.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
  }

  function applyMainApplyButton() {
    Array.from(document.querySelectorAll('button, [type="submit"]'))
      .filter((element) => /apply\s+to\s+work\s+together/i.test(compactText(element.textContent)))
      .forEach((element) => {
        element.textContent = 'APPLY TO WORK TOGETHER';
        element.classList.remove('btn-primary', 'sgc-luxury-cta', 'btn-primary-gold');
        element.classList.add(GOLD_CLASS, APPLY_CLASS);
        applyInlineGold(element);
        setImportant(element, 'border-radius', '9999px');
        setImportant(element, 'background', 'linear-gradient(92deg, #c8871f 0%, #f1c95c 34%, #d99d28 68%, #a96b18 100%)');
        setImportant(element, 'background-color', '#dba239');
        setImportant(element, 'background-image', 'linear-gradient(92deg, #c8871f 0%, #f1c95c 34%, #d99d28 68%, #a96b18 100%)');
        setImportant(element, 'box-shadow', '0 16px 28px rgba(95, 64, 25, 0.24), 0 6px 14px rgba(214, 165, 62, 0.18)');
      });
  }

  function applyFooterStartButton() {
    Array.from(document.querySelectorAll('footer a, .sgc-compact-footer a, a'))
      .filter((element) => /start\s+your\s+project/i.test(compactText(element.textContent)))
      .forEach((element) => {
        element.textContent = 'START YOUR PROJECT';
        element.classList.remove('footer-cta', 'sgc-luxury-cta', 'btn-primary-gold', 'btn-primary');
        element.classList.add(GOLD_CLASS, FOOTER_CLASS);
        applyInlineGold(element);
        setImportant(element, 'display', 'inline-flex');
        setImportant(element, 'border-radius', '9999px');
      });
  }

  function applyContactConsultationCorrections() {
    injectStyles();
    applyHeaderConsultationPill();
    applyLowerCardConsultationPill();
    applyMainApplyButton();
    applyFooterStartButton();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyContactConsultationCorrections, { once: true });
  else applyContactConsultationCorrections();

  window.addEventListener('load', applyContactConsultationCorrections, { once: true });
  [50, 150, 350, 750, 1200, 2000, 3500, 5200, 7600, 10000, 12500, 15000, 20000, 30000].forEach((delay) => window.setTimeout(applyContactConsultationCorrections, delay));

  const contactCtaGuard = window.setInterval(applyContactConsultationCorrections, 500);
  window.setTimeout(() => window.clearInterval(contactCtaGuard), 45000);

  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(() => {
      pending = false;
      applyContactConsultationCorrections();
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
    version: '2026-06-11-design-only-contact-button-state-hotfix',
    headerText: HEADER_TEXT,
    lowerText: LOWER_TEXT
  });
})();
