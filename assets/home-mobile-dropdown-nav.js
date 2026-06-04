;(() => {
  'use strict';

  const MENU_ID = 'sgc-home-mobile-dropdown-nav';
  const STYLE_ID = 'sgc-home-mobile-dropdown-nav-style';
  const MOBILE_QUERY = '(max-width: 767px)';
  const CALENDLY_URL = 'https://calendly.com/sharpgrowthco';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services/', label: 'My Services' },
    { href: '/work/', label: 'My Work' },
    { href: '/about/', label: 'About' },
    { href: '/packages/', label: 'Packages' },
    { href: '/contact/', label: 'Contact' },
    { href: CALENDLY_URL, label: 'Book a Consultation', external: true, cta: true }
  ];

  function isHomePath() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '';
  }

  function isMobileWidth() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @media (max-width: 767px) {
        body.sgc-home-mobile-dropdown-nav-active #root {
          padding-top: 70px !important;
        }
        .sgc-home-mobile-dropdown-nav {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 10050 !important;
          padding: 10px 14px !important;
          background: linear-gradient(180deg, rgba(255,248,240,.98) 0%, rgba(250,240,225,.96) 100%) !important;
          box-shadow: 0 10px 32px rgba(64,42,26,.13), inset 0 -1px 0 rgba(255,255,255,.55) !important;
          backdrop-filter: blur(14px) saturate(1.05) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.05) !important;
          font-family: Outfit, Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .sgc-home-mobile-dropdown-nav__bar {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 14px !important;
          max-width: 100% !important;
        }
        .sgc-home-mobile-dropdown-nav__brand {
          color: oklch(0.24 0.045 55) !important;
          font-family: 'Cormorant Garamond', Georgia, serif !important;
          font-size: clamp(1.3rem, 6vw, 1.75rem) !important;
          font-weight: 700 !important;
          letter-spacing: .03em !important;
          text-decoration: none !important;
          white-space: nowrap !important;
        }
        .sgc-home-mobile-dropdown-nav__toggle {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          min-height: 42px !important;
          padding: 10px 14px !important;
          border: 1px solid rgba(139,111,71,.32) !important;
          border-radius: 999px !important;
          background: rgba(255,255,255,.58) !important;
          color: oklch(0.24 0.045 55) !important;
          box-shadow: 0 8px 18px rgba(64,42,26,.10) !important;
          font-size: .78rem !important;
          font-weight: 700 !important;
          letter-spacing: .16em !important;
          text-transform: uppercase !important;
        }
        .sgc-home-mobile-dropdown-nav__icon,
        .sgc-home-mobile-dropdown-nav__icon::before,
        .sgc-home-mobile-dropdown-nav__icon::after {
          display: block !important;
          width: 16px !important;
          height: 2px !important;
          border-radius: 999px !important;
          background: currentColor !important;
          content: '' !important;
        }
        .sgc-home-mobile-dropdown-nav__icon {
          position: relative !important;
        }
        .sgc-home-mobile-dropdown-nav__icon::before {
          position: absolute !important;
          top: -5px !important;
          left: 0 !important;
        }
        .sgc-home-mobile-dropdown-nav__icon::after {
          position: absolute !important;
          top: 5px !important;
          left: 0 !important;
        }
        .sgc-home-mobile-dropdown-nav__panel {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 14px !important;
          right: 14px !important;
          display: grid !important;
          gap: 0 !important;
          padding: 10px !important;
          border: 1px solid rgba(139,111,71,.18) !important;
          border-radius: 22px !important;
          background: rgba(255,250,244,.98) !important;
          box-shadow: 0 18px 44px rgba(64,42,26,.18) !important;
          transform-origin: top center !important;
          transition: opacity .18s ease, transform .18s ease, visibility .18s ease !important;
        }
        .sgc-home-mobile-dropdown-nav__panel[hidden] {
          display: grid !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transform: translateY(-8px) scale(.985) !important;
        }
        .sgc-home-mobile-dropdown-nav__panel:not([hidden]) {
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateY(0) scale(1) !important;
        }
        .sgc-home-mobile-dropdown-nav__link {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          min-height: 46px !important;
          padding: 12px 14px !important;
          border-radius: 14px !important;
          color: oklch(0.28 0.04 55) !important;
          font-size: .94rem !important;
          font-weight: 600 !important;
          letter-spacing: .04em !important;
          text-decoration: none !important;
        }
        .sgc-home-mobile-dropdown-nav__link + .sgc-home-mobile-dropdown-nav__link {
          border-top: 1px solid rgba(139,111,71,.11) !important;
        }
        .sgc-home-mobile-dropdown-nav__link:active,
        .sgc-home-mobile-dropdown-nav__link:focus-visible {
          background: rgba(139,111,71,.10) !important;
          outline: none !important;
        }
        .sgc-home-mobile-dropdown-nav__link--cta {
          margin-top: 8px !important;
          justify-content: center !important;
          border: 1px solid rgba(139,111,71,.30) !important;
          background: linear-gradient(135deg, #8B6F47 0%, #D8B46A 54%, #F4E1A6 100%) !important;
          color: #2f2415 !important;
          box-shadow: 0 10px 24px rgba(139,111,71,.23) !important;
          text-transform: uppercase !important;
          letter-spacing: .10em !important;
          font-size: .78rem !important;
        }
      }
      @media (min-width: 768px) {
        .sgc-home-mobile-dropdown-nav { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function closeMenu() {
    const nav = document.getElementById(MENU_ID);
    if (!nav) return;
    const button = nav.querySelector('button');
    const panel = nav.querySelector('[data-sgc-mobile-menu-panel]');
    if (!button || !panel) return;
    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  }

  function removeMenu() {
    const nav = document.getElementById(MENU_ID);
    if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
    document.body.classList.remove('sgc-home-mobile-dropdown-nav-active');
  }

  function createMenu() {
    if (document.getElementById(MENU_ID)) return;
    injectStyles();

    const nav = document.createElement('nav');
    nav.id = MENU_ID;
    nav.className = 'sgc-home-mobile-dropdown-nav';
    nav.setAttribute('aria-label', 'Mobile site navigation');

    const bar = document.createElement('div');
    bar.className = 'sgc-home-mobile-dropdown-nav__bar';

    const brand = document.createElement('a');
    brand.className = 'sgc-home-mobile-dropdown-nav__brand';
    brand.href = '/';
    brand.textContent = 'Sharp Growth Co.';
    brand.setAttribute('aria-label', 'Sharp Growth Co. home');

    const button = document.createElement('button');
    button.className = 'sgc-home-mobile-dropdown-nav__toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open mobile menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', MENU_ID + '-panel');
    button.innerHTML = '<span>Menu</span><span class="sgc-home-mobile-dropdown-nav__icon" aria-hidden="true"></span>';

    const panel = document.createElement('div');
    panel.id = MENU_ID + '-panel';
    panel.className = 'sgc-home-mobile-dropdown-nav__panel';
    panel.setAttribute('data-sgc-mobile-menu-panel', 'true');
    panel.hidden = true;

    links.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'sgc-home-mobile-dropdown-nav__link' + (item.cta ? ' sgc-home-mobile-dropdown-nav__link--cta' : '');
      link.href = item.href;
      link.textContent = item.label;
      if (item.external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      link.addEventListener('click', closeMenu);
      panel.appendChild(link);
    });

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });

    document.addEventListener('click', (event) => {
      const currentNav = document.getElementById(MENU_ID);
      if (currentNav && !currentNav.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    bar.appendChild(brand);
    bar.appendChild(button);
    nav.appendChild(bar);
    nav.appendChild(panel);
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('sgc-home-mobile-dropdown-nav-active');
  }

  function syncMenu() {
    if (isHomePath() && isMobileWidth()) createMenu();
    else removeMenu();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncMenu);
  else syncMenu();

  window.addEventListener('load', syncMenu);
  window.addEventListener('resize', syncMenu);
  window.addEventListener('orientationchange', () => window.setTimeout(syncMenu, 120));
})();
