//projects list thumbnail mouse follow
(() => {
    // Stop if device does not have a fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const preview = document.getElementById("cursor-preview");
    const previewImg = document.getElementById("cursor-preview-img");
    const rows = Array.from(document.querySelectorAll(".project-row"));
    const preloadCache = new Map();

    // Preload image function
    function preload(src) {
        if (!src || preloadCache.has(src)) return;
        const img = new Image();
        img.src = src;
        preloadCache.set(src, img);
    }

    let isVisible = false;
    let hideTimeoutId = null;
    let fadeTimeoutId = null;

    const HIDE_DELAY_MS = 200;
    const FADE_DURATION_MS = 100;

    // Move preview with cursor
    function onPointerMove(e) {
        if (!isVisible) return;
        const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        const latest = events[events.length - 1] || e;
        preview.style.transform = `translate3d(${latest.clientX}px, ${latest.clientY}px, 0)`;
    }

    function clearPendingHide() {
        if (hideTimeoutId !== null) {
            clearTimeout(hideTimeoutId);
            hideTimeoutId = null;
        }
        if (fadeTimeoutId !== null) {
            clearTimeout(fadeTimeoutId);
            fadeTimeoutId = null;
        }
    }

    function showInstantly(thumb, x, y) {
        clearPendingHide();
        preview.style.transition = "none";
        previewImg.src = thumb;
        preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        preview.style.opacity = "1";
        preview.style.display = "block";
        isVisible = true;
        window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    function scheduleHide() {
        hideTimeoutId = setTimeout(() => {
            hideTimeoutId = null;
            isVisible = false;
            window.removeEventListener("pointermove", onPointerMove);
            preview.style.transition = `opacity ${FADE_DURATION_MS}ms ease-out`;
            void preview.offsetWidth; // Force reflow
            preview.style.opacity = "0";
            fadeTimeoutId = setTimeout(() => {
                fadeTimeoutId = null;
                preview.style.display = "none";
            }, FADE_DURATION_MS);
        }, HIDE_DELAY_MS);
    }

    // Attach events to all rows
    rows.forEach((row, index) => {
        row.addEventListener("pointerenter", (e) => {
            const thumb = row.dataset.thumb;

            // Show current thumbnail
            if (thumb) {
                showInstantly(thumb, e.clientX, e.clientY);
            }

            // Automatically find and preload adjacent thumbnails
            const prevRow = rows[index - 1];
            const nextRow = rows[index + 1];

            if (prevRow) preload(prevRow.dataset.thumb);
            if (nextRow) preload(nextRow.dataset.thumb);
        });

        row.addEventListener("pointerleave", scheduleHide);
    });
})();