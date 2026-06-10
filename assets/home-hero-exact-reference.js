(function () {
  'use strict';

  var CALENDLY_URL = 'https://calendly.com/sharpgrowthco';

  function isHomePath() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '';
  }

  function makeHotspot(className, href, label, newTab) {
    var link = document.createElement('a');
    link.className = 'sgc-exact-reference-hotspot ' + className;
    link.dataset.sgcExactClass = className;
    link.dataset.sgcExactLabel = label;
    link.dataset.sgcExactHref = href;
    link.href = href;
    link.setAttribute('aria-label', label);
    link.textContent = label.replace(' — Contact Page', '');
    if (newTab) {
      link.dataset.sgcExactTarget = '_blank';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    return link;
  }

  function normalizeHotspots() {
    document.querySelectorAll('.sgc-exact-reference-hotspot').forEach(function (link) {
      var className = link.dataset.sgcExactClass;
      var label = link.dataset.sgcExactLabel;
      var href = link.dataset.sgcExactHref;
      if (className === 'sgc-exact-laptop-work' || className === 'sgc-exact-hero-book') {
        href = '/contact/';
        label = 'Work with Me';
        link.dataset.sgcExactHref = '/contact/';
        link.dataset.sgcExactLabel = 'Work with Me';
      }
      if (className) link.className = 'sgc-exact-reference-hotspot ' + className;
      if (label) {
        var visibleLabel = label.replace(' — Contact Page', '');
        link.setAttribute('aria-label', label);
        link.textContent = visibleLabel;
      }
      if (href) link.href = href;
      if (link.dataset.sgcExactTarget === '_blank') {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    });
  }

  function buildHero() {
    var hero = document.createElement('section');
    hero.className = 'sgc-exact-reference-hero';
    hero.setAttribute('aria-label', 'Sharp Growth Co. marketing hero');

    var links = [
      ['sgc-exact-logo', '/', 'Sharp Growth Co. Home', false],
      ['sgc-exact-home', '/', 'Home', false],
      ['sgc-exact-services', '/services/', 'My Services', false],
      ['sgc-exact-work', '/work/', 'My Work', false],
      ['sgc-exact-about', '/about/', 'About', false],
      ['sgc-exact-packages', '/packages/', 'Packages', false],
      ['sgc-exact-contact', '/contact/', 'Contact', false],
      ['sgc-exact-header-book', CALENDLY_URL, 'Book a Consultation', true],
      ['sgc-exact-laptop-work', '/contact/', 'Work with Me', false],
      ['sgc-exact-hero-book', '/contact/', 'Work with Me', false],
      ['sgc-exact-hero-services', '/services/', 'View Services', false]
    ];

    links.forEach(function (item) {
      hero.appendChild(makeHotspot(item[0], item[1], item[2], item[3]));
    });

    var shimmerPhrase = document.createElement('span');
    shimmerPhrase.className = 'sgc-exact-hero-shimmer-phrase';
    shimmerPhrase.setAttribute('aria-hidden', 'true');

    var shimmerText = 'impossible to ignore.';
    var shimmerCharacters = shimmerText.split('');
    var shimmerSteps = shimmerCharacters.filter(function (character) {
      return character !== ' ';
    }).length;
    var shimmerStep = shimmerSteps - 1;

    shimmerCharacters.forEach(function (character) {
      var letter = document.createElement('span');
      letter.className = character === ' ' ? 'sgc-exact-hero-shimmer-space' : 'sgc-exact-hero-shimmer-letter';
      letter.textContent = character === ' ' ? '\u00a0' : character;
      if (character !== ' ') {
        letter.style.setProperty('--sgc-shimmer-step', shimmerStep);
        shimmerStep -= 1;
      }
      shimmerPhrase.appendChild(letter);
    });

    hero.appendChild(shimmerPhrase);

    return hero;
  }

  function applyExactHero() {
    if (!isHomePath() || document.querySelector('.sgc-exact-reference-hero')) return;

    document.body.classList.add('sgc-home-exact-reference');

    var root = document.querySelector('#root');
    var app = document.querySelector('#root > .min-h-screen') || root;
    if (!app) return;

    var hero = buildHero();
    var firstSection = app.querySelector('section');
    if (firstSection && firstSection.parentNode === app) {
      app.insertBefore(hero, firstSection);
      firstSection.setAttribute('data-sgc-replaced-by-exact-reference', 'true');
      firstSection.style.display = 'none';
    } else {
      app.insertBefore(hero, app.firstChild);
    }
    normalizeHotspots();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyExactHero);
  } else {
    applyExactHero();
  }

  var tries = 0;
  var timer = window.setInterval(function () {
    tries += 1;
    applyExactHero();
    normalizeHotspots();
    if (document.querySelector('.sgc-exact-reference-hero') && tries > 8) {
      window.clearInterval(timer);
    }
    if (tries > 60) window.clearInterval(timer);
  }, 75);

  [250, 750, 1500, 3000, 6000].forEach(function (delay) {
    window.setTimeout(normalizeHotspots, delay);
  });

  var guardTicks = 0;
  var guardTimer = window.setInterval(function () {
    guardTicks += 1;
    normalizeHotspots();
    if (guardTicks > 80) window.clearInterval(guardTimer);
  }, 250);

  var observerScheduled = false;
  var observer = new MutationObserver(function (mutations) {
    var shouldNormalize = mutations.some(function (mutation) {
      return mutation.target && mutation.target.classList && mutation.target.classList.contains('sgc-exact-reference-hotspot');
    });
    if (!shouldNormalize || observerScheduled) return;
    observerScheduled = true;
    window.requestAnimationFrame(function () {
      observerScheduled = false;
      normalizeHotspots();
    });
  });

  function observeExactHero() {
    var hero = document.querySelector('.sgc-exact-reference-hero');
    if (hero) {
      observer.observe(hero, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-label', 'href', 'target', 'rel']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeExactHero);
  } else {
    observeExactHero();
  }
  window.setTimeout(observeExactHero, 500);
})();
