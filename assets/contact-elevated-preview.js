(() => {
  const CONTACT_BANNER_COPY = "Tell me about your business, goals, and vision. I personally review every inquiry to ensure we're the right fit before scheduling your complementary consultation. Helping Alberta businesses elevate their online presence through intentional strategy, refined design, and content that supports meaningful growth.";
  const CONTACT_BANNER_TAGLINE = 'Boutique Strategy, Personally Tailored for Your Business';

  const TEXT_REPLACEMENTS = new Map([
    ["Tell me about your business and goals. I'll review your inquiry and reach out within 1–2 business days to schedule your free consultation.", CONTACT_BANNER_COPY],
    ["Submit Your Inquiry", "Share Your Vision"],
    ["Fill out the form with your business details and goals.", "Share the business you’re building, the goals you’re pursuing, and where you want your brand to go next."],
    ["I Review & Reach Out", "Personalized Review"],
    ["I'll review your inquiry within 1–2 business days and schedule a call.", "I personally review each inquiry and respond within 1–2 business days with the most intentional next step."],
    ["Free Strategy Call", "Discovery Consultation"],
    ["I'll discuss your goals, answer your questions, and recommend the best approach.", "We’ll discuss your goals, opportunities, and the best strategic path forward for your brand."],
    ["Custom Proposal", "Tailored Growth Proposal"],
    ["I'll send a tailored proposal with scope, timeline, and investment details.", "If the partnership is aligned, I’ll prepare a focused proposal with scope, priorities, timeline, and investment."],
    ["Monthly / Project Budget", "Estimated Investment Range"],
    ["Tell Me About Your Goals", "Tell Me About Your Brand & Goals"],
    ["What are you hoping to achieve? What's your biggest marketing challenge right now?", "What are you looking to improve, launch, grow, or refine? Share any goals, challenges, or ideas so I can better understand your vision."]
  ]);

  function replaceTextNodes(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const current = node.nodeValue;
      let next = current;
      TEXT_REPLACEMENTS.forEach((replacement, original) => {
        next = next.split(original).join(replacement);
      });
      if (next !== current) node.nodeValue = next;
    });
  }

  function findTextElement(text) {
    const elements = Array.from(document.querySelectorAll('body *'));
    return elements.find((el) => el.children.length === 0 && el.textContent.trim() === text);
  }

  function findContainingElement(text) {
    const elements = Array.from(document.querySelectorAll('body *'));
    return elements.find((el) => el.textContent && el.textContent.trim() === text);
  }

  function hideFieldByLabel(labelText) {
    const label = findTextElement(labelText) || findContainingElement(labelText);
    if (!label) return;
    let node = label;
    while (node && node !== document.body) {
      const hasInput = !!node.querySelector('input, textarea, select');
      const tooLarge = node.textContent.length > 260;
      if (hasInput && !tooLarge) {
        node.classList.add('sgc-hidden-preview-field');
        return;
      }
      node = node.parentElement;
    }
    if (label.parentElement) label.parentElement.classList.add('sgc-hidden-preview-field');
  }

  function updateContactBanner() {
    const hero = document.querySelector('[data-loc="client/src/pages/Contact.tsx:52"]');
    const heroParagraph = document.querySelector('[data-loc="client/src/pages/Contact.tsx:61"]');

    if (heroParagraph) {
      heroParagraph.textContent = CONTACT_BANNER_COPY;
    }

    document.querySelectorAll('.sgc-contact-trust-preview').forEach((panel) => panel.remove());

    if (!hero || hero.querySelector('.sgc-contact-banner-tagline')) return;
    const tagline = document.createElement('div');
    tagline.className = 'sgc-contact-banner-tagline';
    tagline.textContent = CONTACT_BANNER_TAGLINE;
    hero.appendChild(tagline);
  }

  const SERVICE_GOLD_BACKGROUND = 'linear-gradient(135deg, #C79D5B 0%, #E8C988 45%, #F5E3BC 50%, #E8C988 55%, #C79D5B 100%)';
  const SERVICE_NEUTRAL_BACKGROUND = 'linear-gradient(180deg, rgba(255,253,247,0.94), rgba(246,240,228,0.88))';

  function setImportant(button, property, value) {
    button.style.setProperty(property, value, 'important');
  }

  function applyServiceButtonGoldVisual(button) {
    setImportant(button, 'transform', 'translateY(-3px)');
    setImportant(button, 'color', '#111111');
    setImportant(button, '-webkit-text-fill-color', '#111111');
    setImportant(button, 'border-color', '#C79D5B');
    setImportant(button, 'background', SERVICE_GOLD_BACKGROUND);
    setImportant(button, 'background-color', '#E8C988');
    setImportant(button, 'background-image', SERVICE_GOLD_BACKGROUND);
    setImportant(button, 'box-shadow', '0 6px 18px rgba(199, 157, 91, 0.45)');
    setImportant(button, 'text-shadow', 'none');
  }

  function applyServiceButtonNeutralVisual(button) {
    if (button.matches(':hover') || button.dataset.sgcServiceHovering === 'true') {
      applyServiceButtonGoldVisual(button);
      return;
    }
    setImportant(button, 'transform', 'translateY(0)');
    setImportant(button, 'color', 'oklch(0.48 0.018 60)');
    setImportant(button, '-webkit-text-fill-color', 'oklch(0.48 0.018 60)');
    setImportant(button, 'border-color', 'rgba(181, 134, 49, 0.20)');
    setImportant(button, 'background', SERVICE_NEUTRAL_BACKGROUND);
    setImportant(button, 'background-color', 'transparent');
    setImportant(button, 'background-image', SERVICE_NEUTRAL_BACKGROUND);
    setImportant(button, 'box-shadow', '0 10px 28px rgba(52, 38, 22, 0.055)');
    setImportant(button, 'text-shadow', 'none');
  }

  function serviceButtonIsGoldSelected(button) {
    return button.classList.contains('sgc-service-pill-gold-selected')
      || button.classList.contains('selected')
      || button.classList.contains('active')
      || button.getAttribute('aria-pressed') === 'true';
  }

  function setServiceButtonGoldSelected(button, selected) {
    button.classList.toggle('selected', selected);
    button.classList.toggle('sgc-service-pill-gold-selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    button.setAttribute('data-sgc-service-visual-state', selected ? 'gold' : 'outline');
    if (selected || button.matches(':hover') || button.dataset.sgcServiceHovering === 'true') applyServiceButtonGoldVisual(button);
    else applyServiceButtonNeutralVisual(button);
  }

  function syncSelectedServicesInput(button) {
    const form = button.closest('form');
    if (!form) return;
    let input = form.querySelector('input[type="hidden"][name="services_interested_in"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'services_interested_in';
      form.prepend(input);
    }
    input.value = Array.from(form.querySelectorAll('.service-pill.selected, .service-pill[aria-pressed="true"]'))
      .map((pill) => pill.textContent.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
      .join(', ');
  }

  function wireServiceButtonGoldState(button) {
    button.classList.add('service-pill', 'sgc-service-button-preview');
    setImportant(button, 'transition', 'all 0.3s ease-in-out');
    setServiceButtonGoldSelected(button, serviceButtonIsGoldSelected(button));
    syncSelectedServicesInput(button);
    if (button.dataset.sgcServiceGoldListener === 'true') return;
    button.dataset.sgcServiceGoldListener = 'true';
    const setHoverGold = () => {
      button.dataset.sgcServiceHovering = 'true';
      applyServiceButtonGoldVisual(button);
      window.setTimeout(() => {
        if (button.dataset.sgcServiceHovering === 'true' || button.matches(':hover')) applyServiceButtonGoldVisual(button);
      }, 325);
    };
    button.addEventListener('mouseenter', setHoverGold);
    button.addEventListener('mouseover', setHoverGold);
    button.addEventListener('pointerenter', setHoverGold);
    button.addEventListener('mouseleave', () => {
      button.dataset.sgcServiceHovering = 'false';
      if (!serviceButtonIsGoldSelected(button)) applyServiceButtonNeutralVisual(button);
    });
    button.addEventListener('click', () => {
      if (button.dataset.sgcContactServiceReady === 'true') {
        const nowSelected = button.classList.contains('selected')
          || button.classList.contains('sgc-contact-service-selected')
          || button.getAttribute('aria-pressed') === 'true';
        setServiceButtonGoldSelected(button, nowSelected);
        syncSelectedServicesInput(button);
        return;
      }
      const nextSelected = !serviceButtonIsGoldSelected(button);
      setServiceButtonGoldSelected(button, nextSelected);
      syncSelectedServicesInput(button);
    });
  }

  function tuneServicesSection() {
    const heading = findTextElement('Services Interested In');
    if (!heading) return;
    let section = heading.closest('div');
    for (let i = 0; i < 4 && section && section !== document.body; i += 1) {
      if (section.querySelectorAll('button').length >= 3) break;
      section = section.parentElement;
    }
    if (!section || section === document.body) return;
    const paragraphs = Array.from(section.querySelectorAll('p'));
    const helper = paragraphs.find((p) => p.textContent.includes('Select') || p.textContent.includes('services'));
    if (helper) {
      helper.textContent = 'Select one or more services so I can tailor your next-step recommendation.';
      helper.classList.add('sgc-service-helper-preview');
    }
    section.querySelectorAll('button').forEach(wireServiceButtonGoldState);
  }

  function addInvestmentNote() {
    const investmentHeading = findTextElement('Estimated Investment Range');
    if (!investmentHeading || document.querySelector('.sgc-field-note-preview')) return;
    const section = investmentHeading.closest('div');
    if (!section) return;
    const note = document.createElement('p');
    note.className = 'sgc-field-note-preview';
    note.textContent = 'A thoughtful range helps me recommend the most aligned level of support without making the inquiry feel overly transactional.';
    investmentHeading.insertAdjacentElement('afterend', note);
  }

  function markPage() {
    document.body.classList.add('contact-page-preview');
  }

  function applyPreview() {
    markPage();
    replaceTextNodes();
    hideFieldByLabel('Phone Number');
    hideFieldByLabel('Instagram Handle');
    updateContactBanner();
    tuneServicesSection();
    addInvestmentNote();
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    applyPreview();
    if (document.querySelector('[data-loc="client/src/pages/Contact.tsx:113"]') || attempts > 40) {
      window.clearInterval(timer);
      applyPreview();
    }
  }, 120);

  window.addEventListener('load', () => setTimeout(applyPreview, 250));
})();

