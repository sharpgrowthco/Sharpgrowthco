(function () {
  'use strict';

  var WORK_HREF = '/work/';
  var WORK_LABEL = 'My Work';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isWorkLink(link) {
    var label = normalize(link.textContent || link.getAttribute('aria-label'));
    var href = (link.getAttribute('href') || '').replace(window.location.origin, '');
    return label === 'my work' || href === '/work' || href === '/work/';
  }

  function makeWorkLink(reference) {
    var link = document.createElement('a');
    link.href = WORK_HREF;
    link.textContent = WORK_LABEL;
    link.setAttribute('aria-label', WORK_LABEL);
    link.className = reference && reference.className ? reference.className : 'sgc-priority-my-work-nav';
    link.classList.add('sgc-priority-my-work-nav', 'sgc-mobile-menu-row');
    link.dataset.sgcPriorityWorkNav = 'true';
    return link;
  }

  function findServicesLink(links) {
    return links.find(function (link) {
      var label = normalize(link.textContent || link.getAttribute('aria-label'));
      var href = (link.getAttribute('href') || '').replace(window.location.origin, '');
      return label === 'my services' || label === 'services' || href === '/services' || href === '/services/';
    });
  }

  function markSeparateMobileRows(services, work) {
    var parent = (work && work.parentElement) || (services && services.parentElement);
    if (parent) parent.classList.add('sgc-mobile-menu-list');
    if (services) {
      services.classList.add('sgc-mobile-menu-row', 'sgc-mobile-services-nav');
      services.style.setProperty('display', 'block', 'important');
      services.style.setProperty('width', '100%', 'important');
      services.style.setProperty('flex-basis', '100%', 'important');
    }
    if (work) {
      work.classList.add('sgc-mobile-menu-row', 'sgc-priority-my-work-nav');
      work.style.setProperty('display', 'block', 'important');
      work.style.setProperty('width', '100%', 'important');
      work.style.setProperty('flex-basis', '100%', 'important');
      work.style.setProperty('margin-left', '0', 'important');
      work.style.setProperty('clear', 'both', 'important');
    }
  }

  function ensureWorkInContainer(container) {
    if (!container || container.dataset.sgcSkipWorkNav === 'true') return;
    var links = Array.prototype.slice.call(container.querySelectorAll('a'));
    if (!links.length) return;

    var existing = links.find(isWorkLink);
    if (existing) {
      existing.href = WORK_HREF;
      existing.textContent = WORK_LABEL;
      existing.setAttribute('aria-label', WORK_LABEL);
      existing.style.removeProperty('display');
      existing.style.removeProperty('visibility');
      existing.style.removeProperty('opacity');
      existing.style.removeProperty('width');
      existing.style.removeProperty('height');
      existing.classList.add('sgc-priority-my-work-nav', 'sgc-mobile-menu-row');
      markSeparateMobileRows(findServicesLink(links), existing);
      return;
    }

    var services = findServicesLink(links);

    if (!services || !services.parentNode) return;
    var work = makeWorkLink(services);
    services.insertAdjacentElement('afterend', work);
    markSeparateMobileRows(services, work);
  }

  function repairExactHero() {
    var hero = document.querySelector('.sgc-exact-reference-hero');
    if (!hero) return;
    var work = hero.querySelector('.sgc-exact-work');
    if (!work) {
      work = document.createElement('a');
      work.className = 'sgc-exact-reference-hotspot sgc-exact-work';
      work.dataset.sgcExactClass = 'sgc-exact-work';
      hero.appendChild(work);
    }
    work.href = WORK_HREF;
    work.textContent = WORK_LABEL;
    work.setAttribute('aria-label', WORK_LABEL);
    work.dataset.sgcExactHref = WORK_HREF;
    work.dataset.sgcExactLabel = WORK_LABEL;
  }

  function repairNavigation() {
    repairExactHero();
    document.querySelectorAll('header nav, header [role="navigation"], header div, .sgc-site-header nav, .sgc-header-nav, nav').forEach(ensureWorkInContainer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repairNavigation);
  } else {
    repairNavigation();
  }

  [100, 300, 750, 1500, 3000, 6000].forEach(function (delay) {
    window.setTimeout(repairNavigation, delay);
  });

  var scheduled = false;
  var observer = new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      repairNavigation();
    });
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.body) startObserver();
  else document.addEventListener('DOMContentLoaded', startObserver);
})();
