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
    const title = header.querySelector('a[href="/"] span:first-child');
    const sub = header.querySelector('a[href="/"] span:last-child');
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
      set(cta, 'border-radius', '0');
      set(cta, 'border', '1px solid rgba(222,177,91,.48)');
      set(cta, 'background', 'linear-gradient(135deg,#e0b453 0%,#cb9938 47%,#a87423 100%)');
      set(cta, 'color', '#fffaf2');
      set(cta, 'box-shadow', '0 14px 26px rgba(132,86,31,.17), inset 0 1px 0 rgba(255,238,196,.24)');
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
