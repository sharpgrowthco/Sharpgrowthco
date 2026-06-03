from pathlib import Path
import re
import subprocess
from PIL import Image

root = Path('/home/ubuntu/sharp-growth-co-repo')
stamp = '20260603050500'
shared_assets = [
    'assets/luxury-button-enhancements.css',
    'assets/luxury-button-enhancements.js',
]
logo_assets = [
    'assets/images/sharp-growth-co-header-logo-transparent.png',
    'assets/images/sharp-growth-co-header-logo-transparent.webp',
]

html_files = [p for p in root.rglob('*.html') if '.git' not in p.parts]
for html in html_files:
    text = html.read_text(encoding='utf-8')
    original = text
    for asset in shared_assets:
        escaped = re.escape(asset)
        text = re.sub(rf'((?:\.\./)?{escaped})(?:\?v=[0-9A-Za-z_-]+)?', rf'\1?v={stamp}', text)
    if text != original:
        html.write_text(text, encoding='utf-8')

checks = []
for rel in logo_assets:
    p = root / rel
    im = Image.open(p)
    checks.append((rel, im.size, im.mode, p.stat().st_size))
    if im.width < 2000 or im.height < 450:
        raise SystemExit(f'Logo asset too small for crisp rendering: {rel} {im.size}')
    if im.mode != 'RGBA':
        raise SystemExit(f'Logo asset is not transparent RGBA: {rel} {im.mode}')

header_pages = ['index.html','services/index.html','about/index.html','packages/index.html','contact/index.html','work/index.html']
missing_pages = []
for page in header_pages:
    p = root / page
    text = p.read_text(encoding='utf-8')
    if 'luxury-button-enhancements.js?v=' not in text or 'luxury-button-enhancements.css?v=' not in text:
        missing_pages.append(page)
if missing_pages:
    raise SystemExit('Missing refreshed luxury assets in shared-header pages: ' + ', '.join(missing_pages))

subprocess.run(['node', '--check', str(root / 'assets/luxury-button-enhancements.js')], check=True)

print({'stamp': stamp, 'shared_header_pages_checked': header_pages, 'logo_checks': checks})