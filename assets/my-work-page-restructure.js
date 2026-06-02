(() => {
  const VERSION = 'my-work-stats-parallax-20260602';
  const TESTIMONIAL_VIDEO_SRC = '/assets/images/testimonial-video-edited_45aa1248.mp4';
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
        <div class="sgc-work-container sgc-work-centered">
          <p class="sgc-work-label">My Process</p>
          <div class="sgc-work-rule"></div>
          <h2 id="sgc-work-process-heading">How I work with you — directly</h2>
          <div class="sgc-process-grid">
            <article><span>01</span><h3>Discover</h3><p>I get clear on your goals, audience, offers, and what your business needs most right now.</p></article>
            <article><span>02</span><h3>Strategize</h3><p>I map the creative direction, messaging, and execution plan so every piece has a purpose.</p></article>
            <article><span>03</span><h3>Execute</h3><p>I build the assets, content, pages, and systems with direct communication from start to finish.</p></article>
            <article><span>04</span><h3>Optimize</h3><p>I refine what we launch so your marketing keeps feeling aligned, polished, and measurable.</p></article>
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

  let parallaxReady = false;
  const enableSubtleBackgroundParallax = () => {
    if (!isWork() || parallaxReady || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    parallaxReady = true;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const update = () => {
      const viewportCenter = window.innerHeight / 2;
      const alberta = document.querySelector('.sgc-work-alberta');
      const process = document.querySelector('.sgc-work-process');

      if (alberta) {
        const rect = alberta.getBoundingClientRect();
        const offset = clamp((rect.top + rect.height / 2 - viewportCenter) * -0.035, -26, 26);
        alberta.style.setProperty('--sgc-alberta-parallax-y', `${offset.toFixed(2)}px`);
      }

      if (process) {
        const rect = process.getBoundingClientRect();
        const offset = clamp((rect.top + rect.height / 2 - viewportCenter) * -0.032, -24, 24);
        process.style.setProperty('--sgc-process-parallax-y', `${offset.toFixed(2)}px`);
      }
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
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
