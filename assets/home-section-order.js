(() => {
  'use strict';

  const VERSION = 'home-new-flow-dashboard-testimonial-20260602';
  const HOME_PATHS = new Set(['/', '']);

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function normalizedLower(text) {
    return normalize(text).toLowerCase();
  }

  function isHomePage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return HOME_PATHS.has(path);
  }

  function sectionContainingText(targetText) {
    const target = normalizedLower(targetText);
    const sections = Array.from(document.querySelectorAll('section'));
    return sections.find((section) => normalizedLower(section.textContent).includes(target)) || null;
  }

  function findWhySection() {
    return sectionContainingText('Strategic Marketing for Business Growth') || sectionContainingText('Why Sharp Growth Co.');
  }

  function findServicesSection() {
    return sectionContainingText('Everything your brand needs to grow') || sectionContainingText('My Services');
  }

  function findPricingSection() {
    return document.querySelector('[data-sgc-pricing-teaser]') || sectionContainingText('Packages built for every stage of growth') || sectionContainingText('Packages & Pricing');
  }

  function findReadySection() {
    return document.querySelector('[data-ready-to-begin-injected="true"]') || sectionContainingText('Ready to grow with intention?') || sectionContainingText('Ready to Begin');
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
          <p class="sgc-home-flow-intro">I bring strategy, content, websites, and creative direction together so your business has a clear message, a stronger online presence, and a marketing plan that is built around real goals — not guesswork.</p>
        </div>
        <aside class="sgc-home-offer-callout" aria-label="Sharp Growth Co. offer summary">
          <p>Sharp Growth Co. is for local Alberta businesses that want polished marketing, consistent visibility, and a partner who can turn scattered ideas into a clear growth plan.</p>
          <a class="sgc-home-flow-cta" href="/services/">Explore My Services</a>
        </aside>
      </div>
    `;
    return section;
  }

  function buildResultsSection() {
    const section = document.createElement('section');
    section.className = 'sgc-home-results-section';
    section.id = 'results-you-can-measure';
    section.dataset.sgcHomeSection = 'results-dashboard';
    section.dataset.sgcHomeFlowVersion = VERSION;
    section.setAttribute('aria-labelledby', 'sgc-home-results-heading');
    section.innerHTML = `
      <div class="sgc-home-flow-container">
        <p class="sgc-home-flow-label">Results You Can Measure</p>
        <h2 class="sgc-home-flow-heading sgc-home-results-heading" id="sgc-home-results-heading">Marketing you can actually track</h2>
        <p class="sgc-home-flow-intro sgc-home-results-intro">The right strategy should make your next steps clearer and your results easier to see — from stronger traffic and reach to better leads and measurable business impact.</p>

        <div class="results-dashboard" role="img" aria-label="Sample six-month growth dashboard showing website traffic, social reach, new leads, revenue impact, monthly growth, Google ranking, return on investment, and retention metrics.">
          <div class="dash-header">
            <span class="dash-title">Results You Can Measure</span>
            <span class="dash-period">6-Month Growth Overview</span>
          </div>

          <div class="metrics-row">
            <div class="metric-card">
              <span class="metric-label">Website Traffic</span>
              <span class="metric-value">3,240</span>
              <span class="metric-change"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>+182% vs. prior</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Social Reach</span>
              <span class="metric-value">28.4K</span>
              <span class="metric-change"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>+215% growth</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">New Leads</span>
              <span class="metric-value">147</span>
              <span class="metric-change"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>+94% increase</span>
            </div>
            <div class="metric-card">
              <span class="metric-label">Revenue Impact</span>
              <span class="metric-value">$18.6K</span>
              <span class="metric-change"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path></svg>+67% attributed</span>
            </div>
          </div>

          <div class="chart-area">
            <div class="chart-main">
              <span class="chart-label">Monthly Growth — Before &amp; After</span>
              <div class="bar-chart">
                <div class="bar-group"><div class="bar charcoal" style="height: 30px;"></div><span class="bar-month">Jan</span></div>
                <div class="bar-group"><div class="bar charcoal" style="height: 35px;"></div><span class="bar-month">Feb</span></div>
                <div class="bar-group"><div class="bar gold" style="height: 52px;"></div><span class="bar-month">Mar</span></div>
                <div class="bar-group"><div class="bar gold" style="height: 72px;"></div><span class="bar-month">Apr</span></div>
                <div class="bar-group"><div class="bar gold" style="height: 96px;"></div><span class="bar-month">May</span></div>
                <div class="bar-group"><div class="bar gold" style="height: 130px;"></div><span class="bar-month">Jun</span></div>
              </div>
              <div class="chart-legend">
                <span class="legend-item"><span class="legend-dot charcoal"></span> Before Sharp Growth Co.</span>
                <span class="legend-item"><span class="legend-dot gold"></span> After Sharp Growth Co.</span>
              </div>
            </div>

            <div class="chart-sidebar">
              <div class="highlight-card">
                <div class="highlight-icon gold-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></div>
                <div class="highlight-info"><span class="highlight-value">Page 1</span><span class="highlight-label">Google ranking for 3 target keywords</span></div>
              </div>
              <div class="highlight-card">
                <div class="highlight-icon gold-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                <div class="highlight-info"><span class="highlight-value">4.2x</span><span class="highlight-label">Return on marketing investment</span></div>
              </div>
              <div class="highlight-card">
                <div class="highlight-icon gold-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4 12 14.01l-3-3"></path></svg></div>
                <div class="highlight-info"><span class="highlight-value">92%</span><span class="highlight-label">Client retention rate</span></div>
              </div>
            </div>
          </div>

          <div class="dash-footer">
            <div class="dash-branding"><span class="dash-logo-text">Sharp Growth Co.</span></div>
            <span class="dash-tagline">Strategic marketing. Measurable growth.</span>
          </div>
        </div>

        <p class="sgc-results-disclaimer"><em>Sample client results. Individual outcomes vary.</em></p>
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
    `;
    return section;
  }

  function getOrCreateHomeSection(key, builder) {
    const selector = `[data-sgc-home-section="${key}"]`;
    const existing = document.querySelector(selector);
    if (existing) return existing;
    return builder();
  }

  function removeLegacyClientStorySections() {
    Array.from(document.querySelectorAll('section')).forEach((section) => {
      if (section.dataset.sgcHomeSection) return;
      const text = normalizedLower(section.textContent);
      const isLegacyClientStory = text.includes('client success story') || (text.includes('results you can measure') && text.includes('marketing growth'));
      if (isLegacyClientStory) section.remove();
    });
  }

  function insertAfter(reference, element) {
    if (!reference || !element || reference === element) return;
    if (reference.nextElementSibling === element) return;
    reference.insertAdjacentElement('afterend', element);
  }

  function enforceHomeOrder() {
    if (!isHomePage()) return;

    removeLegacyClientStorySections();

    const whySection = findWhySection();
    const servicesSection = findServicesSection();
    const footer = document.querySelector('footer');

    if (!whySection || !servicesSection) return;

    const whatSection = getOrCreateHomeSection('what-i-offer', buildWhatIOfferSection);
    const resultsSection = getOrCreateHomeSection('results-dashboard', buildResultsSection);
    const testimonialSection = getOrCreateHomeSection('short-testimonial', buildTestimonialSection);

    insertAfter(whySection, whatSection);
    insertAfter(whatSection, resultsSection);
    insertAfter(resultsSection, servicesSection);
    insertAfter(servicesSection, testimonialSection);

    const pricingSection = findPricingSection();
    if (pricingSection) insertAfter(testimonialSection, pricingSection);

    const readySection = findReadySection();
    if (readySection) insertAfter(pricingSection || testimonialSection, readySection);

    if (footer && readySection) insertAfter(readySection, footer);
  }

  function scheduleOrder() {
    window.requestAnimationFrame(() => {
      enforceHomeOrder();
      window.setTimeout(enforceHomeOrder, 150);
      window.setTimeout(enforceHomeOrder, 600);
      window.setTimeout(enforceHomeOrder, 1400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleOrder, { once: true });
  } else {
    scheduleOrder();
  }

  window.addEventListener('load', scheduleOrder);
  window.addEventListener('popstate', scheduleOrder);
  window.addEventListener('hashchange', scheduleOrder);

  const observer = new MutationObserver(scheduleOrder);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
