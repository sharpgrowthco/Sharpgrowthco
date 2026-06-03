(function () {
  'use strict';

  var VERSION = 'sitewide-cta-footer-20260603';

  function buildBanner() {
    var section = document.createElement('section');
    section.className = 'ready-to-begin-image-banner ready-to-begin-injected-section sgc-bottom-cta-banner';
    section.dataset.readyToBeginInjected = 'true';
    section.dataset.sgcBottomCta = VERSION;
    section.setAttribute('aria-label', 'Ready to Begin consultation banner for Sharp Growth Co.');
    section.innerHTML = [
      '<div class="ready-to-begin-banner-content">',
      '  <div class="section-label">Ready to Begin</div>',
      '  <h2>Ready to grow with intention?</h2>',
      '  <p>Book a free consultation and let\'s talk about how strategic marketing can help your Alberta business show up, stand out, and scale.</p>',
      '  <div class="ready-to-begin-actions">',
      '    <a class="ready-to-begin-primary sgc-arrow-fixed" href="/contact/">Book a Custom Growth Plan<span class="sgc-arrow-symbol" aria-hidden="true">→</span></a>',
      '    <a class="ready-to-begin-secondary sgc-arrow-fixed" href="/packages/">View Packages<span class="sgc-arrow-symbol" aria-hidden="true">→</span></a>',
      '  </div>',
      '</div>'
    ].join('');
    return section;
  }

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function looksLikeReadyToBegin(node) {
    if (!node || node.nodeType !== 1) return false;
    var text = normalize(node.textContent);
    return /Ready to Begin/i.test(text) || /Ready to grow with intention\?/i.test(text);
  }

  function findExistingBanner() {
    var preferred = document.querySelector('[data-sgc-bottom-cta]');
    if (preferred) return preferred;
    return Array.prototype.slice.call(document.querySelectorAll('section, div')).find(function (node) {
      if (node.matches && node.matches('footer, footer *')) return false;
      return looksLikeReadyToBegin(node) && normalize(node.textContent).length < 1200;
    }) || null;
  }

  function placeBanner(banner) {
    var footer = document.querySelector('footer');
    var root = document.getElementById('root');
    if (footer && footer.parentNode) {
      if (banner.nextElementSibling !== footer) footer.parentNode.insertBefore(banner, footer);
      return;
    }
    if (root && root.parentNode) {
      root.parentNode.insertBefore(banner, root.nextSibling);
      return;
    }
    document.body.appendChild(banner);
  }

  function updateBanner() {
    if (!document.body) return;
    var existing = findExistingBanner();
    var banner = buildBanner();
    if (existing) {
      if (existing.dataset && existing.dataset.sgcBottomCta === VERSION) {
        placeBanner(existing);
      } else {
        existing.replaceWith(banner);
        placeBanner(banner);
      }
    } else {
      placeBanner(banner);
    }

    Array.prototype.slice.call(document.querySelectorAll('section, div')).forEach(function (node) {
      if (node.dataset && node.dataset.sgcBottomCta === VERSION) return;
      if (node.closest && node.closest('[data-sgc-bottom-cta="' + VERSION + '"]')) return;
      if (node.matches && node.matches('footer, footer *')) return;
      if (looksLikeReadyToBegin(node) && normalize(node.textContent).length < 1200) {
        node.classList.add('sgc-ready-to-begin-duplicate-hidden');
        node.hidden = true;
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function schedule() {
    updateBanner();
    window.setTimeout(updateBanner, 250);
    window.setTimeout(updateBanner, 900);
    window.setTimeout(updateBanner, 1800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('popstate', schedule);
})();
