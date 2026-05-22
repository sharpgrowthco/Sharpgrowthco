# Cloudflare Contact Form Setup Guide

## Step 1: Get SendGrid API Key

1. Go to [SendGrid](https://sendgrid.com) and sign up (free tier available)
2. Navigate to **Settings** → **API Keys**
3. Create a new API Key with Mail Send permissions
4. Copy your API key

## Step 2: Deploy Cloudflare Worker

### Option A: Via Wrangler CLI (Recommended)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create worker project
wrangler init contact-form-handler

# Copy the content from functions/contact-form-handler.js into src/index.js

# Add your SendGrid API Key
# Edit the worker file and replace:
# - SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY_HERE'
# - FROM_EMAIL = 'noreply@sharpgrowthco.com'

# Deploy
wrangler deploy
```

### Option B: Via Cloudflare Dashboard

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Click **Create Application** → **Create Worker**
3. Name it: `contact-form-handler`
4. Copy the code from `functions/contact-form-handler.js`
5. Update the API key and email variables
6. Save and Deploy

## Step 3: Add Worker Route

1. In Cloudflare Dashboard, go to **Workers & Pages**
2. Click your worker
3. Go to **Triggers** → **Routes**
4. Add a new route: `https://yourdomain.com/api/contact`
5. Point it to your worker

## Step 4: Update HTML

Replace the old script in your HTML:

```html
<!-- Remove this: -->
<script src="/assets/contact-form-netlify.js" defer></script>

<!-- Add this: -->
<script src="/assets/contact-form-cloudflare.js" defer></script>

<!-- Remove this form (if exists): -->
<form name="contact" method="POST" data-netlify="true" hidden>
  ...
</form>
```

## Step 5: Update Form Endpoint

In `assets/contact-form-cloudflare.js`, update line 6:

```javascript
const WORKER_ENDPOINT = 'https://yourdomain.com/api/contact'; // Your actual worker URL
```

## Testing

1. Go to your contact page
2. Fill out the form
3. Submit
4. Check your sharpgrowthco@gmail.com inbox
5. Should receive a formatted email with all form data

## Environment Variables (Advanced)

For production, use Cloudflare secrets instead of hardcoding:

```bash
wrangler secret put SENDGRID_API_KEY
wrangler secret put FROM_EMAIL
```

Then in worker:
```javascript
const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
const FROM_EMAIL = env.FROM_EMAIL;
```

## Troubleshooting

- **Email not sending?** Check SendGrid API key and FROM_EMAIL domain verification
- **Worker error?** Check Cloudflare Worker logs in dashboard
- **CORS issues?** Worker has CORS headers configured
- **Form not submitting?** Verify WORKER_ENDPOINT URL is correct

## Features Included

✅ Form validation (client-side)  
✅ XSS protection (sanitization)  
✅ Professional HTML email template  
✅ CORS support  
✅ Error handling  
✅ Automatic response  

Need help? Check Cloudflare and SendGrid documentation.
