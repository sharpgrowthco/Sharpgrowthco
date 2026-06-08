const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

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
      return new Response(
        JSON.stringify({ success: false, error: 'Name, email, and message are required.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const contactToEmail = env.CONTACT_TO_EMAIL || 'sharpgrowthco@gmail.com';
    const contactFromEmail = env.CONTACT_FROM_EMAIL || 'Sharp Growth Co. <contact@sharpgrowthco.com>';

    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Contact email service is missing RESEND_API_KEY.' }),
        { status: 500, headers: jsonHeaders }
      );
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
        from: contactFromEmail,
        to: contactToEmail,
        reply_to: email,
        subject: `New contact from ${name}${subjectBusiness}`,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ success: false, error: err }), { status: 502, headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully.' }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: jsonHeaders });
  }
}
