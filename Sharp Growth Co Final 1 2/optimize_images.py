from pathlib import Path
from PIL import Image, ImageOps
import json

PUBLIC_DIR = Path('/home/ubuntu/sharp-growth-co-upload/public')
MAPPING_PATH = Path('/home/ubuntu/sharp-growth-co-upload/image_seo_mapping.json')
REPORT_PATH = Path('/home/ubuntu/sharp-growth-co-upload/image_optimization_report.json')

mapping = json.loads(MAPPING_PATH.read_text(encoding='utf-8'))
report = []

for item in mapping:
    old_path = PUBLIC_DIR / item['old_path']
    new_path = PUBLIC_DIR / item['new_path']
    if not old_path.exists():
        report.append({**item, 'status': 'missing_source'})
        continue
    new_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(old_path) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        width, height = im.size
        original_bytes = old_path.stat().st_size
        quality = 88 if item.get('critical') else 82
        method = 6
        # Keep exact dimensions to preserve current layout while improving transfer size.
        save_kwargs = {'format': 'WEBP', 'quality': quality, 'method': method}
        if im.mode == 'RGBA':
            save_kwargs['lossless'] = False
        im.save(new_path, **save_kwargs)
    optimized_bytes = new_path.stat().st_size
    report.append({
        **item,
        'status': 'optimized',
        'width': width,
        'height': height,
        'original_bytes': original_bytes,
        'optimized_bytes': optimized_bytes,
        'savings_bytes': original_bytes - optimized_bytes,
        'savings_percent': round((original_bytes - optimized_bytes) / original_bytes * 100, 2) if original_bytes else 0,
        'quality': quality
    })

REPORT_PATH.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f'optimized={sum(1 for r in report if r["status"] == "optimized")} report={REPORT_PATH}')
print(f'total_original={sum(r.get("original_bytes",0) for r in report)} total_optimized={sum(r.get("optimized_bytes",0) for r in report)}')
