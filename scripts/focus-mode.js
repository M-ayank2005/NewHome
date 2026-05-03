/*
 * New Home — Focus Mode
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    const focusModeIcon = document.getElementById("focusModeIcon");
    const body = document.body;

    // Load saved focus mode state
    const focusSaved = localStorage.getItem("focusMode") === "true";
    if (focusSaved) {
        body.classList.add("focus-mode");
    }

    // Toggle focus mode on click
    focusModeIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        const isActive = body.classList.toggle("focus-mode");
        localStorage.setItem("focusMode", isActive);
    });

    // Exit focus mode on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && body.classList.contains("focus-mode")) {
            body.classList.remove("focus-mode");
            localStorage.setItem("focusMode", false);
        }
    });
})();
