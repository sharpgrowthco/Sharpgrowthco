(() => {
  const VERSION = 'priority-my-work-nav-20260602';
  const WORK_HREF = '/work/';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function setLinkText(link, text) {
    const textElement = Array.from(link.querySelectorAll('*')).reverse().find((node) => normalize(node.textContent));
    if (textElement) {
      textElement.textContent = text;
      return;
    }
    link.textContent = text;
  }

  function restoreMyWorkNav() {
    document.querySelectorAll('header nav, header, nav').forEach((nav) => {
      const links = Array.from(nav.querySelectorAll('a'));
      if (!links.length) return;

      const existing = links.find((link) => {
        const label = normalize(link.textContent || link.getAttribute('aria-label'));
        const href = (link.getAttribute('href') || '').toLowerCase();
        return label === 'my work' || href === '/work' || href === '/work/';
      });

      if (existing) {
        existing.href = WORK_HREF;
        existing.textContent = normalize(existing.textContent) === 'work' ? 'My Work' : existing.textContent;
        existing.dataset.sgcPriorityMyWorkNav = VERSION;
        return;
      }

      const aboutLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'about');
      const packagesLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'packages');
      const servicesLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'services');
      const reference = aboutLink || servicesLink || packagesLink || links[0];
      if (!reference || !reference.parentElement) return;

      const clone = reference.cloneNode(true);
      clone.href = WORK_HREF;
      clone.removeAttribute('aria-current');
      clone.removeAttribute('data-state');
      clone.querySelectorAll('[aria-current], [data-state]').forEach((node) => {
        node.removeAttribute('aria-current');
        node.removeAttribute('data-state');
      });
      setLinkText(clone, 'My Work');
      clone.setAttribute('aria-label', 'View My Work');
      clone.dataset.sgcPriorityMyWorkNav = VERSION;

      if (aboutLink) aboutLink.insertAdjacentElement('afterend', clone);
      else if (servicesLink) servicesLink.insertAdjacentElement('afterend', clone);
      else if (packagesLink) packagesLink.insertAdjacentElement('beforebegin', clone);
      else reference.insertAdjacentElement('afterend', clone);
    });
  }

  let restoreScheduled = false;
  let restoreObserver = null;

  function runRestore() {
    restoreScheduled = false;
    if (restoreObserver) restoreObserver.disconnect();
    restoreMyWorkNav();
    window.requestAnimationFrame(() => {
      restoreMyWorkNav();
      if (restoreObserver) restoreObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
    });
  }

  function scheduleRestore() {
    if (restoreScheduled) return;
    restoreScheduled = true;
    window.requestAnimationFrame(runRestore);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleRestore, { once: true });
  } else {
    scheduleRestore();
  }

  window.addEventListener('load', restoreMyWorkNav, { once: true });
  [100, 300, 800, 1600].forEach((delay) => window.setTimeout(restoreMyWorkNav, delay));

  restoreObserver = new MutationObserver(scheduleRestore);
  restoreObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
