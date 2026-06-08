(() => {
  'use strict';

  const VERSION = 'home-pricing-teaser-buttons-20260602';
  const PACKAGES_URL = '/packages/';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/';
  }

  function buildPricingTeaser() {
    const section = document.createElement('section');
    section.className = 'sgc-home-pricing-teaser';
    section.id = 'packages-pricing';
    section.dataset.sgcPricingTeaser = VERSION;
    section.setAttribute('aria-labelledby', 'sgc-home-pricing-teaser-heading');
    section.innerHTML = `
      <p class="sgc-pricing-teaser-label">Packages &amp; Pricing</p>
      <h2 class="sgc-pricing-teaser-heading" id="sgc-home-pricing-teaser-heading">Packages built for every stage of growth</h2>
      <p class="sgc-pricing-teaser-subheading">Simple pricing. Serious results. All packages include direct access to me — no middlemen, ever.</p>

      <div class="sgc-pricing-teaser-grid">
        <article class="sgc-pricing-teaser-card">
          <span class="sgc-pricing-teaser-num">Package 01</span>
          <h3 class="sgc-pricing-teaser-name">Website Refresh</h3>
          <p class="sgc-pricing-teaser-desc">A modern, conversion-focused redesign for businesses ready to upgrade.</p>
          <div class="sgc-pricing-teaser-divider" aria-hidden="true"></div>
          <div class="sgc-pricing-teaser-price-row"><span class="sgc-pricing-teaser-price">$1,200</span></div>
          <p class="sgc-pricing-teaser-note">Starting investment</p>
          <a href="${PACKAGES_URL}" class="sgc-pricing-teaser-card-cta sgc-pricing-teaser-outline" aria-label="See full Website Refresh package details on the Packages and Pricing page">See Full Details</a>
        </article>

        <article class="sgc-pricing-teaser-card">
          <span class="sgc-pricing-teaser-num">Package 02</span>
          <h3 class="sgc-pricing-teaser-name">The Spark</h3>
          <p class="sgc-pricing-teaser-desc">Perfect for businesses just getting started on social media.</p>
          <div class="sgc-pricing-teaser-divider" aria-hidden="true"></div>
          <div class="sgc-pricing-teaser-price-row"><span class="sgc-pricing-teaser-price">$597</span></div>
          <p class="sgc-pricing-teaser-note">One-time investment</p>
          <a href="${PACKAGES_URL}" class="sgc-pricing-teaser-card-cta sgc-pricing-teaser-outline" aria-label="See full The Spark package details on the Packages and Pricing page">See Full Details</a>
        </article>

        <article class="sgc-pricing-teaser-card sgc-pricing-teaser-featured">
          <span class="sgc-pricing-teaser-num">Package 03</span>
          <h3 class="sgc-pricing-teaser-name">The Content Queen</h3>
          <p class="sgc-pricing-teaser-desc">Consistent, professional content every month — done for you.</p>
          <div class="sgc-pricing-teaser-divider" aria-hidden="true"></div>
          <div class="sgc-pricing-teaser-price-row"><span class="sgc-pricing-teaser-price">$1,200</span><span class="sgc-pricing-teaser-period">/mo</span></div>
          <p class="sgc-pricing-teaser-note">3-month minimum</p>
          <a href="${PACKAGES_URL}" class="sgc-pricing-teaser-card-cta sgc-pricing-teaser-filled" aria-label="See full The Content Queen package details on the Packages and Pricing page">See Full Details</a>
        </article>

        <article class="sgc-pricing-teaser-card">
          <span class="sgc-pricing-teaser-num">Package 04</span>
          <h3 class="sgc-pricing-teaser-name">The Full Sharp</h3>
          <p class="sgc-pricing-teaser-desc">Completely hands-off — I run your entire social media presence.</p>
          <div class="sgc-pricing-teaser-divider" aria-hidden="true"></div>
          <div class="sgc-pricing-teaser-price-row"><span class="sgc-pricing-teaser-price">$2,500</span><span class="sgc-pricing-teaser-period">/mo</span></div>
          <p class="sgc-pricing-teaser-note">3-month minimum</p>
          <a href="${PACKAGES_URL}" class="sgc-pricing-teaser-card-cta sgc-pricing-teaser-outline" aria-label="See full The Full Sharp package details on the Packages and Pricing page">See Full Details</a>
        </article>
      </div>

      <div class="sgc-pricing-teaser-view-all-wrap">
        <a href="${PACKAGES_URL}" class="sgc-pricing-teaser-view-all sgc-pricing-teaser-view-all-button" aria-label="View the full Sharp Growth Co. Packages and Pricing page">
          View Full Packages &amp; Pricing
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
    `;
    return section;
  }

  function findExistingPricingSection() {
    const candidates = Array.from(document.querySelectorAll('section'));
    return candidates.find((section) => {
      if (section.dataset.sgcPricingTeaser === VERSION) return false;
      const text = normalize(section.textContent);
      return text.includes('packages & pricing') || text.includes('packages built for every stage of growth');
    });
  }

  function replacePricingSection() {
    if (!isHomePage()) return true;
    const current = document.querySelector('[data-sgc-pricing-teaser]');
    if (current && current.dataset.sgcPricingTeaser === VERSION) return true;
    if (current) {
      current.replaceWith(buildPricingTeaser());
      return true;
    }

    const existing = findExistingPricingSection();
    if (!existing) return false;

    existing.replaceWith(buildPricingTeaser());
    return true;
  }

  function init() {
    let attempts = 0;
    const maxAttempts = 60;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (replacePricingSection() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 150);

    replacePricingSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
