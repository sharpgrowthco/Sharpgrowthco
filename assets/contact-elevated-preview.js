(() => {
  const CONTACT_BANNER_COPY = "Tell me about your business, goals, and vision. I personally review every inquiry to ensure we're the right fit before scheduling your complimentary consultation. Helping Alberta businesses elevate their online presence through intentional strategy, refined design, and content that supports meaningful growth.";
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
    ["What are you hoping to achieve? What's your biggest marketing challenge right now?", "What are you looking to improve, launch, grow, or refine? Share any goals, challenges, or ideas so I can better understand your vision."],
    ["Free Consultation", "Complimentary Consultation"],
    ["Book a Free Consultation", "Book a Complimentary Consultation"],
    ["free consultation", "complimentary consultation"]
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
    section.querySelectorAll('button').forEach((button) => button.classList.add('sgc-service-button-preview'));
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