/* 2026-06-11 — Contact consultation label correction.
   Text-only refinement: routes and form actions remain untouched. */
(() => {
  const CONSULTATION_TEXT = 'Book a Consultation';
  const CONSULTATION_REPLACEMENTS = [
    ['Book a Complimentary Consultation', CONSULTATION_TEXT],
    ['Book a Complementary Consultation', CONSULTATION_TEXT],
    ['BOOK A CONSULTATION', CONSULTATION_TEXT],
    ['Book a Free Consultation', CONSULTATION_TEXT],
    ['Complementary Consultation', CONSULTATION_TEXT],
    ['Complimentary Consultation', CONSULTATION_TEXT],
    ['Free Consultation', CONSULTATION_TEXT],
    ['complementary consultation', CONSULTATION_TEXT],
    ['complimentary consultation', CONSULTATION_TEXT],
    ['free consultation', CONSULTATION_TEXT]
  ];

  function normalizeConsultationLabels() {
    document.querySelectorAll('a, button, [role="button"]').forEach((element) => {
      const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;
      const next = CONSULTATION_REPLACEMENTS.reduce((value, [from, to]) => value.split(from).join(to), text);
      const applyGoldConsultationFit = (target) => {
        target.style.setProperty('width', '22.5rem', 'important');
        target.style.setProperty('min-width', '22.5rem', 'important');
        target.style.setProperty('max-width', 'calc(100vw - 2rem)', 'important');
        target.style.setProperty('padding-left', '1.25rem', 'important');
        target.style.setProperty('padding-right', '1.25rem', 'important');
        target.style.setProperty('font-size', '0.72rem', 'important');
        target.style.setProperty('letter-spacing', '0.045em', 'important');
        target.style.setProperty('white-space', 'nowrap', 'important');
        target.style.setProperty('overflow', 'visible', 'important');
        target.style.setProperty('text-overflow', 'clip', 'important');
      };
      const isHeaderConsultationPill = !element.getAttribute('href')
        && (element.matches('.hidden, .sgc-mobile-book-cta') || element.classList.contains('sgc-contact-consultation-cta-fit'));
      if (text === CONSULTATION_TEXT && isHeaderConsultationPill) {
        element.classList.add('sgc-contact-consultation-cta-fit');
        applyGoldConsultationFit(element);
      }
      if (next !== text && /consultation/i.test(next)) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
          let nodeText = node.nodeValue;
          CONSULTATION_REPLACEMENTS.forEach(([from, to]) => {
            nodeText = nodeText.split(from).join(to);
          });
          if (nodeText !== node.nodeValue) node.nodeValue = nodeText;
        });
        element.setAttribute('aria-label', next);
        const styledTarget = element.matches('.sgc-luxury-cta, .btn-primary-gold')
          ? element
          : element.querySelector('.sgc-luxury-cta, .btn-primary-gold') || element;
        styledTarget.classList.add('sgc-contact-consultation-cta-fit');
        const shouldFitAsPill = /book\s+a\s+consultation/i.test(text)
          || element.matches('.hidden, .sgc-mobile-book-cta')
          || styledTarget.matches('.sgc-luxury-cta, .btn-primary-gold');
        if (shouldFitAsPill) {
          [element, styledTarget].forEach(applyGoldConsultationFit);
        }
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', normalizeConsultationLabels);
  else normalizeConsultationLabels();

  window.addEventListener('load', () => setTimeout(normalizeConsultationLabels, 320));
  let consultationAttempts = 0;
  const consultationTimer = window.setInterval(() => {
    consultationAttempts += 1;
    normalizeConsultationLabels();
    if (consultationAttempts > 32) window.clearInterval(consultationTimer);
  }, 180);
})();
