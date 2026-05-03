/*
 * New Home — Font Customization
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    const fontSelector = document.getElementById("fontSelector");
    if (!fontSelector) return;

    // Font → Google Fonts URL map (only load non-default fonts)
    const fontMap = {
        "Poppins": null, // already loaded
        "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
        "Outfit": "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
        "Nunito": "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap",
        "Raleway": "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
        "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
        "Plus Jakarta Sans": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
        "JetBrains Mono": "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
    };

    // Load a Google Font dynamically
    function loadFont(fontName) {
        const url = fontMap[fontName];
        if (!url) return; // Poppins is already loaded

        // Don't load the same font twice
        const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
        if (existingLink) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.dataset.font = fontName;
        document.head.appendChild(link);
    }

    // Apply a font to the page
    function applyFont(fontName) {
        loadFont(fontName);
        document.documentElement.style.setProperty(
            "--main-font-family",
            `"${fontName}", sans-serif`
        );
    }

    // Restore saved font
    const savedFont = localStorage.getItem("selectedFont") || "Poppins";
    fontSelector.value = savedFont;
    if (savedFont !== "Poppins") {
        applyFont(savedFont);
    }

    // Style each option with its own font for preview
    Array.from(fontSelector.options).forEach(opt => {
        opt.style.fontFamily = `"${opt.value}", sans-serif`;
    });

    // Listen for changes
    fontSelector.addEventListener("change", function () {
        const chosen = fontSelector.value;
        localStorage.setItem("selectedFont", chosen);
        applyFont(chosen);
    });
})();
