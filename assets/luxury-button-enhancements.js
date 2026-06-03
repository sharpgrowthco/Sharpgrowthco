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
    '/thank-you'
  ];

  const PLAIN_NAV_TEXT = [
    'home',
    'services',
    'my work',
    'work',
    'about',
    'packages',
    'contact'
  ];

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isNavigationLink(el) {
    const text = normalize(el.textContent || el.value || el.getAttribute('aria-label'));
    if (!text || text.includes('book') || text.includes('start your project')) return false;
    if (!PLAIN_NAV_TEXT.includes(text)) return false;
    return Boolean(el.closest('nav, header, footer, [role="navigation"], .footer, .site-footer'));
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
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();


/* Sharp Growth Co. definitive all-page title bar harmonizer.
   This block intentionally uses inline !important styles because the generated
   navigation markup already contains inline !important reset styles that normal
   CSS cannot beat. */
(() => {
  const PLAIN_NAV_TEXT = new Set(['home', 'services', 'my work', 'work', 'about', 'packages', 'contact']);
  const NORMAL = {
    color: '#2d2118',
    webkitTextFillColor: '#21140e',
    background: 'transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    textDecorationLine: 'none',
    textShadow: 'none',
    filter: 'none',
    transform: 'none',
    transition: 'color 180ms ease, -webkit-text-fill-color 180ms ease, transform 180ms ease, text-shadow 180ms ease, filter 180ms ease'
  };
  const GOLD_POP = {
    color: '#b8862a',
    webkitTextFillColor: '#b8862a',
    background: 'transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    textDecorationLine: 'none',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.98), 0 8px 16px rgba(146, 107, 50, 0.24)',
    filter: 'drop-shadow(0 6px 8px rgba(73, 42, 16, 0.16))',
    transform: 'translate3d(0, -2px, 0) scale(1.025)'
  };

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function setImportant(el, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
      const cssProp = prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
      el.style.setProperty(cssProp, value, 'important');
    });
  }

  function isPlainTitleBarLink(el) {
    if (!el || el.matches('.sgc-luxury-cta')) return false;
    const text = normalize(el.textContent || el.getAttribute('aria-label'));
    return PLAIN_NAV_TEXT.has(text) && Boolean(el.closest('header'));
  }

  function bindTitleBarLink(el) {
    if (!isPlainTitleBarLink(el)) return;
    setImportant(el, NORMAL);
    if (el.dataset.sgcTitleBarUnified === 'true') return;
    el.dataset.sgcTitleBarUnified = 'true';

    const activate = () => setImportant(el, GOLD_POP);
    const reset = () => setImportant(el, NORMAL);

    el.addEventListener('mouseenter', activate, { passive: true });
    el.addEventListener('mouseleave', reset, { passive: true });
    el.addEventListener('focus', activate, { passive: true });
    el.addEventListener('blur', reset, { passive: true });
    el.addEventListener('mousedown', activate, { passive: true });
    el.addEventListener('mouseup', reset, { passive: true });
    el.addEventListener('touchstart', activate, { passive: true });
    el.addEventListener('touchend', reset, { passive: true });
    el.addEventListener('touchcancel', reset, { passive: true });
  }

  let queued = false;
  function unifyTitleBar() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      document.querySelectorAll('header a').forEach(bindTitleBarLink);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unifyTitleBar, { once: true });
  } else {
    unifyTitleBar();
  }
  window.addEventListener('load', unifyTitleBar);
  window.addEventListener('popstate', unifyTitleBar);
  window.addEventListener('hashchange', unifyTitleBar);
  document.addEventListener('click', () => setTimeout(unifyTitleBar, 80), true);

  const observer = new MutationObserver(unifyTitleBar);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();


/* Final delegated title bar interaction guard.
   Uses bubbling/capturing pointer and focus events so the generated nav can be
   styled consistently even when individual link listeners are missed. */
