(() => {
  const routeIsServices = () => window.location.pathname === '/services' || window.location.hash.includes('/services');

  const webCardBackgrounds = {
    'Custom Website Design': '/assets/images/alberta-web-design-custom-website-service.webp',
    'Mobile-First Builds': '/assets/images/alberta-web-design-mobile-first-business-website.webp',
    'Fast & Conversion-Focused': '/assets/images/website-design-calgary-conversion-focused-landing-page.webp',
    'SEO-Ready Structure': '/assets/images/marketing-strategist-alberta-seo-ready-website-structure.webp',
    'Landing Pages & Funnels': '/assets/images/local-business-marketing-alberta-landing-page-funnel.webp',
    'Refreshes & Redesigns': '/assets/images/okotoks-marketing-agency-website-refresh-redesign.webp'
  };

  const webCardAltText = {
    'Custom Website Design': 'Alberta web design custom website service background for local business growth.',
    'Mobile-First Builds': 'Alberta web design mobile-first business website background for responsive customer experiences.',
    'Fast & Conversion-Focused': 'Website design Calgary conversion-focused landing page background for premium service inquiries.',
    'SEO-Ready Structure': 'Marketing strategist Alberta SEO-ready website structure background for search visibility.',
    'Landing Pages & Funnels': 'Local business marketing Alberta landing page funnel background for campaign conversions.',
    'Refreshes & Redesigns': 'Okotoks marketing agency website refresh and redesign background for established local businesses.'
  };

  const mainServiceTitles = [
    'Social Media Management',
    'Content Creation',
    'Marketing Strategy',
    'Events & Promotions',
    'Branding & Creative Direction'
  ];

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function findHeading(title, tags = 'h2,h3') {
    return Array.from(document.querySelectorAll(tags)).find((el) => normalize(el.textContent) === title);
  }

  function setupActiveToggle(card) {
    if (!card || card.dataset.sgcInteractiveReady === 'true') return;
    card.dataset.sgcInteractiveReady = 'true';
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      const alreadyActive = card.classList.contains('sgc-service-is-active');
      document.querySelectorAll('.sgc-service-is-active').forEach((el) => el.classList.remove('sgc-service-is-active'));
      if (!alreadyActive) card.classList.add('sgc-service-is-active');
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  }

  function findWebsiteCard(heading) {
    let card = heading;
    while (card && card.parentElement && card.parentElement !== document.body) {
      const className = card.className ? card.className.toString() : '';
      const hasCardShape = className.includes('p-6') || className.includes('rounded') || className.includes('border');
      const containsOnlyThisFeature = card.querySelector('h3') === heading;
      if (hasCardShape && containsOnlyThisFeature) return card;
      card = card.parentElement;
    }
    return heading.parentElement;
  }

  function ensureBackgroundLayers(card, image) {
    card.querySelectorAll(':scope > .sgc-web-card-bg, :scope > .sgc-web-card-overlay').forEach((el) => el.remove());

    const bg = document.createElement('span');
    bg.className = 'sgc-web-card-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.style.backgroundImage = `url("${image}")`;

    const overlay = document.createElement('span');
    overlay.className = 'sgc-web-card-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    card.prepend(overlay);
    card.prepend(bg);
  }

  function enhanceWebsiteCards() {
    Object.entries(webCardBackgrounds).forEach(([title, image]) => {
      const heading = findHeading(title, 'h3');
      if (!heading) return;
      const card = findWebsiteCard(heading);
      if (!card) return;
      card.classList.add('sgc-web-feature-card');
      card.setAttribute('aria-label', webCardAltText[title] || `${title} website design service background image`);
      card.style.setProperty('--sgc-card-bg', `url("${image}")`);
      card.style.backgroundImage = `url("${image}")`;
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center center';
      card.style.backgroundRepeat = 'no-repeat';
      card.style.borderRadius = '16px';
      ensureBackgroundLayers(card, image);
      setupActiveToggle(card);
    });
  }

  function enhanceMainServiceBoxes() {
    mainServiceTitles.forEach((title) => {
      const heading = findHeading(title, 'h2');
      if (!heading) return;
      let card = heading;
      while (card && card.parentElement && !card.className.toString().includes('grid-cols-1 lg:grid-cols-12')) {
        card = card.parentElement;
      }
      if (!card || card === document.body) return;
      card.classList.add('sgc-main-service-box');
      setupActiveToggle(card);
    });
  }

  function enhanceServicesPage() {
    if (!routeIsServices()) return;
    enhanceMainServiceBoxes();
    enhanceWebsiteCards();
  }

  let queued = false;
  function scheduleEnhance() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      enhanceServicesPage();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEnhance);
  } else {
    scheduleEnhance();
  }

  window.addEventListener('popstate', scheduleEnhance);
  window.addEventListener('hashchange', scheduleEnhance);
  document.addEventListener('click', () => setTimeout(scheduleEnhance, 80), true);

  const observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
