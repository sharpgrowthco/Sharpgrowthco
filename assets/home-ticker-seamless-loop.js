(function () {
  'use strict';

  var WORDS = ['Strategy', 'Content Creation', 'Web Design', 'Social Media', 'Brand Growth', 'Events', 'Visibility'];
  var REPEATS_PER_HALF = 4;

  function makeWord(word) {
    var span = document.createElement('span');
    span.className = 'text-sm font-medium tracking-widest uppercase sgc-seamless-ticker-word';
    span.style.fontFamily = 'Outfit, sans-serif';
    span.style.color = 'oklch(0.985 0.008 85)';
    span.appendChild(document.createTextNode(word + ' '));

    var dot = document.createElement('span');
    dot.className = 'mx-3 opacity-60 sgc-seamless-ticker-dot';
    dot.textContent = '·';
    span.appendChild(dot);

    return span;
  }

  function appendSequence(target) {
    for (var repeat = 0; repeat < REPEATS_PER_HALF; repeat += 1) {
      WORDS.forEach(function (word) {
        target.appendChild(makeWord(word));
      });
    }
  }

  function enhanceTicker() {
    var strip = document.querySelector('.sgc-home-hero-ticker-strip, [data-sgc-home-hero-ticker="true"]');
    if (!strip) {
      return false;
    }

    var track = strip.querySelector('.flex.whitespace-nowrap') || strip.firstElementChild;
    if (!track) {
      return false;
    }

    if (track.dataset.sgcSeamlessTicker === 'true') {
      return true;
    }

    var halfOne = document.createElement('span');
    halfOne.className = 'sgc-seamless-ticker-half';
    halfOne.setAttribute('aria-hidden', 'false');
    appendSequence(halfOne);

    var halfTwo = document.createElement('span');
    halfTwo.className = 'sgc-seamless-ticker-half';
    halfTwo.setAttribute('aria-hidden', 'true');
    appendSequence(halfTwo);

    track.textContent = '';
    track.appendChild(halfOne);
    track.appendChild(halfTwo);
    track.dataset.sgcSeamlessTicker = 'true';
    track.setAttribute('aria-label', WORDS.join(', '));
    track.classList.add('sgc-seamless-ticker-track');
    strip.classList.add('sgc-seamless-ticker-strip');
    return true;
  }

  function scheduleEnhancement() {
    window.requestAnimationFrame(function () {
      enhanceTicker();
      window.setTimeout(enhanceTicker, 250);
      window.setTimeout(enhanceTicker, 900);
      window.setTimeout(enhanceTicker, 1800);
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