(() => {
  const NAV_TEXT = new Set(['home', 'services', 'my work', 'work', 'about', 'packages', 'contact']);
  const NORMAL = {
    color: '#2d2118',
    webkitTextFillColor: '#21140e',
    background: 'transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    textDecorationLine: 'none',
    textShadow: 'none',
    filter: 'none',
    transform: 'none'
  };
  const ACTIVE = {
    color: '#b8862a',
    webkitTextFillColor: '#b8862a',
    background: 'transparent',
    boxShadow: 'none',
    textDecoration: 'none',
    textDecorationLine: 'none',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.98), 0 8px 16px rgba(146, 107, 50, 0.24)',
    filter: 'drop-shadow(0 6px 8px rgba(73, 42, 16, 0.16))',
    transform: 'translate3d(0, -2px, 0) scale(1.025)'
  };

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function set(el, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
      el.style.setProperty(prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), value, 'important');
    });
  }

  function navLinkFromEvent(event) {
    const target = event.target && event.target.closest ? event.target.closest('header a') : null;
    if (!target || target.matches('.sgc-luxury-cta')) return null;
    const text = normalize(target.textContent || target.getAttribute('aria-label'));
    return NAV_TEXT.has(text) ? target : null;
  }

  function normalizeAllHeaderLinks() {
    document.querySelectorAll('header a').forEach((link) => {
      const text = normalize(link.textContent || link.getAttribute('aria-label'));
      if (NAV_TEXT.has(text) && !link.matches('.sgc-luxury-cta')) {
        link.dataset.sgcTitleBarDelegated = 'true';
        link.style.setProperty('transition', 'color 180ms ease, -webkit-text-fill-color 180ms ease, transform 180ms ease, text-shadow 180ms ease, filter 180ms ease', 'important');
        set(link, NORMAL);
      }
    });
  }

  ['pointerover', 'mouseover', 'focusin', 'pointerdown', 'mousedown', 'touchstart'].forEach((type) => {
    document.addEventListener(type, (event) => {
      const link = navLinkFromEvent(event);
      if (link) set(link, ACTIVE);
    }, true);
  });

  ['pointerout', 'mouseout', 'focusout', 'pointerup', 'mouseup', 'touchend', 'touchcancel'].forEach((type) => {
    document.addEventListener(type, (event) => {
      const link = navLinkFromEvent(event);
      if (link) set(link, NORMAL);
    }, true);
  });

  let queued = false;
  function scheduleNormalize() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      normalizeAllHeaderLinks();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleNormalize, { once: true });
  } else {
    scheduleNormalize();
  }
  window.addEventListener('load', scheduleNormalize);
  window.addEventListener('popstate', scheduleNormalize);
  window.addEventListener('hashchange', scheduleNormalize);
  new MutationObserver(scheduleNormalize).observe(document.documentElement, { childList: true, subtree: true });
})();


/* 2026-06-03 restore crisp transparent client-provided logo in the top-left white header banner. */
(() => {
  const LOGO_ALT = 'Sharp Growth Co. Local Alberta Marketing';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function findBrandLink() {
    const header = document.querySelector('header');
    if (!header) return null;
    const links = Array.from(header.querySelectorAll('a[href="/"], a[href="../"], a[href$="/"]'));
    return links.find((link) => {
      const text = normalize(link.textContent || link.getAttribute('aria-label') || '');
      return text.includes('sharp growth co') || text.includes('local alberta marketing');
    }) || null;
  }

  function setImportant(el, prop, value) {
    el.style.setProperty(prop, value, 'important');
  }

  function restoreHeaderLogo() {
    const link = findBrandLink();
    if (!link) return;

    link.classList.remove('sgc-luxury-cta');
    link.classList.add('sgc-header-logo-link');
    link.setAttribute('href', '/');
    link.setAttribute('aria-label', 'Sharp Growth Co. home');
    link.setAttribute('data-sgc-header-logo', 'transparent-client-logo');

    setImportant(link, 'background', 'transparent');
    setImportant(link, 'background-color', 'transparent');
    setImportant(link, 'background-image', 'none');
    setImportant(link, 'box-shadow', 'none');
    setImportant(link, 'filter', 'none');
    setImportant(link, 'text-decoration', 'none');
    setImportant(link, 'transform', 'none');
    setImportant(link, 'width', 'clamp(14.25rem, 23vw, 21rem)');
    setImportant(link, 'min-width', 'clamp(14.25rem, 23vw, 21rem)');
    setImportant(link, 'max-width', 'none');
    setImportant(link, 'padding', '0');
    setImportant(link, 'margin', '0');
    setImportant(link, 'overflow', 'visible');

    if (!link.querySelector('.sgc-header-logo-text')) {
      link.textContent = '';
      const wrap = document.createElement('span');
      wrap.className = 'sgc-header-logo-text';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = '<strong>Sharp Growth Co.</strong><small>Local Alberta Marketing</small>';
      link.appendChild(wrap);
    }
  }

  let queued = false;
  function scheduleLogoRestore() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      restoreHeaderLogo();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleLogoRestore, { once: true });
  } else {
    scheduleLogoRestore();
  }
  window.addEventListener('load', scheduleLogoRestore);
  window.addEventListener('popstate', scheduleLogoRestore);
  window.addEventListener('hashchange', scheduleLogoRestore);
  document.addEventListener('click', () => setTimeout(scheduleLogoRestore, 80), true);
  setTimeout(scheduleLogoRestore, 100);
  setTimeout(scheduleLogoRestore, 500);
  setTimeout(scheduleLogoRestore, 1500);
})();


