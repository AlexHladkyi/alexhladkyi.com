//projects list thumbnail preview (overlay clamped to the and-others container, no cursor-follow)
(() => {
    // Stop if device does not have a fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const container = document.getElementById("and-others");
    const preview = document.getElementById("cursor-preview");
    const previewImg = document.getElementById("cursor-preview-img");
    const rows = Array.from(document.querySelectorAll(".project-row"));

    let hideTimeoutId = null;
    let fadeTimeoutId = null;

    const HIDE_DELAY_MS = 200;
    const FADE_DURATION_MS = 100;

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

    // Position the preview level with the given row, clamped so it never
    // renders past the top or bottom edge of the and-others container.
    // Since the preview is absolutely (not fixed) positioned, it scrolls
    // with the page like any other in-flow content — no scroll listener needed.
    function positionPreview(row) {
        const containerRect = container.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        const previewHeight = preview.offsetHeight;

        let top = (rowRect.top - containerRect.top) + (rowRect.height / 2) - (previewHeight / 2);
        const maxTop = container.offsetHeight - previewHeight;
        top = Math.max(0, Math.min(top, maxTop));

        preview.style.transform = `translate3d(0, ${top}px, 0)`;
    }

    function showInstantly(thumb, row) {
        clearPendingHide();
        preview.style.transition = "none";
        previewImg.src = thumb;
        preview.style.display = "block";
        positionPreview(row);
        preview.style.opacity = "1";
    }

    function scheduleHide() {
        hideTimeoutId = setTimeout(() => {
            hideTimeoutId = null;
            preview.style.transition = `opacity ${FADE_DURATION_MS}ms ease-out`;
            void preview.offsetWidth; // Force reflow
            preview.style.opacity = "0";
            fadeTimeoutId = setTimeout(() => {
                fadeTimeoutId = null;
                preview.style.display = "none";
            }, FADE_DURATION_MS);
        }, HIDE_DELAY_MS);
    }

    // Attach hover events to all rows
    rows.forEach((row) => {
        const thumb = row.dataset.thumb;

        row.addEventListener("pointerenter", () => {
            if (thumb) showInstantly(thumb, row);
        });

        row.addEventListener("pointerleave", scheduleHide);
    });

    // Preload every thumbnail, deferred until after the rest of the page has loaded
    function preloadAllThumbnails() {
        rows.forEach((row) => {
            const thumb = row.dataset.thumb;
            if (!thumb) return;
            const img = new Image();
            img.src = thumb;
        });
    }

    function schedulePreload() {
        if ("requestIdleCallback" in window) {
            requestIdleCallback(preloadAllThumbnails);
        } else {
            setTimeout(preloadAllThumbnails, 200);
        }
    }

    if (document.readyState === "complete") {
        schedulePreload();
    } else {
        window.addEventListener("load", schedulePreload);
    }
})();
