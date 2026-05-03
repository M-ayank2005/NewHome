/*
 * New Home — Pomodoro Timer
 * Copyright (c) 2024-2026 Prem
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 */

(function () {
    "use strict";

    // ---- DOM Elements ----
    const pomodoroIcon = document.getElementById("pomodoroIcon");
    const pomodoroContainer = document.getElementById("pomodoroContainer");
    const pomoTimeDisplay = document.getElementById("pomoTimeDisplay");
    const pomoModeLabel = document.getElementById("pomoModeLabel");
    const pomoProgress = document.getElementById("pomoProgress");
    const pomoStartPause = document.getElementById("pomoStartPause");
    const pomoReset = document.getElementById("pomoReset");
    const pomoSkip = document.getElementById("pomoSkip");
    const pomoPlayIcon = document.getElementById("pomoPlayIcon");
    const pomoPauseIcon = document.getElementById("pomoPauseIcon");
    const pomoSessionCount = document.getElementById("pomoSessionCount");
    const pomoWorkTab = document.getElementById("pomoWorkTab");
    const pomoBreakTab = document.getElementById("pomoBreakTab");
    const pomoPresets = document.getElementById("pomoPresets");

    // ---- State ----
    const CIRCUMFERENCE = 2 * Math.PI * 90; // 565.48
    let mode = "work"; // "work" or "break"
    let workDuration = parseInt(localStorage.getItem("pomoDuration") || "25", 10); // minutes
    let breakDuration = parseInt(localStorage.getItem("pomoBreakDuration") || "5", 10); // minutes
    let totalSeconds = workDuration * 60;
    let remainingSeconds = totalSeconds;
    let isRunning = false;
    let intervalId = null;
    let sessions = parseInt(localStorage.getItem("pomoSessions") || "0", 10);

    // ---- Init ----
    pomoSessionCount.textContent = sessions;
    updateDisplay();
    updateProgress();
    highlightPreset();

    // ---- Toggle Panel ----
    pomodoroIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        const isVisible = pomodoroContainer.style.display !== "none";
        pomodoroContainer.style.display = isVisible ? "none" : "block";
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
        if (
            pomodoroContainer.style.display !== "none" &&
            !pomodoroContainer.contains(e.target) &&
            !document.getElementById("pomodoroCont").contains(e.target)
        ) {
            pomodoroContainer.style.display = "none";
        }
    });

    // ---- Start / Pause ----
    pomoStartPause.addEventListener("click", function () {
        if (isRunning) {
            pause();
        } else {
            start();
        }
    });

    function start() {
        if (remainingSeconds <= 0) return;
        isRunning = true;
        pomoPlayIcon.style.display = "none";
        pomoPauseIcon.style.display = "block";
        intervalId = setInterval(tick, 1000);
    }

    function pause() {
        isRunning = false;
        pomoPlayIcon.style.display = "block";
        pomoPauseIcon.style.display = "none";
        clearInterval(intervalId);
        intervalId = null;
    }

    function tick() {
        remainingSeconds--;
        updateDisplay();
        updateProgress();

        if (remainingSeconds <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            isRunning = false;
            pomoPlayIcon.style.display = "block";
            pomoPauseIcon.style.display = "none";
            onTimerComplete();
        }
    }

    // ---- Timer Complete ----
    function onTimerComplete() {
        // Play notification sound (if supported)
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            oscillator.connect(gain);
            gain.connect(audioCtx.destination);
            oscillator.frequency.value = 800;
            oscillator.type = "sine";
            gain.gain.value = 0.3;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) { /* ignore audio errors */ }

        if (mode === "work") {
            sessions++;
            localStorage.setItem("pomoSessions", sessions);
            pomoSessionCount.textContent = sessions;
            switchMode("break");
        } else {
            switchMode("work");
        }
    }

    // ---- Reset ----
    pomoReset.addEventListener("click", function () {
        pause();
        totalSeconds = (mode === "work" ? workDuration : breakDuration) * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
    });

    // ---- Skip ----
    pomoSkip.addEventListener("click", function () {
        pause();
        if (mode === "work") {
            switchMode("break");
        } else {
            switchMode("work");
        }
    });

    // ---- Mode Tabs ----
    pomoWorkTab.addEventListener("click", () => switchMode("work"));
    pomoBreakTab.addEventListener("click", () => switchMode("break"));

    function switchMode(newMode) {
        pause();
        mode = newMode;

        // Update tabs
        pomoWorkTab.classList.toggle("active", mode === "work");
        pomoBreakTab.classList.toggle("active", mode === "break");

        // Update container class for green accent
        pomodoroContainer.classList.toggle("break-mode", mode === "break");

        // Update duration and display
        if (mode === "work") {
            totalSeconds = workDuration * 60;
            pomoModeLabel.textContent = "Focus Time";
            highlightPreset();
        } else {
            totalSeconds = breakDuration * 60;
            pomoModeLabel.textContent = "Break Time";
            // Hide presets during break
        }
        remainingSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
    }

    // ---- Duration Presets ----
    pomoPresets.addEventListener("click", function (e) {
        const btn = e.target.closest(".pomo-preset");
        if (!btn || isRunning) return;

        const minutes = parseInt(btn.dataset.minutes, 10);
        if (mode === "work") {
            workDuration = minutes;
            localStorage.setItem("pomoDuration", minutes);
        } else {
            breakDuration = minutes;
            localStorage.setItem("pomoBreakDuration", minutes);
        }
        totalSeconds = minutes * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
        updateProgress();
        highlightPreset();
    });

    function highlightPreset() {
        const currentDuration = mode === "work" ? workDuration : breakDuration;
        document.querySelectorAll(".pomo-preset").forEach(btn => {
            btn.classList.toggle("active", parseInt(btn.dataset.minutes, 10) === currentDuration);
        });
    }

    // ---- Display Helpers ----
    function updateDisplay() {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        pomoTimeDisplay.textContent =
            String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    }

    function updateProgress() {
        const fraction = remainingSeconds / totalSeconds;
        const offset = CIRCUMFERENCE * (1 - fraction);
        pomoProgress.style.strokeDashoffset = offset;
    }
    // ---- Settings Toggle ----
    const pomodoroCheckbox = document.getElementById("pomodoroCheckbox");
    const pomodoroCont = document.getElementById("pomodoroCont");

    // Load saved state
    const pomodoroEnabled = localStorage.getItem("pomodoroEnabled");
    if (pomodoroEnabled === "false") {
        pomodoroCont.style.display = "none";
        pomodoroContainer.style.display = "none";
        if (pomodoroCheckbox) pomodoroCheckbox.checked = false;
    } else {
        if (pomodoroCheckbox) pomodoroCheckbox.checked = true;
    }

    if (pomodoroCheckbox) {
        pomodoroCheckbox.addEventListener("change", function () {
            const enabled = pomodoroCheckbox.checked;
            localStorage.setItem("pomodoroEnabled", enabled);
            pomodoroCont.style.display = enabled ? "block" : "none";
            if (!enabled) {
                pomodoroContainer.style.display = "none";
                pause();
            }
        });
    }
})();
