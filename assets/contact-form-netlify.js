(() => {
  const FORM_NAME = 'contact';
  const RESEND_ENDPOINT = '/api/contact';
  const FIELD_MAP = [
    { selector: 'input[placeholder="Jane Smith"]', name: 'name' },
    { selector: 'input[placeholder="Your Business Name"]', name: 'business_name' },
    { selector: 'input[placeholder="jane@yourbusiness.com"]', name: 'email' },
    { selector: 'input[placeholder="(555) 000-0000"]', name: 'phone' },
    { selector: 'input[placeholder="www.yourbusiness.com"]', name: 'website_url' },
    { selector: 'input[placeholder="@yourbusiness"]', name: 'instagram_handle' },
    { selector: 'textarea[placeholder^="Share your goals"]', name: 'message' },
  ];

  const SERVICE_LABELS = [
    'Website Design & Development',
    'Social Media Management',
    'Content Creation',
    'Marketing Strategy',
    'Events & Promotions',
    'Branding & Creative Direction',
    'Custom Growth Plan',
  ];

  const normalise = (value) => (value || '').replace(/\s+/g, ' ').trim();

  const findContactForm = () => {
    const forms = Array.from(document.querySelectorAll('form'));
    return forms.find((form) => {
      const text = normalise(form.textContent);
      return text.includes('Your Information') && text.includes('Services Interested In') && text.includes('Apply to Work Together');
    }) || null;
  };

  const ensureHiddenInput = (form, name, value = '') => {
    let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.prepend(input);
    }
    input.value = value;
    return input;
  };

  const applyFieldNames = (form) => {
    FIELD_MAP.forEach(({ selector, name }) => {
      const field = form.querySelector(selector);
      if (field) field.setAttribute('name', name);
    });
  };

  const getServiceButtons = (form) => Array.from(form.querySelectorAll('button[type="button"]')).filter((button) => {
    const label = normalise(button.textContent);
    return SERVICE_LABELS.includes(label);
  });

  const buttonIsSelected = (button) => {
    const ariaPressed = button.getAttribute('aria-pressed');
    if (ariaPressed === 'true') return true;
    if (button.classList.contains('active') || button.classList.contains('selected')) return true;
    const style = window.getComputedStyle(button);
    const background = style.backgroundColor || '';
    const color = style.color || '';
    return background.includes('80, 61, 40') || background.includes('39, 22, 12') || color.includes('255');
  };

  const updateSelectedServices = (form) => {
    const buttons = getServiceButtons(form);
    const selected = buttons
      .filter(buttonIsSelected)
      .map((button) => normalise(button.textContent));
    ensureHiddenInput(form, 'services_interested_in', selected.join(', '));
  };

  const collectFormData = (form) => {
    const data = new FormData(form);
    data.delete('form-name');
    data.delete('bot-field');
    return Object.fromEntries(data.entries());
  };

  const showStatus = (form, message, isError = false) => {
    let status = form.querySelector('[data-sgc-contact-status="true"]');
    if (!status) {
      status = document.createElement('p');
      status.dataset.sgcContactStatus = 'true';
      status.setAttribute('role', 'status');
      status.style.marginTop = '1rem';
      status.style.fontWeight = '600';
      const submitButton = Array.from(form.querySelectorAll('button')).find((button) => normalise(button.textContent).includes('APPLY'));
      if (submitButton && submitButton.parentElement) {
        submitButton.insertAdjacentElement('afterend', status);
      } else {
        form.appendChild(status);
      }
    }
    status.textContent = message;
    status.style.color = isError ? '#8f2f1f' : '#4f3d28';
  };

  const submitToResend = async (form, event) => {
    if (event) event.preventDefault();
    if (form.dataset.sgcResendSubmitting === 'true') return;

    form.dataset.sgcResendSubmitting = 'true';
    applyFieldNames(form);
    updateSelectedServices(form);
    ensureHiddenInput(form, 'services_interested_in', form.querySelector('input[name="services_interested_in"]')?.value || '');

    const submitButton = Array.from(form.querySelectorAll('button')).find((button) => normalise(button.textContent).includes('APPLY'));
    const originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'SENDING...';
    }

    try {
      const response = await window.fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectFormData(form)),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (_) {
        result = {};
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.error || `Contact form submission failed with status ${response.status}`);
      }

      form.dataset.sgcResendSubmitted = 'true';
      showStatus(form, 'Thank you — your message has been sent to Sharp Growth Co.');
    } catch (error) {
      form.dataset.sgcResendError = error.message || 'Contact form submission failed';
      console.error('[Sharp Growth Co.] Contact form could not be sent through Resend.', error);
      showStatus(form, 'Your message could not be sent. Please email SharpGrowthCo@gmail.com directly.', true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || 'APPLY TO WORK TOGETHER';
      }
      window.setTimeout(() => {
        form.dataset.sgcResendSubmitting = 'false';
      }, 1000);
    }
  };

  const enhanceForm = () => {
    const form = findContactForm();
    if (!form || form.dataset.sgcResendEnhanced === 'true') return;

    form.dataset.sgcResendEnhanced = 'true';
    form.setAttribute('name', FORM_NAME);
    form.setAttribute('method', 'POST');
    form.setAttribute('action', RESEND_ENDPOINT);

    ensureHiddenInput(form, 'services_interested_in', '');
    applyFieldNames(form);
    updateSelectedServices(form);

    getServiceButtons(form).forEach((button) => {
      button.addEventListener('click', () => {
        window.setTimeout(() => updateSelectedServices(form), 0);
      });
    });

    form.addEventListener('submit', (event) => {
      submitToResend(form, event);
    }, true);
  };

  const observer = new MutationObserver(enhanceForm);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceForm);
  } else {
    enhanceForm();
  }
})();
