from pathlib import Path
import re
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parent
STAMP = str(int(time.time()))
PAGES = [
    ROOT / 'index.html',
    ROOT / 'services' / 'index.html',
    ROOT / 'work' / 'index.html',
    ROOT / 'about' / 'index.html',
    ROOT / 'packages' / 'index.html',
    ROOT / 'contact' / 'index.html',
]
ASSETS_TO_BUST = [
    'luxury-button-enhancements.css',
    'luxury-button-enhancements.js',
    'mobile-hero-image.css',
    'mobile-hero-image.js',
    'home-hero-exact-reference.css',
    'home-hero-exact-reference.js',
]

changed = []
for page in PAGES:
    text = page.read_text()
    original = text
    for asset in ASSETS_TO_BUST:
        pattern = re.compile(rf'({re.escape(asset)})(?:\?v=[^"\'\']*)?')
        text = pattern.sub(rf'\1?v={STAMP}', text)
    if text != original:
        page.write_text(text)
        changed.append(str(page.relative_to(ROOT)))

js_files = [ROOT / 'assets' / 'luxury-button-enhancements.js', ROOT / 'assets' / 'mobile-hero-image.js']
for js in js_files:
    subprocess.run(['node', '--check', str(js)], check=True, cwd=ROOT)

luxury_js = (ROOT / 'assets' / 'luxury-button-enhancements.js').read_text()
required_tokens = [
    'Home-page source-of-truth header lock',
    "width', desktop ? '1240px'",
    "padding-left', desktop ? '76px'",
    "width', desktop ? '224px'",
    "gap', desktop ? '51.2px'",
    "min-width', desktop ? '276px'",
]
missing = [token for token in required_tokens if token not in luxury_js]
if missing:
    raise SystemExit('Missing final header-lock tokens: ' + ', '.join(missing))

for page in PAGES:
    text = page.read_text()
    if 'luxury-button-enhancements.js?v=' not in text:
        raise SystemExit(f'Missing refreshed luxury JS reference in {page.relative_to(ROOT)}')
    if 'luxury-button-enhancements.css?v=' not in text:
        raise SystemExit(f'Missing refreshed luxury CSS reference in {page.relative_to(ROOT)}')

print('stamp=' + STAMP)
print('changed_pages=' + ', '.join(changed))
print('node_check=passed')
print('home_header_lock_tokens=present')
print('shared_header_pages_checked=' + str(len(PAGES)))