(() => {
  'use strict';

  const VERSION = 'home-exact-order-short-teasers-20260602';
  const CALENDLY = 'https://calendly.com/sharpgrowthco';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function normalizedLower(text) {
    return normalize(text).toLowerCase();
  }

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/';
  }

  function allSections() {
    return Array.from(document.querySelectorAll('#root section, main section, body > section, section'))
      .filter((section, index, list) => list.indexOf(section) === index);
  }

  function sectionText(section) {
    return normalizedLower(section ? section.textContent : '');
  }

  function sectionContainingAny(needles, options = {}) {
    const loweredNeedles = needles.map((needle) => normalizedLower(needle));
    return allSections().find((section) => {
      if (!options.includeManaged && section.dataset.sgcHomeSection) return false;
      if (!options.includePricing && section.dataset.sgcPricingTeaser) return false;
      if (!options.includeReady && section.dataset.readyToBeginInjected) return false;
      const text = sectionText(section);
      return loweredNeedles.some((needle) => text.includes(needle));
    }) || null;
  }

  function findHeroSection() {
    return sectionContainingAny(['marketing that makes your business impossible to ignore'], { includeManaged: true }) ||
      Array.from(document.querySelectorAll('#root section, main section, section')).find((section) => sectionText(section).length > 30) ||
      null;
  }

  function findWhySection() {
    return sectionContainingAny([
      'why sharp growth co.',
      'why sharp growth co',
      'strategic marketing for business growth',
      'most businesses don\'t have a marketing problem'
    ]);
  }

  function findServicesSection() {
    return sectionContainingAny([
      'everything your brand needs to grow',
      'website design & development',
      'social media & content creation',
      'see my services'
    ]);
  }

  function findWhoSection() {
    return sectionContainingAny([
      'built for ambitious alberta businesses',
      'local restaurants & cafés',
      'local restaurants & cafes',
      'who i work with'
    ]);
  }

  function findFaqSection() {
    return sectionContainingAny([
      'questions i get asked all the time',
      'what types of businesses do you work with?',
      'what’s included in a free consultation?',
      'what\'s included in a free consultation?'
    ]);
  }

  function findPricingSection() {
    return document.querySelector('[data-sgc-pricing-teaser]') || sectionContainingAny([
      'packages built for every stage of growth',
      'packages & pricing',
      'view full packages & pricing',
      'view all packages'
    ], { includePricing: true });
  }

  function findReadySection() {
    return document.querySelector('[data-ready-to-begin-injected="true"]') || sectionContainingAny([
      'ready to grow with intention?',
      'ready to begin'
    ], { includeReady: true });
  }

  function buildWhatIOfferSection() {
    const section = document.createElement('section');
    section.className = 'sgc-home-what-offer';
    section.id = 'what-i-offer';
    section.dataset.sgcHomeSection = 'what-i-offer';
    section.dataset.sgcHomeFlowVersion = VERSION;
    section.setAttribute('aria-labelledby', 'sgc-home-what-offer-heading');
    section.innerHTML = `
      <div class="sgc-home-flow-container sgc-home-what-offer-grid">
        <div class="sgc-home-flow-copy">
          <p class="sgc-home-flow-label">What I Offer</p>
          <h2 class="sgc-home-flow-heading" id="sgc-home-what-offer-heading">Focused marketing support for businesses ready to grow</h2>
          <p class="sgc-home-flow-intro">I bring strategy, websites, social media, content, and creative direction together so your business has a stronger online presence, clearer messaging, and marketing that moves with intention.</p>
          <a class="sgc-home-flow-cta sgc-home-flow-cta-inline" href="/services/">Explore My Services</a>
        </div>
        <aside class="sgc-home-offer-callout" aria-label="Sharp Growth Co. offer summary">
          <p>Sharp Growth Co. is for local Alberta businesses that want polished marketing, consistent visibility, and a clear plan for turning attention into action.</p>
        </aside>
      </div>
    `;
    return section;
  }

  function buildTestimonialSection() {
    const section = document.createElement('section');
    section.className = 'sgc-home-testimonial-section';
    section.id = 'home-client-success';
    section.dataset.sgcHomeSection = 'short-testimonial';
    section.dataset.sgcHomeFlowVersion = VERSION;
    section.setAttribute('aria-labelledby', 'sgc-home-testimonial-heading');
    section.innerHTML = `
      <p class="testimonial-label">Client Success</p>
      <h2 class="testimonial-heading" id="sgc-home-testimonial-heading">Real results for real businesses</h2>

      <div class="testimonial-card">
        <span class="quote-mark" aria-hidden="true">&quot;</span>
        <div class="quote-text">
          <p>Working with Jenna at Sharp Growth Co. was honestly one of the best business decisions I've made for Gather &amp; Grow. She completely understood my vision and brought it to life in a way that exceeded every expectation I had.</p>
          <p>She was responsive, creative, organized, and truly cared about making everything perfect. I've received so many compliments on my website and branding already, and I finally feel confident sending people to my business online.</p>
          <p>I cannot recommend Jenna and Sharp Growth Co. enough.</p>
        </div>
        <div class="quote-divider" aria-hidden="true"></div>
        <div class="attribution">
          <div class="attribution-info">
            <span class="attribution-name">Laine Mackay</span>
            <span class="attribution-role">Founder, Gather and Grow</span>
          </div>
          <div class="project-tags" aria-label="Project services">
            <span class="project-tag">Website Design</span>
            <span class="project-tag">Booking Setup</span>
            <span class="project-tag">Branding</span>
          </div>
        </div>
      </div>

      <div class="testimonial-footer">
        <a href="/work/" class="testimonial-link testimonial-link-button" aria-label="See the full Gather and Grow testimonial and case study on the My Work page">
          See Full Testimonial
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
    `;
    return section;
  }

  function getOrReplaceWhatIOfferSection() {
    const existing = document.querySelector('[data-sgc-home-section="what-i-offer"]');
    if (existing) return existing;

    const legacy = sectionContainingAny(['what i offer'], { includeManaged: true });
    const replacement = buildWhatIOfferSection();
    if (legacy && legacy !== findServicesSection() && legacy !== findWhySection()) {
      legacy.replaceWith(replacement);
    }
    return replacement;
  }

  function getOrReplaceTestimonialSection() {
    const current = document.querySelector('[data-sgc-home-section="short-testimonial"]');
    if (current && current.dataset.sgcHomeFlowVersion === VERSION) return current;

    const replacement = buildTestimonialSection();
    if (current) {
      current.replaceWith(replacement);
      return replacement;
    }

    const legacy = sectionContainingAny(['client success story', 'real results for real businesses', 'gather & grow', 'gather and grow'], { includeManaged: false });
    if (legacy && legacy !== findWhoSection()) {
      legacy.replaceWith(replacement);
    }
    return replacement;
  }

  function removeMovedOrLegacySections() {
    const injectedReady = document.querySelector('[data-ready-to-begin-injected="true"]');
    allSections().forEach((section) => {
      if (section.dataset.sgcHomeSection || section.dataset.sgcPricingTeaser) return;
      const text = sectionText(section);
      const isDuplicateReady = injectedReady && section !== injectedReady && text.includes('ready to grow with intention?');
      const shouldRemove =
        text.includes('proudly alberta') ||
        text.includes('my process') ||
        text.includes('client success story') ||
        text.includes('results you can measure') ||
        isDuplicateReady;
      if (!shouldRemove) return;
      section.dataset.sgcHomeRemovedBy = VERSION;
      section.remove();
    });
  }

  function insertAfter(reference, element) {
    if (!reference || !element || reference === element) return;
    if (reference.nextElementSibling === element) return;
    reference.insertAdjacentElement('afterend', element);
  }

  function normalizeWhyCta(whySection) {
    if (!whySection) return;
    const links = Array.from(whySection.querySelectorAll('a, button'));
    links.forEach((link) => {
      const label = normalizedLower(link.textContent);
      if (!label.includes('book') && !label.includes('consultation')) return;
      if (link.tagName.toLowerCase() === 'a') {
        link.href = CALENDLY;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }

  function enforceHomeOrder() {
    if (!isHomePage()) return true;

    removeMovedOrLegacySections();

    const heroSection = findHeroSection();
    const whySection = findWhySection();
    const whatSection = getOrReplaceWhatIOfferSection();
    const servicesSection = findServicesSection();
    const testimonialSection = getOrReplaceTestimonialSection();
    const whoSection = findWhoSection();
    const pricingSection = findPricingSection();
    const faqSection = findFaqSection();
    const readySection = findReadySection();
    const footer = document.querySelector('footer');

    if (!heroSection || !whySection || !servicesSection) return false;

    normalizeWhyCta(whySection);

    insertAfter(heroSection, whySection);
    insertAfter(whySection, whatSection);
    insertAfter(whatSection, servicesSection);
    insertAfter(servicesSection, testimonialSection);
    if (whoSection) insertAfter(testimonialSection, whoSection);
    if (pricingSection) insertAfter(whoSection || testimonialSection, pricingSection);
    if (faqSection) insertAfter(pricingSection || whoSection || testimonialSection, faqSection);
    if (readySection) insertAfter(faqSection || pricingSection || whoSection || testimonialSection, readySection);
    if (footer) insertAfter(readySection || faqSection || pricingSection || whoSection || testimonialSection, footer);

    document.documentElement.dataset.sgcHomeOrderVersion = VERSION;
    return Boolean(readySection || faqSection || pricingSection || whoSection);
  }

  let attempts = 0;
  let intervalId = null;
  const maxAttempts = 80;

  function runBoundedOrderPass() {
    attempts += 1;
    enforceHomeOrder();
    if (attempts >= maxAttempts && intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function start() {
    if (!isHomePage()) return;
    if (intervalId) return;
    attempts = 0;
    runBoundedOrderPass();
    intervalId = window.setInterval(runBoundedOrderPass, 150);
    window.setTimeout(() => {
      enforceHomeOrder();
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }, 14000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('load', () => window.setTimeout(start, 80), { once: true });
  window.addEventListener('popstate', () => window.setTimeout(start, 80));
  window.addEventListener('hashchange', () => window.setTimeout(start, 80));
})();
