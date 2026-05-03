/*
 * New Home — Sticky Notes
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    const stickyNotesIcon = document.getElementById("stickyNotesIcon");
    const stickyNotesContainer = document.getElementById("stickyNotesContainer");
    const stickyNotesTextarea = document.getElementById("stickyNotesTextarea");
    const clearNotesBtn = document.getElementById("clearNotesBtn");

    // Load saved notes
    const savedNotes = localStorage.getItem("stickyNotes");
    if (savedNotes) {
        stickyNotesTextarea.value = savedNotes;
    }

    // Toggle panel
    stickyNotesIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        const isVisible = stickyNotesContainer.style.display !== "none";
        stickyNotesContainer.style.display = isVisible ? "none" : "block";
        if (!isVisible) {
            stickyNotesTextarea.focus();
        }
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (
            stickyNotesContainer.style.display !== "none" &&
            !stickyNotesContainer.contains(e.target) &&
            !document.getElementById("stickyNotesCont").contains(e.target)
        ) {
            stickyNotesContainer.style.display = "none";
        }
    });

    // Save on input
    stickyNotesTextarea.addEventListener("input", function () {
        localStorage.setItem("stickyNotes", stickyNotesTextarea.value);
    });

    // Clear notes
    clearNotesBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear your notes?")) {
            stickyNotesTextarea.value = "";
            localStorage.removeItem("stickyNotes");
            stickyNotesTextarea.focus();
        }
    });

    // Keyboard shortcut for Sticky Notes (S)
    document.addEventListener("keydown", function (e) {
        const activeEl = document.activeElement;
        if (
            activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable
        ) {
            // Only handle escape if focus is in sticky notes
            if (e.key === "Escape" && activeEl === stickyNotesTextarea) {
                stickyNotesContainer.style.display = "none";
                activeEl.blur();
            }
            return;
        }

        const key = e.key.toLowerCase();
        const isCtrl = e.ctrlKey || e.metaKey;

        // --- S : Toggle Sticky Notes ---
        if (key === "s" && !isCtrl && !e.shiftKey && !e.altKey) {
            stickyNotesIcon.click();
        }
    });
})();
