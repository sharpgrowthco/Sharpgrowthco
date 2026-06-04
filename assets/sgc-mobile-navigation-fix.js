(() => {
  const MOBILE_QUERY = '(max-width: 767px)';
  const MENU_ID = 'sgc-mobile-menu-panel';
  const navItems = [
    ['Home', '/'],
    ['Services', '/services/'],
    ['My Work', '/work/'],
    ['About', '/about/'],
    ['Packages', '/packages/'],
    ['Contact', '/contact/']
  ];
  const bookingUrl = 'https://calendly.com/sharpgrowthco';

  const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
  const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

  const normalizePath = (path) => {
    if (!path) return '/';
    try {
      path = new URL(path, window.location.origin).pathname;
    } catch (_) {}
    return path.length > 1 ? path.replace(/\/+$/, '/') : '/';
  };

  const closeMenu = (button, panel) => {
    panel?.classList.remove('is-open');
    button?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sgc-mobile-menu-open');
  };

  const openMenu = (button, panel) => {
    panel?.classList.add('is-open');
    button?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sgc-mobile-menu-open');
  };

  const resetFallbackBrand = (brand) => {
    if (!brand) return;
    brand.href = '/';
    brand.className = 'sgc-mobile-fallback-brand';
    brand.setAttribute('aria-label', 'Sharp Growth Co. home');
    brand.removeAttribute('data-sgc-header-logo');
    brand.innerHTML = '<span>Sharp Growth Co.</span><small>Local Alberta Marketing</small>';
    setImportant(brand, 'display', 'flex');
    setImportant(brand, 'flex-direction', 'column');
    setImportant(brand, 'justify-content', 'center');
    setImportant(brand, 'flex', '1 1 auto');
    setImportant(brand, 'width', 'auto');
    setImportant(brand, 'min-width', '0');
    setImportant(brand, 'max-width', 'calc(100vw - 6rem)');
    setImportant(brand, 'height', 'auto');
    setImportant(brand, 'min-height', '0');
    setImportant(brand, 'padding', '0');
    setImportant(brand, 'margin', '0');
    setImportant(brand, 'overflow', 'hidden');
    setImportant(brand, 'background', 'transparent');
    setImportant(brand, 'box-shadow', 'none');
  };

  const resetFallbackButton = (button) => {
    if (!button) return;
    button.type = 'button';
    button.className = 'sgc-mobile-fallback-toggle';
    button.setAttribute('aria-label', 'Toggle menu');
    button.innerHTML = '<span class="sgc-mobile-toggle-line"></span><span class="sgc-mobile-toggle-line"></span><span class="sgc-mobile-toggle-line"></span>';
    setImportant(button, 'display', 'inline-flex');
    setImportant(button, 'flex-direction', 'column');
    setImportant(button, 'align-items', 'center');
    setImportant(button, 'justify-content', 'center');
    setImportant(button, 'flex', '0 0 2.75rem');
    setImportant(button, 'width', '2.75rem');
    setImportant(button, 'height', '2.75rem');
    setImportant(button, 'min-width', '2.75rem');
    setImportant(button, 'min-height', '2.75rem');
    setImportant(button, 'padding', '0');
    setImportant(button, 'margin-left', 'auto');
    setImportant(button, 'border', '1px solid rgba(65, 43, 28, 0.16)');
    setImportant(button, 'border-radius', '999px');
    setImportant(button, 'background', 'rgba(255, 250, 242, 0.78)');
    setImportant(button, 'color', 'rgb(45, 33, 24)');
    setImportant(button, 'box-shadow', '0 10px 24px rgba(64, 42, 26, 0.10)');
    button.querySelectorAll('.sgc-mobile-toggle-line').forEach((line) => {
      setImportant(line, 'display', 'block');
      setImportant(line, 'width', '1.15rem');
      setImportant(line, 'height', '1.5px');
      setImportant(line, 'margin', '0.16rem 0');
      setImportant(line, 'border-radius', '999px');
      setImportant(line, 'background', 'currentColor');
    });
  };

  const sanitizeFallbackHeader = (header) => {
    if (!header?.classList?.contains('sgc-mobile-fallback-header')) return;
    const inner = header.querySelector('.sgc-mobile-fallback-inner') || header.firstElementChild;
    if (!inner) return;

    const firstBrand = inner.querySelector('a.sgc-mobile-fallback-brand, a[href="/"]') || document.createElement('a');
    const firstButton = inner.querySelector('button[aria-label="Toggle menu"], .sgc-mobile-fallback-toggle') || document.createElement('button');

    inner.replaceChildren(firstBrand, firstButton);
    resetFallbackBrand(firstBrand);
    resetFallbackButton(firstButton);
  };

  const createFallbackHeader = () => {
    if (!isMobile()) return null;
    const existingFallback = document.querySelector('header.sgc-mobile-fallback-header');
    if (existingFallback) return existingFallback;
    const existingHeader = document.querySelector('header');
    if (existingHeader) return existingHeader;

    const header = document.createElement('header');
    header.className = 'sgc-mobile-fallback-header';
    header.setAttribute('data-sgc-mobile-fallback', 'true');

    const inner = document.createElement('div');
    inner.className = 'sgc-mobile-fallback-inner';

    const brand = document.createElement('a');
    const button = document.createElement('button');

    inner.appendChild(brand);
    inner.appendChild(button);
    header.appendChild(inner);
    document.body.insertBefore(header, document.body.firstChild);
    sanitizeFallbackHeader(header);
    return header;
  };

  const buildPanel = (header, button) => {
    let panel = document.getElementById(MENU_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = MENU_ID;
    panel.className = 'sgc-mobile-menu-panel';
    panel.setAttribute('role', 'navigation');
    panel.setAttribute('aria-label', 'Mobile navigation');

    const current = normalizePath(window.location.pathname);
    navItems.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if (normalizePath(href) === current) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', () => closeMenu(button, panel));
      panel.appendChild(link);
    });

    const booking = document.createElement('a');
    booking.href = bookingUrl;
    booking.textContent = 'Book a Consultation';
    booking.className = 'sgc-mobile-booking-link';
    booking.setAttribute('aria-label', 'Book a consultation with Sharp Growth Co.');
    booking.addEventListener('click', () => closeMenu(button, panel));
    panel.appendChild(booking);

    header.insertAdjacentElement('afterend', panel);
    return panel;
  };

  const init = () => {
    const header = document.querySelector('header') || createFallbackHeader();
    sanitizeFallbackHeader(header);
    const button = header?.querySelector('button[aria-label="Toggle menu"]');
    if (!header || !button) return;

    const panel = buildPanel(header, button);
    button.dataset.sgcMobileNavFixed = 'true';
    button.setAttribute('aria-controls', MENU_ID);
    button.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
    button.setAttribute('type', 'button');

    if (button.dataset.sgcMobileNavListener !== 'true') {
      button.dataset.sgcMobileNavListener = 'true';
      button.addEventListener('click', (event) => {
        if (!isMobile()) return;
        event.preventDefault();
        event.stopPropagation();
        if (panel.classList.contains('is-open')) closeMenu(button, panel);
        else openMenu(button, panel);
      }, true);
    }

    if (document.documentElement.dataset.sgcMobileNavDocumentListeners !== 'true') {
      document.documentElement.dataset.sgcMobileNavDocumentListeners = 'true';
      document.addEventListener('click', (event) => {
        const activePanel = document.getElementById(MENU_ID);
        const activeButton = document.querySelector('button[aria-label="Toggle menu"]');
        if (!activePanel?.classList.contains('is-open')) return;
        if (activePanel.contains(event.target) || activeButton?.contains(event.target)) return;
        closeMenu(activeButton, activePanel);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        closeMenu(document.querySelector('button[aria-label="Toggle menu"]'), document.getElementById(MENU_ID));
      });

      window.addEventListener('resize', () => {
        if (!isMobile()) closeMenu(document.querySelector('button[aria-label="Toggle menu"]'), document.getElementById(MENU_ID));
      });
    }
  };

  const boot = () => {
    init();
    let attempts = 0;
    const interval = window.setInterval(() => {
      init();
      attempts += 1;
      if (attempts >= 40) window.clearInterval(interval);
    }, 250);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
