(() => {
  const VERSION = 'my-work-process-overlay-20260602';
  const TESTIMONIAL_VIDEO_SRC = '/assets/videos/gather-grow-testimonial-website-screen-recording.mp4';
  const STORY_IMAGE_SRC = '/assets/images/alberta-marketing-agency-mountain-banner-local-business-growth.webp';

  const isHome = () => ['/', '/index.html', ''].includes(window.location.pathname);
  const isWork = () => window.location.pathname.replace(/\/+$/, '') === '/work';

  const sectionContainingText = (text) => {
    const candidates = Array.from(document.querySelectorAll('section'));
    return candidates.find((section) => section.textContent && section.textContent.includes(text));
  };

  const ensureMyWorkNav = () => {
    const navs = Array.from(document.querySelectorAll('nav, header'));
    navs.forEach((nav) => {
      const links = Array.from(nav.querySelectorAll('a'));
      if (!links.length || links.some((link) => /my work/i.test(link.textContent || '') || (link.getAttribute('href') || '').includes('/work'))) return;
      const servicesLink = links.find((link) => /services/i.test(link.textContent || ''));
      const aboutLink = links.find((link) => /about/i.test(link.textContent || ''));
      const reference = servicesLink || aboutLink || links[0];
      if (!reference || !reference.parentElement) return;
      const clone = reference.cloneNode(true);
      clone.href = '/work/';
      clone.removeAttribute('aria-current');
      clone.querySelectorAll('*').forEach((child) => child.removeAttribute('aria-current'));
      if (clone.children.length) {
        const textNode = Array.from(clone.querySelectorAll('*')).reverse().find((el) => (el.textContent || '').trim());
        if (textNode) textNode.textContent = 'My Work';
        else clone.textContent = 'My Work';
      } else {
        clone.textContent = 'My Work';
      }
      reference.insertAdjacentElement('afterend', clone);
    });
  };

  const hideMovedHomeSections = () => {
    if (!isHome()) return;
    ['Proudly Alberta', 'My Process', 'Client Success Story'].forEach((label) => {
      const section = sectionContainingText(label);
      if (section) {
        section.setAttribute('data-moved-to-my-work', label);
        section.style.display = 'none';
      }
    });
  };

  const enhanceWorkHero = () => {
    if (!isWork()) return;
    const hero = sectionContainingText('Work that speaks for itself.');
    if (!hero || hero.dataset.sgcWorkHeroEnhanced === VERSION) return;
    hero.dataset.sgcWorkHeroEnhanced = VERSION;
    hero.classList.add('sgc-work-hero-banner');

    const label = hero.querySelector('.section-label');
    if (label) label.textContent = 'My Work';

    const paragraph = Array.from(hero.querySelectorAll('p')).find((node) => /Explore brand direction/i.test(node.textContent || ''));
    if (paragraph) {
      paragraph.textContent = 'A closer look at real client transformation, local strategy, and the process behind polished digital work for Alberta businesses.';
    }
  };

  const hideOriginalWorkPortfolioSections = () => {
    if (!isWork()) return;
    Array.from(document.querySelectorAll('section')).forEach((section) => {
      const text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      const isFilterBar = text === 'All Website Design Social Media Brand Strategy Events & Promotions Content Creation' ||
        (text.includes('All') && text.includes('Website Design') && text.includes('Content Creation') && !text.includes('Client Success Story') && text.length < 160);
      const isPortfolioGrid = text.includes('Bloom Wellness Studio') || text.includes('The Local Kitchen') || text.includes('Grand Opening Campaign') || text.includes('Founder Content Series') || text.includes('Real Estate Professional');
      const isShortFeedback = text.includes('CLIENT FEEDBACK') || text.includes('Jenna completely exceeded my expectations') || text.includes('Ready to be my next success story?');
      if (isFilterBar || isPortfolioGrid || isShortFeedback) {
        section.setAttribute('data-sgc-removed-work-portfolio', VERSION);
        section.style.display = 'none';
        section.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const safelyPlay = (video) => {
    if (!video) return;
    const playPromise = video.play?.();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
  };

  const prepareStoryVideo = () => {
    if (!isWork()) return;
    const video = document.querySelector('.sgc-full-story-laptop video');
    if (!video || video.dataset.sgcFullStoryVideoReady === 'true') return;
    video.dataset.sgcFullStoryVideoReady = 'true';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      safelyPlay(video);
    });
    video.addEventListener('pause', () => {
      if (!document.hidden && !video.ended) safelyPlay(video);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) safelyPlay(video);
    });
    safelyPlay(video);
  };

  const buildMyWorkSections = () => {
    if (!isWork() || document.querySelector('[data-sgc-my-work-restructure]')) return;
    const footer = document.querySelector('footer');
    const root = document.querySelector('#root');
    const mountParent = footer && footer.parentElement ? footer.parentElement : root;
    if (!mountParent) return;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-sgc-my-work-restructure', VERSION);
    wrapper.className = 'sgc-my-work-page-sections';
    wrapper.innerHTML = `
      <section class="sgc-work-testimonial sgc-full-story-section" aria-labelledby="sgc-work-testimonial-heading">
        <div class="sgc-work-container">
          <div class="sgc-work-centered sgc-testimonial-heading-wrap">
            <p class="sgc-work-label">Client Success Story</p>
            <div class="sgc-work-rule"></div>
            <h2 id="sgc-work-testimonial-heading">Real results for real businesses</h2>
          </div>

          <article class="sgc-full-story-card">
            <div class="sgc-full-story-grid">
              <div class="sgc-full-story-copy">
                <div class="sgc-full-story-quote-mark" aria-hidden="true">“</div>
                <p class="sgc-full-story-eyebrow">Client Testimonial</p>
                <div class="sgc-full-story-rule"></div>
                <div class="sgc-full-story-text">
                  <p>Working with Jenna at Sharp Growth Co. was honestly one of the best business decisions I've made for Gather &amp; Grow. From the very beginning, she completely understood my vision and brought it to life in a way that exceeded every expectation I had.</p>
                  <p>She created a stunning custom website for my business that feels incredibly professional, modern, and perfectly aligned with my brand. On top of that, she designed beautiful promotional flyers, helped integrate and brand an easy-to-use booking website that made everything feel seamless for both myself and my clients.</p>
                  <p>What impressed me most was her dedication and work ethic. I was on a very tight timeline, and Jenna went above and beyond to make sure every detail was completed quickly without sacrificing quality. She was responsive, creative, organized, and truly cared about making everything perfect.</p>
                  <p>I've received so many compliments on my website and branding already, and I finally feel confident sending people to my business online. If you're looking for someone who is talented, professional, reliable, and genuinely passionate about helping businesses grow, Jenna is the one.</p>
                  <p>I cannot recommend Jenna and Sharp Growth Co. enough.</p>
                </div>
                <p class="sgc-full-story-author">— Laine Mackay, Founder, Gather and Grow</p>
                <div class="sgc-full-story-bottom-visual">
                  <img src="${STORY_IMAGE_SRC}" alt="Alberta marketing agency portfolio banner showing a local brand and community growth project." loading="lazy">
                </div>
              </div>

              <div class="sgc-full-story-visual" aria-label="Gather and Grow website video preview">
                <div class="gold-growth-animation" aria-hidden="true">
                  <svg class="gold-botanical-svg" viewBox="0 0 460 820" preserveAspectRatio="xMidYMax meet" focusable="false">
                    <defs>
                      <linearGradient id="sgcGoldStem" x1="0" x2="0" y1="1" y2="0">
                        <stop offset="0" stop-color="#8f6428" stop-opacity="0.72"/>
                        <stop offset="0.38" stop-color="#d4af37" stop-opacity="0.92"/>
                        <stop offset="0.72" stop-color="#fff0ad" stop-opacity="0.74"/>
                        <stop offset="1" stop-color="#c8962f" stop-opacity="0.48"/>
                      </linearGradient>
                      <radialGradient id="sgcGoldGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0" stop-color="#fff4bd" stop-opacity="0.92"/>
                        <stop offset="0.33" stop-color="#d4af37" stop-opacity="0.34"/>
                        <stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
                      </radialGradient>
                      <radialGradient id="sgcLeafGold" cx="42%" cy="36%" r="72%">
                        <stop offset="0" stop-color="#fff1ad" stop-opacity="0.72"/>
                        <stop offset="0.62" stop-color="#c8952e" stop-opacity="0.42"/>
                        <stop offset="1" stop-color="#6f4a1d" stop-opacity="0.18"/>
                      </radialGradient>
                    </defs>
                    <g class="botanical-glow">
                      <circle cx="230" cy="748" r="84"/>
                      <circle cx="230" cy="562" r="74"/>
                      <circle cx="230" cy="330" r="58"/>
                      <circle cx="230" cy="62" r="44"/>
                    </g>
                    <g class="botanical-stems">
                      <path class="stem stem-main" pathLength="1" d="M230 788 C226 724 239 671 226 611 C213 552 234 512 230 459 C225 392 217 346 226 283 C235 215 226 158 234 96 C238 64 247 36 238 10"/>
                      <path class="stem stem-left-low" pathLength="1" d="M229 706 C178 689 151 650 165 613 C179 577 216 574 227 531"/>
                      <path class="stem stem-right-low" pathLength="1" d="M231 676 C286 655 311 609 289 574 C268 540 237 546 231 497"/>
                      <path class="stem stem-left-mid" pathLength="1" d="M228 520 C171 500 145 452 169 417 C191 383 225 397 229 346"/>
                      <path class="stem stem-right-mid" pathLength="1" d="M231 458 C289 439 315 395 292 359 C272 328 239 338 231 292"/>
                      <path class="stem stem-left-upper" pathLength="1" d="M230 270 C184 249 165 207 190 174 C211 148 232 152 235 110"/>
                      <path class="stem stem-right-upper" pathLength="1" d="M233 250 C285 230 309 188 285 151 C265 120 240 133 238 83"/>
                      <path class="curl curl-base-left" pathLength="1" d="M225 696 C175 681 155 739 196 746 C229 752 234 712 202 714"/>
                      <path class="curl curl-base-right" pathLength="1" d="M232 631 C289 620 309 674 265 685 C232 693 225 652 258 653"/>
                      <path class="curl curl-card" pathLength="1" d="M228 548 C279 532 291 483 253 478 C223 474 218 515 249 512"/>
                      <path class="curl curl-laptop-left" pathLength="1" d="M230 332 C178 313 169 263 205 259 C235 255 239 295 211 293"/>
                      <path class="curl curl-laptop-right" pathLength="1" d="M235 170 C284 155 294 105 255 102 C226 99 222 137 249 137"/>
                      <path class="curl curl-top-left" pathLength="1" d="M235 88 C194 78 192 30 226 35 C254 39 252 72 221 67"/>
                      <path class="curl curl-top-right" pathLength="1" d="M238 56 C280 41 287 -1 251 0 C225 1 221 33 247 31"/>
                    </g>
                    <g class="botanical-leaves">
                      <path class="leaf leaf-1" d="M165 612 C130 596 125 564 170 575 C190 580 187 604 165 612Z"/>
                      <path class="leaf leaf-2" d="M287 574 C326 556 335 522 289 535 C270 540 267 564 287 574Z"/>
                      <path class="leaf leaf-3" d="M170 417 C135 404 130 373 172 384 C190 389 190 411 170 417Z"/>
                      <path class="leaf leaf-4" d="M292 359 C329 343 337 312 293 322 C274 326 273 350 292 359Z"/>
                      <path class="leaf leaf-5" d="M190 174 C158 162 155 134 192 143 C209 147 209 169 190 174Z"/>
                      <path class="leaf leaf-6" d="M285 151 C319 136 325 108 287 117 C270 121 267 143 285 151Z"/>
                      <path class="leaf leaf-7" d="M206 260 C176 248 174 224 207 231 C222 234 222 253 206 260Z"/>
                      <path class="leaf leaf-8" d="M254 103 C284 91 289 66 255 73 C240 76 238 96 254 103Z"/>
                      <path class="leaf leaf-9" d="M225 36 C200 26 198 7 227 12 C240 15 240 31 225 36Z"/>
                      <path class="leaf leaf-10" d="M250 1 C276 -8 281 -30 251 -25 C238 -22 237 -5 250 1Z"/>
                    </g>
                    <g class="botanical-lights">
                      <circle class="light light-1" cx="230" cy="744" r="4"/>
                      <circle class="light light-2" cx="228" cy="558" r="3.2"/>
                      <circle class="light light-3" cx="232" cy="330" r="2.9"/>
                      <circle class="light light-4" cx="236" cy="62" r="3.6"/>
                      <circle class="light light-5" cx="169" cy="608" r="2"/>
                      <circle class="light light-6" cx="290" cy="358" r="1.9"/>
                      <circle class="light light-7" cx="254" cy="102" r="2.1"/>
                      <circle class="light light-8" cx="206" cy="260" r="1.8"/>
                    </g>
                  </svg>
                  <div class="gold-pot"></div>
                  <span class="sparkle s1">✦</span>
                  <span class="sparkle s2">✧</span>
                  <span class="sparkle s3">✦</span>
                  <span class="sparkle s4">✧</span>
                  <span class="sparkle s5">✦</span>
                  <span class="sparkle s6">✧</span>
                  <span class="sparkle s7">✦</span>
                </div>
                <div class="sgc-full-story-laptop">
                  <div class="sgc-full-story-browser-bar" aria-hidden="true">
                    <span></span><span></span><span></span>
                    <div>gatherandgrow.ca</div>
                  </div>
                  <div class="sgc-full-story-screen">
                    <video src="${TESTIMONIAL_VIDEO_SRC}" autoplay muted loop playsinline preload="auto"></video>
                  </div>
                </div>
                <div class="sgc-full-story-project-note">
                  <p class="sgc-full-story-eyebrow">Featured Project</p>
                  <h3>Gather &amp; Grow</h3>
                  <p>Custom website design, branded booking integration, and promotional assets built on a tight launch timeline.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="sgc-work-alberta" aria-labelledby="sgc-work-alberta-heading">
        <div class="sgc-work-bg" aria-hidden="true"></div>
        <div class="sgc-work-overlay" aria-hidden="true"></div>
        <div class="sgc-work-container sgc-work-split">
          <div>
            <p class="sgc-work-label sgc-on-dark">Proudly Alberta</p>
            <div class="sgc-work-rule"></div>
            <h2 id="sgc-work-alberta-heading">Built here.<br>Built for here.</h2>
            <p>I'm not a faceless agency. I'm a local Alberta-based marketing expert who has studied marketing formally, built an engaged social media audience from scratch, and helped businesses grow through strategy that actually fits their market.</p>
            <p>Whether you're a boutique in Okotoks, a restaurant in Calgary, or a small business in Edmonton — I know this landscape intimately.</p>
          </div>
          <ul class="sgc-work-list" aria-label="Proudly Alberta highlights">
            <li>Deep roots in the Alberta business community</li>
            <li>Experience across restaurants, salons, spas, real estate, schools, and service-based businesses</li>
            <li>Local insight paired with polished, strategic execution</li>
            <li>Every strategy is built for real people in real communities</li>
          </ul>
        </div>
        <div class="sgc-work-container">
          <div class="sgc-alberta-stat-row" aria-label="Marketing growth statistics">
            <article>
              <strong>70%</strong>
              <span>Of small business owners say lack of marketing expertise is their #1 barrier to growth</span>
            </article>
            <article>
              <strong>67%</strong>
              <span>More leads per month with an active content strategy</span>
            </article>
            <article>
              <strong>$42</strong>
              <span>Returned for every $1 spent on email marketing</span>
            </article>
            <article>
              <strong>2×</strong>
              <span>Faster growth when marketing is handled by an expert</span>
            </article>
          </div>
        </div>
      </section>

      <section class="sgc-work-process" aria-labelledby="sgc-work-process-heading">
        <div class="sgc-work-process-bg" aria-hidden="true"></div>
        <div class="sgc-work-container sgc-work-process-shell">
          <div class="sgc-work-process-heading-panel" data-sgc-process-reveal>
            <p class="sgc-work-label sgc-on-dark">My Process</p>
            <div class="sgc-work-rule"></div>
            <h2 id="sgc-work-process-heading">How I work with you — directly</h2>
            <p class="sgc-work-process-intro">A focused, hands-on process designed to move your marketing from scattered to strategic without adding another layer of agency complexity.</p>
          </div>
          <div class="sgc-process-grid" aria-label="Sharp Growth Co. four-step client process">
            <article data-sgc-process-reveal><span>01</span><div><h3>Discover</h3><p>I audit your current marketing, research your market, and identify the exact opportunities that will move the needle for your specific business.</p></div></article>
            <article data-sgc-process-reveal><span>02</span><div><h3>Strategize</h3><p>I build a clear, custom roadmap with priorities and timelines — no jargon, no fluff. Just a focused plan you can actually act on.</p></div></article>
            <article data-sgc-process-reveal><span>03</span><div><h3>Execute</h3><p>I personally handle execution — filming, editing, writing, posting, optimizing. You stay focused on your business while I handle the marketing.</p></div></article>
            <article data-sgc-process-reveal><span>04</span><div><h3>Optimize</h3><p>I track what's working, report back clearly, and continuously refine your strategy so results keep improving month after month.</p></div></article>
          </div>
        </div>
      </section>
    `;

    const hero = document.querySelector('.sgc-work-hero-banner');
    const readySection = sectionContainingText('Ready to Begin');
    if (hero && hero.parentElement) hero.insertAdjacentElement('afterend', wrapper);
    else if (readySection) readySection.insertAdjacentElement('beforebegin', wrapper);
    else if (footer) footer.insertAdjacentElement('beforebegin', wrapper);
    else mountParent.appendChild(wrapper);

    prepareStoryVideo();
  };

  let processRevealReady = false;
  const enableSubtleBackgroundParallax = () => {
    if (!isWork() || processRevealReady) return;
    processRevealReady = true;

    const revealItems = Array.from(document.querySelectorAll('[data-sgc-process-reveal]'));
    if (!revealItems.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('sgc-process-is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sgc-process-is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item, index) => {
      item.style.setProperty('--sgc-process-delay', `${Math.min(index * 90, 360)}ms`);
      observer.observe(item);
    });
  };

  const run = () => {
    ensureMyWorkNav();
    hideMovedHomeSections();
    enhanceWorkHero();
    hideOriginalWorkPortfolioSections();
    buildMyWorkSections();
    prepareStoryVideo();
    enableSubtleBackgroundParallax();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.addEventListener('load', run);
  let attempts = 0;
  const interval = window.setInterval(() => {
    run();
    attempts += 1;
    if (attempts > 24) window.clearInterval(interval);
  }, 250);
})();
