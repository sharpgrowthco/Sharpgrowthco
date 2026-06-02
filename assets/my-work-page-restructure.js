(() => {
  const VERSION = 'my-work-page-20260602';
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
      <section class="sgc-work-intro" aria-labelledby="sgc-work-intro-heading">
        <div class="sgc-work-container sgc-work-centered">
          <p class="sgc-work-label">My Work</p>
          <div class="sgc-work-rule"></div>
          <h1 id="sgc-work-intro-heading">Strategy, websites, and content built for Alberta businesses.</h1>
          <p class="sgc-work-lede">A closer look at how I think, build, and partner directly with local business owners to create a digital presence that feels polished, practical, and easy to trust.</p>
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

      <section class="sgc-work-testimonial" aria-labelledby="sgc-work-testimonial-heading">
        <div class="sgc-work-container">
          <div class="sgc-work-centered sgc-testimonial-heading-wrap">
            <p class="sgc-work-label">Client Success</p>
            <div class="sgc-work-rule"></div>
            <h2 id="sgc-work-testimonial-heading">Real results for real businesses</h2>
          </div>
          <article class="sgc-testimonial-card">
            <span class="sgc-quote-mark" aria-hidden="true">“</span>
            <div class="sgc-quote-text">
              <p>Working with Jenna at Sharp Growth Co. was honestly one of the best business decisions I've made for Gather &amp; Grow. She completely understood my vision and brought it to life in a way that exceeded every expectation I had.</p>
              <p>She was responsive, creative, organized, and truly cared about making everything perfect. I've received so many compliments on my website and branding already, and I finally feel confident sending people to my business online.</p>
              <p>I cannot recommend Jenna and Sharp Growth Co. enough.</p>
            </div>
            <div class="sgc-quote-divider"></div>
            <div class="sgc-attribution">
              <div>
                <strong>Laine Mackay</strong>
                <span>Founder, Gather and Grow</span>
              </div>
              <div class="sgc-project-tags" aria-label="Project services">
                <span>Website Design</span>
                <span>Booking Setup</span>
                <span>Branding</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    `;

    const readySection = sectionContainingText('Ready to Begin');
    if (readySection) readySection.insertAdjacentElement('beforebegin', wrapper);
    else if (footer) footer.insertAdjacentElement('beforebegin', wrapper);
    else mountParent.appendChild(wrapper);
  };

  const run = () => {
    ensureMyWorkNav();
    hideMovedHomeSections();
    buildMyWorkSections();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  let attempts = 0;
  const interval = window.setInterval(() => {
    run();
    attempts += 1;
    if (attempts > 20) window.clearInterval(interval);
  }, 250);
})();
