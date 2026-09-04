/**
 * warez.js - Dokathlon 2026 Authentic Windows 95 Desktop OS Engine
 * - Converts navigation links into literal desktop icons sitting on the desktop
 * - Spawns 5 bouncing OS desktop icons that scatter from cursor
 * - Bottom right corner FREE RAM banner (Left RAM sidebar removed!)
 * - Spawns scattered boot popups ONLY ONCE the very first time the homepage is opened!
 */
(function() {
    "use strict";

    function initRetroOSEngine() {
        // ----------------------------------------------------------------------
        // 1. CONVERT TOP NAVIGATION TO LITERAL DESKTOP ICONS
        // ----------------------------------------------------------------------
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(function(link) {
            if (link.querySelector(".nav-icon")) return; // already transformed

            const text = link.textContent.trim();
            let icon = "📁"; // default folder

            if (text.toLowerCase().includes("etu") || text.toLowerCase().includes("koti") || link.getAttribute("href") === "index.html") {
                icon = "🖥️";
            } else if (text.toLowerCase().includes("p4p") || text.toLowerCase().includes("fighter") || text.toLowerCase().includes("pari") || text.toLowerCase().includes("rank")) {
                icon = "🥊";
            } else if (text.toLowerCase().includes("historia") || text.toLowerCase().includes("history")) {
                icon = "📜";
            } else if (text.toLowerCase().includes("tulo") || text.toLowerCase().includes("result")) {
                icon = "📊";
            } else if (text.toLowerCase().includes("sään") || text.toLowerCase().includes("rule")) {
                icon = "📑";
            } else if (text.toLowerCase().includes("about") || text.toLowerCase().includes("tietoa") || text.toLowerCase().includes("info")) {
                icon = "ℹ️";
            }

            link.innerHTML = '<div class="nav-icon">' + icon + '</div><span class="nav-label">' + text + '</span>';
        });


        // ----------------------------------------------------------------------
        // 4. BOOT POPUPS (Scattered, Varied Sizes, HOMEPAGE ONLY, ONCE PER SESSION!)
        // ----------------------------------------------------------------------
        const popupMessages = [
            { title: "🌶️ HOT ADVERT", icon: "🌶️", msg: "HOT SINGLES IN YOUR AREA want to compete in 10 secret sports events!", btn: "Meet Now", width: 390, x: 160, y: 75 },
            { title: "ℹ️ DOKATHLON OS BOOT", icon: "ℹ️", msg: "WELCOME TO DOKATHLON DESKTOP v20.26! Click and drag windows by their title bars.", btn: "OK", width: 280, x: Math.max(160, window.innerWidth / 2 - 140), y: Math.max(100, window.innerHeight - 230) },
            { title: "⚠️ SYSTEM ALERT", icon: "⚠️", msg: "CRITICAL: Dokathlon 2026 hype levels exceeding system memory (1024 KB)!", btn: "Continue", width: 450, x: Math.max(160, window.innerWidth - 490), y: 65 },
            { title: "❌ ERROR 0x0042069", icon: "❌", msg: "Internet Explorer 5.5 required for maximum audio synthesis and bouncing speed.", btn: "Ignore", width: 310, x: 170, y: Math.max(100, window.innerHeight / 2 - 110) },
            { title: "🎁 CONGRATULATIONS!", icon: "🏆", msg: "YOU ARE THE 1,000,000th ATHLETE! Click OK to claim your free virtual trophy!", btn: "Claim Trophy", width: 360, x: Math.max(160, window.innerWidth - 410), y: Math.max(100, window.innerHeight / 2 - 40) },
            { title: "🛡️ VIRUS ALERT", icon: "☢️", msg: "WARNING: not-a-virus.docx is attempting to install Cottage Run Minigame cheats!", btn: "Quarantine", width: 270, x: 260, y: Math.max(100, window.innerHeight - 270) }
        ];

        let activeWindows = [];

        function createPopupDialog(data, customX, customY) {
            const win = document.createElement("div");
            win.className = "retro-popup-window";
            let actualWidth = Math.min(data.width || 330, window.innerWidth - 20);
            win.style.width = actualWidth + "px";
            
            let preferredX = customX !== undefined ? customX : (data.x + (Math.random() - 0.5) * 30);
            let minX = window.innerWidth < 900 ? 10 : 140;
            const winX = Math.max(minX, Math.min(window.innerWidth - actualWidth - 10, preferredX));
            
            let preferredY = customY !== undefined ? customY : (data.y + (Math.random() - 0.5) * 30);
            const winY = Math.max(50, Math.min(window.innerHeight - 210, preferredY));
            
            win.style.left = winX + "px";
            win.style.top = winY + "px";
            win.style.zIndex = 10000 + activeWindows.length + 1;

            win.innerHTML = 
                '<div class="popup-title-bar">' +
                    '<span class="popup-title">' + data.title + '</span>' +
                    '<button class="popup-close-btn">X</button>' +
                '</div>' +
                '<div class="popup-body">' +
                    '<div class="popup-icon">' + data.icon + '</div>' +
                    '<div class="popup-text">' + data.msg + '</div>' +
                '</div>' +
                '<div class="popup-footer">' +
                    '<button class="popup-action-btn">' + data.btn + '</button>' +
                    '<button class="popup-cancel-btn">Cancel</button>' +
                '</div>';

            document.body.appendChild(win);
            activeWindows.push(win);

            // Play retro synth beep on boot dialog
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "square";
                osc.frequency.setValueAtTime(520, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } catch(e) {}

            // Close actions
            function closePopup() {
                if (win.parentNode) {
                    win.remove();
                    activeWindows = activeWindows.filter(w => w !== win);
                }
            }
            const closeBtn = win.querySelector(".popup-close-btn");
            const actionBtn = win.querySelector(".popup-action-btn");
            const cancelBtn = win.querySelector(".popup-cancel-btn");
            
            [closeBtn, actionBtn, cancelBtn].forEach(btn => {
                if(!btn) return;
                btn.addEventListener("click", closePopup);
                btn.addEventListener("touchstart", function(e) {
                    e.stopPropagation();
                    closePopup();
                }, {passive: true});
                btn.addEventListener("mousedown", function(e) { e.stopPropagation(); });
            });

            // Make window draggable by title bar
            const titleBar = win.querySelector(".popup-title-bar");
            let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;

            titleBar.addEventListener("mousedown", function(e) {
                isDragging = true;
                dragOffsetX = e.clientX - win.offsetLeft;
                dragOffsetY = e.clientY - win.offsetTop;
                // Bring to front
                win.style.zIndex = 15000;
                e.preventDefault();
            });

            window.addEventListener("mousemove", function(e) {
                if (!isDragging) return;
                let newX = e.clientX - dragOffsetX;
                let newY = e.clientY - dragOffsetY;
                win.style.left = newX + "px";
                win.style.top = newY + "px";
            });

            window.addEventListener("mouseup", function() {
                isDragging = false;
            });
        }

        function spawnSpecificPopup(index) {
            const data = popupMessages[index % popupMessages.length];
            createPopupDialog(data, 180 + Math.random() * 300, 100 + Math.random() * 250);
        }

        // ONLY Trigger boot popups ONCE THE FIRST TIME THE HOMEPAGE IS OPENED!
        const isHomepage = window.location.pathname.endsWith("index.html") || 
                           window.location.pathname === "/" || 
                           window.location.pathname === "" ||
                           window.location.pathname.endsWith("/dokathlon/") ||
                           document.querySelector(".starting-screen-view") !== null ||
                           document.title.toLowerCase().includes("koti") ||
                           document.title.toLowerCase().includes("etu");

        if (isHomepage) {
            const popupsShown = sessionStorage.getItem("dokathlon_boot_popups_shown_v1");
            if (!popupsShown) {
                sessionStorage.setItem("dokathlon_boot_popups_shown_v1", "true");
                setTimeout(function() { createPopupDialog(popupMessages[0]); }, 200); // HOT SINGLES IS FIRST!
                setTimeout(function() { createPopupDialog(popupMessages[1]); }, 450);
                setTimeout(function() { createPopupDialog(popupMessages[2]); }, 700);
                setTimeout(function() { createPopupDialog(popupMessages[3]); }, 950);
                setTimeout(function() { createPopupDialog(popupMessages[4]); }, 1200);
                setTimeout(function() { createPopupDialog(popupMessages[5]); }, 1450);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initRetroOSEngine);
    } else {
        initRetroOSEngine();
    }
})();
