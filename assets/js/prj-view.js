document.addEventListener('DOMContentLoaded', () => {
  const projectHeaders = Array.from(document.querySelectorAll('.prj-view'));
  if (!projectHeaders.length) return;

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Grab ID from parent wrapper
        const parentSection = entry.target.closest('.prj-id');
        const uniqueProjectId = parentSection ? parentSection.id : 'no-project-id';

        if (window.umami && typeof window.umami.track === 'function') {
          umami.track('project_view', { project_id: uniqueProjectId });
        }

        observerInstance.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the header block is in view
  });

  projectHeaders.forEach(header => observer.observe(header));
});