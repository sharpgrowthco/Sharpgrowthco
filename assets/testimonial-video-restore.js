(() => {
  const VIDEO_SRC = './assets/images/testimonial-video-edited_45aa1248.mp4';

  function findTextNode(text) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if ((node.textContent || '').includes(text)) return node;
    }
    return null;
  }

  function findTestimonialVideo() {
    const labelNode = findTextNode('CLIENT TESTIMONIAL');
    const testimonialGrid = labelNode?.parentElement?.parentElement?.parentElement;
    const visualColumn = testimonialGrid?.children?.[1];
    const sectionVideo = visualColumn?.querySelector?.('video');
    if (sectionVideo) return { video: sectionVideo, mockup: visualColumn?.children?.[0] || null };

    // Fallback for the production React bundle: target the restored testimonial recording directly.
    const videos = Array.from(document.querySelectorAll('video'));
    const restoredVideo = videos.find((candidate) => {
      const src = candidate.getAttribute('src') || candidate.currentSrc || '';
      return src.includes('testimonial-video-edited_45aa1248.mp4');
    });
    if (restoredVideo) return { video: restoredVideo, mockup: restoredVideo.closest('div') || null };

    if (videos.length === 1) return { video: videos[0], mockup: videos[0].closest('div') || null };
    return { video: null, mockup: null };
  }

  function safelyPlay(video) {
    if (!video) return;
    const playPromise = video.play?.();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
  }

  function enableContinuousScrollLoop(video) {
    if (!video || video.dataset.testimonialLoopReady === 'true') return;
    video.dataset.testimonialLoopReady = 'true';

    // The supplied asset is a scrolling screen recording. These handlers keep it moving continuously
    // inside the mock computer screen and restart it cleanly whenever the recording reaches the end.
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      safelyPlay(video);
    });

    video.addEventListener('pause', () => {
      if (!document.hidden && !video.ended) safelyPlay(video);
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) safelyPlay(video);
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) safelyPlay(video);
        });
      }, { threshold: 0.15 });
      observer.observe(video);
    }
  }

  function restoreTestimonialVideo() {
    const { video, mockup } = findTestimonialVideo();
    if (!video) return;

    if (video.getAttribute('src') !== VIDEO_SRC) {
      video.setAttribute('src', VIDEO_SRC);
      video.load?.();
    }

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.playbackRate = 1;
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.objectPosition = 'center center';
    video.style.display = 'block';

    if (mockup) {
      mockup.style.opacity = '1';
      mockup.style.transform = 'translateY(0) scale(1)';
      mockup.style.transition = 'opacity 600ms ease, transform 600ms ease';
    }

    enableContinuousScrollLoop(video);
    safelyPlay(video);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreTestimonialVideo);
  } else {
    restoreTestimonialVideo();
  }

  window.addEventListener('load', restoreTestimonialVideo);
  setTimeout(restoreTestimonialVideo, 250);
  setTimeout(restoreTestimonialVideo, 1000);
  setTimeout(restoreTestimonialVideo, 2500);
  setInterval(restoreTestimonialVideo, 5000);
})();
