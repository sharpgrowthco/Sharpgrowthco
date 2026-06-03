(function () {
  'use strict';

  var VERSION = 'sitewide-footer-20260603';
  var footerMarkup = [
    '<footer class="site-footer sgc-compact-footer" data-sgc-footer-update="' + VERSION + '">',
    '  <div class="footer-top">',
    '    <div class="footer-brand">',
    '      <a href="/" class="footer-logo" aria-label="Sharp Growth Co. home">Sharp Growth Co.</a>',
    '      <span class="footer-tagline">Local Alberta Marketing</span>',
    '    </div>',
    '    <nav aria-label="Footer navigation">',
    '      <ul class="footer-nav">',
    '        <li><a href="/">Home</a></li>',
    '        <li><a href="/services/">Services</a></li>',
    '        <li><a href="/work/">My Work</a></li>',
    '        <li><a href="/about/">About</a></li>',
    '        <li><a href="/packages/">Packages</a></li>',
    '      </ul>',
    '    </nav>',
    '    <a href="/contact/" class="footer-cta sgc-arrow-fixed">Start Your Project<span class="sgc-arrow-symbol" aria-hidden="true">→</span></a>',
    '  </div>',
    '  <div class="footer-bottom">',
    '    <span class="footer-copy">&copy; 2026 Sharp Growth Co. All rights reserved.</span>',
    '    <span class="footer-motto">Marketing that makes your business impossible to ignore.</span>',
    '  </div>',
    '</footer>'
  ].join('');

  function buildFooter() {
    var template = document.createElement('template');
    template.innerHTML = footerMarkup;
    return template.content.firstElementChild;
  }

  function replaceFooter() {
    if (!document.body) return;
    var existing = document.querySelector('footer.sgc-compact-footer');
    if (existing) {
      if (existing.dataset.sgcFooterUpdate !== VERSION) existing.replaceWith(buildFooter());
      Array.prototype.slice.call(document.querySelectorAll('footer:not(.sgc-compact-footer)')).forEach(function (footer) {
        footer.remove();
      });
      return;
    }

    var firstFooter = document.querySelector('footer');
    var newFooter = buildFooter();
    if (firstFooter && firstFooter.parentNode) {
      firstFooter.replaceWith(newFooter);
      Array.prototype.slice.call(document.querySelectorAll('footer:not(.sgc-compact-footer)')).forEach(function (footer) {
        footer.remove();
      });
      return;
    }

    var cta = document.querySelector('[data-sgc-bottom-cta]');
    if (cta && cta.parentNode) {
      cta.insertAdjacentElement('afterend', newFooter);
      return;
    }

    var root = document.getElementById('root');
    if (root && root.parentNode) {
      root.parentNode.insertBefore(newFooter, root.nextSibling);
      return;
    }

    document.body.appendChild(newFooter);
  }

  function schedule() {
    replaceFooter();
    window.setTimeout(replaceFooter, 250);
    window.setTimeout(replaceFooter, 900);
    window.setTimeout(replaceFooter, 1800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('popstate', schedule);
})();
