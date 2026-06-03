(() => {
  const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/';

  const routeIsHome = () => currentPath() === '/';

  const routeIsServices = () => {
    const path = currentPath();
    return path === '/services' || window.location.hash.includes('/services');
  };

  const websiteBannerImage = '/assets/images/alberta-web-design-website-laptop-showcase.webp';

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
      image: '/assets/images/branding-creative-direction-brand-board-visual-identity.webp',
      alt: 'Branding and creative direction brand board visual identity for Alberta businesses.'
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
    if (!section.id) section.id = serviceAnchorsByTitle['Website Design & Development'];
    section.setAttribute('data-sgc-service-anchor', serviceAnchorsByTitle['Website Design & Development']);
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
    image.title = config.alt;
    image.setAttribute('aria-label', config.alt);
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
    mainServiceCards.forEach((config, index) => {
      const heading = findHeading(config.title, 'h2');
      if (!heading) return;
      let card = heading;
      while (card && card.parentElement && !card.className.toString().includes('grid-cols-1 lg:grid-cols-12')) {
        card = card.parentElement;
      }
      if (!card || card === document.body) return;
      card.classList.add('sgc-main-service-box', 'sgc-main-service-image-card');
      const anchorId = serviceAnchorsByTitle[config.title];
      if (anchorId && !card.id) card.id = anchorId;
      if (anchorId) card.setAttribute('data-sgc-service-anchor', anchorId);
      card.classList.remove('sgc-service-tone-cream', 'sgc-service-tone-sand');
      card.classList.add(index % 2 === 0 ? 'sgc-service-tone-cream' : 'sgc-service-tone-sand');
      card.style.setProperty('--sgc-main-service-image', `url("${config.image}")`);
      ensureMainServiceImagePanel(card, config);
      setupActiveToggle(card);
    });
  }

  const serviceAnchorsByTitle = {
    'Website Design & Development': 'website-design',
    'Social Media Management': 'social-media-management',
    'Content Creation': 'content-creation',
    'Marketing Strategy': 'marketing-strategy',
    'Events & Promotions': 'events-promotions',
    'Branding & Creative Direction': 'branding-creative-direction'
  };

  const homeServiceCards = [
    {
      title: 'Website Design & Development',
      sourceTitle: 'Website Design & Development',
      description: 'Modern websites built to convert and grow with you.',
      href: '/services/#website-design'
    },
    {
      title: 'Social Media & Content Creation',
      sourceTitle: 'Social Media Management',
      description: 'Strategy, reels, posting, and community growth — done for you.',
      href: '/services/#social-media-management'
    },
    {
      title: 'Marketing Strategy',
      sourceTitle: 'Marketing Strategy',
      description: 'Clear positioning, campaign plans, and local growth direction.',
      href: '/services/#marketing-strategy'
    },
    {
      title: 'Branding & Creative Direction',
      sourceTitle: 'Branding & Creative Direction',
      description: 'Visual direction, brand voice, and templates that stay consistent.',
      href: '/services/#branding-creative-direction'
    }
  ];

  const homeServiceTitles = Object.keys(serviceAnchorsByTitle);

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
      'Wellness & Beauty Studios',
      'Real Estate Professionals',
      'Boutique Retail Shops',
      'Service Providers'
    ];
    const previousLabels = [
      ...businessLabels,
      'Lifestyle Brands',
      'Entrepreneurs & Coaches',
      'Schools',
      'Health & Fitness Businesses'
    ];

    section.classList.add('sgc-business-tags-section');
    section.querySelectorAll('.sgc-business-tags-row, .sgc-business-tags-followup').forEach((el) => el.remove());

    const oldTagEls = Array.from(section.querySelectorAll('a, button, span, div, li'))
      .filter((el) => previousLabels.some((label) => normalize(el.textContent) === normalize(label)) && el.children.length === 0);

    let oldTagContainer = null;
    if (oldTagEls.length > 0) {
      oldTagContainer = oldTagEls[0].parentElement;
      while (oldTagContainer && oldTagContainer !== section && oldTagContainer.contains(heading)) {
        oldTagContainer = oldTagContainer.parentElement;
      }
      while (oldTagContainer && oldTagContainer !== section && !oldTagEls.every((el) => oldTagContainer.contains(el))) {
        oldTagContainer = oldTagContainer.parentElement;
      }
      if (oldTagContainer && oldTagContainer !== section && !oldTagContainer.contains(heading)) {
        oldTagContainer.remove();
        oldTagContainer = null;
      } else {
        oldTagEls.forEach((el) => {
          const tag = el.closest('a, button, li') || el;
          tag.remove();
        });
      }
    }

    const row = document.createElement('div');
    row.className = 'sgc-business-tags-row';
    businessLabels.forEach((label) => {
      const tag = document.createElement('span');
      tag.className = 'sgc-business-gold-tag';
      tag.setAttribute('tabindex', '0');
      tag.textContent = label;
      row.appendChild(tag);
    });

    const followup = document.createElement('div');
    followup.className = 'sgc-business-tags-followup';
    followup.innerHTML = `
      <p>Don't see your industry? I work with ambitious local businesses of all kinds.</p>
      <a class="sgc-business-contact-button" href="/contact" aria-label="Contact Sharp Growth Co.">Contact Me</a>
    `;

    const insertionTarget = heading;
    if (insertionTarget && insertionTarget.parentElement) {
      insertionTarget.insertAdjacentElement('afterend', row);
      row.insertAdjacentElement('afterend', followup);
    } else {
      section.append(row, followup);
    }
  }

  function findHomeServiceCard(section, title) {
    const existingCard = Array.from(section.querySelectorAll('[data-sgc-source-service-title]'))
      .find((el) => normalize(el.dataset.sgcSourceServiceTitle) === title);
    if (existingCard) return existingCard;

    const heading = Array.from(section.querySelectorAll('h3')).find((el) => normalize(el.textContent) === title);
    if (!heading) return null;

    let card = heading.parentElement;
    while (card && card !== section && !card.querySelector('img')) {
      card = card.parentElement;
    }
    while (card && card.parentElement && card.parentElement !== section && card.querySelectorAll('h3').length !== 1) {
      card = card.parentElement;
    }
    return card && card !== section ? card : null;
  }

  function updateHomeServiceDescription(card, description) {
    const paragraphs = Array.from(card.querySelectorAll('p')).filter((p) => normalize(p.textContent).length > 0);
    const descriptionEl = paragraphs[0];
    if (descriptionEl) {
      descriptionEl.textContent = description;
      descriptionEl.classList.add('sgc-home-service-card-description');
    }
  }

  function ensureHomeServiceLink(card, config) {
    card.querySelectorAll(':scope > .sgc-home-service-card-link').forEach((link) => link.remove());

    const link = document.createElement('a');
    link.className = 'sgc-home-service-card-link';
    link.href = config.href;
    link.setAttribute('aria-label', `View ${config.title} service details`);
    link.innerHTML = '<span class="sgc-sr-only">View service details</span>';
    card.appendChild(link);
  }

  function enhanceHomeServiceCards() {
    const section = findHomeServicesSection();
    if (!section) return;
    section.classList.add('sgc-home-services-section');

    const retainedTitles = new Set(homeServiceCards.map((card) => card.sourceTitle || card.title));
    const retainedCards = [];

    homeServiceTitles.forEach((title) => {
      const card = findHomeServiceCard(section, title);
      if (!card) return;

      if (!retainedTitles.has(title)) {
        card.classList.add('sgc-home-service-card-hidden');
        card.setAttribute('aria-hidden', 'true');
        card.style.setProperty('display', 'none', 'important');
        return;
      }

      const config = homeServiceCards.find((item) => (item.sourceTitle || item.title) === title);
      const image = card.querySelector('img');
      if (!image || !config) return;

      const cardHeading = card.querySelector('h3');
      if (cardHeading) cardHeading.textContent = config.title;

      card.classList.remove('sgc-home-service-card-hidden');
      card.removeAttribute('aria-hidden');
      card.style.removeProperty('display');
      card.classList.add('sgc-home-service-card', 'sgc-home-service-card-clickable');
      card.dataset.sgcSourceServiceTitle = config.sourceTitle || config.title;
      card.setAttribute('data-sgc-service-anchor', config.href.split('#')[1] || '');
      retainedCards.push(card);
      updateHomeServiceDescription(card, config.description);
      ensureHomeServiceLink(card, config);

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

    const grid = retainedCards[0] && retainedCards.every((card) => card.parentElement === retainedCards[0].parentElement)
      ? retainedCards[0].parentElement
      : null;
    if (grid) {
      grid.classList.add('sgc-home-services-grid');
      const orderBySourceTitle = new Map(homeServiceCards.map((card, index) => [card.sourceTitle || card.title, index]));
      retainedCards
        .sort((a, b) => {
          const aOrder = orderBySourceTitle.get(a.dataset.sgcSourceServiceTitle || normalize(a.querySelector('h3')?.textContent)) ?? 99;
          const bOrder = orderBySourceTitle.get(b.dataset.sgcSourceServiceTitle || normalize(b.querySelector('h3')?.textContent)) ?? 99;
          return aOrder - bOrder;
        })
        .forEach((card) => grid.appendChild(card));
    }

    const servicesCtas = Array.from(section.querySelectorAll('a, button')).filter((el) => {
      const text = normalize(el.textContent).toLowerCase();
      return text === 'see all services' || text === 'see my services';
    });
    servicesCtas.forEach((cta) => {
      cta.textContent = 'SEE MY SERVICES';
      if (cta.tagName.toLowerCase() === 'a') cta.setAttribute('href', '/services/');
      cta.classList.add('sgc-home-services-cta');
    });

  }

  function removeMovedHomeSections() {
    if (!routeIsHome()) return;

    ['Proudly Alberta', 'My Process'].forEach((label) => {
      const marker = Array.from(document.querySelectorAll('section p, section h2, section h3, section span, section div'))
        .find((el) => normalize(el.textContent) === label);
      const section = marker ? marker.closest('section') : null;
      if (!section) return;
      section.setAttribute('data-sgc-home-moved-section', label);
      section.remove();
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

    const preferredSection = readySections.find((section) => section.dataset.readyToBeginInjected === 'true') || readySections[readySections.length - 1] || readySections[0];

    readySections.forEach((section) => {
      if (section === preferredSection) {
        section.classList.add('sgc-ready-to-begin-preferred');
        section.classList.remove('sgc-ready-to-begin-duplicate-hidden');
        section.hidden = false;
        section.style.removeProperty('display');
        section.removeAttribute('aria-hidden');
        delete section.dataset.readyToBeginDuplicateRemoved;
        return;
      }

      section.classList.add('sgc-ready-to-begin-duplicate-hidden');
      section.classList.remove('sgc-ready-to-begin-preferred');
      section.hidden = true;
      section.style.setProperty('display', 'none', 'important');
      section.setAttribute('aria-hidden', 'true');
      section.dataset.readyToBeginDuplicateRemoved = 'true';
    });
  }

  function scrollToServiceHash() {
    if (!routeIsServices()) return;
    const anchorId = (window.location.hash || '').replace(/^#/, '');
    if (!anchorId || !Object.values(serviceAnchorsByTitle).includes(anchorId)) return;
    const target = document.getElementById(anchorId) || document.querySelector(`[data-sgc-service-anchor="${anchorId}"]`);
    if (!target || target.dataset.sgcHashScrolled === 'true') return;
    target.dataset.sgcHashScrolled = 'true';
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }

  const orderedServicesFaqs = [
    {
      question: 'What types of businesses do you work with?',
      answer: 'I work with local Alberta businesses that are ready to show up more strategically online, including restaurants, cafés, wellness and beauty studios, real estate professionals, boutique retail shops, service providers, schools, and growing local brands.'
    },
    {
      question: 'What’s included in a free consultation?',
      answer: 'We will talk through where your marketing stands now, what is feeling scattered or under-supported, and which next steps would help your business grow with more clarity and confidence.'
    },
    {
      question: 'How long does a website build typically take?',
      answer: 'Most website projects depend on scope, content readiness, and feedback timelines. Smaller refreshes can move quickly, while custom builds need more time for strategy, design, development, refinement, and launch preparation.'
    },
    {
      question: 'Do you offer ongoing monthly marketing support?',
      answer: 'Yes. Ongoing support can include social media management, content creation, campaign planning, brand direction, reporting, and continuous optimization so your marketing keeps improving month after month.'
    },
    {
      question: 'What areas of Alberta do you serve?',
      answer: 'Sharp Growth Co. supports businesses across Alberta, including Calgary, Okotoks, Edmonton, surrounding communities, and remote clients who want local insight paired with polished strategy.'
    },
    {
      question: 'How is Sharp Growth Co. different from a marketing agency?',
      answer: 'You work directly with Jenna instead of being passed between departments. The process is hands-on, strategic, personal, and built for businesses that want agency-level polish without unnecessary complexity.'
    }
  ];

  const orderedServiceSections = [
    {
      key: 'social-content',
      eyebrow: 'Social Media & Content Creation',
      title: 'Content that builds community and moves people to act.',
      intro: 'A combined strategy, content, and publishing system for businesses that need to look consistent, stay visible, and turn attention into real demand.',
      image: '/assets/images/social-media-management-alberta-content-strategy-phone.webp',
      alt: 'Phone mockup showing social media management and content creation strategy for Alberta local businesses.',
      visualLabel: 'Phone-first content system',
      points: [
        'Social media planning, captions, posting, and community engagement',
        'Short-form video, Reels, TikTok, UGC-style content, and launch assets',
        'Monthly content direction that keeps your visuals, message, and offers aligned'
      ]
    },
    {
      key: 'marketing-strategy',
      eyebrow: 'Marketing Strategy',
      title: 'A clear roadmap for sustainable local growth.',
      intro: 'Strategy turns scattered marketing into focused action. I map your positioning, offers, campaigns, and customer journey so every effort has a purpose.',
      image: '/assets/images/calgary-marketing-consultant-boardroom-strategy-meeting.webp',
      alt: 'Marketing strategy boardroom planning session for Alberta entrepreneurs and local business growth.',
      visualLabel: 'Strategic growth planning',
      points: [
        'Brand positioning, messaging, campaign planning, and launch strategy',
        'Customer journey mapping, offer refinement, and growth audits',
        'Clear priorities and timelines so you know exactly what to do next'
      ]
    },
    {
      key: 'branding-creative-direction',
      eyebrow: 'Branding & Creative Direction',
      title: 'A cohesive brand presence people remember.',
      intro: 'Your brand should feel intentional everywhere it appears. I shape the visuals, voice, templates, and creative direction that make your business feel polished and recognizable.',
      image: '/assets/images/branding-creative-direction-brand-board-visual-identity.webp',
      alt: 'Brand board creative direction and visual identity system for Alberta businesses.',
      visualLabel: 'Brand board direction',
      points: [
        'Visual direction, brand identity support, voice, and messaging refinement',
        'Content themes, Canva templates, brand kits, and promotional graphics',
        'Creative direction that keeps every touchpoint consistent and elevated'
      ]
    }
  ];

  function createOrderedServicesFaq() {
    const section = document.createElement('section');
    section.className = 'sgc-services-ordered-faq';
    section.id = 'services-faq';
    section.innerHTML = `
      <div class="sgc-services-ordered-shell">
        <p class="sgc-services-kicker">FAQ</p>
        <h2>Questions before we grow?</h2>
        <div class="sgc-services-faq-list">
          ${orderedServicesFaqs.map((item, index) => `
            <article class="sgc-services-faq-item">
              <button class="sgc-services-faq-question" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
                <span>${item.question}</span>
                <span class="sgc-services-faq-icon" aria-hidden="true"></span>
              </button>
              <div class="sgc-services-faq-answer" ${index === 0 ? '' : 'hidden'}>
                <p>${item.answer}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
    section.querySelectorAll('.sgc-services-faq-question').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.sgc-services-faq-item');
        const answer = item?.querySelector('.sgc-services-faq-answer');
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (answer) answer.hidden = expanded;
      });
    });
    return section;
  }

  function createGoldLaptopHero() {
    const section = document.createElement('section');
    section.className = 'sgc-services-gold-laptop-hero luxury-gradient-section';
    section.id = serviceAnchorsByTitle['Website Design & Development'];
    section.setAttribute('data-sgc-service-anchor', serviceAnchorsByTitle['Website Design & Development']);
    section.innerHTML = `
      <div class="luxury-overlay" aria-hidden="true"></div>
      <div class="content-wrapper">
        <div class="sgc-services-ordered-shell sgc-services-laptop-copy">
          <p class="sgc-services-kicker">Flagship Website Service</p>
          <h2>Website Design &amp; Development</h2>
          <p>Custom, conversion-focused websites built to make your business look polished, feel trustworthy, and turn visitors into customers.</p>
        </div>
        <div class="sgc-gold-laptop-scene" aria-label="Interactive laptop mockup listing Website Design and Development services">
          <div class="sgc-gold-laptop">
          <div class="sgc-gold-laptop-lid">
            <span class="sgc-gold-laptop-shine" aria-hidden="true"></span>
            <div class="sgc-gold-laptop-screen">
              <div class="sgc-gold-laptop-topbar"><span></span><span></span><span></span><em>sharpgrowthco.com/web-design</em></div>
              <div class="sgc-gold-laptop-heading"><h3>Website Design &amp; Development</h3><p>What's Included</p></div>
              <div class="sgc-gold-laptop-grid">
                ${webCards.map((card) => `
                  <article class="sgc-gold-laptop-card" tabindex="0">
                    <img src="${card.image}" alt="${card.alt}" loading="lazy" decoding="async">
                    <span class="sgc-gold-laptop-card-overlay" aria-hidden="true"></span>
                    <div><h4>${card.title}</h4><p>${card.description}</p></div>
                  </article>
                `).join('')}
              </div>
            </div>
          </div>
            <div class="sgc-gold-laptop-hinge" aria-hidden="true"></div>
            <div class="sgc-gold-laptop-base" aria-hidden="true"><span></span></div>
          </div>
          <div class="sgc-gold-laptop-shadow" aria-hidden="true"></div>
        </div>
      </div>
    `;
    return section;
  }

  function createVisualServiceSection(config, index) {
    const section = document.createElement('section');
    section.className = `sgc-services-visual-section sgc-services-visual-${config.key}`;
    section.id = config.key;
    section.setAttribute('data-sgc-service-anchor', config.key);
    const reverseClass = index % 2 ? ' sgc-services-visual-reverse' : '';
    section.innerHTML = `
      <div class="sgc-services-visual-inner${reverseClass}">
        <div class="sgc-services-visual-media">
          <div class="sgc-services-device-frame">
            <img src="${config.image}" alt="${config.alt}" loading="lazy" decoding="async">
            <span>${config.visualLabel}</span>
          </div>
        </div>
        <div class="sgc-services-visual-copy">
          <p class="sgc-services-kicker">${config.eyebrow}</p>
          <h2>${config.title}</h2>
          <p>${config.intro}</p>
          <ul>
            ${config.points.map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    return section;
  }

  function getServicesHeroSection() {
    const heading = Array.from(document.querySelectorAll('h1')).find((el) => normalize(el.textContent).includes('Full-service marketing'));
    return heading ? heading.closest('section') || heading.parentElement : null;
  }

  function getReadyToBeginSection() {
    const readySections = Array.from(document.querySelectorAll('section')).filter((section) => {
      const text = normalize(section.textContent);
      const headings = Array.from(section.querySelectorAll('h1,h2,h3')).map((heading) => normalize(heading.textContent)).join(' ');
      return text.includes('Ready to Begin') || headings.includes('Ready to grow with intention?');
    });
    return readySections.find((section) => section.dataset.readyToBeginInjected === 'true') || readySections[readySections.length - 1] || readySections[0] || null;
  }

  function removeServicesFaqFromHomeIfNeeded() {
    if (!routeIsHome()) return;
    const faqHeading = Array.from(document.querySelectorAll('section h2, section h3')).find((el) => /questions|faq/i.test(normalize(el.textContent)));
    const faqSection = faqHeading ? faqHeading.closest('section') : null;
    if (faqSection) {
      faqSection.dataset.sgcMovedToServices = 'true';
      faqSection.remove();
    }
  }

  function buildOrderedServicesPage() {
    if (!routeIsServices()) return;
    const hero = getServicesHeroSection();
    const existingOrderedSections = document.querySelectorAll('.sgc-services-gold-laptop-hero, .sgc-services-visual-section, .sgc-services-ordered-faq');
    if (!hero) return;
    if (hero.dataset.sgcOrderedServicesBuilt === 'true' && existingOrderedSections.length >= 5) {
      const readyCurrent = getReadyToBeginSection();
      const footerCurrent = document.querySelector('footer');
      if (readyCurrent && footerCurrent && readyCurrent.nextElementSibling !== footerCurrent && footerCurrent.parentNode) {
        footerCurrent.parentNode.insertBefore(readyCurrent, footerCurrent);
      }
      return;
    }

    keepPreferredReadyToBeginSection();
    const ready = getReadyToBeginSection();
    const footer = document.querySelector('footer');
    const parent = hero.parentElement;
    if (!parent) return;

    Array.from(parent.children).forEach((child) => {
      if (child === hero || child === ready || child === footer) return;
      if (child.tagName && child.tagName.toLowerCase() === 'section') child.remove();
    });

    document.querySelectorAll('.sgc-services-gold-laptop-hero, .sgc-services-visual-section, .sgc-services-ordered-faq').forEach((el) => el.remove());

    const laptopHero = createGoldLaptopHero();
    const visualSections = orderedServiceSections.map((config, index) => createVisualServiceSection(config, index));
    const faq = createOrderedServicesFaq();

    hero.insertAdjacentElement('afterend', laptopHero);
    let cursor = laptopHero;
    visualSections.forEach((section) => {
      cursor.insertAdjacentElement('afterend', section);
      cursor = section;
    });

    cursor.insertAdjacentElement('afterend', faq);

    if (ready) {
      ready.classList.add('sgc-services-ordered-ready');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(ready, footer);
      } else {
        faq.insertAdjacentElement('afterend', ready);
      }
    }

    hero.dataset.sgcOrderedServicesBuilt = 'true';
  }

  function enhanceServicesPage() {
    if (!routeIsServices()) return;
    buildOrderedServicesPage();
    keepPreferredReadyToBeginSection();
    scrollToServiceHash();
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
    removeServicesFaqFromHomeIfNeeded();
    enhanceHomeBusinessTags();
    enhanceHomeServiceCards();
    removeMovedHomeSections();
    enhanceServicesPage();
    enhanceContactServiceButtons();
  }

  let queued = false;
  let runCount = 0;
  const maxRuns = 8;
  function scheduleEnhance() {
    if (queued || runCount >= maxRuns) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      runCount += 1;
      enhanceAllPages();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEnhance, { once: true });
  } else {
    scheduleEnhance();
  }

  window.addEventListener('popstate', () => setTimeout(scheduleEnhance, 80));
  window.addEventListener('hashchange', () => setTimeout(scheduleEnhance, 80));
  window.setTimeout(scheduleEnhance, 250);
  window.setTimeout(scheduleEnhance, 900);
  window.setTimeout(scheduleEnhance, 1800);
  window.setTimeout(scheduleEnhance, 3200);

  const servicesRoot = document.getElementById('root') || document.body;
  if (servicesRoot && 'MutationObserver' in window) {
    let mutationRuns = 0;
    const observer = new MutationObserver(() => {
      if (mutationRuns >= 14) {
        observer.disconnect();
        return;
      }
      mutationRuns += 1;
      window.setTimeout(scheduleEnhance, 80);
    });
    observer.observe(servicesRoot, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 9000);
  }
})();
