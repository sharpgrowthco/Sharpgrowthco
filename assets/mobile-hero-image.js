(() => {
  function enhanceHomeHeroImage() {
    if (window.location.pathname !== '/' && window.location.pathname !== '') return;

    const candidates = Array.from(document.images).filter((img) => {
      const src = img.currentSrc || img.src || '';
      const alt = img.alt || '';
      return src.includes('homepage-hero-laptop') || src.includes('HomepageHero') || alt.toLowerCase().includes('homepage hero') || alt.toLowerCase().includes('laptop website design');
    });

    const heroImage = candidates[0];
    if (!heroImage) return;

    heroImage.dataset.sgcHomeHero = 'true';
    heroImage.style.objectFit = window.innerWidth <= 767 ? 'cover' : '';
    heroImage.style.objectPosition = window.innerWidth <= 767 ? 'left center' : '';

    const section = heroImage.closest('section') || heroImage.parentElement;
    document.body.classList.add('sgc-home-luxury-hero');
    if (section) section.classList.add('sgc-mobile-home-hero');
  }

  document.addEventListener('DOMContentLoaded', enhanceHomeHeroImage, { once: true });
  window.addEventListener('load', enhanceHomeHeroImage);
  window.addEventListener('resize', enhanceHomeHeroImage);
  const observer = new MutationObserver(enhanceHomeHeroImage);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceHomeHeroImage();
})();

;(() => {
  const set = (el, prop, val) => el && el.style.setProperty(prop, val, 'important');
  const applyReferenceHeader = () => {
    const header = document.querySelector('header');
    if (!header) return;
    set(header, 'background', 'linear-gradient(180deg, rgba(255,248,240,.98) 0%, rgba(250,240,225,.94) 100%)');
    set(header, 'border', '0');
    set(header, 'border-radius', '0');
    set(header, 'box-shadow', '0 8px 32px rgba(64,42,26,.10), inset 0 -1px 0 rgba(255,255,255,.38)');
    set(header, 'backdrop-filter', 'blur(14px) saturate(1.04)');
    set(header, '-webkit-backdrop-filter', 'blur(14px) saturate(1.04)');
    [header.firstElementChild, header.querySelector('.container')].filter(Boolean).forEach((el) => {
      set(el, 'min-height', innerWidth <= 767 ? '5.5rem' : '7.2rem');
      set(el, 'background', 'transparent');
      set(el, 'border', '0');
      set(el, 'border-radius', '0');
      set(el, 'box-shadow', 'none');
    });
    const nav = header.querySelector('nav, [role="navigation"]');
    if (nav) {
      set(nav, 'display', 'flex');
      set(nav, 'align-items', 'center');
      set(nav, 'gap', innerWidth <= 767 ? '1.2rem' : 'clamp(2rem, 4vw, 4.1rem)');
      set(nav, 'background', 'transparent');
      set(nav, 'border', '0');
      set(nav, 'box-shadow', 'none');
    }
    const order = {'/':'1','/services/':'2','/services':'2','/work/':'3','/work':'3','/about/':'4','/about':'4','/packages/':'5','/packages':'5','/contact/':'6','/contact':'6'};
    header.querySelectorAll('nav a, [role="navigation"] a').forEach((a) => {
      if (order[a.getAttribute('href') || '']) set(a, 'order', order[a.getAttribute('href') || '']);
      ['background','background-image','box-shadow','filter','text-shadow'].forEach((p) => set(a, p, p === 'background' ? 'transparent' : 'none'));
      set(a, 'display', 'inline-flex');
      set(a, 'align-items', 'center');
      set(a, 'justify-content', 'center');
      set(a, 'min-width', '0');
      set(a, 'min-height', '0');
      set(a, 'width', 'auto');
      set(a, 'height', 'auto');
      set(a, 'padding', '0');
      set(a, 'margin', '0');
      set(a, 'border', '0');
      set(a, 'border-radius', '0');
      set(a, 'transform', 'none');
      set(a, 'color', '#2d2118');
      set(a, 'font-family', "'Outfit', 'Raleway', sans-serif");
      set(a, 'font-size', 'clamp(.88rem, 1.05vw, 1.02rem)');
      set(a, 'font-weight', '500');
      set(a, 'line-height', '1');
      set(a, 'letter-spacing', '.02em');
      set(a, 'text-transform', 'none');
    });
    const logoLink = Array.from(header.querySelectorAll('a[href="/"]')).find((candidate) => {
      return !candidate.closest('nav, [role="navigation"]') && /Sharp\s+Growth\s+Co\./i.test(candidate.textContent || '');
    });
    const title = logoLink?.querySelector('span:first-child');
    const sub = logoLink?.querySelector('span:last-child');
    set(title, 'font-size', 'clamp(1.12rem, 1.6vw, 1.45rem)');
    set(title, 'line-height', '.95');
    set(title, 'color', '#23140d');
    set(sub, 'color', 'rgba(105,72,46,.66)');
    set(sub, 'font-size', 'clamp(.46rem, .72vw, .58rem)');
    set(sub, 'line-height', '1.1');
    set(sub, 'letter-spacing', '.19em');
    const cta = header.querySelector('button, a[href*="calendly"]');
    if (cta) {
      set(cta, 'min-height', innerWidth <= 767 ? '3.15rem' : '4.25rem');
      set(cta, 'padding', innerWidth <= 767 ? '0 1.2rem' : '0 2.9rem');
      set(cta, 'border-radius', '999px');
      set(cta, 'border', '1px solid rgba(255,232,182,.76)');
      set(cta, 'background', 'linear-gradient(115deg,#A87524 0%,#D6A642 26%,#EED591 48%,#FFF1C7 56%,#D8AE55 72%,#A87524 100%)');
      set(cta, 'color', '#1F1712');
      set(cta, 'box-shadow', '0 14px 30px rgba(39,24,11,.17), 0 8px 18px rgba(218,171,87,.32), inset 0 1px 0 rgba(255,250,235,.7), inset 0 -1px 0 rgba(116,75,24,.28)');
      set(cta, 'font-family', "'Outfit', 'Raleway', sans-serif");
      set(cta, 'font-size', '.82rem');
      set(cta, 'font-weight', '700');
      set(cta, 'letter-spacing', '.17em');
      set(cta, 'text-transform', 'uppercase');
    }
  };
  addEventListener('DOMContentLoaded', applyReferenceHeader, { once: true });
  addEventListener('load', applyReferenceHeader);
  addEventListener('resize', applyReferenceHeader);
  new MutationObserver(applyReferenceHeader).observe(document.documentElement, { childList: true, subtree: true });
  applyReferenceHeader();
})();

