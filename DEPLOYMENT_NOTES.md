# Sharp Growth Co. testimonial video fix

This folder is a deployment-ready static copy of the Sharp Growth Co. website with the testimonial screen recording restored inside the computer-screen frame.

## What changed

The uploaded screen recording was converted to a web-ready MP4 and placed at:

`assets/images/testimonial-video-edited_45aa1248.mp4`

The homepage references a small compatibility script at:

`assets/testimonial-video-restore.js?v=20260522-loop2`

That script ensures the testimonial video is loaded into the existing computer-screen frame, muted, autoplayed, played inline on mobile, and continuously looped. The recording itself scrolls through the testimonial/webpage content and restarts automatically when it reaches the end.

## Cloudflare Pages upload

Upload the contents of this folder as your static site output. If Cloudflare asks for a build command, use no build command. If it asks for an output directory, use the project root or `/` depending on the upload workflow.

The package includes `_headers` and `_redirects` for reliable video delivery and static-site routing.

## Verification completed

Local verification confirmed all referenced local assets exist, and the testimonial MP4 loads with `loop`, `autoplay`, `muted`, `playsInline`, and `preload=auto` enabled.
