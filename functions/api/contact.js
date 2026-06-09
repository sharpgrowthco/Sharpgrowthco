const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

function wantsHtmlResponse(request) {
  const contentType = request.headers.get('content-type') || '';
  const accept = request.headers.get('accept') || '';
  return !contentType.includes('application/json') && accept.includes('text/html');
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function redirectResponse(path) {
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createSubmissionId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `sgc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function splitRecipients(value = '') {
  return String(value)
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function emailDomain(email = '') {
  const [, domain = ''] = String(email).split('@');
  return domain.toLowerCase();
}

function requestMeta(request) {
  return {
    contentType: request.headers.get('content-type') || '',
    accept: request.headers.get('accept') || '',
    userAgent: request.headers.get('user-agent') || '',
    cfRay: request.headers.get('cf-ray') || '',
    cfCountry: request.headers.get('cf-ipcountry') || '',
    referer: request.headers.get('referer') || '',
  };
}

function safeLog(event, details = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  try {
    console.info(JSON.stringify(payload));
  } catch (_e) {
    console.info(event, details);
  }
}

function safeWarn(event, details = {}) {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  try {
    console.warn(JSON.stringify(payload));
  } catch (_e) {
    console.warn(event, details);
  }
}

async function parsePayload(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function fieldRow(label, value) {
  const clean = String(value || '').trim();
  if (!clean) return '';
  return `<p style="margin:0 0 12px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(clean).replace(/\n/g, '<br>')}</p>`;
}

function buildContactHtml(data, submissionId) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#23140d;max-width:680px;">
      <h2 style="margin:0 0 18px;color:#23140d;">New Sharp Growth Co. contact request</h2>
      ${fieldRow('Submission ID', submissionId)}
      ${fieldRow('Name', data.name)}
      ${fieldRow('Business Name', data.business_name)}
      ${fieldRow('Email', data.email)}
      ${fieldRow('Phone', data.phone)}
      ${fieldRow('Website', data.website_url)}
      ${fieldRow('Instagram', data.instagram_handle)}
      ${fieldRow('Services Interested In', data.services_interested_in)}
      ${fieldRow('Budget', data.budget)}
      ${fieldRow('Timeline', data.timeline)}
      ${fieldRow('Message', data.message)}
    </div>
  `;
}

function backupPayload({ submissionId, data, meta, resendId, primaryStatus }) {
  return {
    event: 'sharp_growth_co_contact_submission',
    submissionId,
    primaryStatus,
    resendId,
    submittedAt: new Date().toISOString(),
    contact: {
      name: data.name || '',
      businessName: data.business_name || '',
      email: data.email || '',
      phone: data.phone || '',
      website: data.website_url || '',
      instagram: data.instagram_handle || '',
      servicesInterestedIn: data.services_interested_in || '',
      budget: data.budget || '',
      timeline: data.timeline || '',
      message: data.message || '',
    },
    request: meta,
  };
}

async function sendBackupWebhook(env, payload) {
  if (!env.CONTACT_LOG_WEBHOOK_URL) {
    return { skipped: true, reason: 'CONTACT_LOG_WEBHOOK_URL not configured' };
  }

  const response = await fetch(env.CONTACT_LOG_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return {
    skipped: false,
    ok: response.ok,
    status: response.status,
    body: response.ok ? '' : await response.text(),
  };
}

async function sendBackupEmail(env, { submissionId, data, html, resendId }) {
  const recipients = splitRecipients(env.CONTACT_BACKUP_TO_EMAIL);
  if (!recipients.length) {
    return { skipped: true, reason: 'CONTACT_BACKUP_TO_EMAIL not configured' };
  }

  const subjectBusiness = data.business_name ? ` — ${String(data.business_name).trim()}` : '';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: recipients,
      reply_to: data.email,
      subject: `[Backup] New contact from ${data.name}${subjectBusiness}`,
      html: `
        ${html}
        <hr style="border:none;border-top:1px solid #e8ded2;margin:24px 0;">
        <p style="font-family:Arial,sans-serif;color:#6f6259;font-size:13px;line-height:1.5;">
          Backup notification for Sharp Growth Co. contact submission ${escapeHtml(submissionId)}.
          Primary Resend email ID: ${escapeHtml(resendId || 'not returned')}.
        </p>
      `,
    }),
  });

  return {
    skipped: false,
    ok: response.ok,
    status: response.status,
    body: response.ok ? '' : await response.text(),
  };
}

async function runBackupNotifications(env, payload, backupEmailArgs) {
  const results = {};

  try {
    results.webhook = await sendBackupWebhook(env, payload);
  } catch (e) {
    results.webhook = { skipped: false, ok: false, error: e.message };
  }

  try {
    results.email = await sendBackupEmail(env, backupEmailArgs);
  } catch (e) {
    results.email = { skipped: false, ok: false, error: e.message };
  }

  return results;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const submissionId = createSubmissionId();
  const meta = requestMeta(request);

  try {
    const data = await parsePayload(request);
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();

    safeLog('contact_form_intake_received', {
      submissionId,
      name,
      businessName: String(data.business_name || '').trim(),
      emailDomain: emailDomain(email),
      messageLength: message.length,
      contentType: meta.contentType,
      userAgent: meta.userAgent,
      cfRay: meta.cfRay,
      referer: meta.referer,
    });

    if (!name || !email || !message) {
      safeWarn('contact_form_validation_failed', {
        submissionId,
        hasName: Boolean(name),
        hasEmail: Boolean(email),
        hasMessage: Boolean(message),
        contentType: meta.contentType,
        userAgent: meta.userAgent,
      });

      if (wantsHtmlResponse(request)) {
        return htmlResponse('Name, email, and message are required. Please go back and complete the contact form.', 400);
      }
      return jsonResponse({ success: false, error: 'Name, email, and message are required.', submissionId }, 400);
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
      safeWarn('contact_form_email_service_not_configured', {
        submissionId,
        hasResendApiKey: Boolean(env.RESEND_API_KEY),
        hasFromEmail: Boolean(env.CONTACT_FROM_EMAIL),
        hasToEmail: Boolean(env.CONTACT_TO_EMAIL),
      });

      if (wantsHtmlResponse(request)) {
        return htmlResponse('The contact email service is not configured. Please email SharpGrowthCo@gmail.com directly.', 500);
      }
      return jsonResponse({ success: false, error: 'Contact email service is not configured.', submissionId }, 500);
    }

    const subjectBusiness = data.business_name ? ` — ${String(data.business_name).trim()}` : '';
    const html = buildContactHtml({ ...data, name, email, message }, submissionId);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
        reply_to: email,
        subject: `New contact from ${name}${subjectBusiness}`,
        html,
      }),
    });

    const responseText = await response.text();
    let resendResult = {};
    try {
      resendResult = responseText ? JSON.parse(responseText) : {};
    } catch (_e) {
      resendResult = { raw: responseText };
    }

    if (!response.ok) {
      safeWarn('contact_form_primary_email_failed', {
        submissionId,
        status: response.status,
        error: responseText,
        contentType: meta.contentType,
        userAgent: meta.userAgent,
        cfRay: meta.cfRay,
      });

      try {
        const failureBackup = await sendBackupWebhook(
          env,
          backupPayload({
            submissionId,
            data: { ...data, name, email, message },
            meta,
            resendId: '',
            primaryStatus: `failed:${response.status}`,
          }),
        );
        safeLog('contact_form_failure_backup_webhook_result', { submissionId, failureBackup });
      } catch (e) {
        safeWarn('contact_form_failure_backup_webhook_failed', { submissionId, error: e.message });
      }

      if (wantsHtmlResponse(request)) {
        return htmlResponse('Sorry, something went wrong sending your message. Please email SharpGrowthCo@gmail.com directly.', 502);
      }
      return jsonResponse({ success: false, error: responseText, submissionId }, 502);
    }

    const resendId = resendResult.id || '';
    safeLog('contact_form_primary_email_accepted', {
      submissionId,
      resendId,
      status: response.status,
      to: env.CONTACT_TO_EMAIL,
      contentType: meta.contentType,
      userAgent: meta.userAgent,
      cfRay: meta.cfRay,
    });

    const backupResults = await runBackupNotifications(
      env,
      backupPayload({
        submissionId,
        data: { ...data, name, email, message },
        meta,
        resendId,
        primaryStatus: 'accepted',
      }),
      {
        submissionId,
        data: { ...data, name, email, message },
        html,
        resendId,
      },
    );

    safeLog('contact_form_backup_notification_results', {
      submissionId,
      backupResults,
    });

    if (wantsHtmlResponse(request)) {
      return redirectResponse('/thank-you/');
    }

    return jsonResponse({ success: true, message: 'Message sent successfully.', submissionId });
  } catch (e) {
    safeWarn('contact_form_unhandled_error', {
      submissionId,
      error: e.message,
      contentType: meta.contentType,
      userAgent: meta.userAgent,
      cfRay: meta.cfRay,
    });

    if (wantsHtmlResponse(request)) {
      return htmlResponse('Sorry, something went wrong sending your message. Please email SharpGrowthCo@gmail.com directly.', 500);
    }
    return jsonResponse({ success: false, error: e.message, submissionId }, 500);
  }
}