;(() => {
  const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

  function applyHeaderLogoButtonMyWorkFix() {
    const header = document.querySelector('header');
    if (!header) return;

    const logo = Array.from(header.querySelectorAll('a[href="/"]')).find((candidate) => {
      return !candidate.closest('nav, [role="navigation"]') && /Sharp\s+Growth\s+Co\./i.test(candidate.textContent || '');
    });
    if (logo) {
      setImportant(logo, 'flex', '0 0 auto');
      setImportant(logo, 'width', 'auto');
      setImportant(logo, 'max-width', '13rem');
      setImportant(logo, 'padding', '0');
      setImportant(logo, 'margin', '0');
      setImportant(logo, 'gap', '0.12rem');
      setImportant(logo, 'line-height', '1');
      setImportant(logo, 'transform', 'none');
      const logoTitle = logo.querySelector('span:first-child');
      const logoSub = logo.querySelector('span:last-child');
      setImportant(logoTitle, 'font-size', 'clamp(1.05rem, 1.28vw, 1.32rem)');
      setImportant(logoTitle, 'line-height', '0.92');
      setImportant(logoTitle, 'letter-spacing', '-0.035em');
      setImportant(logoTitle, 'max-width', '10.8rem');
      setImportant(logoSub, 'font-size', 'clamp(0.42rem, 0.55vw, 0.54rem)');
      setImportant(logoSub, 'line-height', '1.05');
      setImportant(logoSub, 'letter-spacing', '0.18em');
      setImportant(logoSub, 'white-space', 'nowrap');
    }

    header.querySelectorAll('nav a, [role="navigation"] a').forEach((link) => {
      setImportant(link, 'white-space', 'nowrap');
      setImportant(link, 'word-break', 'keep-all');
      setImportant(link, 'overflow-wrap', 'normal');
      setImportant(link, 'flex', '0 0 auto');
      setImportant(link, 'min-width', 'max-content');
      setImportant(link, 'line-height', '1');
      const label = link.querySelector('span') || link;
      setImportant(label, 'font-family', "'Outfit', sans-serif");
      setImportant(label, 'font-size', 'clamp(.88rem, 1.05vw, 1.02rem)');
      setImportant(label, 'font-weight', '800');
      setImportant(label, 'line-height', '1.08');
      setImportant(label, 'letter-spacing', '.045em');
      setImportant(label, 'color', '#2d2118');
    });

    header.querySelectorAll('nav a[href="/work/"], nav a[href="/work"], [role="navigation"] a[href="/work/"], [role="navigation"] a[href="/work"]').forEach((link) => {
      setImportant(link, 'white-space', 'nowrap');
      setImportant(link, 'min-width', '4.5rem');
    });

    header.querySelectorAll('button').forEach((button) => {
      const inner = button.querySelector('.btn-primary, .btn-gold, [class*="btn-"]');
      const text = (button.textContent || '').toLowerCase();
      if (!inner || !text.includes('consultation')) return;

      setImportant(button, 'background', 'transparent');
      setImportant(button, 'background-image', 'none');
      setImportant(button, 'border', '0');
      setImportant(button, 'box-shadow', 'none');
      setImportant(button, 'padding', '0');
      setImportant(button, 'width', 'auto');
      setImportant(button, 'min-width', '0');
      setImportant(button, 'height', 'auto');
      setImportant(button, 'min-height', '0');
      setImportant(button, 'display', 'inline-flex');
      setImportant(button, 'align-items', 'center');
      setImportant(button, 'justify-content', 'center');

      setImportant(inner, 'width', 'auto');
      setImportant(inner, 'min-width', innerWidth <= 1024 ? '13.5rem' : '16.2rem');
      setImportant(inner, 'height', innerWidth <= 1024 ? '3.75rem' : '4.25rem');
      setImportant(inner, 'min-height', innerWidth <= 1024 ? '3.75rem' : '4.25rem');
      setImportant(inner, 'padding', innerWidth <= 1024 ? '0 1.8rem' : '0 2.9rem');
      setImportant(inner, 'display', 'inline-flex');
      setImportant(inner, 'align-items', 'center');
      setImportant(inner, 'justify-content', 'center');
      setImportant(inner, 'border-radius', '999px');
      setImportant(inner, 'border', '1px solid rgba(255,232,182,0.76)');
      setImportant(inner, 'background', 'linear-gradient(115deg, #A87524 0%, #D6A642 26%, #EED591 48%, #FFF1C7 56%, #D8AE55 72%, #A87524 100%)');
      setImportant(inner, 'box-shadow', '0 14px 30px rgba(39,24,11,0.17), 0 8px 18px rgba(218,171,87,0.32), inset 0 1px 0 rgba(255,250,235,0.7), inset 0 -1px 0 rgba(116,75,24,0.28)');
      setImportant(inner, 'color', '#1F1712');
      setImportant(inner, 'font-family', "'Outfit', 'Raleway', sans-serif");
      setImportant(inner, 'font-size', '0.82rem');
      setImportant(inner, 'font-weight', '700');
      setImportant(inner, 'letter-spacing', '0.17em');
      setImportant(inner, 'line-height', '1');
      setImportant(inner, 'text-transform', 'uppercase');
      setImportant(inner, 'white-space', 'nowrap');
      setImportant(inner, 'transform', 'none');
    });
  }

  document.addEventListener('DOMContentLoaded', applyHeaderLogoButtonMyWorkFix, { once: true });
  window.addEventListener('load', applyHeaderLogoButtonMyWorkFix);
  window.addEventListener('resize', applyHeaderLogoButtonMyWorkFix);
  new MutationObserver(applyHeaderLogoButtonMyWorkFix).observe(document.documentElement, { childList: true, subtree: true });
  applyHeaderLogoButtonMyWorkFix();
})();

