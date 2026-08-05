//Clean up url on overlay close
(() => {
    const overlayIds = Array.from(document.querySelectorAll(".project-row"))
        .map((row) => row.getAttribute("href"))
        .filter((href) => href && href.startsWith("#"))
        .map((href) => href.slice(1));

    function clearHash() {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    window.addEventListener("hashchange", () => {
        const hash = window.location.hash;
        if (hash === "#_" || hash === "") {
            clearHash();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;

        const currentId = window.location.hash.slice(1);
        if (overlayIds.includes(currentId)) {
            window.location.hash = "_";
        }
    });
})();