/* 2026-06-03 Home-page source-of-truth header lock.
   All shared-header pages must match the Home page header metrics exactly. */
(() => {
  const DESKTOP_MIN = 1024;
  const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

  function findConsultationControl(header) {
    return Array.from(header.querySelectorAll('button, a')).find((el) => /book\s+a\s+consultation/i.test(el.textContent || el.getAttribute('aria-label') || ''));
  }

  function lockHeaderToHomeMetrics() {
    const header = document.querySelector('header');
    if (!header) return;

    const desktop = window.innerWidth >= DESKTOP_MIN;
    const container = header.querySelector('.container') || header.firstElementChild;
    const row = container && container.firstElementChild;
    const logo = header.querySelector('a.sgc-header-logo-link, a[href="/"]');
    const logoImg = logo && logo.querySelector('img');
    const nav = header.querySelector('nav, [role="navigation"]');
    const cta = findConsultationControl(header);
    const ctaInner = cta && cta.querySelector('.btn-primary, .btn-gold, [class*="btn-"]');

    header.dataset.sgcHomeHeaderLocked = 'true';
    setImportant(header, 'top', '0');
    setImportant(header, 'left', '0');
    setImportant(header, 'right', '0');
    setImportant(header, 'height', desktop ? '110px' : 'auto');
    setImportant(header, 'min-height', desktop ? '110px' : '0');
    setImportant(header, 'background', 'linear-gradient(180deg, rgba(255,248,240,.98) 0%, rgba(250,240,225,.94) 100%)');
    setImportant(header, 'border', '0');
    setImportant(header, 'border-radius', '0');
    setImportant(header, 'box-shadow', '0 8px 32px rgba(64,42,26,.10), inset 0 -1px 0 rgba(255,255,255,.38)');
    setImportant(header, 'backdrop-filter', 'blur(14px) saturate(1.04)');
    setImportant(header, '-webkit-backdrop-filter', 'blur(14px) saturate(1.04)');

    if (container) {
      setImportant(container, 'width', desktop ? '1240px' : '100%');
      setImportant(container, 'max-width', desktop ? '1240px' : '100%');
      setImportant(container, 'min-height', desktop ? '115.2px' : '5.5rem');
      setImportant(container, 'margin-left', desktop ? 'auto' : '0');
      setImportant(container, 'margin-right', desktop ? 'auto' : '0');
      setImportant(container, 'padding-left', desktop ? '76px' : '1rem');
      setImportant(container, 'padding-right', desktop ? '76px' : '1rem');
      setImportant(container, 'box-sizing', 'border-box');
      setImportant(container, 'background', 'transparent');
      setImportant(container, 'border', '0');
      setImportant(container, 'border-radius', '0');
      setImportant(container, 'box-shadow', 'none');
    }

    if (row) {
      setImportant(row, 'height', desktop ? '80px' : 'auto');
      setImportant(row, 'min-height', desktop ? '0' : '4.8rem');
      setImportant(row, 'width', '100%');
      setImportant(row, 'display', 'flex');
      setImportant(row, 'align-items', 'center');
      setImportant(row, 'justify-content', 'space-between');
      setImportant(row, 'gap', '0');
      setImportant(row, 'padding', '0');
      setImportant(row, 'box-sizing', 'border-box');
    }

    if (logo) {
      logo.classList.add('sgc-header-logo-link');
      setImportant(logo, 'display', 'inline-flex');
      setImportant(logo, 'align-items', 'center');
      setImportant(logo, 'justify-content', 'flex-start');
      setImportant(logo, 'flex', desktop ? '0 0 224px' : '0 0 auto');
      setImportant(logo, 'width', desktop ? '224px' : 'min(56vw, 14rem)');
      setImportant(logo, 'min-width', desktop ? '168px' : '9rem');
      setImportant(logo, 'max-width', desktop ? '224px' : '14rem');
      setImportant(logo, 'height', desktop ? '64px' : 'auto');
      setImportant(logo, 'padding', '0');
      setImportant(logo, 'margin', '0');
      setImportant(logo, 'background', 'transparent');
      setImportant(logo, 'box-shadow', 'none');
      setImportant(logo, 'filter', 'none');
      setImportant(logo, 'text-decoration', 'none');
      setImportant(logo, 'overflow', 'visible');
    }

    if (logoImg) {
      setImportant(logoImg, 'display', 'block');
      setImportant(logoImg, 'width', desktop ? '224px' : 'min(56vw, 14rem)');
      setImportant(logoImg, 'height', desktop ? '64px' : 'auto');
      setImportant(logoImg, 'max-width', desktop ? '224px' : '14rem');
      setImportant(logoImg, 'object-fit', 'contain');
      setImportant(logoImg, 'object-position', 'left center');
      setImportant(logoImg, 'background', 'transparent');
      setImportant(logoImg, 'filter', 'none');
      logoImg.setAttribute('loading', 'eager');
      logoImg.setAttribute('decoding', 'async');
    }

    if (nav) {
      setImportant(nav, 'display', desktop ? 'flex' : 'none');
      setImportant(nav, 'align-items', 'center');
      setImportant(nav, 'justify-content', 'center');
      setImportant(nav, 'gap', desktop ? '51.2px' : '1.2rem');
      setImportant(nav, 'width', desktop ? '574.484px' : 'auto');
      setImportant(nav, 'height', desktop ? '19px' : 'auto');
      setImportant(nav, 'margin', '0');
      setImportant(nav, 'padding', '0');
      setImportant(nav, 'background', 'transparent');
      setImportant(nav, 'border', '0');
      setImportant(nav, 'box-shadow', 'none');
      nav.querySelectorAll('a').forEach((link) => {
        setImportant(link, 'display', 'inline-flex');
        setImportant(link, 'align-items', 'center');
        setImportant(link, 'justify-content', 'center');
        setImportant(link, 'white-space', 'nowrap');
        setImportant(link, 'min-width', 'max-content');
        setImportant(link, 'padding', '0');
        setImportant(link, 'margin', '0');
        setImportant(link, 'line-height', '1');
        setImportant(link, 'text-decoration', 'none');
      });
    }

    if (cta) {
      setImportant(cta, 'display', desktop ? 'inline-flex' : 'none');
      setImportant(cta, 'align-items', 'center');
      setImportant(cta, 'justify-content', 'center');
      setImportant(cta, 'width', 'auto');
      setImportant(cta, 'min-width', desktop ? '276px' : '13.5rem');
      setImportant(cta, 'height', desktop ? '68px' : '3.75rem');
      setImportant(cta, 'min-height', desktop ? '68px' : '3.75rem');
      setImportant(cta, 'padding', desktop ? '0 48px' : '0 1.8rem');
      setImportant(cta, 'margin', '0');
      setImportant(cta, 'border-radius', '0');
      setImportant(cta, 'border', '1px solid rgba(218,171,76,.38)');
      setImportant(cta, 'background', 'linear-gradient(135deg,#ddb24f 0%,#c89539 48%,#a87524 100%)');
      setImportant(cta, 'box-shadow', '0 14px 26px rgba(86,52,21,.18)');
      setImportant(cta, 'color', '#fffaf2');
      setImportant(cta, 'box-sizing', 'border-box');
    }

    if (ctaInner) {
      setImportant(ctaInner, 'display', 'inline');
      setImportant(ctaInner, 'padding', '0');
      setImportant(ctaInner, 'margin', '0');
      setImportant(ctaInner, 'background', 'transparent');
      setImportant(ctaInner, 'border', '0');
      setImportant(ctaInner, 'box-shadow', 'none');
      setImportant(ctaInner, 'color', '#fffaf2');
      setImportant(ctaInner, 'font-family', "'Outfit', 'Raleway', sans-serif");
      setImportant(ctaInner, 'font-size', '0.84rem');
      setImportant(ctaInner, 'font-weight', '700');
      setImportant(ctaInner, 'letter-spacing', '0.18em');
      setImportant(ctaInner, 'line-height', '1');
      setImportant(ctaInner, 'text-transform', 'uppercase');
      setImportant(ctaInner, 'white-space', 'nowrap');
    }
  }

  function scheduleHomeHeaderLock() {
    lockHeaderToHomeMetrics();
    requestAnimationFrame(lockHeaderToHomeMetrics);
    setTimeout(lockHeaderToHomeMetrics, 120);
    setTimeout(lockHeaderToHomeMetrics, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleHomeHeaderLock, { once: true });
  } else {
    scheduleHomeHeaderLock();
  }
  window.addEventListener('load', scheduleHomeHeaderLock);
  window.addEventListener('resize', scheduleHomeHeaderLock);
  window.addEventListener('popstate', scheduleHomeHeaderLock);
  window.addEventListener('hashchange', scheduleHomeHeaderLock);
  new MutationObserver(scheduleHomeHeaderLock).observe(document.documentElement, { childList: true, subtree: true });
})();


