/* Sharp Growth Co. package CTA classifier — 2026-06-03.
   Tags See Full Details / View Packages CTAs for gold styling, and Content Queen for shine. */
(() => {
  const normalize = (value) => (value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*→\s*$/, '')
    .trim()
    .toLowerCase();

  const goldCtaLabels = new Set([
    'see full details',
    'view full packages & pricing',
    'view full packages and pricing',
    'view packages & pricing',
    'view packages and pricing'
  ]);

  function markPackageButtons() {
    document.querySelectorAll('a, button').forEach((element) => {
      const label = normalize(element.textContent || element.innerText);
      const href = (element.getAttribute('href') || '').toLowerCase();
      const context = normalize(
        element.parentElement?.closest('article, section, li, [class*="card"], [class*="package"], [class*="pricing"], [class*="grid"]')?.textContent || ''
      );

      const shouldBeGold = goldCtaLabels.has(label)
        || (label.includes('see full details') && (context.includes('package') || href.includes('packages')))
        || (label.includes('view full packages') || label.includes('view packages'));

      if (!shouldBeGold) return;

      element.classList.add('sgc-gold-package-cta');
      element.setAttribute('data-sgc-gold-package-cta', 'true');

      if (context.includes('content queen') || context.includes('package 03') || context.includes('most popular')) {
        element.classList.add('sgc-content-queen-shine');
        element.setAttribute('data-sgc-content-queen-shine', 'true');
      }
    });
  }

  function schedule() {
    markPackageButtons();
    requestAnimationFrame(markPackageButtons);
    setTimeout(markPackageButtons, 150);
    setTimeout(markPackageButtons, 600);
    setTimeout(markPackageButtons, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('popstate', schedule);
  window.addEventListener('hashchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
