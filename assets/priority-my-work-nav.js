(() => {
  const VERSION = 'priority-my-work-nav-20260602-safe1';
  const WORK_HREF = '/work/';
  const TARGET_LABEL = 'My Work';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function setLinkText(link, text) {
    const textElement = Array.from(link.querySelectorAll('*')).reverse().find((node) => normalize(node.textContent));
    if (textElement) {
      if (textElement.textContent !== text) textElement.textContent = text;
      return;
    }
    if (link.textContent !== text) link.textContent = text;
  }

  function isWorkLink(link) {
    const label = normalize(link.textContent || link.getAttribute('aria-label'));
    const href = (link.getAttribute('href') || '').toLowerCase();
    return label === 'my work' || label === 'work' || href === '/work' || href === '/work/';
  }

  function restoreMyWorkNav() {
    document.querySelectorAll('header nav, header, nav').forEach((nav) => {
      const links = Array.from(nav.querySelectorAll('a'));
      if (!links.length) return;

      const existing = links.find(isWorkLink);

      if (existing) {
        if (existing.getAttribute('href') !== WORK_HREF) existing.setAttribute('href', WORK_HREF);
        if (normalize(existing.textContent) === 'work') setLinkText(existing, TARGET_LABEL);
        if (existing.getAttribute('aria-label') !== 'View My Work') existing.setAttribute('aria-label', 'View My Work');
        existing.dataset.sgcPriorityMyWorkNav = VERSION;
        return;
      }

      const aboutLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'about');
      const packagesLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'packages');
      const servicesLink = links.find((link) => normalize(link.textContent || link.getAttribute('aria-label')) === 'services');
      const reference = aboutLink || servicesLink || packagesLink || links[0];
      if (!reference || !reference.parentElement) return;

      const clone = reference.cloneNode(true);
      clone.setAttribute('href', WORK_HREF);
      clone.removeAttribute('aria-current');
      clone.removeAttribute('data-state');
      clone.querySelectorAll('[aria-current], [data-state]').forEach((node) => {
        node.removeAttribute('aria-current');
        node.removeAttribute('data-state');
      });
      setLinkText(clone, TARGET_LABEL);
      clone.setAttribute('aria-label', 'View My Work');
      clone.dataset.sgcPriorityMyWorkNav = VERSION;

      if (aboutLink) aboutLink.insertAdjacentElement('afterend', clone);
      else if (servicesLink) servicesLink.insertAdjacentElement('afterend', clone);
      else if (packagesLink) packagesLink.insertAdjacentElement('beforebegin', clone);
      else reference.insertAdjacentElement('afterend', clone);
    });
  }

  function scheduleRestore(delay) {
    window.setTimeout(() => window.requestAnimationFrame(restoreMyWorkNav), delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scheduleRestore(0), { once: true });
  } else {
    scheduleRestore(0);
  }

  window.addEventListener('load', () => scheduleRestore(0), { once: true });
  [100, 300, 800, 1600, 3200].forEach(scheduleRestore);
})();
