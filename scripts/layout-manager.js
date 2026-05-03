/*
 * New Home — Layout Manager
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    const layoutPicker = document.getElementById("layoutPicker");
    if (!layoutPicker) return;

    const layoutOptions = layoutPicker.querySelectorAll(".layout-option");
    const body = document.body;

    // Restore saved layout
    const savedLayout = localStorage.getItem("selectedLayout") || "classic";
    applyLayout(savedLayout);

    // Mark the correct button active
    layoutOptions.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.layout === savedLayout);
    });

    // Handle click
    layoutPicker.addEventListener("click", function (e) {
        const btn = e.target.closest(".layout-option");
        if (!btn) return;

        const layout = btn.dataset.layout;
        localStorage.setItem("selectedLayout", layout);

        layoutOptions.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyLayout(layout);
    });

    function applyLayout(layout) {
        // Remove all layout classes
        body.classList.remove("layout-classic", "layout-centered", "layout-minimal");
        body.classList.add(`layout-${layout}`);
    }
})();
