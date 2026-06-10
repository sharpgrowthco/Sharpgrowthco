(() => {
  const MOBILE_MAX_WIDTH = 768;
  const MENU_ID = 'sgc-mobile-header-menu';
  const TOGGLE_ID = 'sgc-mobile-header-toggle';
  const BACKDROP_CLASS = 'sgc-mobile-menu-backdrop';
  const EXPECTED_LINKS = [
    { label: 'Home', fallbackHref: '/' },
    { label: 'Services', fallbackHref: '/services/' },
    { label: 'My Work', fallbackHref: '/work/' },
    { label: 'About', fallbackHref: '/about/' },
    { label: 'Packages', fallbackHref: '/packages/' },
    { label: 'Contact', fallbackHref: '/contact/' },
  ];

  const normalizeText = (value) => (value || '').replace(/\s+/g, ' ').trim();

  const isMobile = () => window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

  const findHeader = () => document.querySelector('#root header') || document.querySelector('header');

  const findExistingNavHref = (header, label) => {
    const wanted = label.toLowerCase();
    const links = Array.from(header.querySelectorAll('nav a[href], [role="navigation"] a[href]'));
    const exact = links.find((link) => normalizeText(link.textContent).toLowerCase() === wanted);
    if (exact) return exact.getAttribute('href') || exact.href;

    if (label === 'My Work') {
      const ariaMatch = links.find((link) => /my work|view my work|work/i.test(`${link.getAttribute('aria-label') || ''} ${normalizeText(link.textContent)}`));
      if (ariaMatch) return ariaMatch.getAttribute('href') || ariaMatch.href;
    }

    const contains = links.find((link) => normalizeText(link.textContent).toLowerCase().includes(wanted));
    return contains ? (contains.getAttribute('href') || contains.href) : '';
  };

  const findBookSource = (header) => {
    return Array.from(header.querySelectorAll('a, button')).find((element) => /book\s+a\s+consultation/i.test(normalizeText(element.textContent)));
  };

  const closeMenu = (header) => {
    if (!header) return;
    const toggle = header.querySelector(`#${TOGGLE_ID}`);
    header.classList.remove('sgc-mobile-menu-open');
    document.body.classList.remove('sgc-mobile-menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  const openMenu = (header) => {
    if (!header || !isMobile()) return;
    const toggle = header.querySelector(`#${TOGGLE_ID}`);
    header.classList.add('sgc-mobile-menu-open');
    document.body.classList.add('sgc-mobile-menu-open');
    toggle?.setAttribute('aria-expanded', 'true');
  };

  const toggleMenu = (header) => {
    if (header.classList.contains('sgc-mobile-menu-open')) {
      closeMenu(header);
    } else {
      openMenu(header);
    }
  };

  const buildLink = ({ label, href }, header) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.addEventListener('click', () => closeMenu(header));
    return link;
  };

  const buildBookControl = (bookSource, header) => {
    if (bookSource?.tagName === 'A' && bookSource.getAttribute('href')) {
      const bookLink = document.createElement('a');
      bookLink.href = bookSource.getAttribute('href') || bookSource.href;
      bookLink.textContent = normalizeText(bookSource.textContent) || 'Book a Consultation';
      bookLink.className = 'sgc-mobile-book-cta';
      const target = bookSource.getAttribute('target');
      const rel = bookSource.getAttribute('rel');
      if (target) bookLink.setAttribute('target', target);
      if (rel) bookLink.setAttribute('rel', rel);
      bookLink.addEventListener('click', () => closeMenu(header));
      return bookLink;
    }

    const bookButton = document.createElement('button');
    bookButton.type = 'button';
    bookButton.className = 'sgc-mobile-book-cta';
    bookButton.textContent = normalizeText(bookSource?.textContent) || 'Book a Consultation';
    bookButton.addEventListener('click', () => {
      closeMenu(header);
      if (bookSource instanceof HTMLElement) {
        requestAnimationFrame(() => bookSource.click());
      }
    });
    return bookButton;
  };

  const ensureBackdrop = (header) => {
    let backdrop = document.querySelector(`.${BACKDROP_CLASS}`);
    if (!backdrop) {
      backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = BACKDROP_CLASS;
      backdrop.setAttribute('aria-label', 'Close mobile navigation menu');
      document.body.appendChild(backdrop);
    }
    backdrop.onclick = () => closeMenu(header);
  };

  const setupMobileMenu = () => {
    const header = findHeader();
    if (!header || header.dataset.sgcMobileMenuReady === 'true') return;

    const navLinks = EXPECTED_LINKS.map((item) => ({
      label: item.label,
      href: findExistingNavHref(header, item.label) || item.fallbackHref,
    }));

    const bookSource = findBookSource(header);
    if (bookSource) {
      bookSource.setAttribute('data-sgc-header-book-cta', 'true');
    }

    const toggle = document.createElement('button');
    toggle.id = TOGGLE_ID;
    toggle.type = 'button';
    toggle.className = 'sgc-mobile-menu-toggle';
    toggle.setAttribute('aria-label', 'Open mobile navigation menu');
    toggle.setAttribute('aria-controls', MENU_ID);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    toggle.addEventListener('click', () => toggleMenu(header));

    const panel = document.createElement('div');
    panel.id = MENU_ID;
    panel.className = 'sgc-mobile-menu-panel';
    panel.setAttribute('aria-label', 'Mobile navigation menu');

    navLinks.forEach((link) => panel.appendChild(buildLink(link, header)));
    panel.appendChild(buildBookControl(bookSource, header));

    header.appendChild(toggle);
    header.appendChild(panel);
    header.classList.add('sgc-mobile-menu-ready');
    header.dataset.sgcMobileMenuReady = 'true';
    ensureBackdrop(header);
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu(findHeader());
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) closeMenu(findHeader());
  });

  const scheduleSetup = () => requestAnimationFrame(setupMobileMenu);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSetup, { once: true });
  } else {
    scheduleSetup();
  }

  new MutationObserver(scheduleSetup).observe(document.documentElement, { childList: true, subtree: true });
})();
