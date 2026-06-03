from pathlib import Path
import re
from datetime import datetime, timezone

root = Path('/home/ubuntu/sharp-growth-co-repo')
stamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
# Refresh local asset query strings only. External URLs and data URIs are left untouched.
pattern = re.compile(r'((?:\.\./|\./)? assets/[^"\'\'<>\s)]+?\.(?:css|js|png|jpg|jpeg|webp|svg))(?:\?v=[^"\'\'<>\s)]*)?')
updated = []
for path in [root / 'index.html', root / '404.html', *sorted((root).glob('*/index.html'))]:
    if not path.exists():
        continue
    text = path.read_text()
    new_text = pattern.sub(lambda m: f"{m.group(1)}?v={stamp}", text)
    if new_text != text:
        path.write_text(new_text)
        updated.append(str(path.relative_to(root)))
print(f'Refreshed cache token: {stamp}')
print('Updated files:')
for item in updated:
    print(f'- {item}')