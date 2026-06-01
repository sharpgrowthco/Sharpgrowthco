(() => {
  const routeIsServices = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/services' || window.location.hash.includes('/services');
  };

  const websiteBannerImage = '/assets/banner-website-laptop.png';

  const webCards = [
    {
      title: 'Custom Website Design',
      description: 'Fully bespoke designs built around your brand — no templates, no shortcuts.',
      image: '/assets/images/alberta-web-design-custom-website-design-service-card.webp',
      alt: 'Custom website design service card for Alberta web design and local business growth.'
    },
    {
      title: 'Mobile-First Builds',
      description: 'Every site is designed for mobile first, then scaled beautifully to desktop.',
      image: '/assets/images/calgary-website-design-mobile-first-responsive-build-service-card.webp',
      alt: 'Mobile-first responsive website design service card for Calgary and Alberta local businesses.'
    },
    {
      title: 'Fast & Conversion-Focused',
      description: 'Speed-optimized builds with clear calls-to-action that turn visitors into leads.',
      image: '/assets/images/okotoks-web-design-fast-conversion-focused-website-service-card.webp',
      alt: 'Fast conversion-focused Okotoks web design service card with growth and performance visuals.'
    },
    {
      title: 'SEO-Ready Structure',
      description: 'Clean headings, metadata, and site architecture that search engines love.',
      image: '/assets/images/alberta-web-design-seo-ready-website-structure-service-card.webp',
      alt: 'SEO-ready Alberta web design service card showing search performance analytics and ranking structure.'
    },
    {
      title: 'Landing Pages & Funnels',
      description: 'Targeted pages for campaigns, launches, and service-specific promotions.',
      image: '/assets/images/calgary-marketing-consultant-landing-page-funnel-service-card.webp',
      alt: 'Calgary marketing consultant landing page and funnel service card for lead generation strategy.'
    },
    {
      title: 'Refreshes & Redesigns',
      description: "Already have a site? I'll modernize it to match your brand and goals.",
      image: '/assets/images/okotoks-web-design-website-refresh-redesign-service-card.webp',
      alt: 'Okotoks web design website refresh and redesign service card showing a premium before and after redesign.'
    }
  ];

  const mainServiceCards = [
    {
      title: 'Social Media Management',
      image: '/assets/images/social-media-management-alberta-content-strategy-phone.webp',
      alt: 'Social media management content strategy for local Alberta businesses.'
    },
    {
      title: 'Content Creation',
      image: '/assets/images/content-creation-alberta-social-media-photo-video-planning.webp',
      alt: 'Content creation planning with professional photo and video direction for Alberta businesses.'
    },
    {
      title: 'Marketing Strategy',
      image: '/assets/images/calgary-marketing-consultant-boardroom-strategy-meeting.webp',
      alt: 'Marketing strategy and boardroom planning session for Alberta entrepreneurs and local business growth.'
    },
    {
      title: 'Events & Promotions',
      image: '/assets/images/local-business-marketing-alberta-event-promotion-content.webp',
      alt: 'Event promotion and local business marketing content for Alberta communities.'
    },
    {
      title: 'Branding & Creative Direction',
      image: '/assets/images/branding-agency-alberta-creative-visual-identity-design.webp',
      alt: 'Branding and creative direction visual identity design for Alberta businesses.'
    }
  ];

  const mainServiceTitles = mainServiceCards.map((card) => card.title);

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

  function applyCardCopy(card, config) {
    const heading = card.querySelector('h3');
    if (heading) heading.textContent = config.title;

    const paragraphs = Array.from(card.querySelectorAll('p'));
    const description = paragraphs.find((p) => normalize(p.textContent).length > 0) || paragraphs[0];
    if (description) description.textContent = config.description;
  }

  function findWebsiteSection() {
    const heading = findHeading('Website Design & Development', 'h2');
    if (!heading) return null;

    let node = heading;
    let best = null;
    while (node && node.parentElement && node !== document.body) {
      const text = normalize(node.textContent);
      const hasCards = webCards.every((config) => text.includes(config.title));
      const hasCta = text.includes('GET A WEBSITE QUOTE') || text.includes('Get a Website Quote');
      if (hasCards && hasCta) best = node;
      node = node.parentElement;
    }

    return best || heading.closest('section') || heading.parentElement;
  }

  function ensureWebsiteBannerLayers(section) {
    if (!section) return;
    section.classList.add('sgc-website-design-hero');
    section.dataset.sgcHeroBannerImage = websiteBannerImage;
    section.style.setProperty('--sgc-website-hero-image', `url("${websiteBannerImage}")`);

    const layerNames = [
      'sgc-website-hero-image-layer',
      'sgc-website-hero-gradient-layer',
      'sgc-website-hero-shimmer-layer',
      'sgc-website-hero-streak-layer'
    ];

    layerNames.forEach((className) => {
      if (section.querySelector(`:scope > .${className}`)) return;
      const layer = document.createElement('span');
      layer.className = className;
      layer.setAttribute('aria-hidden', 'true');
      section.prepend(layer);
    });
  }

  function enhanceWebsiteHeroBanner() {
    ensureWebsiteBannerLayers(findWebsiteSection());
  }

  function enhanceWebsiteCards() {
    webCards.forEach((config) => {
      const heading = findHeading(config.title, 'h3');
      if (!heading) return;
      const card = findWebsiteCard(heading);
      if (!card) return;
      applyCardCopy(card, config);
      card.classList.add('sgc-web-feature-card');
      card.setAttribute('aria-label', `${config.title}: ${config.alt}`);
      card.dataset.sgcSeoImage = config.image;
      card.dataset.sgcSeoAlt = config.alt;
      card.style.setProperty('--sgc-card-bg', `url("${config.image}")`);
      card.style.backgroundImage = 'none';
      card.style.borderRadius = '16px';
      ensureBackgroundLayers(card, config.image);
      setupActiveToggle(card);
    });
  }

  function ensureMainServiceImagePanel(card, config) {
    card.querySelectorAll(':scope > .sgc-main-service-image-panel').forEach((el) => el.remove());

    const panel = document.createElement('div');
    panel.className = 'sgc-main-service-image-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.style.setProperty('--sgc-main-service-image', `url("${config.image}")`);

    const image = document.createElement('img');
    image.src = config.image;
    image.alt = config.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.className = 'sgc-main-service-card-image';

    panel.appendChild(image);
    card.prepend(panel);
    card.dataset.sgcSeoImage = config.image;
    card.dataset.sgcSeoAlt = config.alt;
    card.setAttribute('aria-label', `${config.title}: ${config.alt}`);
  }

  function enhanceMainServiceBoxes() {
    mainServiceCards.forEach((config) => {
      const heading = findHeading(config.title, 'h2');
      if (!heading) return;
      let card = heading;
      while (card && card.parentElement && !card.className.toString().includes('grid-cols-1 lg:grid-cols-12')) {
        card = card.parentElement;
      }
      if (!card || card === document.body) return;
      card.classList.add('sgc-main-service-box', 'sgc-main-service-image-card');
      card.style.setProperty('--sgc-main-service-image', `url("${config.image}")`);
      ensureMainServiceImagePanel(card, config);
      setupActiveToggle(card);
    });
  }

  const homeServiceTitles = [
    'Website Design & Development',
    'Social Media Management',
    'Content Creation',
    'Marketing Strategy',
    'Events & Promotions',
    'Branding & Creative Direction'
  ];

  function findHomeServicesSection() {
    const heading = findHeading('Everything your brand needs to grow', 'h2');
    return heading ? heading.closest('section') || heading.parentElement : null;
  }

  function enhanceHomeBusinessTags() {
    const heading = findHeading('Built for ambitious Alberta businesses', 'h2');
    const section = heading ? heading.closest('section') || heading.parentElement : null;
    if (!section) return;

    const businessLabels = [
      'Local Restaurants & Cafés',
      'Boutique Retail Shops',
      'Wellness & Beauty Studios',
      'Real Estate Professionals',
      'Service Providers',
      'Lifestyle Brands',
      'Entrepreneurs & Coaches',
      'Schools',
      'Health & Fitness Businesses'
    ];

    section.classList.add('sgc-business-tags-section');
    businessLabels.forEach((label) => {
      Array.from(section.querySelectorAll('a, button, span, div, li')).forEach((el) => {
        if (normalize(el.textContent) !== normalize(label)) return;
        if (el.children.length > 0) return;
        el.classList.add('sgc-business-gold-tag');
        el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');
      });
    });
  }

  function enhanceHomeServiceCards() {
    const section = findHomeServicesSection();
    if (!section) return;
    section.classList.add('sgc-home-services-section');

    homeServiceTitles.forEach((title) => {
      const heading = Array.from(section.querySelectorAll('h3')).find((el) => normalize(el.textContent) === title);
      if (!heading) return;

      let card = heading.parentElement;
      while (card && card !== section && !card.querySelector('img')) {
        card = card.parentElement;
      }
      while (card && card.parentElement && card.parentElement !== section && card.querySelectorAll('h3').length !== 1) {
        card = card.parentElement;
      }
      if (!card || card === section) return;

      const image = card.querySelector('img');
      if (!image) return;

      card.classList.add('sgc-home-service-card');
      image.classList.add('sgc-home-service-card-image');
      image.removeAttribute('width');
      image.removeAttribute('height');
      image.style.position = 'absolute';
      image.style.inset = '0';
      image.style.width = '100%';
      image.style.height = '100%';
      image.style.maxWidth = 'none';
      image.style.objectFit = 'cover';
      image.style.objectPosition = 'center center';
    });
  }

  function keepPreferredReadyToBeginSection() {
    if (!routeIsServices()) return;

    const readySections = Array.from(document.querySelectorAll('section'))
      .filter((section) => {
        const text = normalize(section.textContent);
        const headings = Array.from(section.querySelectorAll('h1,h2,h3')).map((heading) => normalize(heading.textContent)).join(' ');
        return text.includes('Ready to Begin') || headings.includes('Ready to grow with intention?');
      });

    if (readySections.length < 2) return;

    readySections.forEach((section, index) => {
      if (index === 0) {
        section.classList.add('sgc-ready-to-begin-preferred');
        section.classList.remove('sgc-ready-to-begin-duplicate-hidden');
        section.hidden = false;
        section.style.removeProperty('display');
        section.removeAttribute('aria-hidden');
        return;
      }

      section.classList.add('sgc-ready-to-begin-duplicate-hidden');
      section.hidden = true;
      section.style.setProperty('display', 'none', 'important');
      section.setAttribute('aria-hidden', 'true');
      section.dataset.readyToBeginDuplicateRemoved = 'true';
    });
  }

  function enhanceServicesPage() {
    if (!routeIsServices()) return;
    enhanceMainServiceBoxes();
    enhanceWebsiteCards();
    enhanceWebsiteHeroBanner();
    keepPreferredReadyToBeginSection();
  }

  function routeIsAbout() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/about' || window.location.hash.includes('/about');
  }

  function routeIsContact() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/contact' || window.location.hash.includes('/contact');
  }

  const aboutImageRestorations = [
    {
      key: 'headshot',
      src: '/assets/images/alberta-marketing-strategist-jenna-founder-headshot.webp',
      alt: 'Jenna, Alberta marketing strategist and founder of Sharp Growth Co., in a professional blazer portrait.',
      width: 1080,
      height: 1456,
      matchAlt: /jenna|founder|headshot|portrait|strategist/i
    },
    {
      key: 'values',
      src: '/assets/images/branding-agency-alberta-values-results-creative-partnership.webp',
      alt: 'Branding agency Alberta values graphic highlighting results, creative excellence, partnership, and community focus.',
      width: 1536,
      height: 1024,
      matchAlt: /values|results|creative|partnership|community/i
    }
  ];

  function repairAboutImages() {
    if (!routeIsAbout()) return;

    document.querySelectorAll('img').forEach((img) => {
      const raw = [img.getAttribute('src'), img.currentSrc, img.src, img.getAttribute('alt')].filter(Boolean).join(' ');
      const config = aboutImageRestorations.find((item) => item.matchAlt.test(raw));
      if (!config) return;

      img.src = config.src;
      img.alt = config.alt;
      img.width = config.width;
      img.height = config.height;
      img.loading = 'eager';
      img.decoding = 'async';
      img.style.maxWidth = img.style.maxWidth || '100%';
      if (!img.closest('[style*="height"]')) img.style.height = img.style.height || 'auto';
      img.dataset.sgcAboutImageRestored = config.key;
    });
  }

  const contactServiceLabels = [
    'Website Design & Development',
    'Social Media Management',
    'Content Creation',
    'Marketing Strategy',
    'Events & Promotions',
    'Branding & Creative Direction',
    'Custom Growth Plan'
  ];

  function findContactForm() {
    return Array.from(document.querySelectorAll('form')).find((form) => {
      const text = normalize(form.textContent);
      return text.includes('Services Interested In') && text.includes('Apply to Work Together');
    }) || null;
  }

  function getContactServiceButtons(form) {
    if (!form) return [];
    return Array.from(form.querySelectorAll('button[type="button"]')).filter((button) => contactServiceLabels.includes(normalize(button.textContent)));
  }

  function ensureContactHiddenInput(form) {
    let input = form.querySelector('input[type="hidden"][name="services_interested_in"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'services_interested_in';
      form.prepend(input);
    }
    return input;
  }

  function ensureServiceFeedback(form, buttons) {
    let feedback = form.querySelector('.sgc-contact-service-feedback');
    if (feedback) return feedback;
    feedback = document.createElement('p');
    feedback.className = 'sgc-contact-service-feedback';
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = 'Select one or more services so I can tailor your next-step recommendation.';
    const buttonWrap = buttons[0]?.parentElement;
    if (buttonWrap && buttonWrap.parentElement) buttonWrap.insertAdjacentElement('afterend', feedback);
    return feedback;
  }

  function updateContactServiceState(form) {
    const buttons = getContactServiceButtons(form);
    if (!buttons.length) return;
    const selected = buttons.filter((button) => button.classList.contains('sgc-contact-service-selected') || button.classList.contains('selected') || button.getAttribute('aria-pressed') === 'true');
    const labels = selected.map((button) => normalize(button.textContent));
    ensureContactHiddenInput(form).value = labels.join(', ');
    const feedback = ensureServiceFeedback(form, buttons);
    if (feedback) {
      feedback.textContent = labels.length
        ? `Selected: ${labels.join(', ')}.`
        : 'Select one or more services so I can tailor your next-step recommendation.';
    }
  }

  function setContactButtonSelected(button, selected) {
    button.classList.toggle('sgc-contact-service-selected', selected);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  }

  function enhanceContactServiceButtons() {
    if (!routeIsContact()) return;
    const form = findContactForm();
    const buttons = getContactServiceButtons(form);
    if (!form || !buttons.length) return;

    form.classList.add('sgc-contact-form-restored');
    buttons.forEach((button) => {
      button.classList.add('sgc-contact-service-option');
      if (!button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', 'false');
      if (button.dataset.sgcContactServiceReady === 'true') return;
      button.dataset.sgcContactServiceReady = 'true';
      button.addEventListener('click', () => {
        const shouldSelect = !button.classList.contains('sgc-contact-service-selected');
        window.requestAnimationFrame(() => {
          setContactButtonSelected(button, shouldSelect);
          updateContactServiceState(form);
        });
      });
    });
    updateContactServiceState(form);
  }

  function enhanceAllPages() {
    repairAboutImages();
    enhanceHomeBusinessTags();
    enhanceHomeServiceCards();
    enhanceServicesPage();
    enhanceContactServiceButtons();
  }

  let queued = false;
  function scheduleEnhance() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      enhanceAllPages();
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