/* 2026-06-03 Home page compact spacing + package CTA gold treatment. */
(() => {
  const isHome = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/';
  };

  const normalize = (value) => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*→\s*$/, '')
    .trim()
    .toLowerCase();

  const setImportant = (element, property, value) => {
    if (!element || !element.style) return;
    element.style.setProperty(property, value, 'important');
  };

  const goldCtaLabels = new Set([
    'see full details',
    'view full packages & pricing',
    'view full packages and pricing',
    'view packages & pricing',
    'view packages and pricing'
  ]);

  function markPackageButtons() {
    document.querySelectorAll('a, button').forEach((element) => {
      const label = normalize(element.textContent || element.innerText);
      const href = (element.getAttribute('href') || '').toLowerCase();
      const context = normalize(
        element.parentElement?.closest('article, section, li, [class*="card"], [class*="package"], [class*="pricing"], [class*="grid"]')?.textContent || ''
      );

      const shouldBeGold = goldCtaLabels.has(label)
        || (label.includes('see full details') && (context.includes('package') || href.includes('packages')))
        || (label.includes('view full packages') || label.includes('view packages'));

      if (!shouldBeGold) return;

      element.classList.add('sgc-gold-package-cta');
      element.setAttribute('data-sgc-gold-package-cta', 'true');

      if (context.includes('content queen') || context.includes('package 03') || context.includes('most popular')) {
        element.classList.add('sgc-content-queen-shine');
        element.setAttribute('data-sgc-content-queen-shine', 'true');
      }
    });
  }

  function compactHomeSpacing() {
    if (!isHome()) return;

    document.documentElement.classList.add('sgc-home-compact-spacing');
    document.body?.classList.add('sgc-home-compact-spacing');

    const candidates = new Set([
      ...document.querySelectorAll('#root main > section, #root section, #root [data-sgc-home-section], #root .home-section, #root [class*="home-"][class*="section"], #root [class*="pricing"], #root [class*="packages"], #root [class*="work"], #root [class*="services"]')
    ]);

    candidates.forEach((section) => {
      if (!(section instanceof HTMLElement)) return;
      if (section.matches('header, footer, nav, script, style, .sgc-exact-reference-hero')) return;
      if (section.closest('header, footer, nav, .sgc-exact-reference-hero')) return;
      const rect = section.getBoundingClientRect();
      if (rect.height < 90) return;

      section.classList.add('sgc-home-compact-section');

      const styles = window.getComputedStyle(section);
      const paddingTop = parseFloat(styles.paddingTop) || 0;
      const paddingBottom = parseFloat(styles.paddingBottom) || 0;
      const marginTop = parseFloat(styles.marginTop) || 0;
      const marginBottom = parseFloat(styles.marginBottom) || 0;

      if (paddingTop > 64) setImportant(section, 'padding-top', 'clamp(2.1rem, 4.2vw, 4rem)');
      if (paddingBottom > 64) setImportant(section, 'padding-bottom', 'clamp(2.1rem, 4.2vw, 4rem)');
      if (marginTop > 24) setImportant(section, 'margin-top', '0px');
      if (marginBottom > 24) setImportant(section, 'margin-bottom', '0px');
    });
  }

  function applyHomeVisualFixes() {
    compactHomeSpacing();
    markPackageButtons();
  }

  function scheduleHomeVisualFixes() {
    applyHomeVisualFixes();
    requestAnimationFrame(applyHomeVisualFixes);
    setTimeout(applyHomeVisualFixes, 150);
    setTimeout(applyHomeVisualFixes, 600);
    setTimeout(applyHomeVisualFixes, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleHomeVisualFixes, { once: true });
  } else {
    scheduleHomeVisualFixes();
  }

  window.addEventListener('load', scheduleHomeVisualFixes);
  window.addEventListener('resize', scheduleHomeVisualFixes);
  window.addEventListener('popstate', scheduleHomeVisualFixes);
  window.addEventListener('hashchange', scheduleHomeVisualFixes);

  const observer = new MutationObserver(scheduleHomeVisualFixes);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
