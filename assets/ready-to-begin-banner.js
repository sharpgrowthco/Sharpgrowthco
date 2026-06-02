(function () {
  'use strict';

  var BANNER_IMAGE = '/assets/images/sharp-growth-co-ready-to-begin-laptop-growth-banner.png';
  var BANNER_LABEL = 'Ready to Begin';
  var BACKGROUND_DESCRIPTION = 'Sharp Growth Co. slim Ready to Begin banner with full laptop growth chart and warm brand background';

  function normalize(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function isServicesPage() {
    return window.location.pathname.replace(/\/+$/, '') === '/services';
  }

  function markPageContext() {
    document.documentElement.classList.toggle('sgc-services-page', isServicesPage());
    document.body.classList.toggle('sgc-services-page', isServicesPage());
  }

  function sectionLooksLikeReadyToBegin(section) {
    if (!section) {
      return false;
    }

    var label = section.querySelector('.section-label');
    var labelText = label ? normalize(label.textContent) : '';
    var headingText = Array.prototype.slice.call(section.querySelectorAll('h1,h2,h3')).map(function (heading) {
      return normalize(heading.textContent);
    }).join(' ');
    var fullText = normalize(section.textContent);

    return labelText === BANNER_LABEL ||
      headingText.indexOf('Ready to grow with intention?') !== -1 ||
      fullText.indexOf(BANNER_LABEL) !== -1;
  }

  function isReadyToBeginSection(section) {
    if (!section || section.dataset.readyToBeginBannerChecked === 'true') {
      return false;
    }

    return sectionLooksLikeReadyToBegin(section);
  }

  function enhanceSection(section) {
    section.classList.add('ready-to-begin-image-banner');
    section.dataset.readyToBeginBannerChecked = 'true';
    section.dataset.backgroundImage = BANNER_IMAGE;
    section.dataset.backgroundImageAlt = BACKGROUND_DESCRIPTION;
    section.setAttribute('aria-label', 'Ready to Begin consultation banner for Sharp Growth Co. Alberta marketing agency');

    var content = section.querySelector('.container');
    if (content) {
      content.classList.add('ready-to-begin-banner-content');
    }
  }

  function createReadyToBeginBanner() {
    var footer = document.querySelector('footer');
    var root = document.querySelector('#root');

    if (!footer || !root) {
      return null;
    }

    var existingInjected = document.querySelector('[data-ready-to-begin-injected="true"]');
    if (existingInjected) {
      if (existingInjected.nextElementSibling !== footer && footer.parentNode) {
        footer.parentNode.insertBefore(existingInjected, footer);
      }
      return existingInjected;
    }

    var section = document.createElement('section');
    section.className = 'ready-to-begin-injected-section';
    section.dataset.readyToBeginInjected = 'true';
    section.innerHTML = [
      '<div class="container ready-to-begin-banner-content">',
      '  <div class="section-label">Ready to Begin</div>',
      '  <h2>Ready to grow with intention?</h2>',
      '  <p>Book a free consultation and let\'s talk about how strategic marketing can help your Alberta business show up, stand out, and scale.</p>',
      '  <div class="ready-to-begin-actions">',
      '    <a class="btn-primary" href="https://calendly.com/sharpgrowthco">Book a Custom Growth Plan</a>',
      '    <a class="btn-gold" href="/packages">View Packages</a>',
      '  </div>',
      '</div>'
    ].join('');

    footer.parentNode.insertBefore(section, footer);
    return section;
  }

  function keepOnlyFirstReadyToBeginSection() {
    var readySections = Array.prototype.slice.call(document.querySelectorAll('section')).filter(sectionLooksLikeReadyToBegin);
    if (readySections.length < 1) {
      return;
    }

    var preferredSection = readySections.filter(function (section) {
      return section.dataset.readyToBeginInjected === 'true';
    })[0] || readySections[readySections.length - 1] || readySections[0];

    readySections.forEach(function (section) {
      if (section === preferredSection) {
        section.classList.add('sgc-ready-to-begin-preferred');
        section.classList.remove('sgc-ready-to-begin-duplicate-hidden');
        section.hidden = false;
        section.style.removeProperty('display');
        section.removeAttribute('aria-hidden');
        delete section.dataset.readyToBeginDuplicateRemoved;
        return;
      }

      section.classList.add('sgc-ready-to-begin-duplicate-hidden');
      section.classList.remove('sgc-ready-to-begin-preferred');
      section.hidden = true;
      section.style.setProperty('display', 'none', 'important');
      section.setAttribute('aria-hidden', 'true');
      section.dataset.readyToBeginDuplicateRemoved = 'true';
    });
  }

  var ctaParallaxReady = false;

  function enableReadyToBeginParallax() {
    if (ctaParallaxReady || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    ctaParallaxReady = true;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function update() {
      var viewportCenter = window.innerHeight / 2;
      document.querySelectorAll('.ready-to-begin-image-banner').forEach(function (section) {
        if (section.classList.contains('sgc-ready-to-begin-duplicate-hidden')) {
          return;
        }
        var rect = section.getBoundingClientRect();
        var offset = clamp((rect.top + rect.height / 2 - viewportCenter) * -0.028, -18, 18);
        section.style.setProperty('--ready-cta-parallax-y', offset.toFixed(2) + 'px');
      });
    }

    var ticking = false;
    function requestUpdate() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
  }

  function enhanceReadyToBeginBanners() {
    markPageContext();
    var created = createReadyToBeginBanner();

    document.querySelectorAll('section').forEach(function (section) {
      if (isReadyToBeginSection(section)) {
        enhanceSection(section);
      }
    });

    if (created) {
      enhanceSection(created);
    }

    keepOnlyFirstReadyToBeginSection();
    enableReadyToBeginParallax();
  }

  function scheduleEnhancement() {
    window.requestAnimationFrame(function () {
      enhanceReadyToBeginBanners();
      window.setTimeout(enhanceReadyToBeginBanners, 250);
      window.setTimeout(enhanceReadyToBeginBanners, 900);
    });
  }

  document.addEventListener('DOMContentLoaded', scheduleEnhancement);
  window.addEventListener('load', scheduleEnhancement);
  window.addEventListener('popstate', scheduleEnhancement);
  document.addEventListener('click', function () {
    window.setTimeout(scheduleEnhancement, 150);
  }, true);

  scheduleEnhancement();
})();