;(() => {
  const setImportant = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');

  function applyFinalHeaderLogoAndCtaPolish() {
    const header = document.querySelector('header');
    if (!header) return;

    const logo = Array.from(header.querySelectorAll('a[href="/"]')).find((candidate) => {
      return !candidate.closest('nav, [role="navigation"]') && /Sharp\s+Growth\s+Co\./i.test(candidate.textContent || '');
    });
    if (logo) {
      setImportant(logo, 'flex', '0 0 auto');
      setImportant(logo, 'width', 'auto');
      setImportant(logo, 'min-width', innerWidth <= 1100 ? '9.2rem' : '10.5rem');
      setImportant(logo, 'max-width', innerWidth <= 1100 ? '11rem' : '14rem');
      setImportant(logo, 'padding', '0');
      setImportant(logo, 'margin', '0');
      setImportant(logo, 'line-height', '1');
      setImportant(logo, 'transform', 'none');

      const logoStack = logo.querySelector('div');
      setImportant(logoStack, 'gap', '0.22rem');
      setImportant(logoStack, 'align-items', 'flex-start');

      const logoTitle = logo.querySelector('span:first-child');
      const logoSub = logo.querySelector('span:last-child');
      setImportant(logoTitle, 'display', 'block');
      setImportant(logoTitle, 'white-space', 'nowrap');
      setImportant(logoTitle, 'max-width', 'none');
      setImportant(logoTitle, 'font-size', innerWidth <= 1100 ? 'clamp(1.08rem, 2vw, 1.32rem)' : 'clamp(1.38rem, 1.72vw, 1.62rem)');
      setImportant(logoTitle, 'line-height', '0.9');
      setImportant(logoTitle, 'letter-spacing', '-0.045em');
      setImportant(logoTitle, 'color', '#21140e');
      setImportant(logoSub, 'display', 'block');
      setImportant(logoSub, 'white-space', 'nowrap');
      setImportant(logoSub, 'max-width', 'none');
      setImportant(logoSub, 'font-size', innerWidth <= 1100 ? 'clamp(0.42rem, 0.78vw, 0.52rem)' : 'clamp(0.48rem, 0.64vw, 0.62rem)');
      setImportant(logoSub, 'line-height', '1');
      setImportant(logoSub, 'letter-spacing', '0.18em');
      setImportant(logoSub, 'color', 'rgba(104, 73, 50, 0.7)');
    }

    header.querySelectorAll('nav a, [role="navigation"] a').forEach((link) => {
      setImportant(link, 'white-space', 'nowrap');
      setImportant(link, 'word-break', 'keep-all');
      setImportant(link, 'overflow-wrap', 'normal');
      setImportant(link, 'min-width', 'max-content');
      const label = link.querySelector('span') || link;
      setImportant(label, 'font-family', "'Outfit', sans-serif");
      setImportant(label, 'font-size', 'clamp(.88rem, 1.05vw, 1.02rem)');
      setImportant(label, 'font-weight', '800');
      setImportant(label, 'line-height', '1.08');
      setImportant(label, 'letter-spacing', '.045em');
      setImportant(label, 'color', '#2d2118');
    });

    header.querySelectorAll('button').forEach((button) => {
      const inner = button.querySelector('.btn-primary, .btn-gold, [class*="btn-"]');
      const text = (button.textContent || '').toLowerCase();
      if (!inner || !text.includes('consultation')) return;

      setImportant(button, 'width', 'auto');
      setImportant(button, 'min-width', innerWidth <= 1100 ? '14.6rem' : '17.25rem');
      setImportant(button, 'height', innerWidth <= 1100 ? '3.75rem' : '4.25rem');
      setImportant(button, 'min-height', innerWidth <= 1100 ? '3.75rem' : '4.25rem');
      setImportant(button, 'padding', innerWidth <= 1100 ? '0 2rem' : '0 3rem');
      setImportant(button, 'display', 'inline-flex');
      setImportant(button, 'align-items', 'center');
      setImportant(button, 'justify-content', 'center');
      setImportant(button, 'border-radius', '999px');
      setImportant(button, 'border', '1px solid rgba(255, 232, 182, 0.76)');
      setImportant(button, 'background', 'linear-gradient(115deg, #A87524 0%, #D6A642 26%, #EED591 48%, #FFF1C7 56%, #D8AE55 72%, #A87524 100%)');
      setImportant(button, 'background-image', 'linear-gradient(115deg, #A87524 0%, #D6A642 26%, #EED591 48%, #FFF1C7 56%, #D8AE55 72%, #A87524 100%)');
      setImportant(button, 'box-shadow', '0 14px 30px rgba(39, 24, 11, 0.17), 0 8px 18px rgba(218, 171, 87, 0.32), inset 0 1px 0 rgba(255, 250, 235, 0.7), inset 0 -1px 0 rgba(116, 75, 24, 0.28)');
      setImportant(button, 'color', '#1F1712');
      setImportant(button, 'cursor', 'pointer');

      setImportant(inner, 'width', 'auto');
      setImportant(inner, 'min-width', '0');
      setImportant(inner, 'height', 'auto');
      setImportant(inner, 'min-height', '0');
      setImportant(inner, 'padding', '0');
      setImportant(inner, 'display', 'inline');
      setImportant(inner, 'border', '0');
      setImportant(inner, 'border-radius', '0');
      setImportant(inner, 'background', 'transparent');
      setImportant(inner, 'background-image', 'none');
      setImportant(inner, 'box-shadow', 'none');
      setImportant(inner, 'color', '#1F1712');
      setImportant(inner, 'font-family', "'Outfit', 'Raleway', sans-serif");
      setImportant(inner, 'font-size', '0.84rem');
      setImportant(inner, 'font-weight', '700');
      setImportant(inner, 'letter-spacing', '0.18em');
      setImportant(inner, 'line-height', '1');
      setImportant(inner, 'text-transform', 'uppercase');
      setImportant(inner, 'white-space', 'nowrap');
      setImportant(inner, 'transform', 'none');
    });
  }

  document.addEventListener('DOMContentLoaded', applyFinalHeaderLogoAndCtaPolish, { once: true });
  window.addEventListener('load', applyFinalHeaderLogoAndCtaPolish);
  window.addEventListener('resize', applyFinalHeaderLogoAndCtaPolish);
  new MutationObserver(applyFinalHeaderLogoAndCtaPolish).observe(document.documentElement, { childList: true, subtree: true });
  applyFinalHeaderLogoAndCtaPolish();
})();
