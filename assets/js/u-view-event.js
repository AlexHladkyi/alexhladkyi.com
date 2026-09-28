const DEBUG = false; // set to true to enable console logging

function initProjectTracking() {
  const projectHeaders = Array.from(document.querySelectorAll('.pass-id'));
  if (!projectHeaders.length) return;

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        const uniqueProjectId = entry.target.id || 'no-project-id';

        if (DEBUG) {
          console.log(uniqueProjectId);
        }

        if (window.umami && typeof window.umami.track === 'function') {
          umami.track(uniqueProjectId);
        }

        observerInstance.unobserve(entry.target);
      }
    });
  }, {
    threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    rootMargin: '-10% 0px -10% 0px'
  });

  projectHeaders.forEach(header => observer.observe(header));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectTracking);
} else {
  initProjectTracking();
}