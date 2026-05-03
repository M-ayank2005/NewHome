/*
 * New Home — Keyboard Shortcuts
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    // Keyboard shortcut handler
    document.addEventListener("keydown", function (e) {
        // Don't intercept when typing in inputs
        const activeEl = document.activeElement;
        if (
            activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable
        ) {
            return;
        }

        const key = e.key.toLowerCase();
        const isCtrl = e.ctrlKey || e.metaKey;

        // --- Ctrl+K or / : Focus search bar ---
        if ((isCtrl && key === "k") || (key === "/" && !isCtrl)) {
            e.preventDefault();
            const searchInput = document.getElementById("searchQ");
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // --- P : Toggle Pomodoro ---
        if (key === "p" && !isCtrl && !e.shiftKey && !e.altKey) {
            const pomodoroIcon = document.getElementById("pomodoroIcon");
            if (pomodoroIcon) pomodoroIcon.click();
        }

        // --- F : Toggle Focus Mode ---
        if (key === "f" && !isCtrl && !e.shiftKey && !e.altKey) {
            const focusModeIcon = document.getElementById("focusModeIcon");
            if (focusModeIcon) focusModeIcon.click();
        }

        // --- T : Toggle Todo ---
        if (key === "t" && !isCtrl && !e.shiftKey && !e.altKey) {
            const todoIcon = document.getElementById("todoIcon");
            if (todoIcon) todoIcon.click();
        }

        // --- B : Toggle Bookmarks ---
        if (key === "b" && !isCtrl && !e.shiftKey && !e.altKey) {
            const bookmarkButton = document.getElementById("bookmarkButton");
            if (bookmarkButton) bookmarkButton.click();
        }

        // --- ? : Show shortcuts help ---
        if (key === "?" || (e.shiftKey && key === "/")) {
            e.preventDefault();
            toggleShortcutsHelp();
        }
    });

    // ---- Shortcuts Help Overlay ----
    let helpOverlay = null;

    function toggleShortcutsHelp() {
        if (helpOverlay) {
            helpOverlay.remove();
            helpOverlay = null;
            return;
        }

        helpOverlay = document.createElement("div");
        helpOverlay.id = "shortcutsHelpOverlay";
        helpOverlay.innerHTML = `
            <div class="shortcuts-help-panel">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcut-row"><kbd>/</kbd> or <kbd>Ctrl+K</kbd><span>Focus search</span></div>
                <div class="shortcut-row"><kbd>P</kbd><span>Pomodoro Timer</span></div>
                <div class="shortcut-row"><kbd>F</kbd><span>Focus Mode</span></div>
                <div class="shortcut-row"><kbd>S</kbd><span>Sticky Notes</span></div>
                <div class="shortcut-row"><kbd>T</kbd><span>Todo List</span></div>
                <div class="shortcut-row"><kbd>B</kbd><span>Bookmarks</span></div>
                <div class="shortcut-row"><kbd>Esc</kbd><span>Close / Exit</span></div>
                <div class="shortcut-row"><kbd>?</kbd><span>This help</span></div>
            </div>
        `;
        document.body.appendChild(helpOverlay);

        helpOverlay.addEventListener("click", function (e) {
            if (e.target === helpOverlay) {
                helpOverlay.remove();
                helpOverlay = null;
            }
        });
    }

    // Close help on Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && helpOverlay) {
            helpOverlay.remove();
            helpOverlay = null;
        }
    });
})();
