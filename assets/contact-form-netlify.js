(() => {
  const FORM_NAME = 'contact';
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

  const REQUIRED_FIELDS = ['name', 'email', 'message'];

  const normalise = (value) => (value || '').replace(/\s+/g, ' ').trim();

  // Validation Functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (form) => {
    const errors = [];

    REQUIRED_FIELDS.forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field || !normalise(field.value)) {
        const label = fieldName === 'message' ? 'Message' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        errors.push(`${label} is required`);
      }
    });

    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  };

  // UI Feedback Functions
  const createStatusMessage = (message, type = 'info') => {
    const messageEl = document.createElement('div');
    messageEl.className = `sgc-form-status sgc-form-status--${type}`;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');
    messageEl.setAttribute('aria-atomic', 'true');
    messageEl.textContent = message;

    return messageEl;
  };

  const showStatusMessage = (form, message, type = 'info') => {
    // Remove existing status messages
    const existingMessages = form.querySelectorAll('.sgc-form-status');
    existingMessages.forEach((msg) => msg.remove());

    const messageEl = createStatusMessage(message, type);
    form.insertBefore(messageEl, form.firstChild);

    // Scroll into view
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove success messages after 6 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 6000);
    }
  };

  const setSubmitButtonState = (form, loading = false) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    if (loading) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.setAttribute('aria-label', 'Sending your message, please wait');
    } else {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || 'Apply to Work Together';
      submitButton.removeAttribute('aria-busy');
      submitButton.removeAttribute('aria-label');
    }
  };

  const findContactForm = () => {
    const forms = Array.from(document.querySelectorAll('form'));
    return (
      forms.find((form) => {
        const text = normalise(form.textContent);
        return (
          text.includes('Your Information') &&
          text.includes('Services Interested In') &&
          text.includes('Apply to Work Together')
        );
      }) || null
    );
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

  const getServiceButtons = (form) =>
    Array.from(form.querySelectorAll('button[type="button"]')).filter((button) => {
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

  const encodeFormData = (form) => {
    const data = new FormData(form);
    data.set('form-name', FORM_NAME);
    data.set('bot-field', '');
    return new URLSearchParams(data).toString();
  };

  const formDataToJson = (form) => {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  };

  const submitToNetlify = (form) => {
    if (form.dataset.sgcNetlifySubmitting === 'true') return;

    // Validate form
    const errors = validateForm(form);
    if (errors.length > 0) {
      showStatusMessage(form, errors[0], 'error');
      return;
    }

    form.dataset.sgcNetlifySubmitting = 'true';
    setSubmitButtonState(form, true);
    showStatusMessage(form, 'Sending your message...', 'info');

    applyFieldNames(form);
    updateSelectedServices(form);
    ensureHiddenInput(form, 'form-name', FORM_NAME);
    ensureHiddenInput(form, 'bot-field', '');

    const startTime = Date.now();
    const minDuration = 800; // Minimum animation duration for better UX

    window
      .fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToJson(form)),
      })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.error || `Form submission failed with status ${response.status}`);
        }
        form.dataset.sgcNetlifySubmitted = 'true';

        // Ensure minimum animation duration for better perceived performance
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          showStatusMessage(
                          form,
              'Message sent successfully. I\'ll be in touch soon.',
              'success'

          );

          // Reset form after successful submission
          setTimeout(() => {
            form.reset();
            setSubmitButtonState(form, false);
          }, 300);
        }, delay);
      })
      .catch((error) => {
        form.dataset.sgcNetlifyError = error.message || 'Form submission failed';
        console.error('[Sharp Growth Co.] Contact form error:', error);

        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, minDuration - elapsed);

        setTimeout(() => {
          showStatusMessage(
                          form,
              'Sorry, something went wrong. Please try again or email SharpGrowthCo@gmail.com directly.',
              'error'

          );
          setSubmitButtonState(form, false);
        }, delay);
      })
      .finally(() => {
        form.dataset.sgcNetlifySubmitting = 'false';
      });
  };

  const enhanceForm = () => {
    const form = findContactForm();
    if (!form || form.dataset.sgcNetlifyEnhanced === 'true') return;

    form.dataset.sgcNetlifyEnhanced = 'true';
    form.setAttribute('name', FORM_NAME);
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/thank-you/');
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('netlify', 'true');
    form.setAttribute('data-netlify-honeypot', 'bot-field');
    form.setAttribute('novalidate', 'true');

    ensureHiddenInput(form, 'form-name', FORM_NAME);
    ensureHiddenInput(form, 'bot-field', '');
    ensureHiddenInput(form, 'services_interested_in', '');

    applyFieldNames(form);
    updateSelectedServices(form);

    getServiceButtons(form).forEach((button) => {
      button.addEventListener('click', () => {
        window.setTimeout(() => updateSelectedServices(form), 0);
      });
    });

    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        submitToNetlify(form);
      },
      false
    );
  };

  // Load stylesheet
  const ensureStylesheet = () => {
    if (document.querySelector('link[href*="contact-form-styles"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/contact-form-styles.css';
    document.head.appendChild(link);
  };

  const observer = new MutationObserver(enhanceForm);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureStylesheet();
      enhanceForm();
    });
  } else {
    ensureStylesheet();
    enhanceForm();
  }
})();
