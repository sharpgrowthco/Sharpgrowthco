from pathlib import Path
import json

ROOT = Path('/home/ubuntu/sharp-growth-co-upload')
PUBLIC = ROOT / 'public'
MAPPING = json.loads((ROOT / 'image_seo_mapping.json').read_text(encoding='utf-8'))
REPORT = json.loads((ROOT / 'image_optimization_report.json').read_text(encoding='utf-8'))

TEXT_FILES = [
    PUBLIC / 'assets' / 'index-CZJTsFxI.js',
    PUBLIC / 'assets' / 'services-enhancements.js',
    PUBLIC / 'assets' / 'banner-hero-update.js',
    PUBLIC / 'index.html',
]

# Replace all old image URLs with SEO-named WebP assets. Handle bare, root-relative, and dot-relative variants.
for path in TEXT_FILES:
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    for item in MAPPING:
        old = item['old_path']
        new = item['new_path']
        replacements = {
            old: new,
            './' + old: './' + new,
            '/' + old: '/' + new,
            old.replace('assets/', './assets/', 1): new.replace('assets/', './assets/', 1),
            old.replace('assets/', '/assets/', 1): new.replace('assets/', '/assets/', 1),
        }
        for src, dst in replacements.items():
            text = text.replace(src, dst)
    path.write_text(text, encoding='utf-8')

# Replace known compiled alt text with stronger unique SEO alt text for visible image elements.
compiled = PUBLIC / 'assets' / 'index-CZJTsFxI.js'
text = compiled.read_text(encoding='utf-8')
alt_replacements = {
    'Jenna, Founder of Sharp Growth Co.': 'Jenna, Alberta marketing strategist and founder of Sharp Growth Co. for local business growth.',
    'Sharp Growth Co. workspace': 'Premium Alberta marketing agency workspace for website design, branding, and content strategy.',
    'Marketing strategy session': 'Calgary marketing consultant leading a boardroom strategy session for a local Alberta business.',
    'Results-Driven, Creative Excellence, Genuine Partnership, Community-Focused': 'Branding agency Alberta values graphic highlighting results-driven strategy, creative excellence, and partnership.',
    'Marketing Growth Over Time — Revenue and Views chart': 'Local business marketing Alberta growth chart showing revenue and audience views improving over time.',
    'Gather & Grow — A Homeschool Enrichment Program': 'Alberta marketing agency portfolio banner showing a local brand and community growth project.',
    'Expanded view': 'Expanded portfolio image for a premium Alberta marketing agency project.',
}
for old_alt, new_alt in alt_replacements.items():
    text = text.replace(old_alt, new_alt)
compiled.write_text(text, encoding='utf-8')

# Runtime enhancement fills gaps in minified React output: alt text, dimensions, lazy loading, decoding, fetch priority, and aria labels for background images.
seo_items = []
for r in REPORT:
    if r.get('status') != 'optimized':
        continue
    seo_items.append({
        'src': '/' + r['new_path'],
        'filename': Path(r['new_path']).name,
        'oldFilename': Path(r['old_path']).name,
        'alt': r['alt'],
        'width': r['width'],
        'height': r['height'],
        'critical': bool(r.get('critical')),
    })

runtime_js = """(() => {
  const IMAGE_SEO_ITEMS = __IMAGE_SEO_ITEMS__;
  const byFilename = new Map();
  IMAGE_SEO_ITEMS.forEach((item) => {
    byFilename.set(item.filename, item);
    byFilename.set(item.oldFilename, item);
  });

  function filenameFromUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.origin);
      return url.pathname.split('/').pop();
    } catch (_) {
      return String(value).split('?')[0].split('#')[0].split('/').pop();
    }
  }

  function enhanceImage(img) {
    const filename = filenameFromUrl(img.currentSrc || img.src || img.getAttribute('src'));
    const item = byFilename.get(filename);
    if (!item) return;
    if (!filename.endsWith('.webp')) {
      img.src = item.src;
    }
    img.alt = item.alt;
    img.width = item.width;
    img.height = item.height;
    img.decoding = 'async';
    img.style.maxWidth = img.style.maxWidth || '100%';
    img.style.height = img.style.height || 'auto';
    if (item.critical) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    } else {
      img.loading = 'lazy';
      img.fetchPriority = 'auto';
    }
  }

  function enhanceBackgroundElements() {
    document.querySelectorAll('[style*="background-image"], [style*="backgroundImage"]').forEach((el) => {
      const bg = el.style.backgroundImage || '';
      for (const item of IMAGE_SEO_ITEMS) {
        if (bg.includes(item.filename) || bg.includes(item.oldFilename)) {
          if (bg.includes(item.oldFilename)) {
            el.style.backgroundImage = bg.split(item.oldFilename).join(item.filename);
          }
          el.setAttribute('role', 'img');
          el.setAttribute('aria-label', item.alt);
          if (!el.style.backgroundSize) el.style.backgroundSize = 'cover';
          if (!el.style.backgroundPosition) el.style.backgroundPosition = 'center center';
          break;
        }
      }
    });
  }

  function applyImageSeo() {
    document.querySelectorAll('img').forEach(enhanceImage);
    enhanceBackgroundElements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImageSeo, { once: true });
  } else {
    applyImageSeo();
  }
  window.addEventListener('load', applyImageSeo);
  const observer = new MutationObserver(() => window.requestAnimationFrame(applyImageSeo));
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style', 'class'] });
})();
""".replace('__IMAGE_SEO_ITEMS__', json.dumps(seo_items, ensure_ascii=False, indent=2))
(PUBLIC / 'assets' / 'image-seo-enhancements.js').write_text(runtime_js, encoding='utf-8')

# Inject preload links and runtime script if not already present.
index_path = PUBLIC / 'index.html'
html = index_path.read_text(encoding='utf-8')
preload_lines = [
    '    <link rel="preload" as="image" type="image/webp" href="/assets/images/alberta-marketing-agency-homepage-hero-laptop-website-design.webp" fetchpriority="high" />',
    '    <link rel="preload" as="image" type="image/webp" href="/assets/images/alberta-marketing-agency-mountain-banner-local-business-growth.webp" />',
]
for line in preload_lines:
    if line not in html:
        html = html.replace('    <link rel="stylesheet" href="/assets/services-enhancements.css" />', line + '\n    <link rel="stylesheet" href="/assets/services-enhancements.css" />')
script_line = '    <script src="/assets/image-seo-enhancements.js" defer></script>'
if script_line not in html:
    html = html.replace('    <script src="/assets/banner-hero-update.js" defer></script>', '    <script src="/assets/banner-hero-update.js" defer></script>\n' + script_line)
index_path.write_text(html, encoding='utf-8')

print('updated references and injected image SEO runtime')
print(f'image_seo_items={len(seo_items)}')
