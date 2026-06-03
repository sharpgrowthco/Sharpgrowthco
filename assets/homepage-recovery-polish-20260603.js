(function () {
  'use strict';
  const isHomePath = location.pathname === '/' || location.pathname === '/index.html';
  if (!isHomePath) return;

  const offerCopy = {
    eyebrow: 'What I Offer',
    title: 'Focused marketing for businesses ready to grow',
    body: 'Your business deserves more than basic marketing or inconsistent posting. I combine strategy, creative direction, and hands-on execution to help local businesses show up online with confidence — from custom websites that convert to social media content that drives real engagement. Every part of your marketing is built with growth in mind.',
    calloutTitle: 'Made for local. Built to grow.',
    calloutBody: 'Whether you\'re a restaurant, spa, salon, wellness brand, or growing local business, I help you build a polished online presence that not only looks professional but works to bring more people through your doors.',
    cta: 'Explore My Services'
  };

  function orbitVisualHTML() {
    const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    return `
      <div class="sgc-offer-orbit" aria-label="Sharp Growth Co. marketing services visual">
        <div class="sgc-orbit-ring outer"><span class="sgc-ring-dot"></span><span class="sgc-ring-dot"></span><span class="sgc-ring-dot"></span><span class="sgc-ring-dot"></span></div>
        <div class="sgc-orbit-ring mid"></div>
        <div class="sgc-orbit-ring glow"></div>
        <div class="sgc-orbit-logo"><div class="sgc-orbit-logo-name">Sharp Growth Co<span>.</span></div><div class="sgc-orbit-logo-divider"></div><div class="sgc-orbit-logo-tagline">Local Alberta Marketing</div></div>
        <div class="sgc-orbit-track">
          <div class="sgc-orbit-card website"><div class="sgc-card-inner sgc-card-website"><div class="sgc-web-bar"><span class="sgc-wdot r"></span><span class="sgc-wdot y"></span><span class="sgc-wdot g"></span><span class="sgc-wurl">yourbusiness.com</span></div><div class="sgc-web-body"><div class="sgc-web-hero"><span>Elevate Your Brand</span></div><div class="sgc-web-lines"><div class="sgc-web-line"></div><div class="sgc-web-line"></div><div class="sgc-web-line"></div></div><div class="sgc-web-btn">Get Started</div></div></div></div>
          <div class="sgc-orbit-card social"><div class="sgc-card-inner sgc-card-social"><div class="sgc-social-inner"><div class="sgc-social-top"><span class="sgc-social-lbl">Social Growth</span><span class="sgc-social-up">↑ 215%</span></div><div class="sgc-social-big">28.4K</div><div class="sgc-social-sub">Monthly Reach</div><div class="sgc-chart"><div class="sgc-bar m" style="height:28%"></div><div class="sgc-bar m" style="height:32%"></div><div class="sgc-bar g" style="height:45%"></div><div class="sgc-bar g" style="height:58%"></div><div class="sgc-bar g" style="height:72%"></div><div class="sgc-bar g" style="height:88%"></div><div class="sgc-bar g" style="height:100%"></div></div></div></div></div>
          <div class="sgc-orbit-card brand"><div class="sgc-card-inner sgc-card-brand"><div class="sgc-brand-inner"><span class="sgc-brand-lbl">Brand Direction</span><div class="sgc-swatches"><div class="sgc-sw a"></div><div class="sgc-sw b"></div><div class="sgc-sw c"></div><div class="sgc-sw d"></div></div><div class="sgc-font-section"><div class="sgc-font-row"><span class="sgc-font-lbl">Heading</span><span class="sgc-aa-serif">Aa</span></div><div class="sgc-font-row"><span class="sgc-font-lbl">Body</span><span class="sgc-aa-sans">Aa</span></div></div></div></div></div>
          <div class="sgc-orbit-card strategy"><div class="sgc-card-inner sgc-card-strategy"><div class="sgc-strategy-inner"><span class="sgc-strat-lbl">Growth Plan</span><div class="sgc-strat-list"><div class="sgc-strat-item"><span class="sgc-check done">${checkSvg}</span><span class="sgc-strat-txt done">Brand Audit</span></div><div class="sgc-strat-item"><span class="sgc-check done">${checkSvg}</span><span class="sgc-strat-txt done">Content Strategy</span></div><div class="sgc-strat-item"><span class="sgc-check done">${checkSvg}</span><span class="sgc-strat-txt done">Website Launch</span></div><div class="sgc-strat-item"><span class="sgc-check pending"></span><span class="sgc-strat-txt">SEO Optimization</span></div><div class="sgc-strat-item"><span class="sgc-check pending"></span><span class="sgc-strat-txt">Social Campaign</span></div></div></div></div></div>
        </div>
      </div>`;
  }

  function findOfferSection() {
    const nodes = Array.from(document.querySelectorAll('section, div'));
    return nodes.find(el => {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      return text.includes('What I Offer') && text.includes('Explore My Services') && (/made for local/i.test(text) || /focused marketing/i.test(text));
    });
  }

  function applyOfferRecovery() {
    if (document.documentElement.dataset.sgcOfferRecovery === 'done') return;
    const section = findOfferSection();
    if (!section) return;
    document.documentElement.dataset.sgcOfferRecovery = 'done';
    section.classList.add('sgc-offer-recovery-section');
    section.innerHTML = `
      <div class="sgc-offer-recovery-wrap">
        <div class="sgc-offer-copy">
          <div class="sgc-offer-eyebrow">${offerCopy.eyebrow}</div>
          <h2 class="sgc-offer-title">${offerCopy.title}</h2>
          <p class="sgc-offer-body">${offerCopy.body}</p>
          <a class="sgc-offer-cta sgc-arrow-fixed" href="/services/">${offerCopy.cta}<span class="sgc-arrow-symbol" aria-hidden="true">→</span></a>
          <div class="sgc-offer-callout"><h3>${offerCopy.calloutTitle}</h3><p>${offerCopy.calloutBody}</p></div>
        </div>
        <div class="sgc-offer-orbit-shell">${orbitVisualHTML()}</div>
      </div>`;
  }

  const arrowLabels = [
    'WORK WITH ME', 'VIEW SERVICES', 'EXPLORE MY SERVICES', 'SEE ALL SERVICES',
    'BOOK A CONSULTATION', 'BOOK A CALL', 'VIEW ALL PACKAGES',
    'BOOK A CUSTOM GROWTH PLAN', 'VIEW PACKAGES', 'START YOUR PROJECT',
    'LEARN MORE', 'GET STARTED'
  ];

  function normalizeHomeArrows() {
    const candidates = Array.from(document.querySelectorAll('a, button'));
    candidates.forEach(el => {
      const label = (el.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase().replace(/→/g, '').trim();
      if (!arrowLabels.some(x => label.includes(x))) return;
      el.classList.add('sgc-arrow-fixed');
      if (!el.querySelector('svg') && !el.querySelector('.sgc-arrow-symbol')) {
        const span = document.createElement('span');
        span.className = 'sgc-arrow-symbol';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '→';
        el.appendChild(span);
      }
    });
  }

  function run() {
    applyOfferRecovery();
    normalizeHomeArrows();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  window.addEventListener('load', run, { once: true });
  setTimeout(run, 350);
  setTimeout(run, 1200);
})();
