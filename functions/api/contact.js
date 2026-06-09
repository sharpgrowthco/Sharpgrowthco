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

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await parsePayload(request);
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();

    if (!name || !email || !message) {
      if (wantsHtmlResponse(request)) {
        return htmlResponse('Name, email, and message are required. Please go back and complete the contact form.', 400);
      }
      return jsonResponse({ success: false, error: 'Name, email, and message are required.' }, 400);
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
      if (wantsHtmlResponse(request)) {
        return htmlResponse('The contact email service is not configured. Please email SharpGrowthCo@gmail.com directly.', 500);
      }
      return jsonResponse({ success: false, error: 'Contact email service is not configured.' }, 500);
    }

    const subjectBusiness = data.business_name ? ` — ${String(data.business_name).trim()}` : '';
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#23140d;max-width:680px;">
        <h2 style="margin:0 0 18px;color:#23140d;">New Sharp Growth Co. contact request</h2>
        ${fieldRow('Name', name)}
        ${fieldRow('Business Name', data.business_name)}
        ${fieldRow('Email', email)}
        ${fieldRow('Phone', data.phone)}
        ${fieldRow('Website', data.website_url)}
        ${fieldRow('Instagram', data.instagram_handle)}
        ${fieldRow('Services Interested In', data.services_interested_in)}
        ${fieldRow('Budget', data.budget)}
        ${fieldRow('Timeline', data.timeline)}
        ${fieldRow('Message', message)}
      </div>
    `;

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

    if (!response.ok) {
      const err = await response.text();
      if (wantsHtmlResponse(request)) {
        return htmlResponse('Sorry, something went wrong sending your message. Please email SharpGrowthCo@gmail.com directly.', 502);
      }
      return jsonResponse({ success: false, error: err }, 502);
    }

    if (wantsHtmlResponse(request)) {
      return redirectResponse('/thank-you/');
    }

    return jsonResponse({ success: true, message: 'Message sent successfully.' });
  } catch (e) {
    if (wantsHtmlResponse(request)) {
      return htmlResponse('Sorry, something went wrong sending your message. Please email SharpGrowthCo@gmail.com directly.', 500);
    }
    return jsonResponse({ success: false, error: e.message }, 500);
  }
}
