function initProjectTracking() {
  const projectHeaders = Array.from(document.querySelectorAll('.prj-view'));
  if (!projectHeaders.length) return;

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.5) {
        const parentSection = entry.target.closest('.prj-id');
        const uniqueProjectId = parentSection ? parentSection.id : 'no-project-id';

        if (window.umami && typeof window.umami.track === 'function') {
          umami.track(uniqueProjectId);
        }

        observerInstance.unobserve(entry.target);
      }
    });
  }, {
    threshold: Array.from({ length: 21 }, (_, i) => i / 20), // 0, 0.05, ..., 1.0
    rootMargin: '-10% 0px -10% 0px'
  });

  projectHeaders.forEach(header => observer.observe(header));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectTracking);
} else {
  initProjectTracking();
}