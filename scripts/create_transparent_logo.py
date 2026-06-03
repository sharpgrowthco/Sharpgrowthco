from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

src = Path('/home/ubuntu/upload/sharp-growth-co-light-background-logo.png')
out_dir = Path('/home/ubuntu/sharp-growth-co-repo/assets/images')
out_dir.mkdir(parents=True, exist_ok=True)
png_out = out_dir / 'sharp-growth-co-header-logo-transparent.png'
webp_out = out_dir / 'sharp-growth-co-header-logo-transparent.webp'
preview_out = out_dir / 'sharp-growth-co-header-logo-transparent-preview.png'

im = Image.open(src).convert('RGBA')
# Work at 4x so the displayed header logo can be larger while remaining crisp.
scale = 4
im = im.resize((im.width * scale, im.height * scale), Image.Resampling.LANCZOS)
arr = np.asarray(im).astype(np.float32)
rgb = arr[..., :3]
orig_alpha = arr[..., 3:4] / 255.0

# Estimate the light paper/background color from the image corners.
h, w = rgb.shape[:2]
corner = max(24, min(h, w) // 18)
corner_pixels = np.concatenate([
    rgb[:corner, :corner].reshape(-1, 3),
    rgb[:corner, -corner:].reshape(-1, 3),
    rgb[-corner:, :corner].reshape(-1, 3),
    rgb[-corner:, -corner:].reshape(-1, 3),
], axis=0)
bg = np.median(corner_pixels, axis=0)

# Distance from the background gives a clean transparency mask.
dist = np.linalg.norm(rgb - bg, axis=2)
# Preserve very light anti-aliased edge pixels as partial alpha, but make true background fully transparent.
alpha = np.clip((dist - 4.0) / 62.0, 0.0, 1.0)

# Any clearly black/espresso or gold lettering should remain solid.
darkness = 1.0 - (rgb.mean(axis=2) / 255.0)
gold_signal = np.clip(((rgb[..., 0] - rgb[..., 2]) + (rgb[..., 1] - rgb[..., 2]) * 0.55) / 105.0, 0.0, 1.0)
alpha = np.maximum(alpha, np.clip((darkness - 0.055) / 0.42, 0.0, 1.0))
alpha = np.maximum(alpha, np.clip((gold_signal - 0.10) / 0.55, 0.0, 1.0) * np.clip((dist - 8.0) / 45.0, 0.0, 1.0))
alpha = np.clip(alpha * orig_alpha[..., 0], 0.0, 1.0)

# Unmatte against the sampled light background so transparent edges do not carry a fuzzy white halo.
alpha3 = np.maximum(alpha[..., None], 1e-3)
fg = (rgb - bg * (1.0 - alpha3)) / alpha3
fg = np.clip(fg, 0, 255)

# For very solid pixels, use a mild contrast/sharpness enhancement to improve header rendering.
out = np.dstack([fg, alpha * 255.0]).astype(np.uint8)
out_im = Image.fromarray(out, 'RGBA')
out_im = out_im.filter(ImageFilter.UnsharpMask(radius=0.65, percent=82, threshold=2))

# Trim transparent edges while keeping a small safe padding for the tagline rule.
a = np.asarray(out_im)[..., 3]
ys, xs = np.where(a > 2)
if len(xs) and len(ys):
    pad_x = 18 * scale
    pad_y = 10 * scale
    left = max(int(xs.min()) - pad_x, 0)
    right = min(int(xs.max()) + pad_x + 1, out_im.width)
    top = max(int(ys.min()) - pad_y, 0)
    bottom = min(int(ys.max()) + pad_y + 1, out_im.height)
    out_im = out_im.crop((left, top, right, bottom))

out_im.save(png_out, optimize=True)
out_im.save(webp_out, quality=98, method=6, lossless=True)

# Preview on white, useful for quick browser-independent inspection if needed.
preview = Image.new('RGBA', out_im.size, (255, 255, 255, 255))
preview.alpha_composite(out_im)
preview.convert('RGB').save(preview_out, quality=95)

print({
    'source_size': Image.open(src).size,
    'transparent_png': str(png_out),
    'transparent_webp': str(webp_out),
    'preview': str(preview_out),
    'output_size': out_im.size,
    'background_rgb': [round(float(x), 2) for x in bg],
    'opaque_pixels': int((np.asarray(out_im)[..., 3] > 245).sum()),
    'semi_transparent_pixels': int(((np.asarray(out_im)[..., 3] > 0) & (np.asarray(out_im)[..., 3] <= 245)).sum()),
})