/**
 * Cloudflare Worker - Contact Form Handler
 * Handles form submissions and sends emails via SendGrid
 */

const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY_HERE'; // Replace with your actual key
const FROM_EMAIL = 'noreply@sharpgrowthco.com'; // Replace with your email
const TO_EMAIL = 'sharpgrowthco@gmail.com';
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate form data
function validateFormData(data) {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.message || !data.message.trim()) {
    errors.push('Message is required');
  }

  return errors;
}

// Sanitize input to prevent XSS
function sanitizeInput(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Format email HTML
function formatEmailHTML(data) {
  const services = data.services_interested_in ? sanitizeInput(data.services_interested_in) : 'Not specified';
  const business = data.business_name ? sanitizeInput(data.business_name) : 'Not specified';
  const phone = data.phone ? sanitizeInput(data.phone) : 'Not provided';
  const website = data.website_url ? sanitizeInput(data.website_url) : 'Not provided';
  const instagram = data.instagram_handle ? sanitizeInput(data.instagram_handle) : 'Not provided';
  const budget = data.budget ? sanitizeInput(data.budget) : 'Not specified';
  const timeline = data.timeline ? sanitizeInput(data.timeline) : 'Not specified';

  return `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background-color: #502819; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #502819; margin-bottom: 5px; }
          .value { color: #555; padding: 10px; background-color: #f5f5f5; border-radius: 4px; }
          .divider { border-top: 2px solid #e0e0e0; margin: 20px 0; }
          .footer { color: #888; font-size: 12px; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${sanitizeInput(data.name)}</div>
            </div>
            
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${sanitizeInput(data.email)}</div>
            </div>
            
            <div class="field">
              <div class="label">Business Name</div>
              <div class="value">${business}</div>
            </div>
            
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${phone}</div>
            </div>
            
            <div class="field">
              <div class="label">Website</div>
              <div class="value">${website}</div>
            </div>
            
            <div class="field">
              <div class="label">Instagram Handle</div>
              <div class="value">${instagram}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="field">
              <div class="label">Services Interested In</div>
              <div class="value">${services}</div>
            </div>
            
            <div class="field">
              <div class="label">Budget</div>
              <div class="value">${budget}</div>
            </div>
            
            <div class="field">
              <div class="label">Timeline</div>
              <div class="value">${timeline}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="field">
              <div class="label">Message</div>
              <div class="value">${sanitizeInput(data.message).replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="footer">
              <p>This email was sent from your Sharp Growth Co. contact form</p>
              <p>Submitted on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Send email via SendGrid
async function sendEmailViaSendGrid(data) {
  const emailContent = formatEmailHTML(data);

  const payload = {
    personalizations: [
      {
        to: [{ email: TO_EMAIL, name: 'Sharp Growth Co.' }],
        subject: `New Contact Form Submission from ${sanitizeInput(data.name)}`,
      },
    ],
    from: { email: FROM_EMAIL, name: 'Sharp Growth Co. Contact Form' },
    content: [
      {
        type: 'text/html',
        value: emailContent,
      },
    ],
  };

  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid Error:', error);
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

// Handle CORS preflight
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
}

// Main handler
export default {
  async fetch(request) {
    // Handle CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      const data = await request.json();

      // Validate form data
      const validationErrors = validateFormData(data);
      if (validationErrors.length > 0) {
        return new Response(
          JSON.stringify({ error: validationErrors[0], errors: validationErrors }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Send email
      await sendEmailViaSendGrid(data);

      return new Response(
        JSON.stringify({ success: true, message: 'Form submitted successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error processing form:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process form submission' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
