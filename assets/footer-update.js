(() => {
  const VERSION = 'compact-footer-home-pill-20260611';

  const footerMarkup = `
    <footer class="site-footer sgc-compact-footer" data-sgc-footer-update="${VERSION}">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="Sharp Growth Co. home">Sharp Growth Co.</a>
          <span class="footer-tagline">Local Alberta Marketing</span>
        </div>

        <nav aria-label="Footer navigation">
          <ul class="footer-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/work/">My Work</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/packages/">Packages</a></li>
          </ul>
        </nav>

        <a href="/contact/" class="footer-cta sgc-luxury-cta btn-primary-gold">Start Your Project</a>
      </div>

      <div class="footer-bottom">
        <span class="footer-copy">&copy; 2026 Sharp Growth Co. All rights reserved.</span>
        <span class="footer-motto">Marketing that makes your business impossible to ignore.</span>
      </div>
    </footer>
  `;

  const buildFooter = () => {
    const template = document.createElement('template');
    template.innerHTML = footerMarkup.trim();
    return template.content.firstElementChild;
  };

  const replaceFooter = () => {
    const compactFooter = document.querySelector('footer.sgc-compact-footer');
    if (compactFooter) {
      compactFooter.dataset.sgcFooterUpdate = VERSION;
      document.querySelectorAll('footer:not(.sgc-compact-footer)').forEach((footer) => footer.remove());
      return;
    }

    const existingFooter = Array.from(document.querySelectorAll('footer')).find((footer) => !footer.classList.contains('sgc-compact-footer'));
    const newFooter = buildFooter();

    if (existingFooter) {
      existingFooter.replaceWith(newFooter);
      return;
    }

    const appRoot = document.getElementById('root');
    if (appRoot && appRoot.children.length) {
      appRoot.insertAdjacentElement('afterend', newFooter);
    } else {
      document.body.appendChild(newFooter);
    }
  };

  const run = () => replaceFooter();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.addEventListener('load', run);
  let attempts = 0;
  const interval = window.setInterval(() => {
    run();
    attempts += 1;
    if (attempts > 30) window.clearInterval(interval);
  }, 250);
})();
